import { NextRequest, NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const RSS_FEEDS = [
  { url: 'https://www.thehindu.com/feeder/default.rss', category: 'General' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'National' },
  { url: 'https://www.thehindu.com/news/international/feeder/default.rss', category: 'International' },
  { url: 'https://www.thehindu.com/opinion/editorial/feeder/default.rss', category: 'Editorial' },
  { url: 'https://www.thehindu.com/opinion/columns/feeder/default.rss', category: 'Opinion' },
  { url: 'https://www.thehindu.com/opinion/op-ed/feeder/default.rss', category: 'Op-Ed' },
  { url: 'https://www.thehindu.com/business/feeder/default.rss', category: 'Business' },
  { url: 'https://www.thehindu.com/sci-tech/feeder/default.rss', category: 'Science & Technology' }
];

interface RSSItem {
  title: string[];
  link: string[];
  description: string[];
  pubDate: string[];
  category?: string[];
}

interface RSSFeed {
  rss: {
    channel: [{
      item: RSSItem[];
    }];
  };
}

function extractTextFromHTML(html: string): string {
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function generateAISummary(text: string): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Skipping AI summarization.');
      return text.substring(0, 200) + '...'; // Return truncated text if API key is missing
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Summarize the following text concisely for a UPSC aspirant, focusing on key points and relevance. Keep the summary under 150 words:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return text.substring(0, 200) + '...'; // Fallback to truncated text on error
  }
}

