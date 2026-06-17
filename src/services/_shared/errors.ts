export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function logServiceError(context: string, error: { message?: string; code?: string }) {
  console.error(context, error.message ?? "Unknown error", error.code ?? "");
}
