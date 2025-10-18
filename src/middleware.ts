import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'refresh_token';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
        const loginUrl = new URL('/auth/login', request.url);

        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        '/admin/:path*',
    ],
};
