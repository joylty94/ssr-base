// 테마 시스템(#4) 컴포넌트/상호작용 테스트
// - 기본값은 브라우저(system) 테마를 따른다 (vitest.setup.ts의 matchMedia mock = 다크 선호)
// - 토글 클릭 시 라이트/다크가 전환되고 html에 class가 반영된다(next-themes attribute="class")
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, ThemeToggle } from "@/shared";

describe("theme system", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    window.localStorage.clear();
  });

  it("system(브라우저) 기본값을 따라 다크 테마로 시작한다", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  it("토글 버튼을 클릭하면 라이트/다크 테마가 전환된다", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = await screen.findByRole("button");
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    await user.click(toggle);
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    await user.click(toggle);
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
