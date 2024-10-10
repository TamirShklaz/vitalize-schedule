"use client"

export class ClientActionError extends Error {
  details?: string | object

  constructor(message: string, details?: string | object) {
    super(message)
    this.name = "ErrorActionResponse"
    this.details = details
  }
}
