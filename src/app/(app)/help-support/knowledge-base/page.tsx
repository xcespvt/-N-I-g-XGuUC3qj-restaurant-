
"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Search, PlayCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const videoCategories = [
  {
    category: "Getting Started",
    videos: [
      {
        title: "How to Onboard Your Restaurant",
        description: "A complete walkthrough of the onboarding process, from KYC to menu setup.",
        videoId: "dQw4w9WgXcQ",
      },
      {
        title: "Setting Up Your First Menu",
        description: "A step-by-step guide to adding categories and menu items.",
        videoId: "dQw4w9WgXcQ",
      },
      {
        title: "Understanding the Dashboard",
        description: "A walkthrough of the main dashboard and what each metric means.",
        videoId: "dQw4w9WgXcQ",
      },
    ],
  },
  {
    category: "Order Management",
    videos: [
      {
        title: "Accepting & Preparing Orders",
        description: "Best practices for managing incoming orders for a smooth experience.",
        videoId: "dQw4w9WgXcQ",
      },
      {
        title: "Handling Dine-In QR Orders",
        description: "Learn how to manage orders placed via QR codes at the table.",
        videoId: "dQw4w9WgXcQ",
      },
      {
        title: "Managing Delivery & Takeaway",
        description: "Effectively handle orders for delivery and takeaway customers.",
        videoId: "dQw4w9WgXcQ",
      },
    ],
  },
  {
    category: "Payments & Earnings",
    videos: [
      {
        title: "Understanding Your Payouts",
        description: "A detailed breakdown of our commission structure and payout cycles.",
        videoId: "dQw4w9WgXcQ",
      },
      {
        title: "How to Read Your Earnings Report",
        description: "A guide to reading the reports to track your financial performance.",
        videoId: "dQw4w9WgXcQ",
      },
    ],
  },
];

const VideoCard = ({ title, description, videoId }: { title: string, description: string, videoId: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="hover:border-primary transition-colors cursor-pointer group flex flex-col">
                    <CardHeader className="p-0">
                        <div className="aspect-video relative rounded-t-lg overflow-hidden">
                            <Image 
                                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                                alt={title}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlayCircle className="h-12 w-12 text-white/80" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                        <CardTitle className="text-base font-semibold">{title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-t-lg"
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6">
       <Link href="/help-support" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Help & Support
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8" /> Video Knowledge Base
        </h1>
        <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tutorials..." className="pl-9" />
        </div>
      </div>
      
      <div className="space-y-8">
        {videoCategories.map(category => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {category.videos.map(video => (
                 <VideoCard key={video.title} {...video} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
