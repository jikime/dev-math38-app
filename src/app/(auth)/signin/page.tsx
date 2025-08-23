"use client"

import React, { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const errorParam = searchParams.get("error")
  
  const [loginSuccess, setLoginSuccess] = useState(false)

  // URL에서 오는 에러 코드를 디코딩
  const decodeErrorCode = (errorCode: string | null): string => {
    if (!errorCode) return ""
    
    try {
      return decodeURIComponent(errorCode)
    } catch {
      return errorCode
    }
  }
  
  const decodedError = decodeErrorCode(errorParam)

  // 오류 메시지 처리
  const getErrorMessage = useCallback((errorCode: string) => {
    if (loginSuccess) return ""
    
    // HTTP 상태 코드 처리
    if (errorCode.includes("Request failed with status code")) {
      const statusCode = errorCode.split("Request failed with status code ").pop()
      
      if (statusCode === "500") {
        return "카카오 계정이 연결되어 있지 않습니다. 먼저 일반 계정으로 가입 후 로그인하신 다음, 설정에서 카카오 계정을 연결해주세요."
      }
      return "로그인 중 문제가 발생했습니다. 다시 시도해주세요."
    }
    
    switch (errorCode) {
      case "OAuthCallback":
      case "Callback":
        return "연결이 해제된 카카오 계정입니다. 관리자에게 문의하세요."
      case "OAuthAccountNotLinked":
        return "이미 다른 방식으로 가입된 이메일입니다. 다른 로그인 방식을 사용해주세요."
      case "AccessDenied":
        return "로그인 권한이 없습니다. 관리자에게 문의해주세요."
      case "Verification":
        return "인증 링크가 만료되었거나 이미 사용되었습니다."
      case "CredentialsSignin":
        return "아이디 또는 비밀번호가 올바르지 않습니다."
      case "KakaoNotLinked":
        return "카카오 계정이 연결되어 있지 않습니다. 먼저 일반 계정으로 가입 후 로그인하신 다음, 설정에서 카카오 계정을 연결해주세요."
      case "InvalidUsername":
      case "InvalidPassword":
        return "아이디 또는 비밀번호가 올바르지 않습니다."
      case "KakaoDisconnected":
        return "카카오 계정 연결이 해제되었습니다. 관리자에게 문의하세요."
      default:
        if (errorCode.includes("연결이 해제")) {
          return errorCode
        } else if (errorCode.includes("카카오 로그인만")) {
          return "이 계정은 카카오 로그인만 사용 가능합니다. 카카오 로그인을 이용해주세요."
        } else if (errorCode.includes("카카오 로그인을 사용할 수 없습니다")) {
          return "이 계정은 아이디/비밀번호로만 로그인 가능합니다."
        } else if (errorCode.includes("password") || errorCode.includes("username") || errorCode.includes("credentials")) {
          return "아이디 또는 비밀번호가 올바르지 않습니다."
        }
        return "로그인 중 문제가 발생했습니다. 다시 시도해주세요."
    }
  }, [loginSuccess])

  const [formState, setFormState] = useState({
    username: "",
    password: "",
    isLoading: false,
    error: decodedError ? getErrorMessage(decodedError) : "",
  })
  
  // URL에서 오는 에러 코드 처리
  useEffect(() => {
    if (decodedError) {
      setFormState(prev => ({
        ...prev,
        error: getErrorMessage(decodedError)
      }))
    }
  }, [decodedError, getErrorMessage])

  const handleKakaoLogin = async () => {
    try {
      setFormState({
        ...formState,
        isLoading: true,
        error: "",
      })
      
      const response = await signIn("kakao", { 
        redirect: false,
        callbackUrl
      })
      
      if (response?.error) {
        setFormState({
          ...formState,
          isLoading: false,
          error: getErrorMessage(response.error),
        })
      } else {
        setLoginSuccess(true)
        setFormState({
          ...formState,
          isLoading: false,
          error: "",
        })
        
        setTimeout(() => {
          router.push(callbackUrl)
        }, 100)
      }
    } catch (error) {
      let errorMessage = "카카오로 로그인 중 문제가 발생했습니다."
      
      if (error instanceof Error) {
        if (error.message === "KakaoNotLinked") {
          errorMessage = getErrorMessage("KakaoNotLinked")
        } else {
          errorMessage = error.message
        }
      }
      
      setFormState({
        ...formState,
        isLoading: false,
        error: errorMessage,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 min-h-[400px]">
        <LoginForm 
          callbackUrl={callbackUrl} 
          handleKakaoLogin={handleKakaoLogin} 
          initialError={formState.error}
          isLoading={formState.isLoading}
        />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}