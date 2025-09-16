// app/logout/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutStart() {
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

  // 페이지 로드 시 자동으로 로그아웃 실행
  useEffect(() => {
    if (session) {
      handleLogout();
    }
  }, [session]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">로그아웃 중…</h1>
        <div className="text-gray-500">
          로그아웃을 진행하고 있습니다.
        </div>
      </div>
    </main>
  );
}
