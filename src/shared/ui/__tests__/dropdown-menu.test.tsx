import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";

describe("DropdownMenu", () => {
  it("트리거 클릭 시 메뉴가 열리고, 항목 클릭 시 onSelect가 호출된 뒤 닫힌다", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>메뉴</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>항목1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    expect(screen.queryByText("항목1")).not.toBeInTheDocument();

    await user.click(screen.getByText("메뉴"));
    await waitFor(() => {
      expect(screen.getByText("항목1")).toBeInTheDocument();
    });

    await user.click(screen.getByText("항목1"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText("항목1")).not.toBeInTheDocument();
    });
  });
});
