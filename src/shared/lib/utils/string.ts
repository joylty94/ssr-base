/** 문자열의 첫 글자만 대문자로 바꾼다. */
export function capitalize(value: string): string {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

/** maxLength를 넘는 문자열을 잘라내고 접미사(기본 "...")를 붙인다. */
export function truncate(
  value: string,
  maxLength: number,
  suffix = "...",
): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength) + suffix;
}

/** URL 친화적인 슬러그로 변환한다(소문자화, 공백→하이픈, 영숫자/하이픈 외 제거). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
