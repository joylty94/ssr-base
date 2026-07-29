import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { GreetingWidget } from "../GreetingWidget";

describe("GreetingWidget", () => {
  it("features/greeting을 shared/ui Card로 감싸 인사 카드로 보여준다", () => {
    render(<GreetingWidget hour={15} />);
    expect(screen.getByText("좋은 오후예요")).toBeInTheDocument();
    // Card 타이틀 등 위젯 자체가 추가하는 컨텍스트가 있는지 확인
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
