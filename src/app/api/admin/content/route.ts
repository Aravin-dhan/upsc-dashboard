import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';

// Production content data - will be populated from database
const getContentData = async () => {
  // TODO: Replace with actual database query
  // For now, return empty array to remove mock data
  return [];
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await UserDatabase.findByEmail(session.email);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const content = await getContentData();

    return NextResponse.json({
      success: true,
      data: {
        content,
        total: content.length,
        summary: {
          published: content.filter(item => item.status === 'published').length,
          draft: content.filter(item => item.status === 'draft').length,
          archived: content.filter(item => item.status === 'archived').length
        }
      }
    });

  } catch (error) {
    console.error('Admin content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await UserDatabase.findByEmail(session.email);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // TODO: Implement content creation
    // For now, return success message
    return NextResponse.json({
      success: true,
      message: 'Content creation will be implemented with database integration'
    });

  } catch (error) {
    console.error('Admin content creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
