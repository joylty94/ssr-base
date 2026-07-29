import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

describe("Button", () => {
  it("클릭 시 onClick이 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 상태에서는 클릭해도 onClick이 호출되지 않는다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        확인
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("variant/size prop에 따라 다른 클래스가 적용된다", () => {
    render(<Button variant="destructive" size="lg">삭제</Button>);
    const button = screen.getByRole("button", { name: "삭제" });
    expect(button.className).toMatch(/destructive/);
  });
});
