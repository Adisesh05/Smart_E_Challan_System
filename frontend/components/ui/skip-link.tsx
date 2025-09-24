"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <Button
      asChild
      variant="outline"
      className="absolute -top-40 left-6 z-50 transition-all focus:top-6 bg-transparent"
    >
      <a href={href}>{children}</a>
    </Button>
  )
}
