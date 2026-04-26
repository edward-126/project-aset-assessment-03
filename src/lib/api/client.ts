import type { ApiErrorResponse } from "@/types/api";

export class ApiClientError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

export async function fetchJson<TResponse>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(input, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | TResponse
    | null;

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse | null;

    throw new ApiClientError(
      errorBody?.error ?? "The request could not be completed.",
      response.status,
      errorBody?.details ?? []
    );
  }

  return body as TResponse;
}
