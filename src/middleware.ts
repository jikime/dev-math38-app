import { auth } from "@/net/core/auth/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Public routes that don't require authentication
  const isPublicRoute = 
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/auth/") ||
    nextUrl.pathname.startsWith("/api/auth/") ||
    nextUrl.pathname === "/unauthorized"

  // If not logged in and trying to access protected route
  // 자동 리디렉션 대신 401 에러로 API에서 처리하도록 함
  if (!isLoggedIn && !isPublicRoute) {
    // API 요청인 경우 JSON 응답
    if (nextUrl.pathname.startsWith('/api/') && !nextUrl.pathname.startsWith('/api/auth/')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // 일반 페이지 요청인 경우 unauthorized 페이지로 이동
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  // If logged in and trying to access login page
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/tutor/problemmng/repository", nextUrl))
  }

  return NextResponse.next()
});


// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    // 보호할 경로들
    "/tutor/:path*",
    // 제외할 경로들
    "/((?!api/auth|_next/static|_next/image|favicon.ico|auth).*)",
  ],
};

