import NextAuth from "next-auth"
import authOptions from "@/components/math-paper/net/auth/auth-options"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }