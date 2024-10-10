export class UnauthorizedError extends Error {
  details?: string | object

  constructor(message: string, details?: string) {
    super(message)
    this.name = "UnauthorizedError"
    this.details = details
  }
}
