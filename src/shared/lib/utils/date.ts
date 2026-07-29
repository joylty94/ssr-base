type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input);
}

/** 유효한(Invalid Date가 아닌) 날짜인지 확인한다. */
export function isValidDate(input: DateInput): boolean {
  return !Number.isNaN(toDate(input).getTime());
}

/**
 * 날짜를 "YYYY-MM-DD" 형식 문자열로 변환한다.
 * 유효하지 않은 날짜는 빈 문자열을 반환한다(레이아웃이 깨지지 않도록 예외 대신 안전한 폴백).
 */
export function formatDate(input: DateInput): string {
  const date = toDate(input);
  if (!isValidDate(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
