import { beforeEach, describe, expect, it } from "vitest";
import { useCounterStore } from "../useCounterStore";

describe("useCounterStore", () => {
  // 스토어는 모듈 전역 싱글턴이라 테스트마다 초기 상태로 되돌린다.
  beforeEach(() => {
    useCounterStore.getState().reset();
  });

  it("초기 count는 0이다", () => {
    expect(useCounterStore.getState().count).toBe(0);
  });

  it("increment는 count를 1 올린다", () => {
    useCounterStore.getState().increment();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("decrement는 count를 1 내린다", () => {
    useCounterStore.getState().decrement();
    expect(useCounterStore.getState().count).toBe(-1);
  });

  it("reset은 count를 0으로 되돌린다", () => {
    useCounterStore.getState().increment();
    useCounterStore.getState().increment();
    useCounterStore.getState().reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
