/**
 * 사이트 하단 푸터 위젯. 모바일에서는 세로로 쌓이고, sm 이상에서는 한 줄로 배치된다.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-screen-xl flex-col items-center gap-2 px-4 py-6 text-sm sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© {year} ssr-base. All rights reserved.</p>
      </div>
    </footer>
  );
}
