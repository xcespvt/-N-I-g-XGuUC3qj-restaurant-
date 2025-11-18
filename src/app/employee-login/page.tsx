
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joiningCode, setJoiningCode] = useState("");

  const handleLogin = () => {
    if (name && phone.length >= 10 && joiningCode) {
      toast({
        title: "Login Successful",
        description: `Welcome, ${name}!`,
      });
      router.push("/dashboard");
    } else {
       toast({
        title: "Invalid Details",
        description: "Please fill in all the fields correctly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-6">
          {/* <div className="flex items-center gap-2 text-2xl font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span>Crevings</span>
          </div> */}
          <img src="/Image/CREVINGS FULL LOGO.svg" alt="Crevings" className="h-10" />
        </div>
        
        <p className="text-center font-semibold text-xl mb-2">
            Employee Login
        </p>
        <p className="text-center text-muted-foreground mb-6">
            Enter your details to access the dashboard.
        </p>

        <Card className="shadow-lg">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="employee-name">Name</Label>
                        <Input id="employee-name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                     <div>
                        <Label htmlFor="employee-phone">Phone Number</Label>
                        <div className="flex gap-2">
                             <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-semibold text-muted-foreground">
                                +91
                             </div>
                            <Input
                                id="employee-phone"
                                type="tel"
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                className="flex-1"
                            />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="joining-code">Restaurant Joining Code</Label>
                        <Input id="joining-code" placeholder="Enter code provided by manager" value={joiningCode} onChange={(e) => setJoiningCode(e.target.value)} />
                    </div>
                    <Button className="w-full" onClick={handleLogin}>Login</Button>
                </div>
            </CardContent>
        </Card>
         <Button asChild variant="link" className="mt-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to main login
            </Link>
        </Button>
      </div>
    </div>
  )
}
