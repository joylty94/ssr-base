import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "../separator";

describe("Separator", () => {
  it("장식용 구분선은 접근성 트리에서 role이 제거된다(decorative)", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("decorative=false면 separator 역할을 노출한다", () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
