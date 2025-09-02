
"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"

const guideSteps = [
  {
    image: "https://placehold.co/550x310.png",
    aiHint: "dashboard analytics",
    title: "Welcome to Your Dashboard",
    description: "This is your central hub. Get a quick overview of your key metrics like total orders, revenue, and active promotions at a glance.",
  },
  {
    image: "https://placehold.co/550x310.png",
    aiHint: "order list",
    title: "Manage Your Orders",
    description: "The 'Orders' tab is where you'll accept new orders, update their status from 'Preparing' to 'Ready', and view your entire order history.",
  },
  {
    image: "https://placehold.co/550x310.png",
    aiHint: "menu management",
    title: "Build Your Menu",
    description: "Easily add, edit, and categorize your dishes in the 'Menu' section. Toggle item availability and set prices for both online and offline sales.",
  },
  {
    image: "https://placehold.co/550x310.png",
    aiHint: "restaurant promotion",
    title: "Create Promotions",
    description: "Attract more customers by creating special offers and discounts. Our Pro plan gives you advanced tools to track performance and target specific audiences.",
  },
  {
    image: "https://placehold.co/550x310.png",
    aiHint: "customer feedback",
    title: "Engage with Feedback",
    description: "Check the 'Feedback' page to see what your customers are saying. Respond to reviews to build loyalty and improve your service.",
  },
];

interface GuideSlideshowProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function GuideSlideshow({ isOpen, onOpenChange }: GuideSlideshowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = guideSteps.length

  const goToNextStep = () => {
    setCurrentStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev))
  }

  const goToPrevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const step = guideSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">XCES Partner Guide</DialogTitle>
          <DialogDescription>
            A quick tour to help you get the most out of your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
            <div className="bg-muted rounded-lg overflow-hidden">
                 <Image
                    src={step.image}
                    alt={step.title}
                    width={550}
                    height={310}
                    data-ai-hint={step.aiHint}
                    className="w-full object-cover aspect-video"
                />
            </div>
            <div className="text-center mt-4 space-y-2">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
        </div>
        <DialogFooter className="p-6 border-t bg-muted/50 justify-between items-center">
            <div className="flex-1">
                <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1.5">Step {currentStep + 1} of {totalSteps}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1"/> Prev
                </Button>
                 {currentStep < totalSteps - 1 ? (
                    <Button onClick={goToNextStep}>
                        Next <ChevronRight className="h-4 w-4 ml-1"/>
                    </Button>
                ) : (
                    <DialogClose asChild>
                        <Button>Done</Button>
                    </DialogClose>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
