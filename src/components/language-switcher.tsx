
"use client"

import { Globe, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LanguageSwitcher() {
  return (
    <Button variant="ghost" className="hidden md:flex items-center gap-2 text-left h-auto p-2">
      <Globe className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">Change Language</p>
        <p className="text-xs text-muted-foreground">GB English</p>
      </div>
      <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
    </Button>
  )
}
