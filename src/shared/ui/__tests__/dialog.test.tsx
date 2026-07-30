import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

describe("Dialog", () => {
  it("트리거를 클릭하면 열리고, 내용이 표시된다", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>열기</DialogTrigger>
        <DialogContent>
          <DialogTitle>제목</DialogTitle>
          <DialogDescription>설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText("제목")).not.toBeInTheDocument();

    await user.click(screen.getByText("열기"));

    await waitFor(() => {
      expect(screen.getByText("제목")).toBeInTheDocument();
    });
  });
});
