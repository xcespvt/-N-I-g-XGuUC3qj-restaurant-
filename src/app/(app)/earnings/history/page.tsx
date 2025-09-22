
"use client"

import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, IndianRupee, Clock, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type WithdrawalStatus = "Completed" | "Processing" | "Failed";

const withdrawalHistory = [
  {
    id: "WD-001",
    amount: 1200.00,
    date: "May 1, 2025, 10:00 AM",
    status: "Completed" as WithdrawalStatus,
  },
  {
    id: "WD-002",
    amount: 850.50,
    date: "April 24, 2025, 11:30 AM",
    status: "Completed" as WithdrawalStatus,
  },
  {
    id: "WD-003",
    amount: 1500.00,
    date: "April 17, 2025, 02:15 PM",
    status: "Failed" as WithdrawalStatus,
    reason: "Incorrect bank details",
  },
  {
    id: "WD-004",
    amount: 980.00,
    date: "April 10, 2025, 09:45 AM",
    status: "Completed" as WithdrawalStatus,
  },
];

const statusStyles: Record<WithdrawalStatus, { icon: React.ElementType, badgeClass: string, textClass: string }> = {
  Completed: { icon: CheckCircle, badgeClass: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700", textClass: "text-green-700 dark:text-green-300" },
  Processing: { icon: Clock, badgeClass: "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700", textClass: "text-blue-700 dark:text-blue-300" },
  Failed: { icon: XCircle, badgeClass: "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700", textClass: "text-red-700 dark:text-red-300" },
};


export default function WithdrawalHistoryPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <Link href="/earnings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
        <ArrowLeft className="h-4 w-4"/>
        Back to Earnings
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Withdrawal History</h1>
      </div>
      
      <div>
            <h2 className="text-lg font-semibold">Transaction History</h2>
            <p className="text-sm text-muted-foreground">A record of all your withdrawal requests.</p>
            <div className="space-y-4 mt-4">
                {withdrawalHistory.map((item) => {
                    const { icon: Icon, badgeClass, textClass } = statusStyles[item.status];
                    return (
                        <div key={item.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50 gap-4">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-2 rounded-full mt-1", badgeClass)}>
                                    <Icon className={cn("h-5 w-5", textClass)} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg flex items-center"><IndianRupee className="h-4 w-4 mr-0.5"/>{item.amount.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                    <p className="text-xs text-muted-foreground">Transaction ID: {item.id}</p>
                                    {item.status === 'Failed' && item.reason && (
                                        <p className="text-xs text-red-500 mt-1">Reason: {item.reason}</p>
                                    )}
                                </div>
                            </div>
                            <Badge variant="outline" className={cn("capitalize flex-shrink-0", badgeClass, textClass)}>{item.status}</Badge>
                        </div>
                    )
                })}
            </div>
      </div>
    </div>
  )
}
