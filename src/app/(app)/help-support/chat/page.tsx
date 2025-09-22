
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const initialMessages = [
  { id: 1, sender: 'support', text: 'Hello! How can I help you today?', time: '10:30 AM' },
];

const suggestedQuestions = [
    "I have a question about my recent payout.",
    "How do I update my menu?",
    "Can you help me with a refund request?",
    "I'm having trouble with the app.",
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = (text?: string) => {
    const messageText = text || newMessage;
    if (messageText.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'user' as const,
        text: messageText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate a support reply
      setTimeout(() => {
        const reply = {
            id: messages.length + 2,
            sender: 'support' as const,
            text: 'Thank you for reaching out. An agent will be with you shortly.',
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, reply]);
      }, 1500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleVoiceNote = () => {
    toast({
        title: "Voice Notes Coming Soon!",
        description: "This feature will be available in a future update.",
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] sm:h-[calc(100vh-theme(spacing.28))]">
        <div className="flex items-center gap-3 p-3 border-b">
            <Link href="/help-support">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <div className="relative">
                <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>CS</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></div>
            </div>
            <div>
                <p className="font-semibold">Crevings Support</p>
                <p className="text-xs text-muted-foreground">Online</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, index) => (
            <div key={msg.id}>
                <div className={cn(
                    "flex items-end gap-2 max-w-[80%]",
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}>
                    <div className={cn(
                    "p-3 rounded-2xl",
                    msg.sender === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-background rounded-bl-none border"
                    )}>
                    <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground px-1">{msg.time}</p>
                </div>
                {index === 0 && (
                    <div className="mt-4 ml-12 space-y-2">
                        {suggestedQuestions.map((q, i) => (
                            <Button key={i} variant="outline" size="sm" className="h-auto py-1.5 px-3" onClick={() => handleSendMessage(q)}>
                                {q}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            ))}
        </div>

        <div className="p-3 border-t bg-background rounded-b-lg">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            <Button variant="ghost" size="icon" type="button" className="text-muted-foreground">
                <Paperclip className="h-5 w-5" />
            </Button>
            <Input 
                placeholder="Type your message..." 
                className="flex-1 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
             <Button variant="ghost" size="icon" type="button" className="text-muted-foreground" onClick={handleVoiceNote}>
                <Mic className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon" className="rounded-full">
                <Send className="h-5 w-5" />
            </Button>
            </form>
        </div>
    </div>
  );
}
