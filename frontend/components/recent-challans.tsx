"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LiveRegion } from "@/components/ui/live-region"
import { useI18n } from "@/components/i18n-provider"

interface Challan {
  id: number
  plate: string
  type: string
  amount: number
  status: string
  issued_at: string
}

interface RecentChallansProps {
  challans: Challan[]
  onSearch: (value: string) => void
}

export function RecentChallans({ challans, onSearch }: RecentChallansProps) {
  const { t } = useI18n()
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof Challan>("issued_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [liveMessage, setLiveMessage] = useState("")

  const itemsPerPage = 10

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1) // Reset to first page when searching
    onSearch(value)

    if (value) {
      setLiveMessage(`Searching for license plate: ${value}`)
    } else {
      setLiveMessage("Search cleared, showing all challans")
    }
  }

  const handleSort = (field: keyof Challan) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortDirection(newDirection)

    const fieldName = t(`challan.${field}`) || field
    setLiveMessage(`Table sorted by ${fieldName} in ${newDirection}ending order`)
  }

  const sortedChallans = [...challans].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const filteredChallans = sortedChallans.filter((challan) =>
    challan.plate.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredChallans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedChallans = filteredChallans.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    setLiveMessage(`Navigated to page ${newPage} of ${totalPages}`)
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "secondary"
      case "issued":
        return "default"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <LiveRegion message={liveMessage} />

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          placeholder={t("dashboard.searchByPlate")}
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          data-testid="search-input"
          aria-label={t("dashboard.searchByPlate")}
        />
      </div>

      {paginatedChallans.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground" role="status" aria-live="polite">
          <p>{searchValue ? `No challans found for "${searchValue}"` : t("dashboard.noResults")}</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border" role="region" aria-label="Challans table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("id")}
                      aria-label={`Sort by ${t("challan.id")} ${sortField === "id" ? (sortDirection === "asc" ? "descending" : "ascending") : ""}`}
                    >
                      {t("challan.id")}
                      {sortField === "id" && (
                        <span className="ml-1" aria-hidden="true">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("plate")}
                      aria-label={`Sort by ${t("challan.plate")} ${sortField === "plate" ? (sortDirection === "asc" ? "descending" : "ascending") : ""}`}
                    >
                      {t("challan.plate")}
                      {sortField === "plate" && (
                        <span className="ml-1" aria-hidden="true">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>{t("challan.violation")}</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("amount")}
                      aria-label={`Sort by ${t("challan.amount")} ${sortField === "amount" ? (sortDirection === "asc" ? "descending" : "ascending") : ""}`}
                    >
                      {t("challan.amount")}
                      {sortField === "amount" && (
                        <span className="ml-1" aria-hidden="true">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>{t("challan.status")}</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("issued_at")}
                      aria-label={`Sort by ${t("challan.issuedAt")} ${sortField === "issued_at" ? (sortDirection === "asc" ? "descending" : "ascending") : ""}`}
                    >
                      {t("challan.issuedAt")}
                      {sortField === "issued_at" && (
                        <span className="ml-1" aria-hidden="true">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>{t("challan.evidence")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedChallans.map((challan) => (
                  <TableRow key={challan.id}>
                    <TableCell className="font-medium">#{challan.id}</TableCell>
                    <TableCell className="font-mono">{challan.plate}</TableCell>
                    <TableCell>{challan.type.replace("_", " ")}</TableCell>
                    <TableCell className="font-semibold">₹{challan.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(challan.status)}>{challan.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(challan.issued_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" aria-label={`View evidence for challan ${challan.id}`}>
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-between" aria-label="Pagination">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredChallans.length)} of{" "}
                {filteredChallans.length} results
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {t("common.previous")}
                </Button>
                <span className="text-sm" aria-current="page">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                >
                  {t("common.next")}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
