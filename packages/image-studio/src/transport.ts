import { ImageStudioError, errorFromResponse, type AttemptInfo } from "./errors.js";

export interface CallOptions {
  /** Abort this call. */
  signal?: AbortSignal;
  /** Override the client's per-attempt timeout (ms). */
  timeoutMs?: number;
  /** Override the client's retry count for this call. */
  retries?: number;
}

export interface TransportOptions {
  baseUrls: string[];
  fetch: typeof fetch;
  headers: Record<string, string>;
  timeoutMs: number;
  retries: number;
  retryDelayMs: number;
  onRetry?: (info: { baseUrl: string; attempt: number; delayMs: number; error: ImageStudioError }) => void;
  onFailover?: (info: { from: string; to: string; error: ImageStudioError }) => void;
}

export interface RequestSpec {
  method: "GET" | "POST";
  path: string;
  query?: Record<string, string | number | undefined>;
  json?: unknown;
  accept: string;
}

const MAX_BACKOFF_MS = 5_000;
const MAX_RETRY_AFTER_MS = 10_000;

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new ImageStudioError("ABORTED", "Request aborted."));
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new ImageStudioError("ABORTED", "Request aborted."));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });

function buildUrl(base: string, spec: RequestSpec): string {
  let url = base.replace(/\/+$/, "") + spec.path;
  if (spec.query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(spec.query)) if (v !== undefined) params.set(k, String(v));
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.min(MAX_RETRY_AFTER_MS, Math.max(0, seconds * 1000));
  const date = Date.parse(header);
  return Number.isNaN(date) ? undefined : Math.min(MAX_RETRY_AFTER_MS, Math.max(0, date - Date.now()));
}

export class Transport {
  constructor(private readonly options: TransportOptions) {}

  /** One HTTP attempt. `parse` runs while the timeout is still armed, so slow bodies time out too. */
  private async attempt<T>(baseUrl: string, spec: RequestSpec, call: CallOptions, parse: (res: Response) => Promise<T>): Promise<T> {
    const url = buildUrl(baseUrl, spec);
    const controller = new AbortController();
    let timedOut = false;
    const timeoutMs = call.timeoutMs ?? this.options.timeoutMs;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const onUserAbort = () => controller.abort();
    if (call.signal?.aborted) controller.abort();
    call.signal?.addEventListener("abort", onUserAbort, { once: true });

    try {
      const headers: Record<string, string> = { Accept: spec.accept, ...this.options.headers };
      let body: string | undefined;
      if (spec.json !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(spec.json);
      }
      const response = await this.options.fetch(url, { method: spec.method, headers, body, signal: controller.signal });
      if (!response.ok) {
        const error = await errorFromResponse(response, url);
        error.retryAfterMs = parseRetryAfter(response.headers.get("retry-after"));
        throw error;
      }
      return await parse(response);
    } catch (cause) {
      if (cause instanceof ImageStudioError) throw cause;
      if (timedOut) throw new ImageStudioError("TIMEOUT", `Request timed out after ${timeoutMs} ms.`, { url, cause });
      if (call.signal?.aborted) throw new ImageStudioError("ABORTED", "Request aborted.", { url, cause });
      const message = cause instanceof Error ? cause.message : String(cause);
      throw new ImageStudioError("NETWORK_ERROR", `Network error: ${message}`, { url, cause });
    } finally {
      clearTimeout(timer);
      call.signal?.removeEventListener("abort", onUserAbort);
    }
  }

  /**
   * Sends the request with retries (same host, transient errors only) and fail-over
   * (next host, when the failure is host specific: 5xx, 429, timeouts, resource limits…).
   * 4xx validation errors are never retried: every host would reject them identically.
   */
  async execute<T>(spec: RequestSpec, call: CallOptions, parse: (res: Response, baseUrl: string) => Promise<T>): Promise<T> {
    const attempts: AttemptInfo[] = [];
    const retries = Math.max(0, call.retries ?? this.options.retries);
    let lastError: ImageStudioError | undefined;

    for (let h = 0; h < this.options.baseUrls.length; h++) {
      const baseUrl = this.options.baseUrls[h];
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await this.attempt(baseUrl, spec, call, (res) => parse(res, baseUrl));
        } catch (error) {
          const err = error instanceof ImageStudioError ? error : new ImageStudioError("NETWORK_ERROR", String(error), { cause: error });
          lastError = err;
          attempts.push({ baseUrl, attempt, status: err.status, code: err.code, message: err.message });

          if (err.code === "ABORTED") throw this.finalize(err, attempts);
          if (err.retryable && attempt < retries) {
            const backoff = Math.min(MAX_BACKOFF_MS, this.options.retryDelayMs * 2 ** attempt * (0.5 + Math.random() * 0.5));
            const delayMs = err.retryAfterMs ?? backoff;
            this.options.onRetry?.({ baseUrl, attempt: attempt + 1, delayMs, error: err });
            await sleep(delayMs, call.signal);
            continue;
          }
          break; // give up on this host
        }
      }

      const next = this.options.baseUrls[h + 1];
      if (lastError && lastError.failoverable && next) {
        this.options.onFailover?.({ from: baseUrl, to: next, error: lastError });
        continue;
      }
      break;
    }
    throw this.finalize(lastError ?? new ImageStudioError("NETWORK_ERROR", "Request failed."), attempts);
  }

  private finalize(error: ImageStudioError, attempts: AttemptInfo[]): ImageStudioError {
    error.attempts = attempts;
    return error;
  }
}
