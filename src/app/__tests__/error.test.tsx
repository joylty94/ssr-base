import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "../error";

describe("ErrorBoundary(error.tsx)", () => {
  it("에러 상태를 alert로 안내하고, 다시 시도 버튼 클릭 시 reset을 호출한다", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorBoundary error={new Error("boom")} reset={reset} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /다시 시도|retry/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
