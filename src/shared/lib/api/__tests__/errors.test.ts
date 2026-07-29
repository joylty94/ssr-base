// 에러 정규화(오류 registry, §7) 단위 테스트.
// 4xx/5xx/네트워크 에러 각각에 대해 인터셉터가 항상 동일한 ApiError 형태로 reject하는지 검증한다.
import { describe, expect, it, beforeEach, afterAll } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { createApiClient } from "../client";
import type { ApiError } from "../types";

describe("axios 에러 인터셉터 정규화", () => {
  const client = createApiClient({ baseURL: "https://api.example.com" });
  const mock = new MockAdapter(client);

  beforeEach(() => {
    // 핸들러/히스토리만 초기화한다. mock.restore()는 adapter 오버라이드 자체를
    // 되돌려 이후 테스트가 실제 네트워크를 타게 만들므로 afterAll에서 한 번만 호출한다.
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  async function captureError(fn: () => Promise<unknown>): Promise<ApiError> {
    try {
      await fn();
    } catch (error) {
      return error as ApiError;
    }
    throw new Error("expected the request to reject");
  }

  it("400 응답을 BAD_REQUEST로 정규화한다", async () => {
    mock.onGet("/bad").reply(400, { message: "잘못된 값입니다" });

    const error = await captureError(() => client.get("/bad"));
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.status).toBe(400);
    expect(error.message).toBe("잘못된 값입니다");
  });

  it("401 응답을 UNAUTHORIZED로 정규화한다", async () => {
    mock.onGet("/secret").reply(401);

    const error = await captureError(() => client.get("/secret"));
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.status).toBe(401);
  });

  it("404 응답을 NOT_FOUND로 정규화한다", async () => {
    mock.onGet("/missing").reply(404);

    const error = await captureError(() => client.get("/missing"));
    expect(error.code).toBe("NOT_FOUND");
    expect(error.status).toBe(404);
  });

  it("500 응답을 SERVER_ERROR로 정규화한다", async () => {
    mock.onGet("/boom").reply(500);

    const error = await captureError(() => client.get("/boom"));
    expect(error.code).toBe("SERVER_ERROR");
    expect(error.status).toBe(500);
  });

  it("네트워크 에러(응답 없음)를 NETWORK_ERROR로 정규화한다", async () => {
    mock.onGet("/offline").networkError();

    const error = await captureError(() => client.get("/offline"));
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.status).toBeUndefined();
  });

  it("타임아웃을 TIMEOUT으로 정규화한다", async () => {
    mock.onGet("/slow").timeout();

    const error = await captureError(() => client.get("/slow"));
    expect(error.code).toBe("TIMEOUT");
  });

  it("서버 메시지가 없으면 기본 안내 메시지를 사용한다", async () => {
    mock.onGet("/no-message").reply(500);

    const error = await captureError(() => client.get("/no-message"));
    expect(error.message.length).toBeGreaterThan(0);
  });
});
