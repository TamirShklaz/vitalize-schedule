"use client"

import { useCallback, useState } from "react"
import { ActionErrorType, ServerActionFunction } from "@/lib/types/action.types"
import { ServerActionError } from "@/lib/errors/server-action.error"

type State<R> = {
  data?: R
  error?: ActionErrorType
  isLoading: boolean
  isSuccess: boolean
}

export function useServerActionMutation<T, R>(
  serverAction: ServerActionFunction<T, R>,
) {
  const [state, setState] = useState<State<R>>({
    data: undefined,
    error: undefined,
    isLoading: false,
    isSuccess: false,
  })

  const trigger = useCallback(
    async (data: T) => {
      setState(prev => ({ ...prev, isLoading: true }))

      try {
        const response = await serverAction(data)

        if (response.success) {
          setState({
            data: response.data,
            error: undefined,
            isLoading: false,
            isSuccess: true,
          })
          return {
            data: response.data,
            error: undefined,
            isLoading: false,
            isSuccess: true,
          }
        } else {
          setState({
            data: undefined,
            error: response.error,
            isLoading: false,
            isSuccess: false,
          })
        }
        return {
          data: undefined,
          error: response.error,
          isLoading: false,
          isSuccess: true,
        }
      } catch (error) {
        let errorResponse: ServerActionError

        if (error instanceof ServerActionError) {
          errorResponse = error
        } else if (error instanceof Error) {
          errorResponse = new ServerActionError(error.message, error.stack)
        } else {
          errorResponse = new ServerActionError(
            "An unknown error occurred",
            error as object,
          )
        }

        setState({
          data: undefined,
          error: errorResponse,
          isLoading: false,
          isSuccess: false,
        })
        throw errorResponse
      }
    },
    [serverAction],
  )

  return {
    ...state,
    trigger,
  }
}
