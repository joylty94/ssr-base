"use client";

import { useTheme } from "next-themes";

/**
 * 라이트/다크 테마 토글 버튼.
 * 현재 적용된 테마(resolvedTheme)를 기준으로 반대 테마로 전환한다.
 *
 * next-themes는 SSR 시점엔 resolvedTheme을 알 수 없어(클라이언트에서 system 테마를
 * 감지한 뒤 확정) 서버/클라이언트 첫 렌더 결과가 다를 수 있다. 별도의 mounted 상태로
 * 감추는 대신, 이 버튼에 한해 suppressHydrationWarning으로 처리한다(React 공식 권장:
 * 의도된 mismatch에는 effect+setState 대신 suppressHydrationWarning 사용).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "🌙 다크" : "☀️ 라이트"}
    </button>
  );
}
