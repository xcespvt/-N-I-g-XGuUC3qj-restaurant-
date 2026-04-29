
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Bell, MessageCircle, MessageSquare, Mail, Phone, 
  Eye, EyeOff, Volume2, CheckCircle2, Printer, MapPin, Image as ImageIcon, Mic,
  FileText, RefreshCcw, Banknote, ShieldCheck, ChevronRight, Settings as SettingsIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { useToast } from "@/hooks/use-toast";

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
  >
    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const PasswordResetFlow = ({ onCancel }: { onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => p.length >= 8 && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    setStep(2);
    setTimer(30);
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email address."
    });
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join('').length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    setError('');
    setStep(3);
    toast({
      title: "OTP Verified",
      description: "You can now set your new password."
    });
  };

  const handleSavePassword = () => {
    if (!validatePassword(newPassword)) {
      setError('Password does not meet requirements');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password must match');
      return;
    }
    setError('');
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully."
    });
    onCancel();
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-slate-100">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 1 — Enter Email</p>
          <div>
            <input 
              type="email" 
              placeholder="Registered Email Address" 
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <button onClick={handleEmailSubmit} className="w-full h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
          <button onClick={onCancel} className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 2 — OTP Verification</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input 
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={e => { handleOtpChange(e.target.value, i); setError(''); }}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-10 sm:w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleVerifyOtp} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Verify OTP</button>
            <button 
              disabled={timer > 0} 
              onClick={() => { setTimer(30); setOtp(['','','','','','']); setError(''); }}
              className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
          <button onClick={onCancel} className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 3 — Create New Password</p>
          <div className="space-y-3">
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); }}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className={newPassword.length >= 8 ? 'text-emerald-500' : ''}>• Minimum 8 characters</p>
              <p className={/\d/.test(newPassword) ? 'text-emerald-500' : ''}>• At least 1 number</p>
              <p className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-emerald-500' : ''}>• At least 1 special character</p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSavePassword} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Save Password</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChangeAccountFlow = ({ type, currentVal, onCancel, onUpdate }: { type: 'Email' | 'Phone Number', currentVal: string, onCancel: () => void, onUpdate: (val: string) => void }) => {
  const [step, setStep] = useState(1);
  const [oldVal, setOldVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newVal, setNewVal] = useState('');
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^\d{10}$/.test(p.replace(/\D/g, ''));

  const handleStep1 = () => {
    if (type === 'Email' && !validateEmail(oldVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(oldVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    if (oldVal !== currentVal) {
      setError(`Does not match registered ${type.toLowerCase()}`); return;
    }
    setError(''); setStep(2);
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to your registered ${type.toLowerCase()}.`
    });
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleStep2 = () => {
    if (otp.join('').length !== 6) {
      setError('OTP must be 6 digits'); return;
    }
    setError(''); setStep(3);
    toast({
      title: "OTP Verified",
      description: `Please enter your new ${type.toLowerCase()}.`
    });
  };

  const handleStep3 = () => {
    if (type === 'Email' && !validateEmail(newVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(newVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    setError(''); setStep(4);
  };

  const handleSave = () => {
    onUpdate(newVal);
    toast({
      title: "Success",
      description: `${type} updated successfully.`
    });
    onCancel();
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-slate-100">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 1 — Enter registered {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`Registered ${type}`} 
            value={oldVal}
            onChange={e => { setOldVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep1} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 2 — OTP Verification</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input 
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={e => { handleOtpChange(e.target.value, i); setError(''); }}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-10 sm:w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep2} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Verify OTP</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 3 — Enter new {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`New ${type}`} 
            value={newVal}
            onChange={e => { setNewVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep3} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 4 — Save changes</p>
          <p className="text-sm text-slate-600">New {type.toLowerCase()}: <span className="font-semibold text-slate-900">{newVal}</span></p>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Save Changes</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const { notificationSettings, updateNotificationSetting } = useAppStore();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    push: true,
    whatsapp: true,
    sms: true,
    email: true,
    calls: true,
    criticalSound: true,
    autoAccept: false,
    cloudPrinting: true,
  });

  const [permissions, setPermissions] = useState({
    location: false,
    media: false,
    mic: false,
  });

  const [accountInfo, setAccountInfo] = useState({
    email: "owner@example.com",
    phone: "9876543210"
  });

  const [showPasswordFlow, setShowPasswordFlow] = useState(false);
  const [activeAccountFlow, setActiveAccountFlow] = useState<'Email' | 'Phone Number' | null>(null);

  // Initialize permission states from browser
  useEffect(() => {
    const checkStatus = async () => {
      if ("Notification" in window) {
        setSettings(p => ({ ...p, push: Notification.permission === 'granted' }));
      }

      const checkPermissionApi = async (name: string, key: string) => {
        try {
          // @ts-ignore
          const status = await navigator.permissions.query({ name: name as any });
          // @ts-ignore
          setPermissions(p => ({ ...p, [key]: status.state === 'granted' }));
          status.onchange = () => {
            // @ts-ignore
            setPermissions(p => ({ ...p, [key]: status.state === 'granted' }));
          };
        } catch (e) {
          console.log(`${name} permission query not supported`);
        }
      };

      await checkPermissionApi('geolocation', 'location');
      await checkPermissionApi('camera', 'media');
      await checkPermissionApi('microphone', 'mic');
    };

    checkStatus();
  }, []);

  const toggleSetting = async (key: keyof typeof settings) => {
    if (key === 'push' && !settings.push) {
      if (!("Notification" in window)) {
        toast({ title: "Error", description: "This browser does not support notifications", variant: "destructive" });
        return;
      }
      const result = await Notification.requestPermission();
      setSettings(p => ({ ...p, push: result === 'granted' }));
      return;
    }
    setSettings(p => ({ ...p, [key]: !p[key] }));
  };

  const togglePermission = async (key: keyof typeof permissions) => {
    if (permissions[key]) {
      toast({ title: "Info", description: `To disable ${key} access, please use your browser site settings.` });
      return;
    }

    try {
      if (key === 'location') {
        navigator.geolocation.getCurrentPosition(
          () => setPermissions(p => ({ ...p, location: true })),
          (err) => {
            console.error(err);
            setPermissions(p => ({ ...p, location: false }));
            toast({ title: "Error", description: "Location access denied.", variant: "destructive" });
          }
        );
      } else if (key === 'media') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissions(p => ({ ...p, media: true }));
      } else if (key === 'mic') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissions(p => ({ ...p, mic: true }));
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: `Could not request ${key} permission.`, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col -m-6">
      {/* Page Header */}
      <div className="h-[56px] bg-white border-b border-slate-100 flex items-center px-4 shrink-0 sticky top-0 z-20">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-[14px] pb-12 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:p-8 lg:max-w-5xl lg:mx-auto lg:w-full">
        {/* 1. Notifications Permissions Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Notification</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Push Notifications</span>
              </div>
              <Toggle checked={settings.push} onChange={() => toggleSetting('push')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">WhatsApp Notifications</span>
              </div>
              <Toggle checked={settings.whatsapp} onChange={() => toggleSetting('whatsapp')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">SMS Notifications</span>
              </div>
              <Toggle checked={settings.sms} onChange={() => toggleSetting('sms')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
              </div>
              <Toggle checked={settings.email} onChange={() => toggleSetting('email')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Call Alerts</span>
              </div>
              <Toggle checked={settings.calls} onChange={() => toggleSetting('calls')} />
            </div>
          </div>
        </div>

        {/* 2. Kitchen Workflow Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Kitchen Workflow</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Critical Sound</span>
              </div>
              <Toggle checked={settings.criticalSound} onChange={() => toggleSetting('criticalSound')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Auto-Accept Mode</span>
              </div>
              <Toggle checked={settings.autoAccept} onChange={() => toggleSetting('autoAccept')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Cloud Printing</span>
              </div>
              <Toggle checked={settings.cloudPrinting} onChange={() => toggleSetting('cloudPrinting')} />
            </div>
          </div>
        </div>

        {/* 3. Device Permissions Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">App Permissions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Location Access</span>
              </div>
              <Toggle checked={permissions.location} onChange={() => togglePermission('location')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Media Access</span>
              </div>
              <Toggle checked={permissions.media} onChange={() => togglePermission('media')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Microphone Access</span>
              </div>
              <Toggle checked={permissions.mic} onChange={() => togglePermission('mic')} />
            </div>
          </div>
        </div>

        {/* 4. Password Management Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Password</h2>
          {!showPasswordFlow ? (
            <button 
              onClick={() => setShowPasswordFlow(true)}
              className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all"
            >
              Forgot Password
            </button>
          ) : (
            <PasswordResetFlow onCancel={() => setShowPasswordFlow(false)} />
          )}
        </div>

        {/* 5. Account Information Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="overflow-hidden">
                <p className="text-xs text-slate-500 mb-0.5">Registered Email</p>
                <p className="text-sm font-medium text-slate-900 truncate">{accountInfo.email}</p>
              </div>
              <button 
                onClick={() => setActiveAccountFlow(activeAccountFlow === 'Email' ? null : 'Email')}
                className="px-4 py-2 h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all shrink-0 ml-4"
              >
                Change
              </button>
            </div>
            {activeAccountFlow === 'Email' && (
              <ChangeAccountFlow 
                type="Email" 
                currentVal={accountInfo.email} 
                onCancel={() => setActiveAccountFlow(null)} 
                onUpdate={(val) => setAccountInfo(prev => ({ ...prev, email: val }))}
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Registered Phone Number</p>
                <p className="text-sm font-medium text-slate-900">{accountInfo.phone}</p>
              </div>
              <button 
                onClick={() => setActiveAccountFlow(activeAccountFlow === 'Phone Number' ? null : 'Phone Number')}
                className="px-4 py-2 h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all shrink-0 ml-4"
              >
                Change
              </button>
            </div>
            {activeAccountFlow === 'Phone Number' && (
              <ChangeAccountFlow 
                type="Phone Number" 
                currentVal={accountInfo.phone} 
                onCancel={() => setActiveAccountFlow(null)} 
                onUpdate={(val) => setAccountInfo(prev => ({ ...prev, phone: val }))}
              />
            )}
          </div>
        </div>

        {/* 6. Policies Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] h-full">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Policies</h2>
          <div className="space-y-4">
            <Link href="/terms" className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Terms and Conditions</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
            <Link href="/refund-policy" className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCcw size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Refund Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
            <Link href="/payout-policy" className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Payout Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
            <Link href="/privacy-policy" className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Privacy Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
