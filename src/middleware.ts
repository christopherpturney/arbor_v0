import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Enhanced logging
  console.log('Middleware - Request:', {
    path: req.nextUrl.pathname,
    method: req.method,
    session: session ? {
      user: session.user.email,
      expires: session.expires_at
    } : 'none'
  });

  // If user is not authenticated and trying to access protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Middleware - Auth Required:', {
      path: req.nextUrl.pathname,
      redirectTo: '/auth'
    });
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 