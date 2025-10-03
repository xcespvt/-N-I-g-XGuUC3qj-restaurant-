
"use client";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

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
  const [phone, setPhone] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      router.push("/dashboard");
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
            <h3 className="text-xl font-bold">Log in with your number</h3>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                +91 -
                </span>
                <Input
                id="phone"
                type="tel"
                placeholder=""
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={10}
                className="pl-14 h-14 text-lg rounded-xl pr-20"
                disabled={isOtpSent}
                />
                {!isOtpSent && (
                <Button
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 text-primary font-bold"
                    onClick={handleSendOtp}
                    disabled={phone.length !== 10}
                >
                    OTP
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
                We'll send a verification code here
                </p>
            )}

            <Button
                onClick={handleVerifyOtp}
                className="w-full h-14 text-lg"
                disabled={!isOtpSent || otp.join("").length !== 6}
            >
                Verify & Proceed
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
