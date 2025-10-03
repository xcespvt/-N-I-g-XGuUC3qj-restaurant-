"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Check,
  CircleOff,
  IndianRupee,
  Info,
  Download,
  ShieldCheck,
  Zap,
  Star,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAppStore } from "@/context/useAppStore";

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

const starterPerks = [
  {
    category: "Core Features",
    features: [
      "Multi-Branch System - Includes 1 free branch add-on (₹99 per extra branch thereafter)",
      "Promotions & Advertising Tool - Run hyperlocal ads inside Crevings",
      "Table & Booking Management - Manage dine-in reservations and waitlists",
      "Delivery, Takeaway & Dine-in Orders - 0% commission on all orders",
    ],
  },
  {
    category: "Smart Insights",
    features: [
      "AI-Powered Local Customer Insights - Track loyal buyers, peak hours and trending items",
      "Advanced Menu Analytics - Optimize dishes and pricing",
    ],
  },
  {
    category: "Finance & Operations",
    features: [
      "Same-Day Withdrawal of payouts",
      "Inventory Management (coming soon)",
      "Digital POS - Connect with Crevings Digital POS for smooth billing",
      "Basic Accounting Reports - Daily/weekly sales and tax summary",
    ],
  },
  {
    category: "Growth & Support",
    features: [
      "Priority Human Call Support",
      "Branding Assistance - Menu design, packaging templates, logo placement",
      "Legal Support - Basic compliance and agreements",
      "Loyalty Program - Customers earn points automatically for repeat orders",
    ],
  },
];

const growthPerks = [
  {
    category: "Multi-Branch Advantage",
    features: [
      "Multi-Branch System - Includes 3 free branch add-ons (₹99 per extra branch thereafter)",
    ],
  },
  {
    category: "Team & Workflow Tools",
    features: [
      "Work Assignment (coming soon) - Assign and track staff tasks",
      "Staff Management (coming soon) - Manage shifts, salaries and performance",
    ],
  },
  {
    category: "Advanced Finance Reporting",
    features: [
      "Advanced Accounting Dashboard - GST-ready reports, expense tracking",
    ],
  },
  {
    category: "Extra Growth Boost",
    features: [
      "Featured Listing in App - Priority placement in local searches",
      "Hyperlocal Social Media Push - 1 monthly promo post designed by Crevings team",
      "Our team assists organizations in enhancing customer engagement through effective offline marketing strategies",
      "Customer Feedback Dashboard - Ratings, reviews and AI-driven sentiment analysis",
    ],
  },
];

const PlanFeature = ({ feature }: { feature: string }) => (
  <li className="flex items-start gap-3">
    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
    <span className="text-muted-foreground">{feature}</span>
  </li>
);

