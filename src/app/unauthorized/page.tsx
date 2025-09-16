'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn } from 'next-auth/react'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  const handleLogin = () => {
    signIn('oauth2', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <ShieldAlert size={48} />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              로그인이 필요합니다
            </CardTitle>
            <CardDescription className="text-gray-600">
              이 페이지에 접근하려면 로그인이 필요합니다.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full text-white"
              size="lg"
            >
              로그인하기
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>계정이 없으시다면 관리자에게 문의하세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}