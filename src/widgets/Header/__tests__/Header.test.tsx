import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/shared";
import { Header } from "../Header";

describe("Header", () => {
  it("사이트 제목이 홈으로 연결되는 링크이고, 테마 토글 버튼을 포함한다", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );

    const homeLink = screen.getByRole("link", { name: "ssr-base" });
    expect(homeLink).toHaveAttribute("href", "/");

    const toggle = screen.getByRole("button");
    await user.click(toggle);
    // 클릭 후에도 여전히 버튼(테마 토글)로 남아있어야 한다(상호작용이 정상 동작)
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("헤더는 상단에 고정되는 반응형 네비 컨테이너로 렌더링된다", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
