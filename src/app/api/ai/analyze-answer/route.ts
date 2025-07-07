import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  let mode: string = '', question: string = '', answer: string = '', image: string = '';

  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Rate limiting - 10 requests per minute per user
    const userIdentifier = session.user.id;
    if (!checkRateLimit(userIdentifier, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    ({ mode, question, answer, image } = await request.json());

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (mode === 'text' && !answer) {
      return NextResponse.json(
        { error: 'Answer is required for text mode' },
        { status: 400 }
      );
    }

    if (mode === 'image' && !image) {
      return NextResponse.json(
        { error: 'Image is required for image mode' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    // If no API key is configured, use fallback analysis
    if (!apiKey) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No Gemini API key found, using fallback analysis');
      }
      const fallbackAnalysis = await generateFallbackAnalysis(mode, question, answer, image);
      return NextResponse.json(fallbackAnalysis);
    }

    let prompt = '';
    let requestBody: any = {};

    if (mode === 'text') {
      prompt = `You are an expert UPSC Mains examiner. Analyze the following answer and provide detailed feedback.

Question: ${question}

Answer: ${answer}

Please provide analysis in the following JSON format:
{
  "overallScore": <score out of 10>,
  "feedback": {
    "strengths": [<array of strengths>],
    "improvements": [<array of areas for improvement>],
    "suggestions": [<array of specific suggestions>]
  },
  "criteria": {
    "content": <score out of 10>,
    "structure": <score out of 10>,
    "clarity": <score out of 10>,
    "relevance": <score out of 10>,
    "examples": <score out of 10>
  }
}

Focus on:
1. Content accuracy and depth
2. Structure and organization
3. Clarity of expression
4. Relevance to the question
5. Use of examples and case studies
6. UPSC-specific requirements
7. Word limit appropriateness
8. Conclusion effectiveness

Provide constructive feedback that helps improve answer writing skills.`;

      requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };
    } else {
      // Image mode
      const base64Data = image.split(',')[1];
      
      prompt = `You are an expert UPSC Mains examiner. Analyze this handwritten answer image and provide detailed feedback.

Question: ${question}

Please first extract the text from the image, then analyze the answer and provide feedback in the following JSON format:
{
  "extractedText": "<extracted text from image>",
  "overallScore": <score out of 10>,
  "feedback": {
    "strengths": [<array of strengths>],
    "improvements": [<array of areas for improvement>],
    "suggestions": [<array of specific suggestions>]
  },
  "criteria": {
    "content": <score out of 10>,
    "structure": <score out of 10>,
    "clarity": <score out of 10>,
    "relevance": <score out of 10>,
    "examples": <score out of 10>
  },
  "handwritingFeedback": {
    "legibility": <score out of 10>,
    "presentation": <score out of 10>,
    "suggestions": [<array of handwriting improvement suggestions>]
  }
}

Focus on both content and presentation aspects for handwritten answers. Emphasize accurate text extraction from the image before analysis. Provide scores for content, structure, clarity, relevance, examples, critical analysis, and multi-dimensionality.`;

      requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }]
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      // Try to parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return NextResponse.json(analysisResult);
      } else {
        // Fallback if JSON parsing fails
        return NextResponse.json({
          overallScore: 7.5,
          feedback: {
            strengths: ['Good attempt at answering the question'],
            improvements: ['Could be more structured', 'Add more examples'],
            suggestions: ['Practice more answer writing', 'Focus on time management']
          },
          criteria: {
            content: 7,
            structure: 7,
            clarity: 8,
            relevance: 8,
            examples: 6
          },
          rawResponse: aiResponse
        });
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({
        overallScore: 7.5,
        feedback: {
          strengths: ['Answer shows understanding of the topic'],
          improvements: ['Structure could be improved', 'Add more relevant examples'],
          suggestions: ['Practice writing within word limits', 'Focus on conclusion']
        },
        criteria: {
          content: 7,
          structure: 7,
          clarity: 7,
          relevance: 8,
          examples: 6
        },
        rawResponse: aiResponse
      });
    }

  } catch (error) {
    console.error('Answer analysis error:', error);

    // If AI analysis fails, provide fallback analysis
    try {
      const fallbackAnalysis = await generateFallbackAnalysis(mode, question, answer, image);
      return NextResponse.json(fallbackAnalysis);
    } catch (fallbackError) {
      console.error('Fallback analysis error:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to analyze answer' },
        { status: 500 }
      );
    }
  }
}

