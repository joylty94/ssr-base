// shared 계층의 유일한 public API. 다른 계층(entities/features/widgets/app)은
// 반드시 이 파일을 통해서만 shared의 구성요소를 임포트한다(ESLint FSD 경계 규칙, #3).
export * from "./ui";
