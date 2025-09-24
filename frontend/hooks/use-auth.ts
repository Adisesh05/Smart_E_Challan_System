"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

interface User {
  email: string
  token: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      // In a real app, you'd validate the token with the server
      setUser({ email: "", token })
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password)
    const token = response.access_token

    localStorage.setItem("auth_token", token)
    setUser({ email, token })

    // Bootstrap violation types
    try {
      await apiClient.bootstrapViolationTypes()
    } catch (error) {
      console.warn("Bootstrap warning:", error)
    }

    return response
  }

  const register = async (email: string, password: string) => {
    const response = await apiClient.register(email, password)
    const token = response.access_token

    localStorage.setItem("auth_token", token)
    setUser({ email, token })

    // Bootstrap violation types
    try {
      await apiClient.bootstrapViolationTypes()
    } catch (error) {
      console.warn("Bootstrap warning:", error)
    }

    return response
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/auth/login")
  }

  const requireAuth = () => {
    if (!user && !isLoading) {
      router.push("/auth/login")
      return false
    }
    return true
  }

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    requireAuth,
    isAuthenticated: !!user,
  }
}