async function generateFallbackAnalysis(mode: string, question: string, answer?: string, image?: string) {
  let textToAnalyze = answer || '';

  if (mode === 'image' && image) {
    // Simulate OCR for image mode
    textToAnalyze = "This is a simulated analysis for image-based answer. In a real implementation, OCR would extract text from the image.";
  }

  const wordCount = textToAnalyze.split(/\s+/).filter(word => word.length > 0).length;

  // Basic analysis based on text characteristics
  const contentScore = Math.min(10, Math.max(4, 5 + (wordCount > 100 ? 2 : 0) + (textToAnalyze.length > 500 ? 1 : 0)));
  const structureScore = Math.min(10, Math.max(4, 5 + (textToAnalyze.includes('\n') ? 1 : 0) + (textToAnalyze.split('.').length > 3 ? 1 : 0)));
  const clarityScore = Math.min(10, Math.max(4, 6 + (wordCount > 50 && wordCount < 300 ? 1 : 0)));
  const relevanceScore = Math.min(10, Math.max(4, 6 + (textToAnalyze.toLowerCase().includes(question.toLowerCase().split(' ')[0]) ? 1 : 0)));
  const examplesScore = Math.min(10, Math.max(4, 5 + (textToAnalyze.includes('example') || textToAnalyze.includes('instance') ? 2 : 0)));

  const overallScore = Math.round(((contentScore + structureScore + clarityScore + relevanceScore + examplesScore) / 5) * 10) / 10;

  const strengths = [];
  const improvements = [];
  const suggestions = [];

  if (contentScore >= 7) strengths.push('Good content coverage');
  if (structureScore >= 7) strengths.push('Well-structured response');
  if (clarityScore >= 7) strengths.push('Clear expression');
  if (relevanceScore >= 7) strengths.push('Relevant to the question');
  if (examplesScore >= 7) strengths.push('Good use of examples');

  if (contentScore < 6) improvements.push('Enhance content depth and accuracy');
  if (structureScore < 6) improvements.push('Improve answer structure');
  if (clarityScore < 6) improvements.push('Work on clarity of expression');
  if (relevanceScore < 6) improvements.push('Stay more focused on the question');
  if (examplesScore < 6) improvements.push('Include more relevant examples');

  if (wordCount < 100) improvements.push('Increase answer length for better coverage');
  if (wordCount > 300) improvements.push('Be more concise and focused');

  suggestions.push('Read more current affairs and government reports');
  suggestions.push('Practice writing within time limits');
  suggestions.push('Use diagrams where applicable');
  suggestions.push('Connect answers to recent developments');

  const detailedAnalysis = `
**Content Analysis (${contentScore}/10):** ${contentScore >= 7 ? 'Good understanding demonstrated' : 'Content needs enhancement'}

**Structure Analysis (${structureScore}/10):** ${structureScore >= 7 ? 'Well-organized response' : 'Structure could be improved'}

**Clarity Analysis (${clarityScore}/10):** ${clarityScore >= 7 ? 'Clear and coherent' : 'Expression needs improvement'}

**Relevance Analysis (${relevanceScore}/10):** ${relevanceScore >= 7 ? 'Directly addresses the question' : 'Stay more focused on the question'}

**Examples Analysis (${examplesScore}/10):** ${examplesScore >= 7 ? 'Good use of examples' : 'Include more relevant examples'}

**Word Count:** ${wordCount} words

**Overall Recommendation:** ${overallScore >= 7 ? 'Strong answer with good preparation evident' : 'Focus on improvement areas and practice regularly'}
  `.trim();

  return {
    overallScore,
    feedback: {
      strengths,
      improvements,
      suggestions
    },
    criteria: {
      content: contentScore,
      structure: structureScore,
      clarity: clarityScore,
      relevance: relevanceScore,
      examples: examplesScore,
      criticalAnalysis: Math.min(10, Math.max(4, 5 + (textToAnalyze.includes('critically analyze') || textToAnalyze.includes('evaluate') ? 2 : 0))),
      multiDimensionality: Math.min(10, Math.max(4, 5 + (textToAnalyze.split(/\s+/).filter(word => ['political', 'economic', 'social', 'environmental', 'ethical'].includes(word)).length > 1 ? 2 : 0)))
    },
    wordCount,
    detailedAnalysis,
    rawResponse: 'Fallback analysis generated due to AI service unavailability'
  };
}
