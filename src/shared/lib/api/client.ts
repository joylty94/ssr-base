import axios, { type AxiosInstance } from "axios";
import { normalizeApiError } from "./errors";
import type { ApiClientConfig } from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * 공용 axios 인스턴스를 생성한다(#7).
 * - 요청 인터셉터: 공통 헤더(Content-Type, X-Requested-With) 주입
 * - 응답 인터셉터: 성공 응답은 그대로 통과, 실패 응답/네트워크 에러/타임아웃은
 *   항상 동일한 ApiError 형태로 정규화하여 reject(오류 registry, §7)
 *
 * baseURL은 인자로 넘기지 않으면 NEXT_PUBLIC_API_BASE_URL 환경변수를 사용한다.
 */
export function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    timeout: config.timeout ?? DEFAULT_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((requestConfig) => {
    requestConfig.headers.set("X-Requested-With", "XMLHttpRequest");
    return requestConfig;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error))
  );

  return instance;
}

/** 앱 전역에서 바로 사용할 수 있는 기본 인스턴스. 커스텀 설정이 필요하면 createApiClient를 직접 호출한다. */
export const apiClient = createApiClient();
