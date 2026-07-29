import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  it("children을 렌더링하고 variant에 따라 클래스가 달라진다", () => {
    render(<Badge variant="destructive">위험</Badge>);
    const badge = screen.getByText("위험");
    expect(badge.className).toMatch(/destructive/);
  });
});
