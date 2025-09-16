// app/logout/callback/page.tsx
"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function nukeCookie(name: string) {
    // 비-HttpOnly 쿠키 제거용 (HttpOnly 쿠키는 signOut이 제거)
    // path 다양성 대응
    const past = "Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `${name}=; expires=${past}; path=/`;
    document.cookie = `${name}=; expires=${past}; path=/; SameSite=Lax`;
    document.cookie = `${name}=; expires=${past}; path=/; SameSite=None; Secure`;
    document.cookie = `${name}=; expires=${past}; path=/; SameSite=Strict`;
    // 도메인별 삭제도 시도
    document.cookie = `${name}=; expires=${past}; path=/; domain=localhost`;
    document.cookie = `${name}=; expires=${past}; path=/; domain=.localhost`;
}

function clearAllCookies() {
    try {
        // 현재 도메인의 모든 쿠키 가져오기
        const cookies = document.cookie.split(';');
        console.log("현재 쿠키들:", cookies);
        
        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            if (cookieName) {
                console.log("쿠키 삭제 시도:", cookieName);
                nukeCookie(cookieName);
            }
        });
        
        // NextAuth 관련 쿠키들 명시적으로 삭제
        const nextAuthCookies = [
            'authjs.session-token',
            'authjs.csrf-token', 
            'authjs.callback-url',
            'JSESSIONID',
            '__Secure-authjs.session-token',
            '__Host-authjs.session-token'
        ];
        
        nextAuthCookies.forEach(cookieName => {
            nukeCookie(cookieName);
        });
        
    } catch (error) {
        console.error("쿠키 삭제 중 오류:", error);
    }
}

export default function LogoutCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("로그아웃 콜백 시작");
        
        // 1) 서버 사이드 로그아웃 API 호출 (HttpOnly 쿠키 삭제)
        console.log("서버 사이드 로그아웃 API 호출");
        try {
          const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            console.log("서버 사이드 로그아웃 성공");
          } else {
            console.warn("서버 사이드 로그아웃 실패, 클라이언트 사이드로 진행");
          }
        } catch (apiError) {
          console.warn("서버 사이드 로그아웃 API 오류:", apiError);
        }
        
        // 2) NextAuth 세션/쿠키 제거 (리다이렉트는 여기서 제어)
        console.log("NextAuth signOut 실행");
        await signOut({ redirect: false });
        console.log("NextAuth signOut 완료");

        // 3) 로컬 쿠키들 모두 삭제
        console.log("로컬 쿠키 삭제 시작");
        clearAllCookies();
        console.log("로컬 쿠키 삭제 완료");

        // 4) 앱 측 저장소 정리
        try {
          console.log("로컬/세션 스토리지 정리");
          localStorage.clear();
          sessionStorage.clear();
          console.log("로컬/세션 스토리지 정리 완료");
        } catch (error) {
          console.error("스토리지 정리 중 오류:", error);
        }

        // 5) 충분한 시간을 두고 리다이렉트
        setTimeout(() => {
            console.log("홈페이지로 리다이렉트");
            // 강제로 페이지 새로고침과 함께 리다이렉트
            window.location.href = "/";
        }, 1000); // 500ms -> 1000ms로 증가

      } catch (error) {
        console.error("로그아웃 중 오류:", error);
        // 오류가 발생해도 홈으로 리다이렉트
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
      
    })();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">로그아웃 중…</h1>
        <div className="text-gray-500">
          세션과 쿠키를 정리하고 있습니다.
        </div>
      </div>
    </main>
  );
}
