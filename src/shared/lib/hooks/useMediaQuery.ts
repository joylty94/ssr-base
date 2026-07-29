import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

/**
 * 주어진 미디어 쿼리(query)의 현재 매치 여부를 구독하는 훅.
 * window.matchMedia는 리액트 바깥의 "외부 스토어"이므로, effect+setState 대신
 * useSyncExternalStore로 구독한다(SSR 시 서버 스냅샷은 false로 고정).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false
  );
}
