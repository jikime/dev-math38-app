import NextAuth, { DefaultSession } from "next-auth"

/**
 * NextAuth 타입 확장
 * - Session과 JWT에 커스텀 필드 추가
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      image: string | null
      academyId: number
      academyName: string
      loginMethod: string
      idPasswordLimitTime?: Date
    } & DefaultSession["user"]
    accessToken?: string
    refreshToken?: string
    impersonated?: boolean
    impersonator?: string
  }

  interface User {
    id: string
    name: string
    email: string
    image: string | null
    academyId: number
    academyName: string
    impersonated?: boolean
    impersonator?: string
    idPasswordLimitTime?: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string
    email: string
    image: string | null
    academyId: number
    academyName: string
    accessToken?: string
    refreshToken?: string
    user?: {
      id: string
      name: string
      email: string
      image: string | null
      academyId: number
      academyName: string
      loginMethod?: string
      idPasswordLimitTime?: Date
    }
    impersonated?: boolean
    impersonator?: string
  }
}