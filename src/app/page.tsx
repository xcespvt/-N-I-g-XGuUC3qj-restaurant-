'use client';

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { usePost } from "@/hooks/useApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  User,
  ArrowUpRight,
  Flame,
  Mail,
  ChevronDown,
  MessageSquare,
  Phone,
  ArrowLeft,
  Lock,
  ShieldCheck,
  KeyRound,
  Package,
  Sandwich,
  Pizza,
  ShoppingBag,
  Coffee,
  IceCream,
  Bike,
  Zap,
  TrendingUp,
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  QrCode,
  Shield,
  Store,
  Tag,
  Utensils,
} from "lucide-react";
import { motion } from "framer-motion";

type LoginStep =
  | "hero"
  | "input"
  | "otp"
  | "email-method"
  | "email-otp-input"
  | "email-otp-verify"
  | "email-password-step1"
  | "email-password-step2"
  | "welcome";

const WelcomeScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onLogin();
      }, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLogin]);

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-[#1E90FF] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isFadingOut
          ? "opacity-0 scale-105 blur-sm"
          : "opacity-100 animate-in fade-in duration-700"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-1000">
        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-[#1E90FF] shadow-2xl shadow-blue-900/30">
          <Flame size={48} fill="currentColor" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
            Welcome back
          </h1>
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.4em]">
            Securing your connection
          </p>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>
    </div>
  );
};

function LoginContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [view, setView] = useState<LoginStep>("hero");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  
  // Existing API Mutations
  const requestOtpMutation = usePost<any, { email: string }>("/api/auth/request-otp", undefined, { credentials: "omit" });
  const verifyOtpMutation = usePost<any, { email: string; otp?: string; password?: string }>("/api/auth/verify-otp", undefined, { credentials: "include" });

  const [isVerifying, setIsVerifying] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const onLogin = () => {
    router.push("/dashboard");
  };

  const onNavigateToOnboarding = () => {
    router.push("/register");
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    setOtpError(false);

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Integration: Send OTP via Email
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVerifying(true);
      await requestOtpMutation.mutateAsync({ email });
      setView("email-otp-verify");
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
      setIsVerifying(false);
    }
  };

  // Integration: Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;

    setIsVerifying(true);
    try {
      await verifyOtpMutation.mutateAsync({ email, otp: enteredOtp });
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setView("welcome");
    } catch (err: any) {
      setOtpError(true);
      toast({
        title: "Invalid OTP",
        description: err?.message || "OTP verification failed.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Integration: Password Login
  const handlePasswordLogin = async () => {
    if (!email || password.length < 6) return;

    setIsVerifying(true);
    try {
      await verifyOtpMutation.mutateAsync({ email, password });
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setView("welcome");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err?.message || "Incorrect email or password.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  

  if (view === "welcome") return <WelcomeScreen onLogin={onLogin} />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
    
      <div className="fixed inset-0 z-[500] bg-white/40 lg:bg-slate-50/40 backdrop-blur-[2px] flex flex-col lg:flex-row font-sans overflow-hidden lg:items-center lg:justify-center">
      {/* Desktop Left Side - Brand & Features */}
      
      <div className="hidden lg:flex lg:flex-1 lg:h-full lg:bg-[#1E90FF] lg:relative lg:flex-col lg:p-16 lg:justify-center lg:overflow-hidden">
        <div className="relative z-10 space-y-12 max-w-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1E90FF] shadow-lg">
              <Flame size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Crevings
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              One platform to rule your entire{" "}
              Restaurant.
            </h2>
            <p className="text-xl text-blue-50/80 leading-relaxed font-medium">
              Join 5,000+ restaurants scaling their business with AI-powered
              analytics, seamless order management, and digital marketing tools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Zap size={20} className="text-yellow-400" />
                <span>Quick Setup</span>
              </div>
              <p className="text-blue-100/60 text-sm">
                Go live in under 10 minutes with our easy onboarding.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck size={20} className="text-emerald-400" />
                <span>Secure Payments</span>
              </div>
              <p className="text-blue-100/60 text-sm">
                Enterprise-grade security for all your transactions.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <TrendingUp size={20} className="text-sky-400" />
                <span>Growth Tools</span>
              </div>
              <p className="text-blue-100/60 text-sm">
                Advanced marketing and customer relationship tools.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <Package size={20} className="text-rose-400" />
                <span>POS Ready</span>
              </div>
              <p className="text-blue-100/60 text-sm">
                Full offline & online order synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        <div className="absolute top-1/2 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Main Login Container */}
      <div className="flex-1 flex flex-col bg-white/90 lg:max-w-[500px] lg:h-full lg:shadow-2xl lg:relative lg:z-20 backdrop-blur-sm shadow-xl border-l border-slate-200/50">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-700 lg:px-12">
          <div className="w-16 h-16 bg-[#1E90FF] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 mb-6 lg:mb-8">
            <Flame size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4 lg:text-5xl lg:mb-6">
            The operating system for your{" "}
            <span className="text-[#1E90FF]">Restaurant</span>
          </h1>
          <p className="text-[16px] text-slate-500 font-medium lg:text-lg lg:leading-relaxed">
            Manage orders, track growth, and scale your business from one
            dashboard.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="px-6 pb-8 lg:px-12 lg:pb-12">
          {view === "hero" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <button
                onClick={() => setView("input")}
                className="w-full h-14 bg-[#1E90FF] text-white rounded-xl font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shadow-sm hover:brightness-110"
              >
                Login
              </button>

              <button
                onClick={onNavigateToOnboarding}
                className="w-full h-14 bg-white text-slate-900 border-[1.5px] border-slate-900 rounded-xl font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all hover:bg-slate-50"
              >
                Become a Partner
              </button>
            </div>
          )}

          {view === "input" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("hero")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Login
                </h3>
              </div>

              <div className="flex items-center h-14 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-slate-50 focus-within:bg-white transition-all">
                <div className="flex items-center gap-2 px-4 border-r border-slate-200 bg-slate-50 h-full">
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    alt="India"
                    className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                  />
                  <span className="text-[15px] font-medium text-slate-700">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  maxLength={10}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 px-4 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("hero")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={() => phoneNumber.length === 10 && setView("otp")}
                  disabled={phoneNumber.length < 10}
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${phoneNumber.length === 10 ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                >
                  Continue
                </button>
              </div>

              <button
                onClick={() => setView("email-method")}
                className="w-full h-14 bg-white text-slate-700 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all border border-slate-200 hover:bg-slate-50"
              >
                <Mail size={18} className="text-slate-500" /> Login with Email
              </button>
            </div>
          )}

          {view === "otp" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("input")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Verify Number
                </h3>
              </div>

              <p className="text-[14px] text-slate-500 mb-4">
                Code sent to{" "}
                <span className="font-bold text-slate-900">
                  +91 {phoneNumber}
                </span>
              </p>

              <div className="flex justify-between gap-2 mb-4 lg:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-[43px] h-[50px] lg:w-[54px] lg:h-[60px] text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                        otpError
                        ? "border-rose-300 bg-rose-50 text-rose-600"
                        : digit
                          ? "border-[#1E90FF] bg-blue-50 text-[#1E90FF]"
                          : "border-slate-200 bg-slate-50 focus:border-[#1E90FF] focus:bg-white"
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-rose-500 text-[13px] font-medium mb-4 animate-in fade-in">
                  Invalid code. Please try again.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setView("input")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={otp.join("").length < 6 || isVerifying}
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                    otp.join("").length === 6 && !isVerifying
                      ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isVerifying ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              <div className="flex gap-3 w-full">
                <button className="flex-1 h-12 rounded-xl font-medium text-[14px] text-slate-700 bg-slate-50 border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-100">
                  <Phone size={16} /> Resend SMS
                </button>
                <button className="flex-1 h-12 rounded-xl font-medium text-[14px] text-emerald-700 bg-emerald-50 border border-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-emerald-100">
                  <MessageSquare size={16} /> WhatsApp
                </button>
              </div>
            </div>
          )}

          {view === "email-method" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("input")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Email Login
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setView("email-otp-input")}
                  className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-[#1E90FF] hover:bg-blue-50/50 transition-all active:scale-[0.98] text-left lg:p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1E90FF] flex items-center justify-center shrink-0 lg:w-14 lg:h-14">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900">
                      Login with OTP
                    </p>
                    <p className="text-[12px] text-slate-500">
                      Secure 6-digit code sent to your email
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setView("email-password-step1")}
                  className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-[#1E90FF] hover:bg-blue-50/50 transition-all active:scale-[0.98] text-left lg:p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 lg:w-14 lg:h-14">
                    <KeyRound size={24} />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-slate-900">
                      Login with Password
                    </p>
                    <p className="text-[12px] text-slate-500">
                      Standard password for established accounts
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {view === "email-otp-input" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("email-method")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Email OTP
                </h3>
              </div>

              <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-slate-50 focus-within:bg-white transition-all">
                <Mail size={20} className="text-slate-400 mr-3" />
                <input
                  type="email"
                  placeholder="restaurant@crevings.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("email-method")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || isVerifying}
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !isVerifying
                      ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                   {isVerifying ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          )}

          {view === "email-otp-verify" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("email-otp-input")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Verify Email
                </h3>
              </div>

              <p className="text-[14px] text-slate-500 mb-4">
                Code sent to{" "}
                <span className="font-bold text-slate-900">{email}</span>
              </p>

              <div className="flex justify-between gap-2 mb-4 lg:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputs.current[index] = el)}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-[43px] h-[50px] lg:w-[54px] lg:h-[60px] text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                        otpError
                        ? "border-rose-300 bg-rose-50 text-rose-600"
                        : digit
                          ? "border-[#1E90FF] bg-blue-50 text-[#1E90FF]"
                          : "border-slate-200 bg-slate-50 focus:border-[#1E90FF] focus:bg-white"
                    }`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-rose-500 text-[13px] font-medium mb-4 animate-in fade-in">
                  Invalid code. Please try again.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setView("email-otp-input")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={otp.join("").length < 6 || isVerifying}
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                    otp.join("").length === 6 && !isVerifying
                      ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isVerifying ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              <button onClick={handleSendOtp} className="w-full h-12 rounded-xl font-medium text-[14px] text-slate-700 bg-slate-50 border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-100">
                <Mail size={16} /> Resend Email
              </button>
            </div>
          )}

          {view === "email-password-step1" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("email-method")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Email Login
                </h3>
              </div>

              <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-slate-50 focus-within:bg-white transition-all">
                <Mail size={20} className="text-slate-400 mr-3" />
                <input
                  type="email"
                  placeholder="restaurant@crevings.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("email-method")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={() => setView("email-password-step2")}
                  disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {view === "email-password-step2" && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center mb-2">
                <button
                  onClick={() => setView("email-password-step1")}
                  className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-[20px] font-bold text-slate-900 ml-2">
                  Enter Password
                </h3>
              </div>

              <p className="text-[14px] text-slate-500 mb-4">
                Signing in as{" "}
                <span className="font-bold text-slate-900">{email}</span>
              </p>

              <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-slate-50 focus-within:bg-white transition-all">
                <Lock size={20} className="text-slate-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[13px] font-semibold text-[#1E90FF] ml-3"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("email-password-step1")}
                  className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={handlePasswordLogin}
                  disabled={
                    !email ||
                    password.length < 6 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                    isVerifying
                  }
                  className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                    email &&
                    password.length >= 6 &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                    !isVerifying
                      ? "bg-[#1E90FF] text-white active:scale-[0.98] hover:brightness-110"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isVerifying ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6 lg:mt-12">
            <p className="text-[12px] text-slate-500 leading-relaxed">
              By continuing, you agree to our
              <br />
              <Link
                href="#"
                className="text-[#1E90FF] hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-[#1E90FF] hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function LoginPage() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LoginContent />
    </QueryClientProvider>
  );
}
