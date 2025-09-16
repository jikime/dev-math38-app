'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthError {
  code: string;
  title: string;
  message: string;
  action: string;
}

const AUTH_ERRORS: Record<string, AuthError> = {
  multiple_session_not_allowed: {
    code: 'multiple_session_not_allowed',
    title: '다중 로그인 제한',
    message: '다른 기기에서 이미 로그인되어 있습니다. 기존 세션을 종료하고 다시 시도하세요.',
    action: '다시 로그인하기'
  },
  Configuration: {
    code: 'Configuration',
    title: '인증 설정 오류',
    message: '인증 서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    action: '다시 시도'
  },
  AccessDenied: {
    code: 'AccessDenied',
    title: '접근 거부',
    message: '이 애플리케이션에 접근할 권한이 없습니다.',
    action: '다시 로그인하기'
  },
  Verification: {
    code: 'Verification',
    title: '인증 실패',
    message: '이메일 또는 링크 인증에 실패했습니다.',
    action: '다시 로그인하기'
  },
  Default: {
    code: 'Default',
    title: '로그인 오류',
    message: '로그인 중 알 수 없는 오류가 발생했습니다.',
    action: '다시 시도'
  }
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<AuthError | null>(null);

  const { data: session } = useSession();

  const handleLogout = () => {
    const idToken = session?.idToken;
    const issuer = process.env.NEXT_PUBLIC_OIDC_ISSUER!;       // http://localhost:9010
    const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!;  // client1
    const postLogout = process.env.NEXT_PUBLIC_OIDC_LOGOUT_CALLBACK || "";

    // id_token_hint가 없거나 이상하면 서버가 client_id로만 식별하도록 허용
    const url = new URL(`${issuer}/connect/logout`);
    if (idToken) url.searchParams.set("id_token_hint", idToken);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("post_logout_redirect_uri", postLogout);

    window.location.href = url.toString(); // 브라우저 네비게이션(쿠키 동반)
  };
  

  useEffect(() => {
    const errorCode = searchParams.get('error') || 'Default';
    const errorMessage = searchParams.get('message');

    console.log('Auth Error Page - errorCode:', errorCode, 'message:', errorMessage);

    let authError = AUTH_ERRORS[errorCode] || AUTH_ERRORS.Default;

    // 서버에서 전달된 커스텀 메시지가 있으면 사용
    if (errorMessage) {
      authError = {
        ...authError,
        message: decodeURIComponent(errorMessage)
      };
    }

    setError(authError);
  }, [searchParams]);

  const handleRetry = async () => {
    // 홈페이지로 이동하여 다시 로그인 플로우 시작
    // router.push('/');
    handleLogout();
    // try {


    //   // NextAuth 세션 종료
    //   await signOut({});
    //   signIn("oauth2", { callbackUrl: "/tutor/problemmng/repository" });
  
    // } catch (error) {
    //   console.error('로그아웃 실패, 직접 리다이렉트:', error);
    //   // NextAuth 로그아웃 실패 시 직접 OIDC 로그인 페이지로 리다이렉트
    //   window.location.href = `${process.env.NEXT_PUBLIC_OIDC_ISSUER}/login?redirect_uri=${window.location.href}`;
    // }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (!error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* 아이콘 */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* 제목 */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error.title}
          </h1>

          {/* 메시지 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {error.message}
          </p>

          {/* 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {error.action}
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              홈으로 돌아가기
            </button>
          </div>

          {/* 에러 코드 (개발용) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                오류 코드: {error.code}
              </p>
              {searchParams.get('message') && (
                <p className="text-xs text-gray-500 mt-1">
                  원본 메시지: {searchParams.get('message')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}