"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, ChevronRight } from "lucide-react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface Props {
  onSuccess: (phone: string, result: ConfirmationResult) => void;
}

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

function setupRecaptcha() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      /* already cleared */
    }
    window.recaptchaVerifier = undefined;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        window.recaptchaVerifier = undefined;
      },
    }
  );
}

export default function PhoneStep({ onSuccess }: Props) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupRecaptcha();
    return () => {
      try {
        window.recaptchaVerifier?.clear();
      } catch {
        /* ignore */
      }
      window.recaptchaVerifier = undefined;
    };
  }, []);

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }

    const fullPhone = `+91${digits}`;
    setLoading(true);

    try {
      if (!window.recaptchaVerifier) setupRecaptcha();
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier!
      );
      toast.success("OTP sent!");
      onSuccess(fullPhone, result);
    } catch (err: unknown) {
      const error = err as { code?: string };
      let msg = "Failed to send OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number")
        msg = "Invalid phone number.";
      if (error.code === "auth/too-many-requests")
        msg = "Too many attempts. Try again later.";
      toast.error(msg);
      // Reset captcha so user can retry
      setupRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center px-4 py-8"
    >
      {/* Premium Card Container */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-[#EBEAE5] rounded-[24px] px-6 py-10 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.04)] relative overflow-hidden">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d723b]/60 to-transparent" />
        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-full bg-[#FCFBF9] border border-[#9d723b]/20 flex items-center justify-center mb-6 shadow-[0_4px_12px_-4px_rgba(157,114,59,0.15)]">
            <Phone className="w-5 h-5 text-[#9d723b]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1917] mb-2 tracking-tight">
            Enter your number
          </h2>
          <p className="text-[#605E5C] text-sm leading-relaxed">
            We'll send a one-time password to verify your identity.
          </p>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
            Mobile Number
          </label>
          <div className="flex items-center bg-[#FCFBF9] border border-[#EBEAE5] focus-within:border-[#9d723b] focus-within:ring-2 focus-within:ring-[#9d723b]/10 rounded-xl transition-all duration-200 overflow-hidden">
            <span className="px-4 py-4 text-[#9d723b] font-bold text-sm border-r border-[#EBEAE5] bg-[#F5F4F0] select-none shrink-0">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              className="flex-1 bg-transparent px-4 py-4 text-[#1C1917] text-sm placeholder-[#C1BFBC] outline-none font-medium"
            />
          </div>
        </div>

        {/* Invisible recaptcha mount point */}
        <div id="recaptcha-container" className="my-2" />

        <motion.button
          whileHover={phone.replace(/\D/g, "").length === 10 && !loading ? { scale: 1.01 } : {}}
          whileTap={phone.replace(/\D/g, "").length === 10 && !loading ? { scale: 0.99 } : {}}
          onClick={handleSendOtp}
          disabled={loading || phone.replace(/\D/g, "").length !== 10}
          className="w-full py-4 bg-[#1C1917] hover:bg-[#2E2A27] active:bg-[#0C0A09] disabled:bg-[#F5F4F0] disabled:text-[#A09E9B] text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-150 rounded-xl flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(28,25,23,0.3)] disabled:shadow-none"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin block" />
          ) : (
            <>
              Send OTP
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
