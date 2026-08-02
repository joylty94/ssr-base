import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "../Counter";
import { useCounterStore } from "../../model/useCounterStore";

describe("Counter", () => {
  beforeEach(() => {
    useCounterStore.getState().reset();
  });

  it("스토어의 현재 count를 렌더링한다", () => {
    render(<Counter />);
    expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
  });

  it("+ 버튼을 누르면 count가 증가한다", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "1 증가" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("1");
  });

  it("− 버튼을 누르면 count가 감소한다", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "1 감소" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("-1");
  });

  it("초기화 버튼을 누르면 count가 0으로 돌아간다", async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole("button", { name: "1 증가" }));
    await user.click(screen.getByRole("button", { name: "초기화" }));
    expect(screen.getByTestId("counter-value")).toHaveTextContent("0");
  });
});
