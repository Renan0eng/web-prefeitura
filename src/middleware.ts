import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'refresh_token';

export function middleware(request: NextRequest) {

    // se a rota for / redireciona para /admin
    console.log("request.nextUrl.pathname", request.nextUrl.pathname);
    
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

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
        '/',           // para redirecionar a raiz
        '/admin/:path*', // para proteger /admin
    ],
};

