import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui 표준 cn 유틸: clsx로 조건부 클래스를 조합하고, tailwind-merge로
// 충돌하는 Tailwind 클래스(예: "p-2 p-4")를 뒤에 오는 값이 이기도록 정리한다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
