"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SignUpForm from "@/components/signup-form";
import { UtensilsCrossed } from "lucide-react";

const CrevingsLogo = () => (
  <div className="flex items-center gap-2 text-2xl font-semibold text-white">
    {/* <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
        <UtensilsCrossed className="h-5 w-5" />
    </div>
    <span>Crevings</span> */}
    <img src="/Image/CREVINGS FULL LOGO.Svg" alt="Crevings" className="h-8 md:h-10" />
  </div>
);

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="register-container">
      <div className="register-header">
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <CrevingsLogo />
        </div>
        
      </div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="register-form-container"
      >
        <SignUpForm />
      </motion.div>
    </div>
  );
}
