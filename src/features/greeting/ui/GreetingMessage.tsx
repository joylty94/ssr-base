import { getGreetingByHour } from "@/entities/greeting";

export interface GreetingMessageProps {
  /** 테스트/스토리 등에서 특정 시각을 강제하고 싶을 때 사용. 생략 시 현재 시각을 쓴다. */
  hour?: number;
}

/**
 * entities/greeting 모델을 사용해 인사말을 렌더링하는 feature-level 컴포넌트.
 * feature는 자급자족해야 하므로 entities/shared만 의존하고, 다른 feature는 참조하지 않는다.
 */
export function GreetingMessage({ hour }: GreetingMessageProps) {
  const resolvedHour = hour ?? new Date().getHours();
  const greeting = getGreetingByHour(resolvedHour);

  return <p>{greeting.message}</p>;
}
