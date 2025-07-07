import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); 

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

// Fallback functions for when AI is not available
function categorizeContent(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase();

  if (text.includes('polity') || text.includes('constitution') || text.includes('governance')) {
    return 'Polity & Governance';
  } else if (text.includes('economy') || text.includes('economic') || text.includes('finance')) {
    return 'Economy';
  } else if (text.includes('environment') || text.includes('climate') || text.includes('ecology')) {
    return 'Environment & Ecology';
  } else if (text.includes('geography') || text.includes('physical') || text.includes('location')) {
    return 'Geography';
  } else if (text.includes('history') || text.includes('ancient') || text.includes('medieval')) {
    return 'History';
  } else if (text.includes('science') || text.includes('technology') || text.includes('research')) {
    return 'Science & Technology';
  } else if (text.includes('international') || text.includes('foreign') || text.includes('global')) {
    return 'International Relations';
  } else {
    return 'Current Affairs';
  }
}

function extractTags(title: string, content: string): string[] {
  const text = (title + ' ' + content).toLowerCase();
  const tags: string[] = [];

  const keywords = [
    'upsc', 'ias', 'ips', 'government', 'policy', 'india', 'economy', 'environment',
    'technology', 'science', 'international', 'relations', 'history', 'geography',
    'polity', 'constitution', 'governance', 'current affairs', 'news'
  ];

  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      tags.push(keyword);
    }
  });

  return tags.slice(0, 5); // Return max 5 tags
}

async function generateAICategoryAndTags(title: string, content: string): Promise<{ category: string; tags: string[] }> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Skipping AI categorization and tagging.');
      return {
        category: categorizeContent(title, content),
        tags: extractTags(title, content)
      };
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze the following article title and content to determine the most relevant UPSC category and up to 5 relevant tags. Provide the output in JSON format: { "category": "Category Name", "tags": ["tag1", "tag2"] }\n\nTitle: ${title}\nContent: ${content.substring(0, 1000)}...`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    try {
      const parsed = JSON.parse(text);
      return { category: parsed.category, tags: parsed.tags };
    } catch (parseError) {
      console.error('Error parsing AI category/tags response:', parseError);
      return {
        category: categorizeContent(title, content),
        tags: extractTags(title, content)
      };
    } 
  } catch (error) {
    console.error('Error generating AI category/tags:', error);
    return {
      category: categorizeContent(title, content),
      tags: extractTags(title, content)
    };
  }
}

function formatDateForDrishti(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function generateDrishtiURL(date: Date): string {
  const formattedDate = formatDateForDrishti(date);
  return `https://www.drishtiias.com/current-affairs-news-analysis-editorials/news-analysis/${formattedDate}`;
}

