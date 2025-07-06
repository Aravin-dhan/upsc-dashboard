import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// The Hindu credentials (provided by user)
const HINDU_CREDENTIALS = {
  username: 'balamruuganirs@gmail.com',
  password: 'ePaper'
};

interface ArticleContent {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishedAt: string;
  url: string;
  category: string;
  tags: string[];
  readingTime: number;
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
  keyPoints: string[];
  questions: string[];
}

async function authenticateHindu(): Promise<string | null> {
  try {
    // First, get the login page to extract any CSRF tokens
    const loginPageResponse = await fetch('https://accounts.thehindu.com/signin', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    if (!loginPageResponse.ok) {
      console.warn('Failed to fetch login page');
      return null;
    }

    const loginHtml = await loginPageResponse.text();
    const $ = cheerio.load(loginHtml);
    
    // Extract CSRF token if present
    const csrfToken = $('input[name="_token"]').attr('value') || 
                     $('meta[name="csrf-token"]').attr('content') ||
                     $('input[name="csrf_token"]').attr('value');

    // Prepare login data
    const loginData = new URLSearchParams({
      email: HINDU_CREDENTIALS.username,
      password: HINDU_CREDENTIALS.password,
      ...(csrfToken && { _token: csrfToken })
    });

    // Attempt login
    const loginResponse = await fetch('https://accounts.thehindu.com/signin', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://accounts.thehindu.com/signin'
      },
      body: loginData.toString(),
      redirect: 'manual' // Handle redirects manually to capture cookies
    });

    // Extract session cookies
    const cookies = loginResponse.headers.get('set-cookie');
    if (cookies) {
      return cookies;
    }

    return null;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

async function scrapeHinduArticle(url: string, sessionCookies?: string): Promise<ArticleContent | null> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    if (sessionCookies) {
      headers['Cookie'] = sessionCookies;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch article: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract article content using multiple selectors
    const title = $('h1.title, h1.headline, .article-title, h1').first().text().trim();
    
    const contentSelectors = [
      '.article-content',
      '.story-content',
      '.content-body',
      '.article-body',
      '.story-element-text',
      '.paywall'
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        content = elements.map((i, el) => $(el).text()).get().join('\n\n');
        if (content.length > 100) break;
      }
    }

    // Extract author
    const author = $('.author-name, .byline, .story-byline, [rel="author"]').first().text().trim() || 'The Hindu';

    // Extract published date
    const publishedAt = $('time, .publish-date, .story-date, .article-date').first().attr('datetime') || 
                       $('time, .publish-date, .story-date, .article-date').first().text().trim() ||
                       new Date().toISOString();

    if (!title || !content || content.length < 100) {
      return null;
    }

    // Generate summary (first 200 characters)
    const summary = content.substring(0, 300).trim() + '...';

    // Estimate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Extract key points (first sentence of each paragraph)
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const keyPoints = paragraphs.slice(0, 5).map(p => {
      const sentences = p.split('.').filter(s => s.trim().length > 20);
      return sentences[0] + '.';
    });

    // Analyze UPSC relevance
    const { upscRelevance, syllabusTopics, category, tags } = analyzeUPSCRelevance(title, content);

    // Generate practice questions
    const questions = generatePracticeQuestions(title, content, category);

    return {
      id: `hindu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      summary,
      author,
      publishedAt: new Date(publishedAt).toISOString(),
      url,
      category,
      tags,
      readingTime,
      upscRelevance,
      syllabusTopics,
      keyPoints,
      questions
    };

  } catch (error) {
    console.error('Error scraping Hindu article:', error);
    return null;
  }
}

function analyzeUPSCRelevance(title: string, content: string): {
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
  category: string;
  tags: string[];
} {
  const text = (title + ' ' + content).toLowerCase();
  
  // High relevance keywords
  const highRelevanceKeywords = [
    'government', 'policy', 'constitution', 'parliament', 'supreme court', 'election',
    'international relations', 'diplomacy', 'defense', 'security', 'economy', 'gdp',
    'inflation', 'budget', 'agriculture', 'environment', 'climate change', 'education',
    'health', 'social justice', 'governance', 'administration', 'civil services',
    'prime minister', 'president', 'chief minister', 'cabinet', 'ministry'
  ];

  const mediumRelevanceKeywords = [
    'technology', 'innovation', 'research', 'development', 'industry', 'manufacturing',
    'energy', 'renewable', 'transport', 'urban', 'rural', 'welfare', 'scheme',
    'program', 'initiative', 'reform', 'law', 'regulation', 'court', 'judgment'
  ];

  let upscRelevance: 'high' | 'medium' | 'low' = 'low';
  const syllabusTopics: string[] = [];
  const tags: string[] = [];

  // Determine relevance
  const highScore = highRelevanceKeywords.filter(keyword => text.includes(keyword)).length;
  const mediumScore = mediumRelevanceKeywords.filter(keyword => text.includes(keyword)).length;

  if (highScore >= 2) {
    upscRelevance = 'high';
  } else if (highScore >= 1 || mediumScore >= 2) {
    upscRelevance = 'medium';
  }

  // Map to syllabus topics
  const topicMapping = {
    'Polity': ['constitution', 'parliament', 'court', 'election', 'governance', 'administration'],
    'Economics': ['economy', 'gdp', 'budget', 'trade', 'investment', 'inflation', 'market'],
    'International Relations': ['international', 'diplomacy', 'foreign', 'bilateral', 'multilateral'],
    'Geography': ['climate', 'weather', 'monsoon', 'river', 'mountain', 'geography'],
    'Environment': ['environment', 'pollution', 'conservation', 'wildlife', 'forest', 'renewable'],
    'Science & Technology': ['technology', 'science', 'research', 'innovation', 'digital'],
    'Agriculture': ['agriculture', 'farmer', 'crop', 'farming', 'rural', 'irrigation'],
    'Defense': ['defense', 'security', 'military', 'army', 'navy', 'border']
  };

  Object.entries(topicMapping).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      syllabusTopics.push(topic);
    }
  });

  // Determine category
  let category = 'General';
  if (text.includes('international') || text.includes('foreign')) {
    category = 'International Relations';
  } else if (text.includes('economy') || text.includes('budget')) {
    category = 'Economics';
  } else if (text.includes('environment') || text.includes('climate')) {
    category = 'Environment';
  } else if (text.includes('technology') || text.includes('science')) {
    category = 'Science & Technology';
  } else if (text.includes('constitution') || text.includes('parliament')) {
    category = 'Polity';
  }

  // Generate tags
  const words = text.split(/\s+/);
  const importantWords = words
    .filter(word => word.length > 4 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who'].includes(word))
    .slice(0, 5);
  
  tags.push(...importantWords);

  return { upscRelevance, syllabusTopics, category, tags };
}

function generatePracticeQuestions(title: string, content: string, category: string): string[] {
  const questions: string[] = [];
  
  // Generate questions based on content
  if (category === 'Polity') {
    questions.push(
      `What are the key constitutional implications discussed in this article?`,
      `How does this development affect the federal structure of India?`,
      `What role do different institutions play in this context?`
    );
  } else if (category === 'Economics') {
    questions.push(
      `What are the economic implications of the policies discussed?`,
      `How might this affect India's GDP and economic growth?`,
      `What are the fiscal and monetary policy aspects mentioned?`
    );
  } else if (category === 'International Relations') {
    questions.push(
      `How does this development affect India's foreign policy?`,
      `What are the strategic implications for India?`,
      `How does this relate to India's neighborhood policy?`
    );
  } else {
    questions.push(
      `What are the main points discussed in this article?`,
      `How is this relevant to UPSC preparation?`,
      `What are the policy implications mentioned?`
    );
  }

  return questions.slice(0, 3);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleUrl = searchParams.get('url');
    const enableAuth = searchParams.get('auth') === 'true';

    if (!articleUrl) {
      return NextResponse.json(
        { success: false, error: 'Article URL is required' },
        { status: 400 }
      );
    }

    let sessionCookies: string | null = null;
    
    if (enableAuth) {
      sessionCookies = await authenticateHindu();
    }

    const articleContent = await scrapeHinduArticle(articleUrl, sessionCookies || undefined);

    if (!articleContent) {
      return NextResponse.json(
        { success: false, error: 'Failed to scrape article content' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article: articleContent,
      authenticated: !!sessionCookies,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Enhanced Hindu scraping error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
