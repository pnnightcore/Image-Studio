export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "UNSUPPORTED"
  | "RENDER_FAILED";

/** Error that maps 1:1 to an HTTP response (see src/server/contract.ts). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const invalid = (message: string, details?: unknown) => new ApiError(400, "INVALID_REQUEST", message, details);
