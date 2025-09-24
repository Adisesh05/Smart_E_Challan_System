"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/components/i18n-provider"

interface LocationStepProps {
  value: string
  onChange: (value: string) => void
}

export function LocationStep({ value, onChange }: LocationStepProps) {
  const { t } = useI18n()

  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="sr-only">
        {t("dashboard.step1")}
      </Label>
      <Input
        id="location"
        type="text"
        placeholder={t("dashboard.locationPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        data-testid="location-input"
        aria-describedby="location-helper"
      />
      <p id="location-helper" className="text-sm text-muted-foreground">
        {t("dashboard.locationHelper")}
      </p>
    </div>
  )
}
