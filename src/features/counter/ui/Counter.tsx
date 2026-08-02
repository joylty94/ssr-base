"use client";

import { Button } from "@/shared";
import { useCounterStore } from "../model/useCounterStore";

/**
 * Zustand 스토어(features/counter/model)를 구독해 카운터를 조작하는 feature-level 컴포넌트.
 * Zustand 스토어 구독은 클라이언트에서만 동작하므로 "use client"가 필요하다.
 * feature는 자급자족해야 하므로 shared(Button)와 자기 model만 의존한다.
 */
export function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div
      className="flex items-center gap-3"
      role="group"
      aria-label="카운터 조작"
    >
      <Button
        variant="outline"
        onClick={decrement}
        aria-label="1 감소"
      >
        −
      </Button>
      <span
        className="min-w-10 text-center text-2xl font-semibold tabular-nums"
        aria-live="polite"
        data-testid="counter-value"
      >
        {count}
      </span>
      <Button
        variant="outline"
        onClick={increment}
        aria-label="1 증가"
      >
        +
      </Button>
      <Button
        variant="ghost"
        onClick={reset}
      >
        초기화
      </Button>
    </div>
  );
}
