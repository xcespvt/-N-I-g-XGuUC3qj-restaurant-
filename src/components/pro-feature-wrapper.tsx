
"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import { UpgradeModal } from "./upgrade-modal"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "./ui/button"

interface ProFeatureWrapperProps {
  children: React.ReactNode
  featureName: string
  featureDescription: string
  className?: string
}

export function ProFeatureWrapper({ children, featureName, featureDescription, className }: ProFeatureWrapperProps) {
  const { subscriptionPlan } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (subscriptionPlan === "Pro") {
    return <>{children}</>
  }

  const handleOpenModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("relative", className)} onClick={handleOpenModal}>
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center cursor-pointer">
                <div className="text-center p-6 bg-card border rounded-lg shadow-lg max-w-sm">
                  <Lock className="h-8 w-8 mx-auto text-primary" />
                  <p className="font-semibold mt-2 text-lg">This is a Pro Feature</p>
                  <p className="text-sm text-muted-foreground mt-1">Upgrade your plan to unlock this feature and many more benefits.</p>
                  <Button variant="default" className="mt-4">
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
              <div className="opacity-40 blur-sm pointer-events-none select-none">
                {children}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Locked. Upgrade to Pro to use this.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName={featureName}
        featureDescription={featureDescription}
      />
    </>
  )
}
