import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

describe("NotFound", () => {
  it("404 안내와 홈으로 돌아가는 링크를 렌더링한다", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading")).toHaveTextContent(/404|찾을 수 없/);
    const homeLink = screen.getByRole("link", { name: /홈|home/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
