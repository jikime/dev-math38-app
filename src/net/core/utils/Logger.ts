/**
 * 중앙집중식 로깅 유틸리티
 * 환경별 로깅 레벨 관리 및 구조화된 로깅 제공
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LogContext {
  /** 로그가 발생한 모듈/컴포넌트 */
  module?: string;
  /** 추가 메타데이터 */
  metadata?: Record<string, any>;
  /** 타임스탬프 */
  timestamp?: Date;
  /** 사용자 ID */
  userId?: string;
  /** 세션 ID */
  sessionId?: string;
  /** 요청 ID */
  requestId?: string;
}

export interface LoggerConfig {
  /** 로그 레벨 */
  level: LogLevel;
  /** 프로덕션 환경에서 로깅 활성화 여부 */
  enableInProduction: boolean;
  /** 로그 포맷터 */
  formatter?: (level: LogLevel, message: string, context?: LogContext) => string;
  /** 외부 로깅 서비스로 전송 */
  externalLogger?: (level: LogLevel, message: string, context?: LogContext) => void;
}

class Logger {
  private config: LoggerConfig;
  private readonly isDevelopment: boolean;
  private readonly logLevelNames: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.NONE]: 'NONE',
  };

  private readonly logLevelEmojis: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: '🔍',
    [LogLevel.INFO]: 'ℹ️',
    [LogLevel.WARN]: '⚠️',
    [LogLevel.ERROR]: '🚨',
    [LogLevel.NONE]: '🔇',
  };

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.config = this.getDefaultConfig();
  }

  /**
   * 기본 설정 가져오기
   */
  private getDefaultConfig(): LoggerConfig {
    const envLogLevel = process.env.NEXT_PUBLIC_LOG_LEVEL?.toUpperCase();
    let level = LogLevel.INFO;

    if (envLogLevel && envLogLevel in LogLevel) {
      level = LogLevel[envLogLevel as keyof typeof LogLevel];
    } else if (this.isDevelopment) {
      level = LogLevel.DEBUG;
    } else {
      level = LogLevel.ERROR;
    }

    return {
      level,
      enableInProduction: false,
      formatter: this.defaultFormatter.bind(this),
    };
  }

  /**
   * 기본 포맷터
   */
  private defaultFormatter(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = context?.timestamp || new Date();
    const emoji = this.logLevelEmojis[level];
    const levelName = this.logLevelNames[level];
    const moduleName = context?.module ? `[${context.module}]` : '';

    if (this.isDevelopment) {
      // 개발 환경: 이모지와 색상 사용
      return `${emoji} ${moduleName} ${message}`;
    } else {
      // 프로덕션 환경: 구조화된 로그
      return JSON.stringify({
        level: levelName,
        message,
        timestamp: timestamp.toISOString(),
        ...context,
      });
    }
  }

  /**
   * 로거 설정 업데이트
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 로그 출력 여부 확인
   */
  private shouldLog(level: LogLevel): boolean {
    if (level < this.config.level) {
      return false;
    }

    if (!this.isDevelopment && !this.config.enableInProduction) {
      return level >= LogLevel.ERROR;
    }

    return true;
  }

  /**
   * 로그 출력
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    ...args: any[]
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.config.formatter
      ? this.config.formatter(level, message, context)
      : this.defaultFormatter(level, message, context);

    // 콘솔 출력
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        break;
    }

    // 외부 로거로 전송
    if (this.config.externalLogger) {
      try {
        this.config.externalLogger(level, message, context);
      } catch (error) {
        console.error('Failed to send log to external logger:', error);
      }
    }
  }

  /**
   * DEBUG 레벨 로그
   */
  debug(message: string, context?: LogContext, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, context, ...args);
  }

  /**
   * INFO 레벨 로그
   */
  info(message: string, context?: LogContext, ...args: any[]): void {
    this.log(LogLevel.INFO, message, context, ...args);
  }

  /**
   * WARN 레벨 로그
   */
  warn(message: string, context?: LogContext, ...args: any[]): void {
    this.log(LogLevel.WARN, message, context, ...args);
  }

  /**
   * ERROR 레벨 로그
   */
  error(message: string, context?: LogContext, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, context, ...args);
  }

  /**
   * API 요청 로깅
   */
  logApiRequest(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }

    const context: LogContext = {
      module: 'API',
      metadata: {
        method,
        url,
        data: this.isDevelopment ? data : undefined,
        headers: this.isDevelopment ? headers : undefined,
      },
    };

    this.debug(`📡 API Request: ${method} ${url}`, context);
  }

  /**
   * API 응답 로깅
   */
  logApiResponse(
    method: string,
    url: string,
    status: number,
    data?: any,
    duration?: number
  ): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }

    const context: LogContext = {
      module: 'API',
      metadata: {
        method,
        url,
        status,
        duration,
        data: this.isDevelopment && status >= 400 ? data : undefined,
      },
    };

    const emoji = status < 400 ? '✅' : '❌';
    const message = `${emoji} API Response: ${method} ${url} - ${status}${
      duration ? ` (${duration}ms)` : ''
    }`;

    if (status >= 400) {
      this.error(message, context);
    } else {
      this.debug(message, context);
    }
  }

  /**
   * API 에러 로깅
   */
  logApiError(
    method: string,
    url: string,
    error: any,
    context?: LogContext
  ): void {
    const errorContext: LogContext = {
      module: 'API',
      ...context,
      metadata: {
        method,
        url,
        error: {
          message: error.message,
          status: error.status,
          code: error.code,
          stack: this.isDevelopment ? error.stack : undefined,
        },
        ...context?.metadata,
      },
    };

    this.error(`🚨 API Error: ${method} ${url} - ${error.message}`, errorContext);
  }

  /**
   * 성능 측정 시작
   */
  startTimer(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.debug(`⏱️ Performance: ${label} took ${duration.toFixed(2)}ms`, {
        module: 'Performance',
        metadata: { label, duration },
      });
    };
  }

  /**
   * 그룹 로깅 시작
   */
  group(label: string): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.isDevelopment) {
      console.group(label);
    }
  }

  /**
   * 그룹 로깅 종료
   */
  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * 테이블 로깅
   */
  table(data: any, columns?: string[]): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.isDevelopment) {
      console.table(data, columns);
    }
  }

  /**
   * 현재 로그 레벨 가져오기
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * 로그 레벨 설정
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

// 싱글톤 인스턴스
export const logger = new Logger();

// 모듈별 로거 생성 헬퍼
export function createModuleLogger(moduleName: string) {
  return {
    debug: (message: string, metadata?: Record<string, any>) =>
      logger.debug(message, { module: moduleName, metadata }),
    info: (message: string, metadata?: Record<string, any>) =>
      logger.info(message, { module: moduleName, metadata }),
    warn: (message: string, metadata?: Record<string, any>) =>
      logger.warn(message, { module: moduleName, metadata }),
    error: (message: string, metadata?: Record<string, any>) =>
      logger.error(message, { module: moduleName, metadata }),
  };
}

// 기본 export
export default logger;