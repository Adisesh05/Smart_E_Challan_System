// components/theme-toggle.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider"; // <- if you have i18n

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n?.() ?? { t: (s: string) => s };

  const next = theme === "light" ? "dark" : "light";

  return (
    <Button
      variant="ghost"
      aria-label={t("Toggle the theme")}
      onClick={() => setTheme(next)}
    >
      {theme === "dark" ? "🌙" : "🌞"}
    </Button>
  );
}
