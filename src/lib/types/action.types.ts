export type ServerActionFunction<T = void, R = void> = (
  data: T,
) => Promise<ActionResponse<R>>

export type ActionResponse<R> = {
  success: boolean
  data?: R
  error?: ActionErrorType
}

export type ActionErrorType = {
  message: string
  details?: string | object
}
