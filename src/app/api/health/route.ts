import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      status: 'healthy'
    };

    return NextResponse.json(diagnostics);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Health check failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
