#!/usr/bin/env node
// README 검증 스크립트 (이슈 #16 TDD Red/Green 게이트).
// vitest 대상이 아닌 문서 산출물이므로, #1의 verify-scaffold.mjs와 같은 방식으로
// 순수 Node 스크립트로 최소 요건을 검증한다.
// 1) DoD(#16)가 요구하는 필수 섹션(H2 제목)이 모두 있는지
// 2) README에 적힌 "npm run <script>" 명령이 실제 package.json scripts와 일치하는지
//    (문서가 낡아서 실행 불가능한 명령을 안내하는 걸 방지)
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const failures = [];

function check(label, condition) {
  if (!condition) failures.push(label);
}

const readmePath = join(root, "README.md");
check("README.md 존재", existsSync(readmePath));
if (!existsSync(readmePath)) {
  console.error("❌ README.md 없음");
  process.exit(1);
}

const readme = readFileSync(readmePath, "utf-8");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));

const REQUIRED_SECTIONS = [
  "새 프로젝트 시작하기",
  "새 FSD 슬라이스 추가하기",
  "shadcn",
  "커스터마이징",
];

for (const section of REQUIRED_SECTIONS) {
  check(
    `필수 섹션 언급 존재: "${section}"`,
    new RegExp(section, "i").test(readme),
  );
}

// README 안의 `npm run <script>` 코드 언급이 실제 package.json scripts에 있는지 확인
const scriptMentions = [...readme.matchAll(/npm run ([\w:-]+)/g)].map(
  (m) => m[1],
);
check(
  "README에 npm run 명령이 최소 1개 이상 안내됨",
  scriptMentions.length > 0,
);
for (const script of new Set(scriptMentions)) {
  check(
    `README가 안내하는 "npm run ${script}"가 package.json scripts에 존재`,
    Boolean(pkg.scripts?.[script]),
  );
}

if (failures.length > 0) {
  console.error("❌ README 검증 실패:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
} else {
  console.log("✅ README 검증 통과");
  process.exit(0);
}
