import { afterEach, describe, expect, it } from "vitest";
import { formatDate, isValidDate } from "../date";

describe("formatDate", () => {
  it("기본 포맷(YYYY-MM-DD)으로 날짜를 문자열화한다", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("문자열/타임스탬프 입력도 동일하게 처리한다", () => {
    expect(formatDate("2026-07-29")).toBe("2026-07-29");
  });

  it("잘못된 날짜 입력에는 빈 문자열을 반환한다", () => {
    expect(formatDate("invalid-date")).toBe("");
  });

  it("존재하지 않는 달력 날짜(2월 30일 등)는 빈 문자열을 반환한다", () => {
    expect(formatDate("2026-02-30")).toBe("");
  });

  describe("UTC보다 뒤처진 타임존에서도(QA 회귀)", () => {
    const originalTz = process.env.TZ;
    afterEach(() => {
      process.env.TZ = originalTz;
    });

    it("date-only 문자열('YYYY-MM-DD')이 하루 밀리지 않는다", () => {
      process.env.TZ = "America/New_York";
      expect(formatDate("2026-07-29")).toBe("2026-07-29");
    });
  });
});

describe("isValidDate", () => {
  it("유효한 Date는 true를 반환한다", () => {
    expect(isValidDate(new Date())).toBe(true);
  });

  it("Invalid Date는 false를 반환한다", () => {
    expect(isValidDate(new Date("invalid"))).toBe(false);
  });
});
