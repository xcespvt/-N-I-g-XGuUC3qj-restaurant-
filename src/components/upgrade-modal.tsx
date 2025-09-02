
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
  featureDescription: string
}

export function UpgradeModal({ isOpen, onClose, featureName, featureDescription }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> This is a Pro Feature
          </DialogTitle>
          <DialogDescription className="pt-4">
            The **{featureName}** feature helps you {featureDescription}.
            Upgrade to Pro to unlock full access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button asChild className="w-full">
            <Link href="/subscription">Upgrade to Pro</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
