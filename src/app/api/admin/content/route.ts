import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';

export const runtime = 'nodejs';

// Mock content data (replace with actual database)
const mockContent = [
  {
    id: '1',
    title: 'UPSC Dashboard Features',
    type: 'page',
    status: 'published',
    author: 'Admin User',
    lastModified: '2024-01-15T10:30:00Z',
    views: 1250,
    path: '/features'
  },
  {
    id: '2',
    title: 'Pricing Plans',
    type: 'page',
    status: 'published',
    author: 'Admin User',
    lastModified: '2024-01-14T15:45:00Z',
    views: 890,
    path: '/pricing'
  },
  {
    id: '3',
    title: 'UPSC Preparation Tips',
    type: 'blog',
    status: 'published',
    author: 'Content Team',
    lastModified: '2024-01-13T09:20:00Z',
    views: 2340,
    path: '/blog/upsc-preparation-tips'
  },
  {
    id: '4',
    title: 'Current Affairs Update',
    type: 'resource',
    status: 'published',
    author: 'Research Team',
    lastModified: '2024-01-12T14:15:00Z',
    views: 1890,
    path: '/resources/current-affairs'
  },
  {
    id: '5',
    title: 'System Maintenance Notice',
    type: 'announcement',
    status: 'draft',
    author: 'Tech Team',
    lastModified: '2024-01-11T11:00:00Z',
    views: 0,
    path: '/announcements/maintenance'
  },
  {
    id: '6',
    title: 'About UPSC Dashboard',
    type: 'page',
    status: 'published',
    author: 'Admin User',
    lastModified: '2024-01-10T16:30:00Z',
    views: 567,
    path: '/about'
  },
  {
    id: '7',
    title: 'Privacy Policy',
    type: 'page',
    status: 'published',
    author: 'Legal Team',
    lastModified: '2024-01-09T12:45:00Z',
    views: 234,
    path: '/privacy'
  },
  {
    id: '8',
    title: 'Terms of Service',
    type: 'page',
    status: 'published',
    author: 'Legal Team',
    lastModified: '2024-01-08T13:20:00Z',
    views: 189,
    path: '/terms'
  },
  {
    id: '9',
    title: 'Study Materials Guide',
    type: 'resource',
    status: 'published',
    author: 'Education Team',
    lastModified: '2024-01-07T10:15:00Z',
    views: 1456,
    path: '/resources/materials'
  },
  {
    id: '10',
    title: 'New Feature Announcement',
    type: 'announcement',
    status: 'archived',
    author: 'Product Team',
    lastModified: '2024-01-06T08:30:00Z',
    views: 890,
    path: '/announcements/new-features'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!hasPermission(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filteredContent = [...mockContent];

    // Apply filters
    if (type && type !== 'all') {
      filteredContent = filteredContent.filter(item => item.type === type);
    }

    if (status && status !== 'all') {
      filteredContent = filteredContent.filter(item => item.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.path.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      content: filteredContent
    });
    
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!hasPermission(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, type, status, content, path } = await request.json();

    // Validate input
    if (!title || !type || !status || !content || !path) {
      return NextResponse.json(
        { error: 'Title, type, status, content, and path are required' },
        { status: 400 }
      );
    }

    // Create new content item
    const newContent = {
      id: Date.now().toString(),
      title,
      type,
      status,
      author: session.user.name,
      lastModified: new Date().toISOString(),
      views: 0,
      path,
      content
    };

    // In a real implementation, save to database
    mockContent.push(newContent);

    return NextResponse.json({
      success: true,
      content: newContent,
      message: 'Content created successfully'
    });
    
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
