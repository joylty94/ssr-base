"use client";

import { useEffect, useState } from "react";

/**
 * value가 delay(ms) 동안 더 이상 바뀌지 않을 때만 최신 값으로 갱신되는 디바운스 훅.
 * 검색어 입력 등 잦은 변경 값을 그대로 API 호출/필터링에 쓰지 않도록 지연시킬 때 사용한다.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
