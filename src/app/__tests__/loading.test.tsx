import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "../loading";

describe("Loading", () => {
  it("접근성 있는 로딩 상태(role=status)를 렌더링한다", () => {
    render(<Loading />);
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent("로딩");
  });
});
