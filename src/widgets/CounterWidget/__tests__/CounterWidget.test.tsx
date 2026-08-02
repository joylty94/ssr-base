import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounterWidget } from "../CounterWidget";
import { useCounterStore } from "@/features/counter";

describe("CounterWidget", () => {
  beforeEach(() => {
    useCounterStore.getState().reset();
  });

  it("features/counter를 shared/ui Card로 감싸 카운터 카드로 보여준다", () => {
    render(<CounterWidget />);
    expect(screen.getByRole("heading", { name: "카운터" })).toBeInTheDocument();
    expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
  });

  it("카드 안의 카운터가 실제로 동작한다(위젯→feature→store 체인)", async () => {
    const user = userEvent.setup();
    render(<CounterWidget />);
    await user.click(screen.getByRole("button", { name: "1 증가" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("1");
  });
});
