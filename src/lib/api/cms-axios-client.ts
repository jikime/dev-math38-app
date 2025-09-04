import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// CMS API 베이스 URL
const CMS_API_BASE_URL = 'https://cms1.suzag.com';

// CMS API용 Axios 인스턴스 생성
const cmsAxiosClient: AxiosInstance = axios.create({
  baseURL: CMS_API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// Request 인터셉터
cmsAxiosClient.interceptors.request.use(
  (config) => {
    // 요청 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 CMS Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ CMS Request Error:', error);
    return Promise.reject(error);
  }
);

// Response 인터셉터
cmsAxiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 로깅 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ CMS Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.info('❌ CMS Response Error:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default cmsAxiosClient;

// CMS API 요청 헬퍼 함수들
export const cmsApiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    cmsAxiosClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    cmsAxiosClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    cmsAxiosClient.put<T>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    cmsAxiosClient.patch<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    cmsAxiosClient.delete<T>(url, config),
};