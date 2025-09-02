
"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

export default function RelationshipManagerPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Your Relationship Manager</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Anjali Mehta</CardTitle>
                <CardDescription>Senior Partner Success Manager</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="portrait professional" />
                        <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground text-sm">
                        Get in touch with Anjali for any assistance with your account, performance insights, or strategic advice.
                    </p>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
                    <a href="tel:+911234567890">
                        <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Call
                        </Button>
                    </a>
                    <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">
                        <WhatsappIcon className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                    </a>
                    <a href="mailto:anjali.mehta@xces.com">
                        <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
