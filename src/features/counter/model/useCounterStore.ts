import { create } from "zustand";

export interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

/**
 * Zustand 예시 스토어. FSD에서 상태 관리는 그 상태를 소유한 슬라이스의 model 계층에 둔다.
 * 이 카운터는 feature/counter의 자급자족 상태이므로 features/counter/model에 위치한다.
 * (전역으로 공유되는 상태가 아니라 이 feature 안에서만 쓰이는 예시라 shared로 올리지 않는다.)
 *
 * 컴포넌트에서는 `useCounterStore((s) => s.count)`처럼 selector로 구독해
 * 필요한 값만 리렌더 대상으로 삼는다.
 *
 * ⚠️ SSR 주의: 이 스토어는 모듈 전역 싱글턴이라 초기값이 요청에 의존하지 않을 때만 안전하다.
 * 지금은 정적 초기값(count: 0)이라 문제없지만, 요청별 데이터(로그인 세션 등)로 초기화해야 한다면
 * 이 패턴을 그대로 쓰면 서버에서 요청 간 상태가 섞인다. 그럴 땐 Context + 요청별 store 생성 패턴을 쓸 것.
 */
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
