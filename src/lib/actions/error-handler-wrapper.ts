import { ActionResponse, ServerActionFunction } from "@/lib/types/action.types"
import { UnauthorizedError } from "@/lib/errors/unauthorized.error"
import { NotFoundError } from "@/lib/errors/not-founder.error"
import postgres from "postgres"
import { InvalidError } from "@/lib/errors/invalid.error"

const { PostgresError } = postgres

export function withErrorHandling<T = void, R = void>(
  action: ServerActionFunction<T, R>,
) {
  return async (data: T): Promise<ActionResponse<R>> => {
    try {
      const result = await action(data)
      return result
    } catch (error) {
      console.error("Server Action Error:", error)

      if (error instanceof UnauthorizedError) {
        return {
          success: false,
          error: {
            message: error.message,
            details: error.details,
          },
        }
      }

      if (error instanceof NotFoundError) {
        return {
          success: false,
          error: {
            message: error.message,
            details: error.details,
          },
        }
      }

      if (error instanceof PostgresError) {
        return {
          success: false,
          error: {
            message: error.message,
            details: error.detail,
          },
        }
      }

      if (error instanceof InvalidError) {
        return {
          success: false,
          error: {
            message: error.message,
            details: error.details,
          },
        }
      }

      return {
        success: false,
        error: {
          message: "An unexpected error occurred",
          details: error as object,
        },
      }
    }
  }
}
