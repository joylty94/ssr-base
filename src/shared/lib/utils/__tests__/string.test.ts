import { describe, expect, it } from "vitest";
import { capitalize, slugify, truncate } from "../string";

describe("capitalize", () => {
  it("첫 글자만 대문자로 바꾼다", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("빈 문자열은 그대로 반환한다", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("truncate", () => {
  it("maxLength보다 길면 잘라내고 접미사를 붙인다", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("maxLength 이하면 그대로 반환한다", () => {
    expect(truncate("hi", 5)).toBe("hi");
  });

  it("접미사를 커스터마이즈할 수 있다", () => {
    expect(truncate("hello world", 5, "…")).toBe("hello…");
  });
});

describe("slugify", () => {
  it("공백을 하이픈으로, 대문자를 소문자로 바꾼다", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("영숫자/하이픈 외 특수문자는 제거한다", () => {
    expect(slugify("Next.js & React!")).toBe("nextjs-react");
  });
});