async function analyzeWithAI(title: string, description: string): Promise<{
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
  tags: string[];
  category: string;
  summary: string; // Add summary to the return type
}> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = categorizeForUPSC(title, description, '');
      return { ...fallback, summary: description.substring(0, 200) + '...' };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this news article for UPSC Civil Services preparation:\n\nTitle: ${title}\nContent: ${description}\n\nProvide analysis in JSON format:\n{\n  "upscRelevance": "high|medium|low",\n  "syllabusTopics": ["array of relevant UPSC syllabus topics"],\n  "tags": ["array of 3-5 relevant tags"],\n  "category": "most relevant category",\n  "summary": "concise summary under 150 words"\n}\n\nConsider:\n- High relevance: Government policies, constitutional matters, international relations, economic policies, major reforms\n- Medium relevance: Technology developments, social issues, environmental matters, cultural topics\n- Low relevance: Sports, entertainment, local news without national significance\n\nSyllabus topics should be from: Polity, Economics, International Relations, Geography, History, Science & Technology, Agriculture, Defense, Environment, Ethics, General Studies`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (aiResponse) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          upscRelevance: analysis.upscRelevance || 'medium',
          syllabusTopics: analysis.syllabusTopics || [],
          tags: analysis.tags || [],
          category: analysis.category || 'General',
          summary: analysis.summary || description.substring(0, 200) + '...' // Fallback for summary
        };
      }
    }
  } catch (error) {
    console.warn('AI analysis failed, using fallback:', error);
  }

  // Fallback to rule-based analysis
  const fallback = categorizeForUPSC(title, description, '');
  return { ...fallback, summary: description.substring(0, 200) + '...' };
}

function categorizeForUPSC(title: string, description: string, category: string): {
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
  tags: string[];
  category: string;
} {
  const content = (title + ' ' + description).toLowerCase();

  // Enhanced keyword analysis
  const highRelevanceKeywords = [
    'government', 'policy', 'constitution', 'parliament', 'supreme court', 'election',
    'international relations', 'diplomacy', 'defense', 'security', 'economy', 'gdp',
    'inflation', 'budget', 'agriculture', 'environment', 'climate change', 'education',
    'health', 'social justice', 'governance', 'administration', 'civil services',
    'upsc', 'ias', 'ips', 'foreign policy', 'trade', 'investment', 'infrastructure',
    'prime minister', 'president', 'chief minister', 'cabinet', 'ministry', 'scheme',
    'act', 'bill', 'amendment', 'judgment', 'verdict', 'ruling', 'order'
  ];

  const mediumRelevanceKeywords = [
    'technology', 'innovation', 'research', 'development', 'industry', 'manufacturing',
    'energy', 'renewable', 'transport', 'urban', 'rural', 'welfare', 'program',
    'initiative', 'reform', 'law', 'regulation', 'court', 'tribunal', 'commission',
    'committee', 'report', 'survey', 'study', 'analysis', 'data', 'statistics'
  ];

  let upscRelevance: 'high' | 'medium' | 'low' = 'low';
  const syllabusTopics: string[] = [];
  const tags: string[] = [];

  // Determine relevance with scoring
  const highScore = highRelevanceKeywords.filter(keyword => content.includes(keyword)).length;
  const mediumScore = mediumRelevanceKeywords.filter(keyword => content.includes(keyword)).length;

  if (highScore >= 2 || (highScore >= 1 && mediumScore >= 1)) {
    upscRelevance = 'high';
  } else if (highScore >= 1 || mediumScore >= 2) {
    upscRelevance = 'medium';
  }

  // Enhanced syllabus mapping
  const topicMapping = {
    'Polity': ['constitution', 'parliament', 'court', 'election', 'governance', 'administration', 'cabinet', 'ministry', 'act', 'bill', 'amendment'],
    'Economics': ['economy', 'gdp', 'budget', 'trade', 'investment', 'inflation', 'market', 'finance', 'banking', 'fiscal', 'monetary'],
    'International Relations': ['international', 'diplomacy', 'foreign', 'bilateral', 'multilateral', 'treaty', 'agreement', 'summit', 'visit'],
    'Geography': ['climate', 'weather', 'monsoon', 'river', 'mountain', 'ocean', 'geography', 'geological', 'natural disaster'],
    'Environment': ['environment', 'pollution', 'conservation', 'wildlife', 'forest', 'renewable', 'carbon', 'emission', 'sustainable'],
    'Science & Technology': ['technology', 'science', 'research', 'innovation', 'digital', 'artificial intelligence', 'space', 'satellite'],
    'Agriculture': ['agriculture', 'farmer', 'crop', 'farming', 'rural', 'irrigation', 'food security', 'agricultural'],
    'Defense': ['defense', 'security', 'military', 'army', 'navy', 'air force', 'border', 'terrorism', 'cyber security'],
    'History': ['history', 'culture', 'heritage', 'tradition', 'ancient', 'medieval', 'modern', 'archaeological'],
    'Ethics': ['ethics', 'corruption', 'transparency', 'accountability', 'integrity', 'moral', 'values']
  };

  Object.entries(topicMapping).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      syllabusTopics.push(topic);
    }
  });

  // Generate smart tags
  const words = content.split(/\s+/);
  const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were']);

  const importantWords = words
    .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()))
    .map(word => word.toLowerCase())
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, 5);

  tags.push(...importantWords);

  // Determine category based on content
  let determinedCategory = category;
  if (content.includes('international') || content.includes('foreign')) {
    determinedCategory = 'International Relations';
  } else if (content.includes('economy') || content.includes('budget') || content.includes('trade')) {
    determinedCategory = 'Economics';
  } else if (content.includes('environment') || content.includes('climate')) {
    determinedCategory = 'Environment';
  } else if (content.includes('technology') || content.includes('science')) {
    determinedCategory = 'Science & Technology';
  } else if (content.includes('constitution') || content.includes('parliament')) {
    determinedCategory = 'Polity';
  }

  return { upscRelevance, syllabusTopics, tags, category: determinedCategory };
}

export async function GET(request: NextRequest) {
  try {
    const allArticles: any[] = [];
    
    // Fetch from multiple RSS feeds
    const feedPromises = RSS_FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; UPSC-Dashboard/1.0)',
          },
          next: { revalidate: 300 } // Cache for 5 minutes
        });
        
        if (!response.ok) {
          console.warn(`Failed to fetch ${feed.url}: ${response.status}`);
          return [];
        }
        
        const xmlData = await response.text();
        const parsedData: RSSFeed = await parseStringPromise(xmlData);
        
        if (!parsedData.rss?.channel?.[0]?.item) {
          return [];
        }
        
        const articles = await Promise.all(
          parsedData.rss.channel[0].item.slice(0, 10).map(async (item: RSSItem) => {
            const title = item.title?.[0] || '';
            const description = extractTextFromHTML(item.description?.[0] || '');

            // Use AI analysis for better categorization
            const analysis = await analyzeWithAI(title, description);

            return {
              id: `hindu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title,
              summary: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
              url: item.link?.[0] || '',
              source: feed.source,
              publishedAt: new Date(item.pubDate?.[0] || new Date()).toISOString(),
              category: analysis.category || feed.category,
              tags: analysis.tags,
              isBookmarked: false,
              isRead: false,
              upscRelevance: analysis.upscRelevance,
              syllabusTopics: analysis.syllabusTopics,
              feedCategory: feed.category,
              aiAnalyzed: true
            };
          })
        );

        return articles;
      } catch (error) {
        console.error(`Error fetching ${feed.url}:`, error);
        return [];
      }
    });
    
    const feedResults = await Promise.all(feedPromises);
    feedResults.forEach(articles => allArticles.push(...articles));
    
    // Sort by publication date (newest first)
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Limit to 50 most recent articles
    const limitedArticles = allArticles.slice(0, 50);
    
    return NextResponse.json({
      success: true,
      articles: limitedArticles,
      count: limitedArticles.length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('RSS fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch RSS feeds',
        articles: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
