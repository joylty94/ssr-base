#!/usr/bin/env node
// 프로젝트 스캐폴드 구조 검증 스크립트 (이슈 #1 TDD Red/Green 게이트)
// vitest 인프라(#2)가 아직 없으므로, 순수 Node로 최소한의 구조 assertion을 수행한다.
// 통과 조건은 PLAN.md #1 / plan-review 합의사항을 그대로 반영한다.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const failures = [];

function check(label, condition) {
  if (!condition) failures.push(label);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

// 1) package.json + 필수 스크립트(dev/build/lint/test)
const pkgPath = join(root, "package.json");
check("package.json 존재", existsSync(pkgPath));
if (existsSync(pkgPath)) {
  const pkg = readJson(pkgPath);
  for (const script of ["dev", "build", "lint", "test", "start"]) {
    check(
      `package.json scripts.${script} 존재`,
      Boolean(pkg.scripts?.[script]),
    );
  }
}

// 2) tsconfig.json + path alias(@/*)
const tsconfigPath = join(root, "tsconfig.json");
check("tsconfig.json 존재", existsSync(tsconfigPath));
if (existsSync(tsconfigPath)) {
  const tsconfig = readJson(tsconfigPath);
  const paths = tsconfig.compilerOptions?.paths ?? {};
  check(
    'tsconfig paths["@/*"] 존재',
    Array.isArray(paths["@/*"]) && paths["@/*"].length > 0,
  );
}

// 3) Tailwind 설정 존재 (v4는 postcss.config 경유 가능)
const tailwindCandidates = [
  "tailwind.config.ts",
  "tailwind.config.js",
  "postcss.config.mjs",
  "postcss.config.js",
];
check(
  "Tailwind 설정 파일 존재",
  tailwindCandidates.some((f) => existsSync(join(root, f))),
);

// 4) Next.js 설정
const nextConfigCandidates = [
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
];
check(
  "next.config 파일 존재",
  nextConfigCandidates.some((f) => existsSync(join(root, f))),
);

// 5) FSD 폴더 골격 (src/ 아래)
const fsdDirs = ["app", "widgets", "features", "entities", "shared", "config"];
for (const dir of fsdDirs) {
  check(`src/${dir} 디렉터리 존재`, existsSync(join(root, "src", dir)));
}

if (failures.length > 0) {
  console.error("❌ 스캐폴드 검증 실패:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
} else {
  console.log("✅ 스캐폴드 검증 통과");
  process.exit(0);
}
