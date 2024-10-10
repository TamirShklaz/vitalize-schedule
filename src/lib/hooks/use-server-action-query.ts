"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ActionErrorType, ServerActionFunction } from "@/lib/types/action.types"
import { ClientActionError } from "@/lib/errors/client-action-error"

type State<R> = {
  data?: R
  error?: ActionErrorType
  isLoading: boolean
  isSuccess: boolean
}

export function useServerActionQuery<T, R>(
  serverAction: ServerActionFunction<T, R>,
  initialArgs: T,
  runOnLoad = true,
) {
  const [state, setState] = useState<State<R>>({
    data: undefined,
    error: undefined,
    isLoading: true,
    isSuccess: false,
  })

  const argsRef = useRef(initialArgs)

  const execute = useCallback(
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
          return response.data
        } else {
          const error = new ClientActionError(
            response.error?.message || "Unknown error occurred",
            response.error?.details,
          )
          setState({
            data: undefined,
            error: response.error,
            isLoading: false,
            isSuccess: false,
          })
          throw error
        }
      } catch (error) {
        let errorResponse: ClientActionError

        if (error instanceof ClientActionError) {
          errorResponse = error
        } else if (error instanceof Error) {
          errorResponse = new ClientActionError(error.message, error.stack)
        } else {
          errorResponse = new ClientActionError(
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

  const refresh = useCallback(() => {
    return execute(argsRef.current)
  }, [execute])

  useEffect(() => {
    argsRef.current = initialArgs
    if (!runOnLoad) return
    refresh()
  }, [JSON.stringify(initialArgs)])

  return {
    ...state,
    execute,
    refresh,
  }
}
