export class NotFoundError extends Error {
  details?: string | object

  constructor(message: string, details?: string) {
    super(message)
    this.name = "NotFoundError"
    this.details = details
  }
}
