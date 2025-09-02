
"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, Search, PlusCircle, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const forumThreads = [
  {
    id: 1,
    title: "Best way to manage inventory during peak hours?",
    author: "Raj's Kitchen",
    authorAvatar: "https://placehold.co/100x100.png",
    authorFallback: "RK",
    replies: 12,
    lastActivity: "2 hours ago",
    tags: ["Inventory", "Best Practices"],
  },
  {
    id: 2,
    title: "Effective promotion ideas for the upcoming festival season?",
    author: "Priya's Cafe",
    authorAvatar: "https://placehold.co/101x101.png",
    authorFallback: "PC",
    replies: 8,
    lastActivity: "5 hours ago",
    tags: ["Promotions", "Marketing"],
  },
  {
    id: 3,
    title: "Issue with payout calculation for last week",
    author: "The Burger Joint",
    authorAvatar: "https://placehold.co/102x102.png",
    authorFallback: "BJ",
    replies: 25,
    lastActivity: "1 day ago",
    tags: ["Payouts", "Support"],
  },
    {
    id: 4,
    title: "Tips for getting better food photos for the menu",
    author: "Sizzling Stars",
    authorAvatar: "https://placehold.co/103x103.png",
    authorFallback: "SS",
    replies: 18,
    lastActivity: "2 days ago",
    tags: ["Menu", "Photography"],
  },
   {
    id: 5,
    title: "How to handle negative feedback gracefully?",
    author: "Daily Bites",
    authorAvatar: "https://placehold.co/104x104.png",
    authorFallback: "DB",
    replies: 31,
    lastActivity: "3 days ago",
    tags: ["Feedback", "Customer Service"],
  },
];


export default function CommunityForumPage() {
    const { toast } = useToast();

    const handleCreatePost = () => {
        toast({
            title: "Feature coming soon!",
            description: "Creating new posts will be available in a future update.",
        });
    };

  return (
    <div className="flex flex-col gap-6">
       <Link href="/help-support" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Help & Support
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8" /> Community Forum
        </h1>
        <div className="flex items-center gap-2">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search forum..." className="pl-9" />
            </div>
            <Button onClick={handleCreatePost}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Create Post
            </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {forumThreads.map(thread => (
          <Card key={thread.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={thread.authorAvatar} alt={thread.author} />
                    <AvatarFallback>{thread.authorFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-base">{thread.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>by <strong>{thread.author}</strong></span>
                        <span>&bull;</span>
                        <span>Last activity {thread.lastActivity}</span>
                    </div>
                     <div className="flex gap-2 mt-2">
                        {thread.tags.map(tag => (
                           <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-5 w-5"/>
                    <span className="font-semibold text-lg">{thread.replies}</span>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
