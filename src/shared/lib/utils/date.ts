type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input);
}

/** 유효한(Invalid Date가 아닌) 날짜인지 확인한다. */
export function isValidDate(input: DateInput): boolean {
  return !Number.isNaN(toDate(input).getTime());
}

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * 날짜를 "YYYY-MM-DD" 형식 문자열로 변환한다.
 * 유효하지 않은 날짜는 빈 문자열을 반환한다(레이아웃이 깨지지 않도록 예외 대신 안전한 폴백).
 *
 * 주의(QA 회귀): "YYYY-MM-DD" 같은 date-only 문자열은 `new Date()`가 UTC 자정으로
 * 해석하는데, 로컬 getter(getFullYear 등)로 읽으면 UTC보다 뒤처진 타임존(예:
 * America/New_York)에서 하루가 밀린다. 이런 입력은 Date/타임존을 거치지 않고
 * 문자열을 직접 검증·정규화해 타임존 영향을 없앤다. Date 객체·타임스탬프 입력은
 * "로컬 벽시계 시각"을 의미하므로 기존과 같이 로컬 getter를 사용한다.
 */
export function formatDate(input: DateInput): string {
  if (typeof input === "string") {
    const match = input.match(DATE_ONLY_PATTERN);
    if (match) {
      const [, yearStr, monthStr, dayStr] = match;
      const year = Number(yearStr);
      const month = Number(monthStr);
      const day = Number(dayStr);
      // 실제 존재하는 날짜인지(2월 30일 등이 아닌지) UTC 기준으로만 검증한다.
      const utc = new Date(Date.UTC(year, month - 1, day));
      const isRealCalendarDate =
        utc.getUTCFullYear() === year &&
        utc.getUTCMonth() === month - 1 &&
        utc.getUTCDate() === day;
      return isRealCalendarDate ? `${yearStr}-${monthStr}-${dayStr}` : "";
    }
  }

  const date = toDate(input);
  if (!isValidDate(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
