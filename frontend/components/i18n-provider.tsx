"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { translations } from "@/lib/translations"

type Language = "en" | "hi" | "bn" | "te" | "mr" | "ta" | "gu" | "kn" | "ml" | "or" | "pa" | "ur"

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved && saved in translations) {
      setLanguage(saved as Language)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language

    // Set text direction for RTL languages
    if (language === "ur") {
      document.documentElement.dir = "rtl"
    } else {
      document.documentElement.dir = "ltr"
    }
  }, [language])

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
