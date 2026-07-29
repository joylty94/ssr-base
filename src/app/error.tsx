"use client";

import { Button } from "@/shared";

/**
 * 라우트 세그먼트에서 발생한 처리되지 않은 에러에 대한 기본 화면.
 * Next.js App Router의 error.tsx 컨벤션에 따라 Client Component여야 하며
 * error/reset props를 받는다.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center"
    >
      <h1 className="text-2xl font-semibold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground">
        {error.message || "알 수 없는 오류가 발생했습니다."}
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
