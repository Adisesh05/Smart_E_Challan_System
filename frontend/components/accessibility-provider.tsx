"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type AccessibilitySettings = {
  fontSize: "small" | "normal" | "large"
  highContrast: boolean
}

type AccessibilityProviderState = {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
}

const initialState: AccessibilityProviderState = {
  settings: {
    fontSize: "normal",
    highContrast: false,
  },
  updateSettings: () => null,
}

const AccessibilityContext = createContext<AccessibilityProviderState>(initialState)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accessibility-settings")
      return saved ? JSON.parse(saved) : initialState.settings
    }
    return initialState.settings
  })

  useEffect(() => {
    const root = document.documentElement

    // Apply font size
    root.classList.remove("font-size-small", "font-size-normal", "font-size-large")
    root.classList.add(`font-size-${settings.fontSize}`)

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Save to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return <AccessibilityContext.Provider value={{ settings, updateSettings }}>{children}</AccessibilityContext.Provider>
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
