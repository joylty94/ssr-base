// shared/lib/api의 public API. shared 계층 밖에서는 이 파일(또는 shared/index.ts)을
// 통해서만 axios 클라이언트를 사용해야 한다.
export { apiClient, createApiClient } from "./client";
export { normalizeApiError } from "./errors";
export type { ApiClientConfig, ApiError, ApiErrorCode } from "./types";
