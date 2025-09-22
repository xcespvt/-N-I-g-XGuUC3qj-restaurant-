
"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const initialMessages = [
  { id: 1, sender: 'support', text: 'Hello! How can I help you today?', time: '10:30 AM' },
  { id: 2, sender: 'user', text: 'Hi, I have a question about my recent payout.', time: '10:31 AM' },
  { id: 3, sender: 'support', text: 'I can certainly help with that. Could you please provide the order ID?', time: '10:32 AM' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-muted/30">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto flex-1 flex flex-col shadow-lg">
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

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map(msg => (
                    <div key={msg.id} className={cn(
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
                    ))}
                </CardContent>

                <div className="p-3 border-t bg-background rounded-b-lg">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button" className="text-muted-foreground">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input 
                        placeholder="Type your message..." 
                        className="flex-1 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" className="rounded-full">
                        <Send className="h-5 w-5" />
                    </Button>
                    </form>
                </div>
            </Card>
        </div>
    </div>
  );
}
