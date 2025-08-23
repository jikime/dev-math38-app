import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import KakaoProvider from "next-auth/providers/kakao"
import { authService } from "./authService"

/**
 * NextAuth 설정
 * - Credentials (아이디/비밀번호) 로그인
 * - Kakao OAuth 로그인
 * - Impersonation (대리 로그인) 지원
 */
const authOptions: NextAuthOptions = {
  // 빌드 시 세션 체크 관련 설정
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  
  providers: [
    // 일반 로그인 및 Impersonation
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        impersonationToken: { label: "Impersonation Token", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          // Impersonation 토큰이 있는 경우
          if (credentials?.impersonationToken) {
            return await authService.handleImpersonation(credentials.impersonationToken)
          }
          
          // 일반 로그인
          if (credentials?.username && credentials?.password) {
            return await authService.handleLogin(credentials.username, credentials.password)
          }
          
          throw new Error("아이디와 비밀번호를 입력해주세요.")
        } catch (error: any) {
          throw new Error(error.message || "로그인에 실패했습니다.")
        }
      },
    }),
    
    // 카카오 OAuth 로그인
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  
  callbacks: {
    // JWT 토큰 생성/업데이트
    async jwt({ token, user, account }) {
      if (user) {
        const u = user as any
        token.accessToken = u.accessToken
        token.refreshToken = u.refreshToken
        token.user = u.user
        token.impersonated = u.impersonated
        token.impersonator = u.impersonator
      }
      return token
    },
    
    // 세션 생성/업데이트
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      
      // 사용자 정보 설정
      if (token.user) {
        session.user = token.user
      } else {
        // Kakao 로그인 시 기본 세션 사용자 정보
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture,
          id: token.sub,
          loginMethod: 'KAKAO',
          idPasswordLimitTime: token.idPasswordLimitTime
        }
      }
      
      session.impersonated = token.impersonated
      session.impersonator = token.impersonator
      
      return session
    },
    
    // 로그인 처리
    async signIn({ user, account, profile }) {
      // Kakao OAuth 로그인 처리
      if (account?.provider === 'kakao' && account?.access_token) {
        try {
          const result = await authService.handleKakaoLogin(user)
          
          // 결과를 user 객체에 병합
          Object.assign(user, result)
          return true
          
        } catch (error: any) {
          console.error("Kakao authentication error:", error)
          
          // 에러 메시지 처리
          const errorMessage = error?.response?.data?.message || error.message
          
          if (errorMessage?.includes('연결이 해제')) {
            throw new Error(errorMessage)
          }
          
          if (errorMessage?.includes('계정을 찾을 수 없습니다') || 
              errorMessage?.includes('연결된 계정이 없습니다')) {
            throw new Error('KakaoNotLinked')
          }
          
          throw error
        }
      }
      
      return true
    },
    
    // 리다이렉트 처리
    async redirect({ url, baseUrl }) {
      // 상대 경로 허용
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // 같은 origin의 URL 허용 - URL이 유효한지 먼저 확인
      try {
        if (url && new URL(url).origin === baseUrl) return url
      } catch (e) {
        // 유효하지 않은 URL인 경우 baseUrl로 리다이렉트
        return baseUrl
      }
      return baseUrl
    },
  },
  
  // JWT 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
    updateAge: 24 * 60 * 60,  // 24시간
  },
  
  // 커스텀 페이지 경로
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/signin",
  },
  
}

export default authOptions