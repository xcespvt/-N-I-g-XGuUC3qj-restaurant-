import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const starterPerks = [
    { category: "Core Features", features: [
        "Multi-Branch System - Includes 1 free branch add-on (₹99 per extra branch thereafter)",
        "Promotions & Advertising Tool - Run hyperlocal ads inside Crevings",
        "Table & Booking Management - Manage dine-in reservations and waitlists",
        "Delivery, Takeaway & Dine-in Orders - 0% commission on all orders",
    ]},
    { category: "Smart Insights", features: [
        "AI-Powered Local Customer Insights - Track loyal buyers, peak hours and trending items",
        "Advanced Menu Analytics - Optimize dishes and pricing",
    ]},
    { category: "Finance & Operations", features: [
        "Same-Day Withdrawal of payouts",
        "Inventory Management (coming soon)",
        "Digital POS - Connect with Crevings Digital POS for smooth billing",
        "Basic Accounting Reports - Daily/weekly sales and tax summary",
    ]},
    { category: "Growth & Support", features: [
        "Priority Human Call Support",
        "Branding Assistance - Menu design, packaging templates, logo placement",
        "Legal Support - Basic compliance and agreements",
        "Loyalty Program - Customers earn points automatically for repeat orders",
    ]}
];

const growthPerks = [
    { category: "Multi-Branch Advantage", features: [
        "Multi-Branch System - Includes 3 free branch add-ons (₹99 per extra branch thereafter)",
    ]},
    { category: "Team & Workflow Tools", features: [
        "Work Assignment (coming soon) - Assign and track staff tasks",
        "Staff Management (coming soon) - Manage shifts, salaries and performance",
    ]},
    { category: "Advanced Finance Reporting", features: [
        "Advanced Accounting Dashboard - GST-ready reports, expense tracking",
    ]},
    { category: "Extra Growth Boost", features: [
        "Featured Listing in App - Priority placement in local searches",
        "Hyperlocal Social Media Push - 1 monthly promo post designed by Crevings team",
        "Our team assists organizations in enhancing customer engagement through effective offline marketing strategies",
        "Customer Feedback Dashboard - Ratings, reviews and AI-driven sentiment analysis",
    ]}
];

const PlanFeature = ({ feature }: { feature: string }) => (
    <li className="flex items-start gap-3">
        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
        <span className="text-muted-foreground">{feature}</span>
    </li>
);

export default function SubscriptionPlans() {
  return (
    <section id="subscription" className="py-12 sm:py-20 lg:py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Flexible Plans for Every Stage
          </h2>
           <p className="mt-4 text-lg text-muted-foreground">
            Whether you're just starting or ready to scale, we have a plan that fits your needs.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Starter Plan */}
            <Card className="h-full flex flex-col">
                <CardHeader className="p-6 pb-0">
                    <CardTitle className="text-2xl font-headline text-primary">Starter Plan</CardTitle>
                    <CardDescription>For single restaurants, cafés, home chefs, and cloud kitchens starting digital growth.</CardDescription>
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
                                <h4 className="font-semibold mb-3">{perkCategory.category}</h4>
                                <ul className="space-y-3">
                                    {perkCategory.features.map((feature, fIndex) => (
                                        <PlanFeature key={fIndex} feature={feature} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="h-full flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 relative">
                 <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 animate-glow" variant="default">
                    <Star className="h-4 w-4 mr-2" />
                    Most Popular
                </Badge>
                <CardHeader className="p-6 pb-0">
                    <CardTitle className="text-2xl font-headline text-primary">Growth Plan</CardTitle>
                    <CardDescription>For multi-outlet brands, franchises, and scaling kitchens.</CardDescription>
                     <div className="flex items-baseline gap-2 pt-4">
                        <span className="text-5xl font-bold font-headline">₹499</span>
                        <span className="text-muted-foreground">/month</span>
                    </div>
                     <p className="text-sm text-muted-foreground mt-1">+ 18% GST</p>
                    <p className="text-sm font-semibold pt-2 text-primary">Everything in Starter ₹399 Plan PLUS:</p>
                </CardHeader>
                <CardContent className="p-6 pt-6 flex-1 flex flex-col">
                   <div className="space-y-6">
                        {growthPerks.map((perkCategory, index) => (
                            <div key={index}>
                                <h4 className="font-semibold mb-3">{perkCategory.category}</h4>
                                <ul className="space-y-3">
                                    {perkCategory.features.map((feature, fIndex) => (
                                        <PlanFeature key={fIndex} feature={feature} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
