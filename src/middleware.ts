import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use edge-compatible auth functions only
async function getSessionFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('upsc-auth-token')?.value;
    if (!token) return null;

    // Simple JWT decode for edge runtime
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

// Define protected routes and their required roles
const protectedRoutes = {
  // Admin-only routes
  '/admin': 'admin',
  '/api/admin': 'admin',
  
  // Teacher and admin routes
  '/teacher': 'teacher',
  '/api/teacher': 'teacher',
  
  // All authenticated users (student, teacher, admin)
  '/dashboard': 'student',
  '/profile': 'student',
  '/learning': 'student',
  '/practice': 'student',
  '/current-affairs': 'student',
  // '/maps': 'student', // Removed for SSR compatibility
  '/analytics': 'student',
  '/api/user': 'student',
  '/api/learning': 'student',
  '/api/practice': 'student',
  '/api/analytics': 'student',
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/pricing',
  '/features',
  '/demo',
  '/docs',

  '/careers',
  '/press',
  '/partners',
  '/affiliate',
  '/contact',
  '/community',
  '/chat',
  '/support',
  '/status',
  '/privacy',
  '/terms',
  '/cookies',
  '/data-protection',
  '/refund',
  '/resources',
  '/resources/materials',
  '/resources/tests',
  '/resources/current-affairs',
  '/resources/papers',
  '/resources/guides',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/auth/refresh',
  '/api/debug/simple-auth',
  '/api/debug/auth',
  '/api/health',
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
];

// Role hierarchy for permission checking
const roleHierarchy = {
  'admin': 3,
  'teacher': 2,
  'student': 1
};

function hasPermission(userRole: string, requiredRole: string): boolean {
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  return userLevel >= requiredLevel;
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

function getRequiredRole(pathname: string): string | null {
  // Check exact matches first
  if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
    return protectedRoutes[pathname as keyof typeof protectedRoutes];
  }
  
  // Check prefix matches for API routes and nested paths
  for (const [route, role] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route + '/') || pathname.startsWith(route)) {
      return role;
    }
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip middleware for RSC (React Server Components) requests
  if (searchParams.has('_rsc')) {
    return NextResponse.next();
  }

  // Skip middleware for Next.js internal requests
  if (pathname.startsWith('/_next/') || pathname.startsWith('/__nextjs_')) {
    return NextResponse.next();
  }

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname);
  
  // If route doesn't require specific authentication, allow access
  if (!requiredRole) {
    return NextResponse.next();
  }
  
  try {
    // Get user session with edge-compatible method
    const session = await getSessionFromRequest(request);

    // If no session, handle based on route type
    if (!session) {
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required', requiresLogin: true },
          { status: 401 }
        );
      }

      // For dashboard, allow limited access in production
      if (pathname === '/dashboard') {
        const response = NextResponse.next();
        response.headers.set('x-auth-status', 'unauthenticated');
        response.headers.set('x-user-role', 'guest');
        return response;
      }

      // For other protected routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Simple permission checking
    const userRole = session.user?.role || 'student';
    if (!hasPermission(userRole, requiredRole)) {
      // Return 403 for API routes
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Redirect to appropriate dashboard based on user role
      const destination = userRole === 'admin' ? '/admin' : '/dashboard';
      const dashboardUrl = new URL(destination, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    
    // Check for suspicious activity patterns
    await detectSuspiciousActivity(request, session);

    // Add user info to headers for use in API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', session.user.id);
    response.headers.set('x-user-role', session.user.role);
    response.headers.set('x-user-tenant', session.user.tenantId);

    return response;
    
  } catch (error) {
    console.error('Middleware error:', error);
    
    // For API routes, return error response
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }
    
    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Detect suspicious activity patterns
 */
async function detectSuspiciousActivity(request: NextRequest, session: any) {
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

  // Check for bot-like behavior
  const suspiciousBots = ['bot', 'crawler', 'spider', 'scraper'];
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    await logSecurityEvent(
      AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY,
      {
        type: 'bot_detection',
        userAgent,
        route: request.nextUrl.pathname,
        ip
      },
      request,
      session?.user?.id,
      session?.user?.email
    );
  }

  // Check for unusual user agent patterns
  if (!userAgent || userAgent.length < 10) {
    await logSecurityEvent(
      AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY,
      {
        type: 'suspicious_user_agent',
        userAgent,
        route: request.nextUrl.pathname,
        ip
      },
      request,
      session?.user?.id,
      session?.user?.email
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
