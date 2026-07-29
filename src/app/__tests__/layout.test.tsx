// 루트 레이아웃(#10) 검증: 서버 컴포넌트를 DOM에 렌더링하는 대신(<html>을 RTL로
// 마운트하는 건 부자연스러움), 함수를 직접 호출해 반환된 엘리먼트 트리의 구조를
// 검사한다 - suppressHydrationWarning, lang, ThemeProvider 래핑, metadata 형태.
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "../layout";
import { ThemeProvider } from "@/shared";

describe("RootLayout", () => {
  it("html에 lang과 suppressHydrationWarning을 설정한다(테마 FOUC/hydration mismatch 방지)", () => {
    const element = RootLayout({
      children: <div>content</div>,
    }) as ReactElement<{
      lang: string;
      suppressHydrationWarning?: boolean;
      children: ReactElement;
    }>;

    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("ko");
    expect(element.props.suppressHydrationWarning).toBe(true);
  });

  it("children을 ThemeProvider로 감싼다", () => {
    const element = RootLayout({
      children: <div>content</div>,
    }) as ReactElement<{ children: ReactElement }>;

    const body = element.props.children as ReactElement<{
      children: ReactElement;
    }>;
    expect(body.type).toBe("body");

    const themeProviderEl = body.props.children as ReactElement;
    expect(themeProviderEl.type).toBe(ThemeProvider);
  });

  it("metadata에 title/description/openGraph가 설정되어 있다", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
    expect(metadata.openGraph?.description).toBeTruthy();
  });
});
