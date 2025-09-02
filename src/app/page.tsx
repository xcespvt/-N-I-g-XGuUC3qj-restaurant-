
"use client";

import { Suspense, lazy, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, ArrowRight, User, Building, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to +91 ${phone}`,
      });
      setStep(2);
    } else {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogin = () => {
    if (otp.length === 6) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } else {
       toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span>Crevings</span>
          </div>
        </div>
        
        <p className="text-center text-muted-foreground mb-6">
            Enter your phone number and we will send an OTP to continue
        </p>

        <Card className="shadow-lg">
            <CardContent className="p-6">
                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                             <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-semibold text-muted-foreground">
                                +91
                             </div>
                            <Input
                                type="tel"
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                className="flex-1"
                            />
                        </div>
                        <Button className="w-full" onClick={handleSendOtp}>Send OTP</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="______"
                          required
                          maxLength={6}
                          pattern="\d{6}"
                          className="tracking-[0.5em] text-center font-semibold text-lg h-12"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        />
                        <Button className="w-full" onClick={handleLogin}>Login</Button>
                        <Button variant="link" size="sm" className="w-full" onClick={() => setStep(1)}>
                            Back to phone number entry
                        </Button>
                    </div>
                )}

                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">OR</span>
                    </div>
                </div>

                <div className="space-y-3">
                     <Link href="/register" className="w-full block">
                        <Button variant="outline" className="w-full justify-center text-base h-12 text-primary border-primary hover:bg-primary/5 hover:text-primary">
                             <Building className="h-5 w-5 mr-3"/> New Restaurant Signup
                        </Button>
                    </Link>
                    <Link href="/employee-login" className="w-full block">
                      <Button variant="ghost" className="w-full justify-center text-base h-12 text-primary hover:bg-primary/5 hover:text-primary">
                          <User className="h-5 w-5 mr-3"/> Employee Login
                      </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
