/** Error codes returned by the server (`ApiErrorCode`) plus the ones the client raises itself. */
export type ImageStudioErrorCode =
  // server
  | "INVALID_REQUEST"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "UNSUPPORTED"
  | "RENDER_FAILED"
  // client side / infrastructure
  | "RESOURCE_LIMIT" // e.g. Cloudflare "Error 1102: Worker exceeded resource limits"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "ABORTED"
  | "BAD_RESPONSE"
  | "HTTP_ERROR";

export interface AttemptInfo {
  baseUrl: string;
  attempt: number;
  status?: number;
  code: ImageStudioErrorCode;
  message: string;
}

export class ImageStudioError extends Error {
  override name = "ImageStudioError";
  readonly code: ImageStudioErrorCode;
  readonly status?: number;
  readonly details?: unknown;
  readonly url?: string;
  /** Every attempt made (across retries and fail-over hosts), oldest first. */
  attempts: AttemptInfo[] = [];
  /** Parsed `Retry-After` header (ms), when the server sent one. */
  retryAfterMs?: number;

  constructor(
    code: ImageStudioErrorCode,
    message: string,
    options: { status?: number; details?: unknown; url?: string; cause?: unknown } = {}
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.code = code;
    this.status = options.status;
    this.details = options.details;
    this.url = options.url;
  }

  /** The same request may succeed if sent again to the same host. */
  get retryable(): boolean {
    if (this.code === "NETWORK_ERROR") return true;
    if (this.code === "RESOURCE_LIMIT" || this.code === "TIMEOUT" || this.code === "ABORTED") return false;
    return this.status === 429 || this.status === 502 || this.status === 503 || this.status === 504;
  }

  /** Another host (see `baseUrl: [...]`) may succeed even if this one will not. */
  get failoverable(): boolean {
    if (this.code === "ABORTED") return false;
    if (this.code === "NETWORK_ERROR" || this.code === "TIMEOUT" || this.code === "RESOURCE_LIMIT") return true;
    return this.status === 429 || (this.status !== undefined && this.status >= 500);
  }
}

export function isImageStudioError(error: unknown): error is ImageStudioError {
  return error instanceof ImageStudioError;
}

/** Turns a failed HTTP response into a typed error (JSON contract first, then known proxy/CDN pages). */
export async function errorFromResponse(response: Response, url: string): Promise<ImageStudioError> {
  const status = response.status;
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text().catch(() => "");

  if (contentType.includes("json")) {
    try {
      const body = JSON.parse(text) as { error?: unknown; code?: unknown; details?: unknown };
      const message = typeof body.error === "string" ? body.error : `Request failed with status ${status}`;
      const code = typeof body.code === "string" ? (body.code as ImageStudioErrorCode) : status >= 500 ? "RENDER_FAILED" : "INVALID_REQUEST";
      return new ImageStudioError(code, message, { status, details: body.details, url });
    } catch {
      /* not valid JSON: fall through */
    }
  }

  if (/exceeded resource limits|error code:?\s*1102|cf-error-code">1102|error 1102/i.test(text)) {
    return new ImageStudioError(
      "RESOURCE_LIMIT",
      "The host ran out of CPU/memory while rendering (Cloudflare error 1102). Use a smaller image, a host with higher limits, or configure a fail-over baseUrl.",
      { status, url }
    );
  }

  const title = /<title>([^<]{1,200})<\/title>/i.exec(text)?.[1]?.trim();
  const snippet = title || text.replace(/\s+/g, " ").trim().slice(0, 160);
  return new ImageStudioError("HTTP_ERROR", `Request failed with status ${status}${snippet ? `: ${snippet}` : ""}`, { status, url });
}
