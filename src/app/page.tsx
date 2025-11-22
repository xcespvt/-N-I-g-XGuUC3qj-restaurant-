"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ---------------------------------------------------------
  // 🔹 SEND OTP API
  // ---------------------------------------------------------
  const handleOtpRequest = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingOtp(true);

      await apiClient<any>("https://backend.crevings.com/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setShowOtp(true);
      setShowPassword(false);

      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email address.",
      });

    } catch (err: any) {
      toast({
        title: "Failed to send OTP",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  // ---------------------------------------------------------
  // 🔹 VERIFY OTP API
  // ---------------------------------------------------------
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    try {
      setVerifyingOtp(true);

      await apiClient<any>("https://backend.crevings.com/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      router.push("/dashboard");

    } catch (err: any) {
      toast({
        title: "Invalid OTP",
        description: err?.message || "OTP verification failed.",
        variant: "destructive",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ---------------------------------------------------------
  // 🔹 PASSWORD LOGIN API
  // ---------------------------------------------------------
  const handlePasswordLogin = async () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoggingIn(true);

      await apiClient<any>("https://backend.crevings.com/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      router.push("/dashboard");

    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || "Incorrect email or password.",
        variant: "destructive",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  // ---------------------------------------------------------
  // 🔹 MAIN LOGIN ACTION (OTP or Password)
  // ---------------------------------------------------------
  const handleLogin = () => {
    if (showOtp) return handleVerifyOtp();
    if (showPassword) return handlePasswordLogin();
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    setShowOtp(false);
    setShowPassword(false);
    setPassword("");
    setOtp(Array(6).fill(""));
  };

  const getAction = () => {
    if (showOtp) return { text: verifyingOtp ? "Verifying..." : "Verify OTP & Login", handler: handleLogin };
    if (showPassword) return { text: loggingIn ? "Logging in..." : "Login", handler: handleLogin };
    return { text: sendingOtp ? "Sending OTP..." : "Login with OTP", handler: handleOtpRequest };
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
          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              disabled={showOtp || showPassword}
            />
          </div>

          {/* OTP INPUT */}
          {showOtp && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Enter 6-digit OTP</Label>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleOtpRequest}>
                  Resend OTP
                </Button>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={el => { if (el) inputRefs.current[index] = el; return undefined; }}
                    className="w-10 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
            </div>
          )}

          {/* PASSWORD INPUT */}
          {showPassword && (
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
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

          {/* MAIN BUTTON */}
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
                <span className="bg-white px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12 text-base text-green-600" onClick={() => {
              setShowPassword(true);
              setShowOtp(false);
            }}>
              Login with password
            </Button>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 px-4">
          By login you authorise us to send notifications via SMS, Email, RCS and others as per{" "}
          <Link href="#" className="underline hover:text-primary">Terms of Service</Link> &nbsp;&amp;&nbsp;
          <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
        </p>

      </div>
    </div>
  );
}
