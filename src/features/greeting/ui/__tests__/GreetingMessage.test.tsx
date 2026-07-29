import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GreetingMessage } from "../GreetingMessage";

describe("GreetingMessage", () => {
  it("주어진 hour prop에 맞는 인사말을 렌더링한다(entities/greeting 모델 사용)", () => {
    render(<GreetingMessage hour={9} />);
    expect(screen.getByText("좋은 아침이에요")).toBeInTheDocument();
  });

  it("hour를 넘기지 않으면 현재 시각 기준으로 인사말을 렌더링한다", () => {
    render(<GreetingMessage />);
    // 어떤 시간대든 4가지 메시지 중 하나는 반드시 렌더링되어야 한다.
    const possibleMessages = [
      "좋은 아침이에요",
      "좋은 오후예요",
      "좋은 저녁이에요",
      "편안한 밤 되세요",
    ];
    const found = possibleMessages.some((msg) => screen.queryByText(msg));
    expect(found).toBe(true);
  });
});
