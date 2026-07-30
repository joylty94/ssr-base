import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";

/**
 * 페이지 콘텐츠 폭을 반응형으로 제한하는 컨테이너.
 * 모바일에서는 여백을 좁게, 큰 화면에서는 넓게 주면서 최대 폭을 넘지 않도록 한다.
 */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