const billingHistory = [
  {
    invoice: "INV-2024-001",
    date: "June 15, 2024",
    amount: "411.82",
    status: "Paid",
  },
  {
    invoice: "INV-2024-002",
    date: "May 15, 2024",
    amount: "411.82",
    status: "Paid",
  },
  {
    invoice: "INV-2024-003",
    date: "April 15, 2024",
    amount: "411.82",
    status: "Paid",
  },
  {
    invoice: "INV-2024-004",
    date: "March 15, 2024",
    amount: "411.82",
    status: "Paid",
  },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300",
  Pending:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300",
};

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();
  const { subscriptionPlan, setSubscriptionPlan } = useAppStore();

  const proMonthlyPrice = 349;
  const proAnnualPriceMonthly = Math.round(proMonthlyPrice * 0.8);

  const handleDowngrade = () => {
    setSubscriptionPlan("Starter Plan");
    toast({
      title: "Plan Downgraded",
      description: "You have been downgraded to the Free plan.",
      variant: "destructive",
    });
  };

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
          Choose the plan that's right for your business. Upgrade, downgrade, or
          cancel anytime.
        </p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-muted p-1 rounded-lg w-full sm:w-auto">
            <TabsTrigger value="plans">Manage Plan</TabsTrigger>
            <TabsTrigger value="history">Billing</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual billing"
            />
            <span className="text-sm font-medium text-primary">
              Annual (Save 20%)
            </span>
          </div>
        </div>

        <TabsContent value="plans" className="mt-8">
          {/* <div className="grid grid-cols-1 lg:max-w-md lg:mx-auto gap-8 items-start">
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
          </div> */}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Starter Plan */}
            <Card className="h-full flex flex-col border-2 border-yellow-300 shadow-2xl shadow-primary/20 relative">
              {subscriptionPlan === "Starter Plan" && (
                <Badge
                  variant="secondary"
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-200 text-yellow-800 border-yellow-300 dark:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-700 px-4 py-1 text-sm font-semibold"
                >
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Active Plan
                </Badge>
              )}
              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-2xl font-headline text-primary">
                  Starter Plan
                </CardTitle>
                <CardDescription>
                  For single restaurants, cafés, home chefs, and cloud kitchens
                  starting digital growth.
                </CardDescription>
                <div className="flex items-baseline gap-2 pt-4">
                  <span className="text-5xl font-bold font-headline">₹399</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">+ 18% GST</p>
              </CardHeader>
              <CardContent className="p-6 pt-6 flex-1 flex flex-col">
                <div className="space-y-6">
                  {starterPerks.map((perkCategory, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-3">
                        {perkCategory.category}
                      </h4>
                      <ul className="space-y-3">
                        {perkCategory.features.map((feature, fIndex) => (
                          <PlanFeature key={fIndex} feature={feature} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                {subscriptionPlan === "Starter Plan" ? (
                  <Button
                    className="w-full text-lg py-6"
                    variant="outline"
                    disabled
                  >
                    <ShieldCheck className="mr-2 h-5 w-5" /> You are on Starter
                    Plan
                  </Button>
                ) : (
                  <Link
                    href={`/subscription/checkout?billing=${
                      isAnnual ? "annual" : "monthly"
                    }`}
                    className="w-full"
                  >
                    <Button className="w-full text-lg py-6">
                      <Zap className="mr-2 h-5 w-5" /> Upgrade to Starter Plan
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            {/* Growth Plan */}
            <Card className="h-full flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 relative">
              {subscriptionPlan === "Growth Plan" ? (
                <Badge
                  className="absolute -top-4 left-1/2 -translate-x-1/2 animate-glow"
                  variant="default"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Active Plan
                </Badge>
              ) : (
                <Badge
                  className="absolute -top-4 left-1/2 -translate-x-1/2 animate-glow"
                  variant="default"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Most Popular
                </Badge>
              )}

              <CardHeader className="p-6 pb-0">
                <CardTitle className="text-2xl font-headline text-primary">
                  Growth Plan
                </CardTitle>
                <CardDescription>
                  For multi-outlet brands, franchises, and scaling kitchens.
                </CardDescription>
                <div className="flex items-baseline gap-2 pt-4">
                  <span className="text-5xl font-bold font-headline">₹499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">+ 18% GST</p>
                <p className="text-sm font-semibold pt-2 text-primary">
                  Everything in Starter ₹399 Plan PLUS:
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-6 flex-1 flex flex-col">
                <div className="space-y-6">
                  {growthPerks.map((perkCategory, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-3">
                        {perkCategory.category}
                      </h4>
                      <ul className="space-y-3">
                        {perkCategory.features.map((feature, fIndex) => (
                          <PlanFeature key={fIndex} feature={feature} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                {subscriptionPlan === "Growth Plan" ? (
                  <Button
                    className="w-full text-lg py-6"
                    variant="outline"
                    disabled
                  >
                    <ShieldCheck className="mr-2 h-5 w-5" /> You are on Growth
                    Plan
                  </Button>
                ) : (
                  <Link
                    href={`/subscription/checkout?billing=${
                      isAnnual ? "annual" : "monthly"
                    }`}
                    className="w-full"
                  >
                    <Button className="w-full text-lg py-6">
                      <Zap className="mr-2 h-5 w-5" /> Upgrade to Growth Plan
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>

          <Alert className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">
              Try Crevings Pro Partner for free
            </AlertTitle>
            <AlertDescription className="text-primary/80">
              Get a 7-day free trial when you sign up for Crevings Pro Partner.
              Cancel anytime during the trial period and you won't be charged.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>
                Manage your current plan and payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                  {/* <p className="font-medium text-lg">{subscriptionPlan === 'Pro' ? 'July 15, 2025' : 'Not applicable'}</p> */}
                  <p className="font-medium text-lg">
                    {subscriptionPlan === "Starter Plan"
                      ? "July 15, 2025"
                      : "Not applicable"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Billing Cycle</p>
                  {/* <p className="font-medium text-lg">{subscriptionPlan === 'Pro' ? (isAnnual ? 'Annual' : 'Monthly') : 'N/A'}</p> */}
                  <p className="font-medium text-lg">
                    {subscriptionPlan === "Starter Plan"
                      ? isAnnual
                        ? "Annual"
                        : "Monthly"
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-6">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() =>
                  handleActionClick(
                    "Updating Payment Method",
                    "Redirecting to payment provider."
                  )
                }
              >
                Update Payment Method
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() =>
                  handleActionClick(
                    "Subscription Cancelled",
                    "Your subscription has been successfully cancelled."
                  )
                }
              >
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Review and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {billingHistory.map((item) => (
                  <div key={item.invoice} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Invoice ID</p>
                        <p className="font-medium">{item.invoice}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(statusStyles[item.status])}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{item.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <div className="flex items-center font-medium">
                          <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                          {item.amount}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleActionClick(
                            "Downloading Invoice",
                            `Invoice ${item.invoice} will be downloaded.`
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">
                        Invoice ID
                      </TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((item) => (
                      <TableRow key={item.invoice}>
                        <TableCell className="font-mono text-xs">
                          {item.invoice}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{item.date}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                            {item.amount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(statusStyles[item.status], "whitespace-nowrap")}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleActionClick(
                                "Downloading Invoice",
                                `Invoice ${item.invoice} will be downloaded.`
                              )
                            }
                          >
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
