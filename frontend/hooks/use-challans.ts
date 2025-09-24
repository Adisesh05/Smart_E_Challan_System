"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Challan {
  id: number
  plate: string
  type: string
  amount: number
  status: string
  issued_at: string
}

export function useChallans() {
  const [challans, setChallans] = useState<Challan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const loadChallans = useCallback(
    async (plate?: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await apiClient.getChallans(plate)
        setChallans(data)
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load challans"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const refreshChallans = useCallback(() => {
    loadChallans()
  }, [loadChallans])

  useEffect(() => {
    loadChallans()
  }, [loadChallans])

  return {
    challans,
    isLoading,
    error,
    loadChallans,
    refreshChallans,
  }
}
