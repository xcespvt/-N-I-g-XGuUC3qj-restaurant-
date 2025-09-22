
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, Search, LifeBuoy, Mail, Phone, BookOpen, Users, MessageSquare } from "lucide-react"

const faqItems = [
  {
    question: "How do I update my menu?",
    answer: "You can update your menu by navigating to the 'Menu' section in the sidebar. From there, you can add new items, edit existing ones, or change their availability.",
    keywords: "menu, update, item, dish, price",
  },
  {
    question: "How do I view my earnings?",
    answer: "The 'Earnings' page provides a detailed breakdown of your total earnings, transaction history, and payouts. You can filter by date range to see specific periods.",
    keywords: "earnings, payout, payment, money, revenue, sales",
  },
  {
    question: "How can I pause accepting orders?",
    answer: "On the 'Dashboard', you can find the 'Restaurant Status' card. Simply toggle the 'Restaurant Online' switch to stop accepting new orders.",
    keywords: "pause, stop, online, offline, orders, accepting",
  },
  {
    question: "Can I manage multiple branches?",
    answer: "Yes, our Pro plan supports multi-branch management. You can add and manage all your branches from the 'Branches' section and switch between them using the selector in the header.",
    keywords: "branch, multiple, location, pro plan",
  },
  {
    question: "How do payouts work and when do I get paid?",
    answer: "Payouts are processed automatically every Tuesday for the previous week's sales (Monday-Sunday). The amount will be credited to your registered bank account within 2-3 business days. You can track your payout history in the 'Earnings' tab.",
    keywords: "payout, payment, bank, transfer, when, earnings",
  },
  {
    question: "What should I do if a customer complains about an order?",
    answer: "You can view customer feedback and ratings in the 'Feedback' section. We recommend replying to the customer's review promptly to address their concerns. For critical issues, you can contact our support team for assistance.",
    keywords: "customer, complaint, feedback, review, bad, issue",
  },
  {
    question: "How do I manage staff access and permissions?",
    answer: "The 'Staff' page allows you to add team members and assign roles. Each role has specific permissions, which you can customize to control access to different sections of the partner hub.",
    keywords: "staff, user, access, permission, role, team",
  },
  {
    question: "Can I see how well my promotions are performing?",
    answer: "Yes, the 'Promotions' page (a Pro feature) includes an 'Analytics' tab where you can track views, clicks, conversions, and revenue generated from your promotional campaigns.",
    keywords: "promotion, analytics, performance, ads, offers, track",
  },
]

export default function HelpSupportPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) {
      return faqItems
    }
    return faqItems.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center pt-0 pb-4">
        <h1 className="text-3xl font-bold md:text-4xl flex items-center justify-center gap-3">
          How can we help?
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Find answers to your questions, explore articles, and get in touch with our support team.
        </p>
        <div className="relative w-full max-w-lg mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for help articles..." 
            className="pl-12 h-12 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {filteredFaqs.length > 0 ? filteredFaqs.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base text-left">{item.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        )) : (
                          <div className="text-center py-10 text-muted-foreground">
                            <p>No FAQs found for "{searchTerm}"</p>
                          </div>
                        )}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>Can't find an answer? We're here to help.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start h-14 text-base">
                        <a href="mailto:support@xces.com">
                            <Mail className="h-5 w-5 mr-3"/>
                            Email Support
                        </a>
                    </Button>
                     <Button asChild variant="outline" className="w-full justify-start h-14 text-base">
                        <Link href="/chat">
                           <MessageSquare className="h-5 w-5 mr-3"/>
                           Chat Support
                        </Link>
                    </Button>
                     <Button asChild variant="outline" className="w-full justify-start h-14 text-base">
                        <a href="tel:+911234567890">
                           <Phone className="h-5 w-5 mr-3"/>
                           Call Us
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
