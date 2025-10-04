// components/i18n-provider.tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";

type Dict = Record<string, string>;
type Dictionaries = Record<string, Dict>;

const DICTS: Dictionaries = {
  en: {
    "Toggle the theme": "Toggle the theme",
    "auth.createAccount": "Create Account",
    "auth.signIn": "Sign In",
    "dashboard.title": "Dashboard",
  },
  // add more locales here
};

type I18nContextValue = {
  locale: string;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

export function I18nProvider({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTS[locale] ?? DICTS.en;
    const t = (key: string) => dict[key] ?? key;
    return { locale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
