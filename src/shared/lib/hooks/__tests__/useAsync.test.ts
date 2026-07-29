import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAsync } from "../useAsync";

describe("useAsync", () => {
  it("기본적으로 즉시 실행되어 성공 시 data/loading 상태가 갱신된다", async () => {
    const fn = vi.fn().mockResolvedValue("결과");
    const { result } = renderHook(() => useAsync(fn));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe("결과");
    expect(result.current.error).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("실패하면 error 상태가 채워지고 data는 null로 유지된다", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("실패"));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeNull();
  });

  it("immediate=false면 execute를 직접 호출해야 실행된다", async () => {
    const fn = vi.fn().mockResolvedValue("수동 실행");
    const { result } = renderHook(() => useAsync(fn, false));

    expect(result.current.loading).toBe(false);
    expect(fn).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe("수동 실행");
  });
});
