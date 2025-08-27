"use client"

import React, { useEffect, useState, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

interface LoginFormProps {
  callbackUrl: string
  handleKakaoLogin: () => void
  initialError?: string
  isLoading?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
  remember: boolean
}

const DEFAULT_URL = "/tutor/problemmng/repository"

const LoginForm = ({ 
  callbackUrl, 
  handleKakaoLogin, 
  initialError, 
  isLoading: externalLoading 
}: LoginFormProps) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(externalLoading || false)
  const [error, setError] = useState<string | null>(initialError || null)
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false)
  const [rememberedUsername, setRememberedUsername] = useState<string>("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername")
    if (savedUsername) {
      setRememberedUsername(savedUsername)
    }
  }, [])

  useEffect(() => {
    if (rememberedUsername) {
      setUsername(rememberedUsername)
      setRemember(true)
    }
  }, [rememberedUsername])

  useEffect(() => {
    if (initialError) {
      setError(initialError)
    }
  }, [initialError])
  
  useEffect(() => {
    setIsLoading(externalLoading || false)
  }, [externalLoading])

  useEffect(() => {
    if (status === "authenticated" && session?.user && loginSuccess) {
      const successUrl = callbackUrl && callbackUrl !== "/" ? callbackUrl : DEFAULT_URL
      router.push(successUrl)
    }
  }, [status, session, loginSuccess, callbackUrl, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login({ username, password, remember })
  }

  const login = async ({ username, password, remember }: LoginCredentials) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        remember,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        if (remember) {
          localStorage.setItem("rememberedUsername", username)
        } else {
          localStorage.removeItem("rememberedUsername")
        }

        setLoginSuccess(true)
        
        setTimeout(() => {
          if (!session || status !== "authenticated") {
            const successUrl = callbackUrl && callbackUrl !== "/" ? callbackUrl : DEFAULT_URL
            router.push(successUrl)
          }
        }, 2000)
      }
    } catch (err) {
      setError("예기치 않은 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const onKakaoLogin = async () => {
    setIsLoading(true)
    try {
      await handleKakaoLogin()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <Image
            className="mx-auto h-36 w-auto max-w-[360px]"
            src="/assets/suzag.png"
            alt="수작(數作)"
            width={360}
            height={144}
            priority
          />
        </div>
        
        <div className="mt-8">
          <Button
            className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#FEE500]/90 font-medium"
            onClick={onKakaoLogin}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" className="mr-2">
                  <g fill="none">
                    <path 
                      fill="#000" 
                      d="M9 1.5C4.30371 1.5 0.5 4.53225 0.5 8.26419C0.5 10.5791 1.97957 12.6115 4.16984 13.7552L3.45068 16.7064C3.38775 16.9568 3.67334 17.1455 3.88791 17.0055L7.48666 14.634C7.98543 14.6961 8.48913 14.75 9 14.75C13.6963 14.75 17.5 11.7177 17.5 8.26419C17.5 4.53225 13.6963 1.5 9 1.5Z"
                    />
                  </g>
                </svg>
                카카오로 로그인
              </>
            )}
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>
        </div>
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해 주세요"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요"
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked as boolean)}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              아이디 기억하기
            </Label>
          </div>
          
          <div>
            {loginSuccess ? (
              <Button
                asChild
                className="w-full"
                variant="default"
                size="lg"
              >
                <Link href="/tutor/problemmng/repository">
                  페이지 이동중입니다. (click)
                </Link>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                variant="default"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인하기"
                )}
              </Button>
            )}
          </div>
        </form>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 text-red-500 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-bold">로그인에 실패했습니다</p>
                <p className="text-xs mt-1">{error}</p>
                {error.includes("카카오 계정이 연결되어 있지 않습니다") && (
                  <div className="mt-2 text-xs">
                    <p className="font-semibold">다음 절차를 따라주세요:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1 pl-2">
                      <li>일반 계정으로 먼저 회원가입 후 로그인하세요</li>
                      <li>설정 메뉴에서 카카오 계정 연결을 진행하세요</li>
                      <li>연결 후에는 카카오 로그인을 사용할 수 있습니다</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default LoginForm