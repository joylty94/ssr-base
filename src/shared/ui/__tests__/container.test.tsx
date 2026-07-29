import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "../container";

describe("Container", () => {
  it("children을 렌더링하고 반응형 max-width/padding 클래스를 적용한다", () => {
    render(<Container>내용</Container>);

    const el = screen.getByText("내용");
    expect(el.className).toMatch(/mx-auto/);
    expect(el.className).toMatch(/max-w-/);
    expect(el.className).toMatch(/px-4/);
  });
});
