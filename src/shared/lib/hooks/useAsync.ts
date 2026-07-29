"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: () => Promise<void>;
}

/**
 * 비동기 함수의 loading/data/error 상태를 관리하는 훅.
 * immediate=true(기본값)면 마운트 시 자동 실행, false면 execute()로 수동 실행한다.
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(immediate);
  // 언마운트/재실행 이후 늦게 도착한 응답이 상태를 덮어쓰지 않도록 추적한다.
  const callId = useRef(0);

  const execute = useCallback(async () => {
    const id = ++callId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      if (callId.current === id) {
        setData(result);
      }
    } catch (err) {
      if (callId.current === id) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      }
    } finally {
      if (callId.current === id) {
        setLoading(false);
      }
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (!immediate) return;
    // execute()를 그대로 호출하지 않는다: execute는 시작하자마자 setLoading(true)를
    // 동기적으로 호출하는데(react-hooks/set-state-in-effect 위반), 마운트 시 초기
    // loading 상태는 이미 useState(immediate)로 설정돼 있어 불필요하다. 여기서는
    // await 이후(then/catch/finally)에만 상태를 갱신해 effect 본문에서 동기적으로
    // setState를 호출하지 않는다.
    const id = ++callId.current;
    asyncFunction()
      .then((result) => {
        if (callId.current === id) setData(result);
      })
      .catch((err: unknown) => {
        if (callId.current === id) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        }
      })
      .finally(() => {
        if (callId.current === id) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, loading, execute };
}
