import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 클래스 이름 병합 유틸리티
 * - Tailwind CSS 클래스 충돌 해결
 * - 조건부 클래스 적용 지원
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}