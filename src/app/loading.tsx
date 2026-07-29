import { Skeleton } from "@/shared";

/**
 * 라우트 전환 중 보여줄 기본 로딩 상태.
 * role="status"로 스크린리더에 로딩 중임을 알린다(빈 화면 대신 접근성 있는 대기 상태).
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col gap-4 py-16"
    >
      <span className="sr-only">로딩 중입니다...</span>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
