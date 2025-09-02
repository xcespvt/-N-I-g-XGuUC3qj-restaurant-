
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Home, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const trackingSteps = [
  { status: "Order Placed", date: "June 28, 2024", icon: CheckCircle, completed: true },
  { status: "Shipped", date: "June 29, 2024", icon: Package, completed: true },
  { status: "Out for Delivery", date: "June 30, 2024", icon: Truck, completed: true },
  { status: "Delivered", date: "June 30, 2024", icon: Home, completed: false },
];

export default function OrderTrackingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/store" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Store
        </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Track Your Order</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #STORE-00124</CardTitle>
          <CardDescription>Branded Packaging Tape (x5 rolls)</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative pl-6">
                {trackingSteps.map((step, index) => (
                    <div key={index} className="relative pb-8">
                        {index < trackingSteps.length - 1 && (
                            <div className={cn(
                                "absolute top-4 left-[1.125rem] w-0.5 h-full -translate-x-1/2",
                                step.completed ? "bg-primary" : "bg-border"
                            )}></div>
                        )}
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full z-10",
                                step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-2"
                            )}>
                                <step.icon className="h-5 w-5" />
                            </div>
                            <div className="pt-1.5">
                                <p className="font-semibold">{step.status}</p>
                                <p className="text-sm text-muted-foreground">{step.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <Separator className="my-4"/>
            <div className="text-center">
                 <p className="text-muted-foreground">Estimated Delivery: <strong>July 1, 2024</strong></p>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Contact Support</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
