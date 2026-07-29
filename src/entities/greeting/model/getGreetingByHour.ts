export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Greeting {
  timeOfDay: TimeOfDay;
  message: string;
}

const MESSAGES: Record<TimeOfDay, string> = {
  morning: "좋은 아침이에요",
  afternoon: "좋은 오후예요",
  evening: "좋은 저녁이에요",
  night: "편안한 밤 되세요",
};

/**
 * 24시간제 시각(0~23)을 아침/오후/저녁/밤으로 분류해 인사말 모델을 반환한다.
 * FSD 예시 슬라이스(#13)의 도메인-불특정 최소 entity 모델.
 */
export function getGreetingByHour(hour: number): Greeting {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError(`hour는 0~23 사이의 정수여야 합니다: ${hour}`);
  }

  const timeOfDay: TimeOfDay =
    hour >= 5 && hour < 12
      ? "morning"
      : hour >= 12 && hour < 18
        ? "afternoon"
        : hour >= 18 && hour < 22
          ? "evening"
          : "night";

  return { timeOfDay, message: MESSAGES[timeOfDay] };
}
