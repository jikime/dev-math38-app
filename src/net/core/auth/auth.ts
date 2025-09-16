// auth.ts
import NextAuth from "next-auth";

// 디버그 모드 확인
const isDebugMode = false;//process.env.NODE_ENV === 'development' && process.env.DEBUG_AUTH === 'true';


// 🔒 보안 개선: 중앙화된 토큰 검증 사용
import { TokenValidator } from './TokenValidator';

// JWT 토큰 파싱 함수 (TokenValidator로 위임)
function parseJWT(token: string) {
  return TokenValidator.parseJWT(token);
}

// 사용자 데이터 추출 함수
function extractUserDataFromToken(tokenPayload: any) {
  return {
    userId: tokenPayload.userId,
    name: tokenPayload.name,
    academyId: tokenPayload.academyId,
    academyName: tokenPayload.academyName,
    authorities: tokenPayload.authorities,
  };
}

// 세션에 토큰 정보를 추가하는 함수
function assignTokenDataToSession(session: any, tokenData: any, userData: any) {
    session.accessToken = tokenData.access_token || tokenData.accessToken;
    session.idToken = tokenData.id_token || tokenData.idToken;
    session.refreshToken = tokenData.refresh_token || tokenData.refreshToken;
    session.userId = userData.userId;
    session.name = userData.name;
    session.academyId = userData.academyId;
    session.academyName = userData.academyName;
    session.authorities = userData.authorities;
}

