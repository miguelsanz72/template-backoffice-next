import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

/**
 * Create the internationalization middleware with cookie handling
 */
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

/**
 * Route configuration for different access types
 */
const ROUTES = {
  // Public routes that don't require authentication
  PUBLIC: [
    `/(${locales.join('|')})?`,
    `/(${locales.join('|')})?/features`,
    `/(${locales.join('|')})?/pricing`,
    `/(${locales.join('|')})?/about`,
    `/(${locales.join('|')})?/contact`,
  ],
  // Authentication related routes
  AUTH: [
    `/(${locales.join('|')})?/auth/login`,
    `/(${locales.join('|')})?/auth/register`,
    `/(${locales.join('|')})?/auth/forgot-password`,
    `/(${locales.join('|')})?/auth/reset-password`,
    `/(${locales.join('|')})?/auth/change-password`,
  ],
  // Locale prefix is optional as a whole, so both /auth/logout and /es/auth/logout match
  LOGOUT: [`(/(${locales.join('|')}))?/auth/logout`],
  // Protected routes that require authentication - using a pattern for all dashboard routes
  PROTECTED: [`/(${locales.join('|')})?/dashboard`],
  // Routes that should redirect authenticated users (e.g., login page)
  REDIRECT_IF_AUTHENTICATED: [`/(${locales.join('|')})?/auth/login`, `/(${locales.join('|')})?/auth/register`],
};

/**
 * Handles locale settings in the response
 * @param response - NextResponse object
 * @param currentLocale - Current locale from cookie
 * @returns Updated NextResponse with locale settings
 */
function handleLocaleSettings(response: NextResponse, currentLocale: string | null): NextResponse {
  const locale = response.headers.get('X-NEXT-INTL-LOCALE') || defaultLocale;

  if (locale !== currentLocale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 31536000, // 1 year
      sameSite: 'lax',
    });
  }

  return response;
}

/**
 * Synchronizes token between storage and cookie
 * @param response - NextResponse object
 * @param tokenFromStorage - Token from Zustand storage
 * @param tokenFromCookie - Token from cookie
 * @returns Updated NextResponse with synchronized token
 */
function synchronizeToken(response: NextResponse, tokenFromStorage: string | null, tokenFromCookie: string | null): NextResponse {
  // If token exists in storage but not in cookie, set it in cookie
  if (tokenFromStorage && !tokenFromCookie) {
    response.cookies.set('auth_token', tokenFromStorage, {
      path: '/',
      // Not httpOnly: the client auth store reads and removes this cookie with js-cookie
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return response;
}

/**
 * Checks if a path matches any of the route patterns
 * @param path - Current path
 * @param routePatterns - Array of route patterns to check against
 * @returns True if path matches any pattern, false otherwise
 */
function matchesRoutePattern(path: string, routePatterns: string[]): boolean {
  return routePatterns.some((pattern) => {
    const regex = new RegExp(`^${pattern}($|/).*`);
    return regex.test(path);
  });
}

/**
 * Checks if the current path is a protected route
 * @param path - Current path
 * @returns True if path is protected, false otherwise
 */
function isProtectedRoute(path: string): boolean {
  // Verifica si la ruta comienza con /dashboard (con o sin locale)
  return path.includes('/dashboard');
}

/**
 * Proxy to handle authentication and internationalization
 * @param request - NextRequest object
 * @returns NextResponse object
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;

  // Extract authentication tokens
  const tokenFromCookie = request.cookies.get('auth_token')?.value || null;
  const authStorageCookie = request.cookies.get('auth-storage')?.value || null;

  let tokenFromStorage: string | null = null;
  if (authStorageCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authStorageCookie));
      tokenFromStorage = authData.state?.token || null;
    } catch (error) {
      console.error('Error parsing auth-storage:', error);
    }
  }

  const token = tokenFromCookie || tokenFromStorage;
  const isAuthenticated = !!token;

  // Get current locale from cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value || null;

  // Handle internationalization first
  const intlResponse = await intlMiddleware(request);

  if (intlResponse) {
    // Update response with locale settings
    const responseWithLocale = handleLocaleSettings(intlResponse, localeCookie);

    // Clear session cookies server-side so httpOnly cookies set by older versions are removed too
    if (matchesRoutePattern(path, ROUTES.LOGOUT)) {
      responseWithLocale.cookies.delete('auth_token');
      responseWithLocale.cookies.delete('auth-storage');
      return responseWithLocale;
    }

    // Synchronize token between storage and cookie
    const finalResponse = synchronizeToken(responseWithLocale, tokenFromStorage, tokenFromCookie);

    // Check if user should be redirected based on authentication status

    // If user is authenticated but trying to access auth pages (login/register)
    if (isAuthenticated && matchesRoutePattern(path, ROUTES.REDIRECT_IF_AUTHENTICATED)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user is not authenticated but trying to access protected routes
    if (!isAuthenticated && isProtectedRoute(path)) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return finalResponse;
  }

  // Public routes - always allow
  if (matchesRoutePattern(path, ROUTES.PUBLIC) || matchesRoutePattern(path, ROUTES.AUTH)) {
    // If user is authenticated but trying to access auth pages (login/register)
    if (isAuthenticated && matchesRoutePattern(path, ROUTES.REDIRECT_IF_AUTHENTICATED)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (isProtectedRoute(path)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // Default case - check if route is protected by pattern
  if (path.includes('/dashboard') || path.includes('/profile') || path.includes('/settings')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)'],
};
