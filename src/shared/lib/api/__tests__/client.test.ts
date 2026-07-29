// axios 클라이언트(#7) 요청/응답 인터셉터 테스트.
// 실제 네트워크 대신 axios-mock-adapter로 어댑터 레벨을 모킹한다(PLAN.md §7 "mock adapter").
import { describe, expect, it, beforeEach, afterAll } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { createApiClient } from "../client";

describe("createApiClient", () => {
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

  it("기본 baseURL/timeout 설정으로 axios 인스턴스를 생성한다", () => {
    expect(client.defaults.baseURL).toBe("https://api.example.com");
    expect(client.defaults.timeout).toBeGreaterThan(0);
  });

  it("요청 인터셉터가 공통 헤더(Content-Type, X-Requested-With)를 주입한다", async () => {
    mock.onGet("/users").reply((config) => {
      expect(config.headers?.["Content-Type"]).toBe("application/json");
      expect(config.headers?.["X-Requested-With"]).toBe("XMLHttpRequest");
      return [200, { ok: true }];
    });

    const response = await client.get("/users");
    expect(response.data).toEqual({ ok: true });
  });

  it("응답 인터셉터는 성공 응답을 그대로 통과시킨다", async () => {
    mock.onGet("/users/1").reply(200, { id: 1, name: "tester" });

    const response = await client.get("/users/1");
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: 1, name: "tester" });
  });
});
