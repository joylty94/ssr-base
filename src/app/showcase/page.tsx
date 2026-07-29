import type { Metadata } from "next";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Separator,
  Skeleton,
} from "@/shared";
import { GreetingWidget } from "@/widgets/GreetingWidget";

export const metadata: Metadata = {
  title: "Showcase",
  description: "shared/ui 컴포넌트, 테마, 반응형, FSD 예시 슬라이스 데모",
};

/**
 * 베이스 프로젝트 사용법 showcase 페이지.
 * shared/ui 디자인 시스템(#6), 테마 토글(#4, Header에 이미 배치),
 * 반응형 Container(#10), FSD 예시 슬라이스(#13, GreetingWidget)를 한 화면에서 보여준다.
 */
export default function ShowcasePage() {
  return (
    <main className="flex flex-col gap-10 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Showcase</h1>
        <p className="mt-2 text-muted-foreground">
          이 베이스 프로젝트의 shared/ui 컴포넌트와 FSD 예시 슬라이스를 모아 보여줍니다.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>기본</Button>
          <Button variant="secondary">보조</Button>
          <Button variant="outline">아웃라인</Button>
          <Button variant="ghost">고스트</Button>
          <Button variant="destructive">삭제</Button>
          <Button variant="link">링크</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Inputs & Badges</h2>
        <div className="flex max-w-sm flex-col gap-3">
          <Input placeholder="이메일을 입력하세요" />
          <div className="flex flex-wrap gap-2">
            <Badge>신규</Badge>
            <Badge variant="secondary">보조</Badge>
            <Badge variant="destructive">위험</Badge>
            <Badge variant="outline">아웃라인</Badge>
          </div>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Card & Skeleton</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>카드 제목</CardTitle>
              <CardDescription>카드 설명 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent>본문 내용이 여기에 들어갑니다.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>로딩 중 예시</CardTitle>
              <CardDescription>Skeleton 컴포넌트</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Dialog & DropdownMenu</h2>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">다이얼로그 열기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>예시 다이얼로그</DialogTitle>
              <DialogDescription>
                Radix Dialog 기반의 shared/ui 컴포넌트입니다.
              </DialogDescription>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">메뉴 열기</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>프로필</DropdownMenuItem>
              <DropdownMenuItem>설정</DropdownMenuItem>
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">FSD 예시 슬라이스</h2>
        <p className="text-muted-foreground">
          entities/greeting → features/greeting → widgets/GreetingWidget 체인 데모(#13)
        </p>
        <div className="max-w-sm">
          <GreetingWidget />
        </div>
      </section>
    </main>
  );
}
