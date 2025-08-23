import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from "@/components/math-paper/net/auth/auth-options"
import { authService } from '@/components/math-paper/net/auth/auth-service';
import { Session } from 'next-auth';

const redirectUri = process.env.KAKAO_REDIRECT_URI || '';

export async function GET(request: NextRequest) {
  try {
    // 현재 사용자 세션 가져오기
    const session = await getServerSession(authOptions as any) as Session & { 
      user: { userId: string },
      accessToken: string 
    };

    // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
    if (!session || !session.user) {
      console.error('세션 없음. 로그인 페이지로 리디렉션');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // URL에서 카카오 인증 코드 추출
    const code = request.nextUrl.searchParams.get('code');
    
    if (!code) {
      console.error('인증 코드가 없음');
      return NextResponse.redirect(
        new URL(`/tutor/profile?error=${encodeURIComponent('카카오 인증 코드 수신 실패')}`, request.url)
      );
    }
    
    // console.log('카카오 인증 코드 수신:', code.substring(0, 10) + '...');
    // console.log('사용자 ID:', session.user.userId, code, session.accessToken);
    
    try {
      await authService.connectKakaoAccount(session.user.userId, code, redirectUri, session.accessToken);
      
      console.log('카카오 계정 연결 성공');
      // 성공 시 프로필 페이지로 리디렉션
      return NextResponse.redirect(
        new URL(`/tutor/profile?success=${encodeURIComponent('카카오 계정 연결 성공')}`, request.url)
      );
    } catch (error: any) {
      console.error('카카오 계정 연결 실패:', error?.message || error);
      
      // 응답 객체가 있는 경우 상세 에러 확인
      if (error?.response?.data) {
        console.error('서버 응답:', error.response.data);
      }
      
      // 오류 발생 시 에러 메시지와 함께 프로필 페이지로 리디렉션
      return NextResponse.redirect(
        new URL(`/tutor/profile?error=${encodeURIComponent('카카오 계정 연결 실패')}`, request.url)
      );
    }
  } catch (error: any) {
    console.error('카카오 계정 연결 처리 중 오류 발생:', error?.message || error);
    
    // 오류 발생 시 홈페이지로 리디렉션
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent('Authentication error')}`, request.url)
    );
  }
}
