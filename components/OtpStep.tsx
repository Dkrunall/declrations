"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";
import { toast } from "sonner";

interface Props {
  phone: string;
  confirmationResult: ConfirmationResult;
  onVerified: () => void;
  onResend: () => void;
}

export default function OtpStep({
  phone,
  confirmationResult,
  onVerified,
  onResend,
}: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...otp];
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(code);
      toast.success("Phone verified!");
      onVerified();
    } catch (err: unknown) {
      const error = err as { code?: string };
      const msg =
        error.code === "auth/code-expired"
          ? "OTP expired. Request a new one."
          : "Invalid OTP. Please try again.";
      toast.error(msg);
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const masked = phone.replace(/(\+91)(\d{3})(\d{4})(\d{3})/, "$1 $2****$4");

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
            <Shield className="w-5 h-5 text-[#9d723b]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1917] mb-2 tracking-tight">Enter OTP</h2>
          <p className="text-[#605E5C] text-sm">
            Sent to{" "}
            <span className="text-[#9d723b] font-bold">{masked}</span>
          </p>
        </div>

        {/* 6-digit boxes */}
        <div
          className="flex gap-2 mb-8"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-0 min-w-0 flex-1 h-14 bg-[#FCFBF9] border border-[#EBEAE5] focus:border-[#9d723b] focus:ring-2 focus:ring-[#9d723b]/10 text-[#1C1917] text-xl font-bold text-center outline-none transition-all duration-150 rounded-xl"
            />
          ))}
        </div>

        <motion.button
          whileHover={otp.join("").length === 6 && !loading ? { scale: 1.01 } : {}}
          whileTap={otp.join("").length === 6 && !loading ? { scale: 0.99 } : {}}
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full py-4 bg-[#1C1917] hover:bg-[#2E2A27] active:bg-[#0C0A09] disabled:bg-[#F5F4F0] disabled:text-[#A09E9B] text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-150 rounded-xl flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(28,25,23,0.3)] disabled:shadow-none"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin block" />
          ) : (
            "Verify OTP"
          )}
        </motion.button>

        <div className="mt-8 text-center">
          {countdown > 0 ? (
            <p className="text-[#A09E9B] text-sm">
              Resend in{" "}
              <span className="text-[#9d723b] font-bold tabular-nums">
                {countdown}s
              </span>
            </p>
          ) : (
            <button
              onClick={onResend}
              className="text-[#9d723b] text-sm font-bold hover:text-[#b58e55] transition-colors duration-150 underline underline-offset-4 decoration-[#9d723b]/30"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
