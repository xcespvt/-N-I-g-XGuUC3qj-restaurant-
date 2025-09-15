
'use client';

import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const SwishLogo = () => (
  <div className="flex items-baseline gap-3">
    <h1 className="text-4xl font-bold text-yellow-400">swish</h1>
    <p className="text-sm text-white/80">
      10-minute
      <br />
      food delivery
    </p>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      router.push('/home');
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-stone-500">
      <div className="flex-1 p-8 text-white relative flex flex-col justify-center">
        <div className="absolute top-8 left-8">
          <SwishLogo />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-extrabold text-yellow-400 leading-tight">
            FROM YOUR
            <br />
            NEXT~DOOR
            <br />
            kitchen
          </h2>
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 h-auto text-base font-bold shadow-lg">
            IN 10 MINS
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white rounded-t-3xl p-8 shadow-2xl"
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
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={10}
              className="pl-14 h-14 text-lg rounded-xl pr-20"
              disabled={isOtpSent}
            />
            {!isOtpSent && (
                <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 text-primary font-bold" onClick={handleSendOtp} disabled={phone.length !== 10}>OTP</Button>
            )}
          </div>
          
          {isOtpSent && (
              <div className="space-y-4 animate-in fade-in-50">
                   <Label>Enter 6-digit OTP</Label>
                   <div className="flex justify-between gap-2">
                       {otp.map((digit, index) => (
                           <Input
                               key={index}
                               ref={(el) => (inputRefs.current[index] = el)}
                               type="tel"
                               maxLength={1}
                               value={digit}
                               onChange={(e: ChangeEvent<HTMLInputElement>) => handleOtpChange(index, e.target.value)}
                               onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                               className="h-14 w-12 text-2xl text-center rounded-xl"
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

          <Button onClick={handleVerifyOtp} className="w-full h-14 text-lg" disabled={!isOtpSent || otp.join('').length !== 6}>
            Verify & Proceed
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By clicking "Continue" Privacy policy & Terms of Conditions apply
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
