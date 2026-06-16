import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { COOKIES_KEY, HEADERS_KEY } from './app/utils/constants';

export async function proxy(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIES_KEY.SESSION_TOKEN)?.value ?? '';
    const response = await fetch(`${process.env.STRAPI_API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { pathname } = request.nextUrl;

    // If the user is logged in and trying to access the login page, redirect them to special-blogs
    if (response.ok && pathname === '/login') {
      return NextResponse.redirect(new URL('/special-blogs', request.url));
    }

    const responseJson = await response.json();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(HEADERS_KEY.USER_INFO, JSON.stringify({ email: responseJson.email }));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log('🚀 ~ proxy ~ error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/special-blogs/:path*'],
};
