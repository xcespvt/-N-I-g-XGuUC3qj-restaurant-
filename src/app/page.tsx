
"use client";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";

const CrevingsLogo = () => (
  <div className="flex items-center gap-2 text-2xl font-semibold">
    {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <UtensilsCrossed className="h-5 w-5" />
    </div>
    <span>Crevings</span> */}
    <img src="/Image/CREVINGS FULL LOGO.svg" alt="Crevings" className="h-10" />

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

  // New UI state for OTP/Password flows
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
    const str = typeof value === "string" ? value : String(value ?? "");
    if (isNaN(Number(str))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = str.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (str && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    setShowOtp(false);
    setShowPassword(false);
    setPassword("");
    setOtp(Array(6).fill(""));
    setIsOtpSent(false);
  };

  const handleOtpRequest = async () => {
    // Keep backend OTP integration intact
    await handleSendOtp();
    setShowOtp(true);
  };
  const handlePasswordRequest = () => {
    setShowPassword(true);
    setShowOtp(false);
  }

  const PASSWORD_LOGIN_URL = process.env.NEXT_PUBLIC_PASSWORD_LOGIN_URL;
  const handleLoginWithPassword = async () => {
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    if (!password) {
      toast({ title: "Missing password", description: "Please enter your password.", variant: "destructive" });
      return;
    }
    if (!PASSWORD_LOGIN_URL) {
      toast({
        variant: "destructive",
        title: "Password login not configured",
        description: "Set NEXT_PUBLIC_PASSWORD_LOGIN_URL to enable password login.",
      });
      return;
    }
    try {
      setVerifying(true);
      await apiClient<any>(PASSWORD_LOGIN_URL, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/dashboard");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err?.message || "Please check your credentials.", variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const getAction = () => {
    if (showOtp) return { text: "Verify OTP & Login", handler: handleVerifyOtp };
    if (showPassword) return { text: "Login", handler: handleLoginWithPassword };
    return { text: "Login with OTP", handler: handleOtpRequest };
  };
  const { text: buttonText, handler: buttonHandler } = getAction();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="p-6 pt-8 w-full max-w-sm mx-auto">
        <div className="flex items-center mb-6">
          {(showOtp || showPassword) && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-2xl font-bold text-left">Log in or sign up</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              disabled={showOtp}
            />
          </div>

          {showOtp && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="otp-1">Enter 6-digit OTP</Label>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleOtpRequest}>Resend OTP</Button>
              </div>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={el => { if (el) inputRefs.current[index] = el; }}
                    className="w-10 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
            </div>
          )}

          {showPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                  onClick={() => setIsPasswordVisible(prev => !prev)}
                >
                  {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={buttonHandler}
            className="w-full h-12 text-base"
            disabled={!email}
          >
            {buttonText}
          </Button>
        </div>

        {!showOtp && !showPassword && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 text-base text-green-600" onClick={handlePasswordRequest}>
              Login with password
            </Button>
          </>
        )}


        <p className="text-center text-xs text-muted-foreground mt-8 px-4">
          By login you authorise us to send notifications via SMS, Email, RCS and others as per&nbsp;
          <Link href="#" className="underline hover:text-primary">
            Terms of Service
          </Link>{" "}
          &amp;{" "}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