async function scrapeDrishtiContent(url: string): Promise<{
  articles: any[];
  todaysTopics: any[];
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      console.warn(`Failed to fetch DrishtiIAS page: ${response.status}`);
      return { articles: [], todaysTopics: [] };
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: any[] = [];
    const todaysTopics: any[] = [];

    // Extract today's topics from right sidebar
    const sidebarSelectors = [
      '.sidebar .widget',
      '.right-sidebar',
      '.secondary-sidebar',
      '.widget-area',
      '.sidebar-content'
    ];

    // Try to extract today's topics
    sidebarSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $element = $(element);
        const widgetTitle = $element.find('h3, h4, .widget-title').text().trim().toLowerCase();

        if (widgetTitle.includes('today') || widgetTitle.includes('news') || widgetTitle.includes('topics')) {
          $element.find('a, li').each((i, linkEl) => {
            const $link = $(linkEl);
            const title = $link.text().trim();
            const href = $link.attr('href');

            if (title && title.length > 10 && title.length < 200) {
              const fullUrl = href && href.startsWith('http') ? href : `https://www.drishtiias.com${href}`;
              todaysTopics.push({
                title,
                url: fullUrl,
                category: 'Today\'s Topic',
                source: 'DrishtiIAS Sidebar'
              });
            }
          });
        }
      });
    });

    // Try different selectors for DrishtiIAS content structure
    const contentSelectors = [
      '.news-analysis-content',
      '.daily-news-analysis',
      '.content-wrapper',
      '.main-content',
      'article',
      '.post-content',
      '.entry-content',
      '.page-content',
      '.single-content'
    ];

    let foundContent = false;

    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        foundContent = true;

        elements.each((index, element) => {
          const $element = $(element);

          // Extract title
          let title = $element.find('h1, h2, h3, .title, .headline').first().text().trim();
          if (!title) {
            title = $element.find('a').first().text().trim();
          }

          // Extract all text content from within the main content area
          let content = '';
          $element.find('p, h1, h2, h3, h4, h5, h6, li').each((i, el) => {
            content += `${$(el).text().trim()}\n\n`;
          });
          content = content.trim();

          // Extract link
          let articleUrl = url;
          const link = $element.find('a').first();
          if (link.length > 0) {
            const href = link.attr('href');
            if (href) {
              articleUrl = href.startsWith('http') ? href : `https://www.drishtiias.com${href}`;
            }
          }

          if (title && title.length > 10 && content && content.length > 50) {
            articles.push({
              title: title.substring(0, 200),
              content: content.substring(0, 500),
              url: articleUrl,
              selector: selector
            });
          }
        });

        if (articles.length > 0) break;
      }
    }

    // Fallback: Extract any meaningful content
    if (!foundContent || articles.length === 0) {
      const allHeadings = $('h1, h2, h3, h4').filter((i, el) => {
        const text = $(el).text().trim();
        return text.length > 10 && text.length < 200;
      });

      allHeadings.each((index, element) => {
        if (articles.length >= 10) return false; // Limit to 10 articles

        const $heading = $(element);
        const title = $heading.text().trim();

        // Find the next paragraph or content
        let content = '';
        const nextElements = $heading.nextAll('p, div').first();
        if (nextElements.length > 0) {
          content = nextElements.text().trim().substring(0, 300);
        }

        if (title && content && content.length > 30) {
          articles.push({
            title,
            content,
            url,
            selector: 'fallback'
          });
        }
      });
    }

    return {
      articles: articles.slice(0, 10),
      todaysTopics: todaysTopics.slice(0, 15)
    };

  } catch (error) {
    console.error('Error scraping DrishtiIAS content:', error);
    return { articles: [], todaysTopics: [] };
  }
}



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    let targetDate: Date;
    if (dateParam) {
      targetDate = new Date(dateParam);
      if (isNaN(targetDate.getTime())) {
        targetDate = new Date();
      }
    } else {
      targetDate = new Date();
    }

    const editorials: any[] = [];

    // Try to scrape content from the last 5 days
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(targetDate);
      currentDate.setDate(currentDate.getDate() - i);

      // Skip weekends
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      const url = generateDrishtiURL(currentDate);
      const scrapedData = await scrapeDrishtiContent(url);

      // Add today's topics to editorials if it's today's date
      if (i === 0) {
        scrapedData.todaysTopics.forEach((topic, index) => {
          editorials.push({
            id: `drishti-topic-${currentDate.getTime()}-${index}`,
            title: topic.title,
            summary: `Today's important topic from DrishtiIAS. Click to read the full analysis.`,
            url: topic.url,
            publishedAt: currentDate.toISOString(),
            category: 'Today\'s Topics',
            tags: ['daily-topics', 'current-affairs'],
            isBookmarked: false,
            isRead: false,
            scrapedFrom: url,
            isTopicOfDay: true
          });
        });
      }

      // Convert scraped content to editorial format
      for (const item of scrapedData.articles) {
        const aiAnalysis = await generateAICategoryAndTags(item.title, item.content);
        const summary = await generateAISummary(item.content);

        const editorial = {
          id: `drishti-${currentDate.getTime()}-${item.title.replace(/\s/g, '').substring(0, 10)}`,
          title: item.title,
          summary: summary,
          url: item.url,
          publishedAt: currentDate.toISOString(),
          category: aiAnalysis.category,
          tags: aiAnalysis.tags,
          isBookmarked: false,
          isRead: false,
          scrapedFrom: url,
          selector: item.selector
        };
        editorials.push(editorial);
      }

      // Add a small delay between requests to be respectful
      if (i < 4) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // If no content was scraped, provide fallback content
    if (editorials.length === 0) {
      const fallbackEditorials = generateFallbackEditorials(targetDate);
      editorials.push(...fallbackEditorials);
    }

    // Sort by publication date (newest first)
    editorials.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({
      success: true,
      editorials: editorials.slice(0, 20),
      count: editorials.length,
      todayUrl: generateDrishtiURL(new Date()),
      lastUpdated: new Date().toISOString(),
      scrapedCount: editorials.filter(e => e.scrapedFrom).length
    });

  } catch (error) {
    console.error('DrishtiIAS editorial scraping error:', error);

    // Provide fallback content on error
    const fallbackEditorials = generateFallbackEditorials(new Date());

    return NextResponse.json({
      success: true,
      editorials: fallbackEditorials,
      count: fallbackEditorials.length,
      todayUrl: generateDrishtiURL(new Date()),
      lastUpdated: new Date().toISOString(),
      error: 'Scraping failed, showing fallback content'
    });
  }
}

function generateFallbackEditorials(date: Date): any[] {
  const formattedDate = formatDateForDrishti(date);

  return [
    {
      id: `drishti-fallback-${date.getTime()}-1`,
      title: `Daily News Analysis - ${formattedDate}`,
      summary: `Today's comprehensive analysis of current affairs and their relevance to UPSC preparation. Visit the DrishtiIAS website for detailed coverage.`,
      url: generateDrishtiURL(date),
      publishedAt: date.toISOString(),
      category: 'General Studies',
      tags: ['current-affairs', 'upsc', 'analysis'],
      isBookmarked: false,
      isRead: false,
      isFallback: true
    }
  ];
}