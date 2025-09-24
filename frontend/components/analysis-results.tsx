"use client"

import { ExternalLink, Car, AlertTriangle, Receipt } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/i18n-provider"

interface AnalysisResultsProps {
  result: {
    vehicle: { plate: string; type: string }
    violation: { type: string; confidence: number; location: string }
    challan: { id: number; amount: number; status: string }
  }
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const { t } = useI18n()

  const confidenceColor =
    result.violation.confidence >= 0.8
      ? "bg-green-500"
      : result.violation.confidence >= 0.6
        ? "bg-yellow-500"
        : "bg-red-500"

  const statusColor =
    result.challan.status === "ISSUED" ? "default" : result.challan.status === "PAID" ? "secondary" : "outline"

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("challan.vehicle")}</p>
                <p className="text-lg font-semibold">{result.vehicle.plate}</p>
                <p className="text-sm text-muted-foreground capitalize">{result.vehicle.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("challan.violation")}</p>
                <p className="text-lg font-semibold">{result.violation.type.replace("_", " ")}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${confidenceColor}`} />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(result.violation.confidence * 100)}% {t("challan.confidence")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("challan.id")}</p>
                <p className="text-lg font-semibold">#{result.challan.id}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={statusColor}>{result.challan.status}</Badge>
                  <span className="text-lg font-bold text-green-600">₹{result.challan.amount}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("challan.viewEvidence")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <strong>{t("challan.location")}:</strong> {result.violation.location}
        </p>
        <p>
          <strong>{t("challan.issuedAt")}:</strong> {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}
