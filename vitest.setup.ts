import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// next/font/google은 Next.js 빌드(SWC)의 컴파일타임 매크로에 의존하므로 순수 Vite/Vitest
// 환경에서는 호출조차 불가능하다(런타임 함수가 아님). layout.tsx 등을 유닛 테스트에서
// 임포트할 수 있도록 최소한의 폰트 객체 형태({variable, className})로 모킹한다.
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "" }),
}));

// jsdom은 window.matchMedia를 구현하지 않으므로, next-themes 등 시스템 테마 감지에
// 의존하는 코드가 테스트에서 동작할 수 있도록 최소 모킹을 제공한다.
// 기본값은 "다크 모드 선호"로 두고, 테스트에서 필요 시 재정의한다.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: query.includes("dark"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

// Node.js가 실험적으로 제공하는 전역 localStorage/sessionStorage가
// jsdom 환경에 제대로 오버라이드되지 않아 undefined로 남는 버전 조합이 있다
// (--localstorage-file 플래그 없이는 사용 불가). next-themes 등이 의존하므로
// 표준 Storage 인터페이스를 간단히 폴리필한다.
class MemoryStorage implements Storage {
  #store = new Map<string, string>();
  get length() {
    return this.#store.size;
  }
  clear() {
    this.#store.clear();
  }
  getItem(key: string) {
    return this.#store.has(key) ? this.#store.get(key)! : null;
  }
  key(index: number) {
    return Array.from(this.#store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.#store.delete(key);
  }
  setItem(key: string, value: string) {
    this.#store.set(key, String(value));
  }
}

if (typeof window !== "undefined") {
  try {
    window.localStorage.setItem("__vitest_probe__", "1");
    window.localStorage.removeItem("__vitest_probe__");
  } catch {
    Object.defineProperty(window, "localStorage", {
      value: new MemoryStorage(),
      configurable: true,
    });
  }
}

