"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * 다크/라이트 테마 프로바이더.
 * - attribute="class": <html class="dark">로 Tailwind의 dark: 변형을 구동
 * - defaultTheme="system": 기본값은 브라우저(OS) 테마를 따른다
 * - enableSystem: 시스템 테마 변경을 실시간으로 반영
 *
 * SSR에서 첫 렌더 시 서버는 테마를 알 수 없어 클라이언트와 markup이 달라질 수 있다(FOUC/hydration mismatch).
 * 이를 소비하는 루트 레이아웃(#10)의 <html> 태그에 suppressHydrationWarning을 반드시 함께 적용해야 한다.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
