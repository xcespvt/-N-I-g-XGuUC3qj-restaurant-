
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, CircleOff, IndianRupee, Info, Download, ShieldCheck, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const proPlanFeatures = [
  { text: "Everything in Free plan", included: true },
  { text: "Advanced analytics & insights", included: true },
  { text: "Promotions & ad tools", included: true },
  { text: "Inventory & supply chain management", included: true },
  { text: "Multi-branch management", included: true },
  { text: "Live order tracking for customers", included: true },
  { text: "Custom branding options", included: true },
  { text: "24/7 priority phone & chat support", included: true },
];

const billingHistory = [
  { invoice: "INV-2024-001", date: "June 15, 2024", amount: "411.82", status: "Paid" },
  { invoice: "INV-2024-002", date: "May 15, 2024", amount: "411.82", status: "Paid" },
  { invoice: "INV-2024-003", date: "April 15, 2024", amount: "411.82", status: "Paid" },
  { invoice: "INV-2024-004", date: "March 15, 2024", amount: "411.82", status: "Paid" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
};


export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();
  const { subscriptionPlan, setSubscriptionPlan } = useAppContext();

  const proMonthlyPrice = 349;
  const proAnnualPriceMonthly = Math.round(proMonthlyPrice * 0.8);
  
  const handleDowngrade = () => {
    setSubscriptionPlan('Free');
    toast({
        title: "Plan Downgraded",
        description: "You have been downgraded to the Free plan.",
        variant: "destructive",
    })
  }

  const handleActionClick = (title: string, description: string) => {
    toast({ title, description });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl flex items-center justify-center gap-3">
          Subscription Plans
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Choose the plan that's right for your business. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-muted p-1 rounded-lg w-full sm:w-auto">
            <TabsTrigger value="plans">Manage Plan</TabsTrigger>
            <TabsTrigger value="history">Billing</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm font-medium text-muted-foreground">Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual billing" />
            <span className="text-sm font-medium text-primary">Annual (Save 20%)</span>
          </div>
        </div>

        <TabsContent value="plans" className="mt-8">
          <div className="grid grid-cols-1 lg:max-w-md lg:mx-auto gap-8 items-start">
            <Card className={cn("flex flex-col relative h-full", subscriptionPlan === 'Pro' ? "border-primary border-2 shadow-2xl shadow-primary/10" : "")}>
                {subscriptionPlan === 'Free' && <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">Recommended</Badge>}
                 {subscriptionPlan === 'Pro' && (
                    <Badge variant="secondary" className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-200 text-yellow-800 border-yellow-300 dark:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-700 px-4 py-1 text-sm font-semibold">
                      Active Plan
                    </Badge>
                  )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Crevings Pro Partner</CardTitle>
                <CardDescription>Advanced features for growing restaurants</CardDescription>
                <div className="pt-4">
                    {isAnnual ? (
                        <>
                            <span className="text-5xl font-bold flex items-center justify-center"><IndianRupee className="h-9 w-9" />{proAnnualPriceMonthly}</span>
                            <span className="text-muted-foreground">/month, billed annually</span>
                        </>
                    ) : (
                        <>
                            <span className="text-5xl font-bold flex items-center justify-center"><IndianRupee className="h-9 w-9" />{proMonthlyPrice}</span>
                            <span className="text-muted-foreground">/month</span>
                        </>
                    )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {proPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                 {subscriptionPlan === 'Pro' ? (
                     <Button className="w-full text-lg py-6" variant="outline" disabled>
                        <ShieldCheck className="mr-2 h-5 w-5"/> You are on Pro
                    </Button>
                 ) : (
                    <Link href={`/subscription/checkout?billing=${isAnnual ? 'annual' : 'monthly'}`} className='w-full'>
                        <Button className="w-full text-lg py-6">
                            <Zap className="mr-2 h-5 w-5"/> Upgrade to Pro
                        </Button>
                    </Link>
                 )}
              </CardFooter>
            </Card>
          </div>

           <Alert className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">Try Crevings Pro Partner for free</AlertTitle>
              <AlertDescription className="text-primary/80">
                Get a 7-day free trial when you sign up for Crevings Pro Partner. Cancel anytime during the trial period and you won't be charged.
              </AlertDescription>
            </Alert>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your current plan and payment method</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Current Plan</p>
                        <p className="font-medium text-lg">{subscriptionPlan} Plan</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Payment Method</p>
                        <p className="font-medium text-lg">Visa **** 4242</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Next Billing Date</p>
                        <p className="font-medium text-lg">{subscriptionPlan === 'Pro' ? 'July 15, 2025' : 'Not applicable'}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Billing Cycle</p>
                        <p className="font-medium text-lg">{subscriptionPlan === 'Pro' ? (isAnnual ? 'Annual' : 'Monthly') : 'N/A'}</p>
                    </div>
               </div>
            </CardContent>
            <CardFooter className="flex gap-2 border-t pt-6">
                <Button variant="outline" onClick={() => handleActionClick("Updating Payment Method", "Redirecting to payment provider.")}>Update Payment Method</Button>
                <Button variant="destructive" onClick={() => handleActionClick("Subscription Cancelled", "Your subscription has been successfully cancelled.")}>Cancel Subscription</Button>
            </CardFooter>
          </Card>
          
          <Card>
             <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Review and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="border rounded-lg">
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Invoice ID</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Amount</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="text-right font-semibold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingHistory.map((item) => (
                                <TableRow key={item.invoice}>
                                    <TableCell className="font-mono text-xs">{item.invoice}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell className="flex items-center font-medium"><IndianRupee className="h-4 w-4 mr-1 text-muted-foreground"/>{item.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(statusStyles[item.status])}>{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleActionClick("Downloading Invoice", `Invoice ${item.invoice} will be downloaded.`)}>
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download Invoice</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
