// 테스트 인프라(#2) 스모크 테스트: Vitest + jsdom + RTL + user-event가
// 실제로 컴포넌트 렌더링/상호작용을 검증할 수 있는지 확인하는 게이트.
// 이후 실제 기능 테스트(#4~#13)는 이 인프라 위에서 작성된다.
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>count: {count}</button>;
}

describe("test infra smoke test", () => {
  it("renders a component and reacts to a user click", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const button = screen.getByRole("button", { name: "count: 0" });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(
      screen.getByRole("button", { name: "count: 1" }),
    ).toBeInTheDocument();
  });
});
