"use client"

import { Minus, Plus, Contrast } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAccessibility } from "@/components/accessibility-provider"
import { useI18n } from "@/components/i18n-provider"

export function AccessibilityControls() {
  const { settings, updateSettings } = useAccessibility()
  const { t } = useI18n()

  const fontSizes = [
    { value: "small", label: t("accessibility.small") },
    { value: "normal", label: t("accessibility.normal") },
    { value: "large", label: t("accessibility.large") },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Accessibility settings">
          <Contrast className="h-4 w-4" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("accessibility.fontSize")}</DropdownMenuLabel>
        <div className="flex items-center justify-between px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const currentIndex = fontSizes.findIndex((size) => size.value === settings.fontSize)
              if (currentIndex > 0) {
                updateSettings({ fontSize: fontSizes[currentIndex - 1].value })
              }
            }}
            disabled={settings.fontSize === "small"}
            aria-label="Decrease font size"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm">{fontSizes.find((size) => size.value === settings.fontSize)?.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const currentIndex = fontSizes.findIndex((size) => size.value === settings.fontSize)
              if (currentIndex < fontSizes.length - 1) {
                updateSettings({ fontSize: fontSizes[currentIndex + 1].value })
              }
            }}
            disabled={settings.fontSize === "large"}
            aria-label="Increase font size"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => updateSettings({ highContrast: !settings.highContrast })}
          className="flex items-center justify-between"
        >
          <span>{t("accessibility.highContrast")}</span>
          <div className={`w-4 h-4 rounded border ${settings.highContrast ? "bg-primary" : "bg-transparent"}`} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
