import { NextResponse } from 'next/server';

export function middleware(request) {
    const isAuthenticated = false; // Здесь вы должны проверить, авторизован ли пользователь

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Укажите пути, для которых будет применяться middleware
export const config = {
    matcher: ['/register', '/dashboard', '/profile'], // Добавьте сюда пути, которые требуют авторизации
}; 