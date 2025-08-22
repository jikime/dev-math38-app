/**
 * 레거시 타입 파일
 * 
 * 기존 코드와의 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 /types/domains/ 하위의 도메인별 타입을 직접 import하는 것을 권장합니다.
 * 
 * @deprecated 점진적으로 도메인별 타입으로 마이그레이션 중
 */

// 도메인별로 분리된 타입들을 re-export
export * from './domains/paper';
export * from './domains/problem';
export * from './domains/common';
export * from './domains/skill';
export * from './domains/study';
export * from './domains/lecture';
export * from './domains/user';
