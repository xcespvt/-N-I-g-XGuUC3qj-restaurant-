
"use client";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";

const CrevingsLogo = () => (
  <div className="flex items-center gap-2 text-2xl font-semibold">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <UtensilsCrossed className="h-5 w-5" />
    </div>
    <span>Crevings</span>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = (val: string) => /.+@.+\..+/.test(val);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    try {
      setSendingOtp(true);
      await apiClient<any>("https://backend.crevings.com/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setIsOtpSent(true);
      toast({ title: "OTP Sent", description: "Check your email for the code." });
    } catch (err: any) {
      toast({ title: "Failed to send OTP", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return;
    try {
      setVerifying(true);
      await apiClient<any>("https://backend.crevings.com/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: "Invalid OTP", description: err?.message || "Please check the code and try again.", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <CrevingsLogo />
        </div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl"
        >
            <div className="space-y-6">
            <h3 className="text-xl font-bold">Log in with your email</h3>
            <div className="relative">
                {/* Email input replaces phone */}
                <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg rounded-xl pr-20"
                disabled={isOtpSent}
                />
                {!isOtpSent && (
                <Button
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 text-primary font-bold"
                    onClick={handleSendOtp}
                    disabled={!isValidEmail(email) || sendingOtp}
                >
                    {sendingOtp ? "Sending..." : "OTP"}
                </Button>
                )}
            </div>

            {isOtpSent && (
                <div className="space-y-4 animate-in fade-in-50">
                <Label>Enter 6-digit OTP</Label>
                <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                    <Input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                          inputRefs.current[index] = el;
                        }}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(index, e)
                        }
                        className="h-12 w-10 text-xl text-center rounded-lg"
                    />
                    ))}
                </div>
                </div>
            )}

            {!isOtpSent && (
                <p className="text-sm text-muted-foreground">
                We'll send a verification code to your email
                </p>
            )}

            <Button
                onClick={handleVerifyOtp}
                className="w-full h-14 text-lg"
                disabled={!isOtpSent || otp.join("").length !== 6 || verifying}
            >
                {verifying ? "Verifying..." : "Verify & Proceed"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
                By clicking "Continue" Privacy policy & Terms of Conditions apply
            </p>
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                href="/register"
                className="underline text-primary font-semibold"
                >
                Sign up
                </Link>
            </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
