import Link from "next/link";
import { Button } from "@/shared";

/**
 * 존재하지 않는 라우트에 대한 기본 404 화면.
 */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  );
}
