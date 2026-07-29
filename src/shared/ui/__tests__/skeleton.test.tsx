import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  it("로딩 placeholder(펄스 애니메이션 클래스)를 렌더링한다", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/animate-pulse/);
  });
});
