import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/shared";
import ShowcasePage from "../page";

function renderPage() {
  return render(
    <ThemeProvider>
      <ShowcasePage />
    </ThemeProvider>,
  );
}

describe("Showcase 페이지", () => {
  it("Button 변형과 Input, Badge를 렌더링한다", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "기본" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("이메일을 입력하세요"),
    ).toBeInTheDocument();
    expect(screen.getByText("신규")).toBeInTheDocument();
  });

  it("Card 섹션에 FSD 예시 슬라이스(GreetingWidget)가 포함된다", () => {
    renderPage();
    const possibleMessages = [
      "좋은 아침이에요",
      "좋은 오후예요",
      "좋은 저녁이에요",
      "편안한 밤 되세요",
    ];
    const found = possibleMessages.some((msg) => screen.queryByText(msg));
    expect(found).toBe(true);
  });

  it("Dialog 트리거를 클릭하면 내용이 열린다", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "다이얼로그 열기" }));
    expect(await screen.findByText("예시 다이얼로그")).toBeInTheDocument();
  });

  it("DropdownMenu 트리거를 클릭하면 메뉴 항목이 열린다", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    expect(await screen.findByText("프로필")).toBeInTheDocument();
  });

  it("반응형 컨테이너(Container) 안에 콘텐츠가 렌더링된다", () => {
    const { container } = renderPage();
    const showcaseRoot = container.querySelector("main");
    expect(showcaseRoot).toBeInTheDocument();
    expect(
      within(showcaseRoot!).getByRole("heading", { level: 1 }),
    ).toHaveTextContent("Showcase");
  });
});
