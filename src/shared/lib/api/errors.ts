import type { AxiosError } from "axios";
import type { ApiError, ApiErrorCode } from "./types";

// 에러 코드 → 사용자향 메시지 매핑(오류 registry, §7). 새로운 에러 유형을 추가할 때는
// 이 표만 확장하면 되고, 인터셉터/호출부 코드는 건드릴 필요가 없다.
const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
  TIMEOUT: "요청 시간이 초과되었습니다.",
  BAD_REQUEST: "잘못된 요청입니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  UNKNOWN: "알 수 없는 오류가 발생했습니다.",
};

function extractServerMessage(error: AxiosError): string | undefined {
  const data = error.response?.data;
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof (data as { message?: unknown }).message === "string"
  ) {
    return (data as { message: string }).message;
  }
  return undefined;
}

function resolveErrorCode(error: AxiosError): ApiErrorCode {
  if (error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout")) {
    return "TIMEOUT";
  }
  if (!error.response) {
    return "NETWORK_ERROR";
  }

  switch (error.response.status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    default:
      return error.response.status >= 500 ? "SERVER_ERROR" : "UNKNOWN";
  }
}

/** 어떤 axios 에러(4xx/5xx/네트워크/타임아웃)든 항상 같은 ApiError 형태로 정규화한다. */
export function normalizeApiError(error: AxiosError): ApiError {
  const code = resolveErrorCode(error);
  return {
    code,
    status: error.response?.status,
    message: extractServerMessage(error) ?? ERROR_MESSAGES[code],
    cause: error,
  };
}
