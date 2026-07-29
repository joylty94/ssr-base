import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Container, ThemeProvider } from "@/shared";
import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "ssr-base";
const SITE_DESCRIPTION =
  "Next.js App Router 기반 재사용 가능한 SSR 베이스 프로젝트";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes(#4)가 클라이언트에서 system 테마를
    // 감지해 class를 붙이므로, 서버 렌더와 클라이언트 첫 렌더의 class가 달라질 수
    // 있다(FOUC 방지를 위한 의도된 mismatch).
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Header />
          <Container className="flex flex-1 flex-col">{children}</Container>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
