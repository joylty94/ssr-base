import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "../useMediaQuery";

// jsdom에는 실제 미디어 쿼리 평가 엔진이 없으므로, 테스트마다 matchMedia를
// 원하는 결과로 스텁하고 change 이벤트로 리스너를 직접 트리거한다.
function stubMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  let changeListener: ((e: MediaQueryListEvent) => void) | null = null;

  const mql = {
    get matches() {
      return matches;
    },
    media: "(min-width: 768px)",
    addEventListener: (_: string, listener: typeof changeListener) => {
      changeListener = listener;
    },
    removeEventListener: () => {
      changeListener = null;
    },
  };

  window.matchMedia = () => mql as unknown as MediaQueryList;

  return {
    fireChange(next: boolean) {
      matches = next;
      changeListener?.({ matches: next } as MediaQueryListEvent);
    },
  };
}

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.restoreAllMocks?.();
  });

  it("초기 matches 값을 반환한다", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("미디어 쿼리 결과가 바뀌면 리렌더링되어 최신 값을 반환한다", () => {
    const { fireChange } = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);

    act(() => {
      fireChange(true);
    });

    expect(result.current).toBe(true);
  });
});
