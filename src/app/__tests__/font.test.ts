// Pretendard 폰트(#5) 검증: CDN 로드 + Tailwind fontFamily 연결 + 시스템 폰트 폴백.
// 컴포넌트가 아니라 globals.css 토큰 자체가 산출물이므로, 파일 내용을 직접 검증한다.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(
  join(import.meta.dirname, "../globals.css"),
  "utf-8"
);

describe("Pretendard 폰트", () => {
  it("Pretendard CDN 스타일시트를 @import로 로드한다", () => {
    expect(globalsCss).toMatch(
      /@import\s+url\(["']?https:\/\/cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard/
    );
  });

  it("--font-sans가 Pretendard를 최우선으로 하고, CDN 장애 시 시스템 폰트로 폴백한다", () => {
    const match = globalsCss.match(/--font-sans:\s*([^;]+);/);
    expect(match).not.toBeNull();

    const value = match![1];
    expect(value).toMatch(/^["']?Pretendard/);
    // 크로스플랫폼 시스템 폰트 폴백(맥/윈도우 한글 서체 포함)과 최종 제네릭 패밀리
    expect(value).toMatch(/Apple SD Gothic Neo/);
    expect(value).toMatch(/Malgun Gothic/);
    expect(value.trim().endsWith("sans-serif")).toBe(true);
  });
});
