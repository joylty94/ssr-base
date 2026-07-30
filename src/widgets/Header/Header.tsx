import Link from "next/link";
import { ThemeToggle } from "@/shared";

/**
 * 사이트 상단 헤더 위젯. 모바일/PC 모두 한 줄에 제목과 테마 토글이 들어가되,
 * 좌우 여백은 화면 크기에 따라 늘어난다(sm/lg 브레이크포인트).
 */
export function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight">
          ssr-base
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
