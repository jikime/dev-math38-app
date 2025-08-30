import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 베이스 URL 설정 (환경변수 또는 기본값)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
console.log('API_BASE_URL', API_BASE_URL);

// Axios 인스턴스 생성
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// Request 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    // const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const token = '#38ct-001';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response 인터셉터
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 액세스 토큰 갱신
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // 리프레시 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.info('❌ Response Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

// API 요청 헬퍼 함수들
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosClient.put<T>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosClient.patch<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.delete<T>(url, config),
};