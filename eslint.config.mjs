import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// FSD 계층 정의 (.claude/rule/next-fsd-core.md)
// 의존성은 위로만 흐른다: shared ← entities ← features ← widgets ← app
const FSD_ELEMENTS = [
  // shared/app/config는 하위 전체가 하나의 element(공용 public API 1개)
  { type: "shared", pattern: "src/shared" },
  { type: "config", pattern: "src/config" },
  { type: "app", pattern: "src/app" },
  // entities/features/widgets는 폴더 하나당 독립된 element(각자 index.ts)
  { type: "entities", pattern: "src/entities/*" },
  { type: "features", pattern: "src/features/*" },
  { type: "widgets", pattern: "src/widgets/*" },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": FSD_ELEMENTS,
    },
    rules: {
      // 계층 간 의존 방향 강제: shared → entities → features → widgets → app
      // features는 서로 임포트 금지(widgets에서만 조합)
      "boundaries/dependencies": [
        2,
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "shared" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "entities" } },
              allow: {
                to: { element: { types: { anyOf: ["shared", "entities"] } } },
              },
            },
            {
              from: { element: { type: "features" } },
              allow: {
                to: { element: { types: { anyOf: ["shared", "entities"] } } },
              },
            },
            {
              from: { element: { type: "widgets" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["shared", "entities", "features"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "config" } },
              allow: { to: { element: { type: "shared" } } },
            },
            {
              from: { element: { type: "app" } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        "shared",
                        "entities",
                        "features",
                        "widgets",
                        "config",
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
      // 각 계층(shared/entities/features/widgets)은 index.ts(public API)로만 임포트 가능
      "boundaries/entry-point": [
        2,
        {
          default: "disallow",
          policies: [
            {
              target: {
                element: {
                  types: { anyOf: ["shared", "entities", "features", "widgets"] },
                },
              },
              allow: "index.ts",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