// 토큰 갱신 함수
async function refreshToken(refreshToken: string) {
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      // client_id: process.env.OIDC_CLIENT_ID!,
      // client_secret: process.env.OIDC_CLIENT_SECRET!,
    });
    
    if (isDebugMode) {
      console.log("=== 토큰 갱신 요청 ===");
      console.log("요청 URL:", `${process.env.NEXT_PUBLIC_OIDC_ISSUER}/oauth2/token`);
      // 🔒 보안: 민감 정보 로깅 제거
      console.log("요청 본문:", {
        grant_type: "refresh_token",
        // refresh_token: "[REDACTED]", // 토큰 정보 완전 제거
        client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET ? "[CONFIGURED]" : "[NOT_SET]"
      });
    }

    const credentials = Buffer.from(
      `${process.env.NEXT_PUBLIC_OIDC_CLIENT_ID}:${process.env.OIDC_CLIENT_SECRET}`
    ).toString('base64');
    const resp = await fetch(`${process.env.NEXT_PUBLIC_OIDC_ISSUER}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`
      },
      body,
    });
    
    if (isDebugMode) {
      console.log("응답 상태:", resp.status);
      console.log("응답 헤더:", Object.fromEntries(resp.headers.entries()));
    }
    
    if (!resp.ok) {
      const errorText = await resp.text();
      if (isDebugMode) {
        console.log("❌ 토큰 갱신 실패");
        console.log("에러 응답:", errorText);
        console.log("응답 상태:", resp.status);
      }
      if(resp.status === 401) {
        // 401 Unauthorized - Refresh token이 유효하지 않음 (만료, 무효화 등)
        if (isDebugMode) {
          console.log("❌ 401 Unauthorized - Refresh token이 유효하지 않음");
          console.log("토큰 갱신 실패 - 재로그인 필요");
        }
        // 서버/클라이언트 환경 모두에서 안전하게 처리
        // 실제 리다이렉트는 JWT 콜백이나 클라이언트 컴포넌트에서 처리
        throw new Error('REFRESH_TOKEN_INVALID');
      }
      throw new Error(`refresh failed: ${resp.status} ${errorText}`);
    }
    
    const data = await resp.json() as any;
    if (isDebugMode) {
      console.log("✅ 토큰 갱신 성공");
      // 🔒 보안: 민감 정보 로깅 최소화
      console.log("토큰 갱신 응답:", {
        hasAccessToken: !!data.access_token,
        hasIdToken: !!data.id_token,
        expiresIn: data.expires_in,
        hasRefreshToken: !!data.refresh_token
        // 실제 토큰 값은 로깅하지 않음
      });
    }
    
    return data;
  } catch (error) {
    if (isDebugMode) {
      console.log("❌ 토큰 갱신 중 예외 발생:", error);
      console.log("에러 타입:", error instanceof Error ? error.constructor.name : typeof error);
      console.log("에러 메시지:", error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
}



export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 }, // 24시간으로 변경 (5분 테스트 해제)
  pages: {
    error: '/auth/error', // 커스텀 에러 페이지
  },
  providers: [
    {
      id: "oauth2",
      name: "Suzag Auth",
      type: "oauth",
      issuer: `${process.env.NEXT_PUBLIC_OIDC_ISSUER}`,
      clientId: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      wellKnown: `${process.env.NEXT_PUBLIC_OIDC_ISSUER}/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid profile email offline_access" } },
      token: `${process.env.NEXT_PUBLIC_OIDC_ISSUER}/oauth2/token`,
      userinfo: `${process.env.NEXT_PUBLIC_OIDC_ISSUER}/userinfo`,   // 직접 명시
      checks: ["pkce", "state"],
    },
  ],
  callbacks: {
     async jwt({ token, account, trigger, user }) {
       if (account) {
         if (account.access_token) token.accessToken = account.access_token;
         if (account.id_token) token.idToken = account.id_token;
         if (account.refresh_token) token.refreshToken = account.refresh_token; // ✅ 서버측 보관
         if (account.expires_at)   token.accessTokenExpires = account.expires_at * 1000;

         // ID 토큰에서 사용자 데이터 추출
         if (account.id_token) {
           const payload = parseJWT(account.id_token);
           if (payload) {
             const userData = extractUserDataFromToken(payload);
             Object.assign(token, userData);
           }
         }
       }

       if (isDebugMode) {
         console.log("=== JWT 콜백 실행 ===");
         console.log("트리거:", trigger, "(타입:", typeof trigger, ")");
         console.log("user 인자:", user);
         console.log("user?.forceRefresh:", user?.forceRefresh);
         console.log("강제 갱신 플래그 설정 전:", token.forceRefresh);
       }

       // update() 호출 시 인자에서 forceRefresh 플래그 확인
       // trigger가 'update'이거나 user 객체에 forceRefresh가 있는 경우
       if ((trigger === 'update') || (user?.forceRefresh === true)) {
         (token as any).forceRefresh = true;
         if (isDebugMode) console.log("강제 갱신 플래그 설정됨: true");
       }

       if (isDebugMode) console.log("===> jwt tokens : ", token);

       // accessToken claims 확인 및 사용자 데이터 추출
       if (token?.accessToken) {
         const accessTokenPayload = parseJWT(token.accessToken as string);
         if (accessTokenPayload) {
           if (isDebugMode) console.log("===> accessToken claims:", accessTokenPayload);
           const userData = extractUserDataFromToken(accessTokenPayload);
           Object.assign(token, userData);
         }
       }

       // 수동 토큰 갱신 트리거 처리
       const shouldForceRefresh = token.forceRefresh === true;

       if (isDebugMode) {
         console.log("강제 갱신 플래그 설정 후:", token.forceRefresh);
         console.log("강제 갱신 필요:", shouldForceRefresh);
       }

       // 액세스 토큰 만료 시 또는 강제 갱신 시, refresh_token으로 재발급
       const now = Date.now();
       const accessTokenExpires = Number(token.accessTokenExpires);

       if (isDebugMode) {
         console.log("현재 시간:", now, "(" + new Date(now).toLocaleString() + ")");
         console.log("토큰 만료 시간:", accessTokenExpires, "(" + new Date(accessTokenExpires).toLocaleString() + ")");
         console.log("토큰 만료됨:", now >= accessTokenExpires);
         console.log("30초 이내 만료:", now >= accessTokenExpires - 30_000);
         console.log("Refresh Token 존재:", !!token.refreshToken);
       }

       // 토큰이 만료되었거나 30초 이내에 만료될 예정인 경우 갱신 시도
       // 또는 강제 갱신이 요청된 경우
       const shouldRefresh = shouldForceRefresh ||
         (token.accessToken && token.accessTokenExpires && !isNaN(accessTokenExpires) && now >= accessTokenExpires - 30_000) ||
         (!token.accessToken && token.refreshToken); // 토큰이 없지만 refresh token이 있는 경우

       if (isDebugMode) {
         console.log("갱신 필요:", shouldRefresh);
         console.log("갱신 조건:", {
           shouldForceRefresh,
           hasAccessToken: !!token.accessToken,
           hasAccessTokenExpires: !!token.accessTokenExpires,
           isValidExpiry: !isNaN(accessTokenExpires),
           isExpiredOrNearExpiry: token.accessToken ? (now >= accessTokenExpires - 30_000) : false,
           noAccessTokenButHasRefresh: !token.accessToken && !!token.refreshToken
         });
       }
       
       if (shouldRefresh && token.refreshToken) {
         if (isDebugMode) console.log(shouldForceRefresh ? "강제 토큰 갱신 시도" : "토큰 만료로 인한 재발급 시도");
         try {
           if (isDebugMode) console.log("Refresh Token으로 새 토큰 요청 중...");
           const data = await refreshToken(String(token.refreshToken));
           
           if (isDebugMode) {
             console.log("새 토큰 응답:", {
               hasAccessToken: !!data.access_token,
               hasIdToken: !!data.id_token,
               expiresIn: data.expires_in,
               hasRefreshToken: !!data.refresh_token
             });
           }
           
           token.accessToken = data.access_token;
           token.idToken = data.id_token ?? token.idToken;
           token.accessTokenExpires = Date.now() + (data.expires_in ?? 3600) * 1000;
           if (data.refresh_token) token.refreshToken = data.refresh_token; // rotate 시 갱신
           
           // 강제 갱신 플래그 제거
           delete (token as any).forceRefresh;
           
           if (isDebugMode) {
             console.log("✅ 토큰 갱신 성공!");
             console.log("새 만료 시간:", token.accessTokenExpires, "(" + new Date(Number(token.accessTokenExpires)).toLocaleString() + ")");
             // 🔒 보안: 토큰 값 로깅 제거
            // console.log("새 토큰:", data.access_token?.substring(0, 30) + "...");
           }
         } catch (error) {
           if (isDebugMode) {
             console.log("❌ 토큰 갱신 실패:", error);
             console.log("에러 상세:", error);
           }

           // 에러 타입에 따른 처리 분기
           const isRefreshTokenInvalid = error instanceof Error &&
                                        error.message === 'REFRESH_TOKEN_INVALID';

           if (isDebugMode) {
             console.log("❌ 토큰 갱신 실패 상세 분석:");
             console.log("  에러 타입:", error instanceof Error ? error.constructor.name : typeof error);
             console.log("  에러 메시지:", error instanceof Error ? error.message : String(error));
             console.log("  Refresh Token 무효 여부:", isRefreshTokenInvalid);
           }

           if (isRefreshTokenInvalid) {
             if (isDebugMode) {
               console.log("🔄 Refresh Token이 무효함 - 완전한 로그아웃 상태로 전환");
               console.log("  RefreshAccessTokenError 플래그 설정됨");
             }
             // Refresh Token이 무효한 경우 모든 토큰 정보 제거
             delete (token as any).accessToken;
             delete (token as any).accessTokenExpires;
             delete (token as any).refreshToken; // 무효한 refresh token 제거
             delete (token as any).idToken;
             delete (token as any).forceRefresh;

             // 에러 상태 표시 (클라이언트에서 감지 가능)
             (token as any).error = 'RefreshAccessTokenError';
             (token as any).errorTime = Date.now();
           } else {
             if (isDebugMode) {
               console.log("⚠️ 일시적인 토큰 갱신 실패 - Refresh Token 보존");
               console.log("  RefreshAccessTokenError 플래그 설정하지 않음");
             }
             // 일시적인 오류인 경우 access token만 제거하고 refresh token 보존
             delete (token as any).accessToken;
             delete (token as any).accessTokenExpires;
             delete (token as any).forceRefresh;

             // 재시도 가능 상태 표시 (RefreshAccessTokenError는 설정하지 않음)
             (token as any).lastRefreshError = error instanceof Error ? error.message : 'Unknown error';
             (token as any).lastRefreshErrorTime = Date.now();
           }
         }
       } else if (shouldRefresh && !token.refreshToken) {
         if (isDebugMode) console.log("❌ 갱신 필요하지만 Refresh Token이 없음");
       } else {
         if (isDebugMode) console.log("ℹ️ 토큰 갱신 불필요 (아직 유효함)");
       }
       return token;
     },
     async session({ session, token }) {
       // 토큰에서 사용자 데이터 추출
       const userData = extractUserDataFromToken(token);
       
       // 세션에 토큰 정보 추가
       assignTokenDataToSession(session, token, userData);
       
       // refreshToken을 세션에 포함하여 클라이언트에서 사용 가능하도록 함
       if (token.refreshToken) {
         session.refreshToken = token.refreshToken as string;
       }

       // 토큰이 만료되었고 refresh token이 있는 경우 갱신 시도
       if (!token.accessToken && token.refreshToken) {
         if (isDebugMode) console.log("세션에서 토큰 갱신 시도");
         try {
           const data = await refreshToken(String(token.refreshToken));
           
           // 갱신된 토큰에서 사용자 데이터 추출
           const refreshedUserData = extractUserDataFromToken(data);
           
           // 갱신된 토큰 정보를 세션에 할당
           assignTokenDataToSession(session, data, refreshedUserData);
           
           // refreshToken이 갱신된 경우 세션에도 업데이트
           if (data.refresh_token) {
             session.refreshToken = data.refresh_token as string;
           }

           if (isDebugMode) console.log("세션에서 토큰 갱신 성공");
         } catch (error) {
           if (isDebugMode) console.log("세션에서 토큰 갱신 실패", error);
         }
       }
       
       return session;
     },
  },
});
