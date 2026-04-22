import { NextResponse } from "next/server";

/** Stable machine-readable codes for clients and logs. */
export const ApiCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  MFA_REQUIRED: "MFA_REQUIRED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
  INVALID_ORIGIN: "INVALID_ORIGIN",
} as const;

export type ApiCodeType = (typeof ApiCode)[keyof typeof ApiCode];

type ErrorBody = {
  success: false;
  message: string;
  code: string;
  details?: unknown;
  /** @deprecated Use `message`; kept for older callers. */
  error: string;
};

export function jsonError(
  message: string,
  code: string,
  status: number,
  details?: unknown,
  headers?: HeadersInit,
): NextResponse<ErrorBody> {
  const body: ErrorBody = {
    success: false,
    message,
    code,
    error: message,
    ...(details !== undefined ? { details } : {}),
  };
  return NextResponse.json(body, { status, headers });
}

export function jsonSuccess<T>(
  data?: T,
  status = 200,
  headers?: HeadersInit,
): NextResponse {
  if (data === undefined) {
    return NextResponse.json({ success: true }, { status, headers });
  }
  return NextResponse.json({ success: true, data }, { status, headers });
}
