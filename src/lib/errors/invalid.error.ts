export class InvalidError extends Error {
  details?: string | object

  constructor(message: string, details?: string | object) {
    super(message)
    this.name = "InvalidError"
    this.details = details
  }
}
