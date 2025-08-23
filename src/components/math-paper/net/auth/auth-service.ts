import { User } from "next-auth"

// 빌드 시에도 안전하게 작동하도록 수정
const getApiUrl = () => {
  // 서버 사이드 빌드 시점에는 환경변수가 없을 수 있으므로 기본값 사용
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || "https://api2.suzag.com"
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://api2.suzag.com"
}

const API_URL = getApiUrl()

/**
 * 인증 관련 서비스 함수들
 */
export const authService = {
  /**
   * Impersonation (대리 로그인) 처리
   */
  async handleImpersonation(impersonationToken: string): Promise<User | null> {
    try {
      // Impersonation 토큰 검증
      const tokenResponse = await fetch(`${API_URL}/impersonate/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: impersonationToken })
      });

      if (!tokenResponse.ok) {
        throw new Error("유효하지 않은 임퍼소네이션 토큰입니다.")
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData) {
        throw new Error("유효하지 않은 임퍼소네이션 토큰입니다.")
      }

      // 사용자 정보 조회
      const userResponse = await fetch(`${API_URL}/api/account2`, {
        headers: {
          Authorization: `Bearer ${tokenData.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.")
      }

      const userData = await userResponse.json();

      if (!userData || userData.error) {
        throw new Error(userData.error || "사용자 정보를 가져오는데 실패했습니다.")
      }

      return {
        user: userData,
        ...tokenData,
        impersonated: true,
        impersonator: tokenData.impersonator,
      } as User
    } catch (error: any) {
      throw new Error(error.message || "임퍼소네이션에 실패했습니다.")
    }
  },

  /**
   * 일반 로그인 처리
   */
  async handleLogin(username: string, password: string): Promise<User | null> {
    try {
      // 로그인 요청
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "login",
          username,
          password,
        }),
      })

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("아이디 또는 비밀번호가 잘못되었습니다.")
          case 403:
            throw new Error("권한이 없습니다.")
          case 500:
            throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.")
          default:
            throw new Error("로그인에 실패했습니다.")
        }
      }

      const tokenData = await response.json()

      // 사용자 정보 조회
      const userResponse = await fetch(`${API_URL}/api/account2`, {
        headers: {
          Authorization: `Bearer ${tokenData.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.")
      }

      const userData = await userResponse.json();

      if (!userData || userData.error) {
        throw new Error(userData.error || "사용자 정보를 가져오는데 실패했습니다.")
      }

      return { 
        user: userData, 
        ...tokenData 
      } as User
    } catch (error: any) {
      throw error
    }
  },

  /**
   * 카카오 로그인 처리
   */
  async handleKakaoLogin(user: any): Promise<any> {
    try {
      // 카카오 로그인 API 호출 - API_URL이 이미 https://api2.suzag.com 형태이므로 경로만 추가
      const loginResponse = await fetch(`${API_URL}/api/open/kakao-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!loginResponse.ok) {
        throw new Error("카카오 로그인에 실패했습니다.")
      }

      const userData = await loginResponse.json();

      // 사용자 정보 조회
      const userResponse = await fetch(`${API_URL}/api/account2`, {
        headers: {
          Authorization: `Bearer ${userData.accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("사용자 정보를 가져오는데 실패했습니다.")
      }

      const userInfo = await userResponse.json();

      if (!userInfo || userInfo.error) {
        throw new Error(userInfo.error || "사용자 정보를 가져오는데 실패했습니다.")
      }

      return {
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
        user: userInfo,
        impersonated: userData.impersonated,
        impersonator: userData.impersonator,
      }
    } catch (error) {
      throw error
    }
  },

  /**
   * 카카오 계정 연결
   */
  async connectKakaoAccount(
    userId: string, 
    code: string, 
    redirectUri: string, 
    accessToken: string
  ) {
    const response = await fetch(`${API_URL}/api/common/profile/sns/connect/kakao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ userId, code, redirectUri })
    });

    if (!response.ok) {
      throw new Error("카카오 계정 연결에 실패했습니다.")
    }

    return response.json();
  },
}