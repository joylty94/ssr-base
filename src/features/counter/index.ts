export { Counter } from "./ui/Counter";
// 스토어 훅을 public API로 노출한다(예시 목적 + 테스트에서 getState().reset() 사용).
// 프로덕션 코드에서는 액션(increment/decrement/reset)만 쓰고, setState로 내부 상태를 직접 조작하지 말 것.
export { useCounterStore } from "./model/useCounterStore";
export type { CounterState } from "./model/useCounterStore";
