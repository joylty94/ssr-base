import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

describe("Card", () => {
  it("헤더/타이틀/설명/본문/푸터를 함께 렌더링한다", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>제목</CardTitle>
          <CardDescription>설명</CardDescription>
        </CardHeader>
        <CardContent>본문</CardContent>
        <CardFooter>푸터</CardFooter>
      </Card>
    );

    expect(screen.getByText("제목")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
    expect(screen.getByText("본문")).toBeInTheDocument();
    expect(screen.getByText("푸터")).toBeInTheDocument();
  });
});
