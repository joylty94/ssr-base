// axios 클라이언트가 뱉는 에러 형태를 통일하기 위한 타입(§7 오류 registry).
// 인터셉터가 실패하면 항상 이 형태의 객체로 reject 되어, 호출부는 axios/네트워크
// 세부사항을 몰라도 code/message만으로 분기할 수 있다.
export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface ApiError {
  /** 에러 종류(오류 registry의 키) */
  code: ApiErrorCode;
  /** HTTP 상태 코드(네트워크/타임아웃 등 응답 자체가 없는 경우 undefined) */
  status?: number;
  /** 사용자에게 보여줄 수 있는 정규화된 메시지 */
  message: string;
  /** 원본 axios 에러(디버깅/로깅용) */
  cause: unknown;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
}
