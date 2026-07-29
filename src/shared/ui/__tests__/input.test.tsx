import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input", () => {
  it("사용자 입력을 받아 값이 반영된다", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="이름" />);

    const input = screen.getByPlaceholderText("이름");
    await user.type(input, "홍길동");

    expect(input).toHaveValue("홍길동");
  });

  it("disabled 상태에서는 입력할 수 없다", () => {
    render(<Input placeholder="이름" disabled />);
    expect(screen.getByPlaceholderText("이름")).toBeDisabled();
  });
});
