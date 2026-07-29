import { describe, expect, it } from "vitest";
import { getGreetingByHour } from "../getGreetingByHour";

describe("getGreetingByHour", () => {
  it.each([
    [5, "morning", "좋은 아침이에요"],
    [11, "morning", "좋은 아침이에요"],
    [12, "afternoon", "좋은 오후예요"],
    [17, "afternoon", "좋은 오후예요"],
    [18, "evening", "좋은 저녁이에요"],
    [21, "evening", "좋은 저녁이에요"],
    [22, "night", "편안한 밤 되세요"],
    [4, "night", "편안한 밤 되세요"],
  ])("%i시는 %s(%s)로 분류된다", (hour, timeOfDay, message) => {
    const greeting = getGreetingByHour(hour);
    expect(greeting.timeOfDay).toBe(timeOfDay);
    expect(greeting.message).toBe(message);
  });

  it("범위를 벗어난 시각(음수, 24 이상)은 에러를 던진다", () => {
    expect(() => getGreetingByHour(-1)).toThrow();
    expect(() => getGreetingByHour(24)).toThrow();
  });
});
