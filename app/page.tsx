"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ConfirmationResult } from "firebase/auth";

import LandingStep from "@/components/LandingStep";
import PhoneStep from "@/components/PhoneStep";
import OtpStep from "@/components/OtpStep";
import DeclarationForm from "@/components/DeclarationForm";
import SuccessStep from "@/components/SuccessStep";
import type { Step } from "@/lib/types";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#f3f1e8] via-[#faf9f5] to-[#f5f3eb] text-[#1c1917] relative overflow-hidden flex flex-col justify-center">
      {/* 1. Lined Gold Grid (Visible and elegant on mobile) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#9d723b18_1px,transparent_1px),linear-gradient(to_bottom,#9d723b18_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-60 pointer-events-none" 
        style={{
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 50%, transparent 100%)",
        }}
      />

      {/* 2. Floating Animated Ambient Blobs (High visibility luxury lighting) */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-20 w-[400px] h-[400px] rounded-full bg-[#b58e55]/20 blur-[90px] pointer-events-none mix-blend-multiply"
      />
      
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-[#9d723b]/18 blur-[110px] pointer-events-none mix-blend-multiply"
      />

      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 30, 0],
          scale: [0.9, 1.05, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-10 w-[300px] h-[300px] rounded-full bg-amber-100/40 blur-[85px] pointer-events-none mix-blend-multiply"
      />

      {/* 3. Subtle Radial Center Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/50 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <LandingStep key="landing" onContinue={() => setStep("phone")} />
          )}

          {step === "phone" && (
            <PhoneStep
              key="phone"
              onSuccess={(phoneNumber, result) => {
                setPhone(phoneNumber);
                setConfirmationResult(result);
                setStep("otp");
              }}
            />
          )}

          {step === "otp" && confirmationResult && (
            <OtpStep
              key="otp"
              phone={phone}
              confirmationResult={confirmationResult}
              onVerified={() => setStep("form")}
              onResend={() => setStep("phone")}
            />
          )}

          {step === "form" && (
            <DeclarationForm
              key="form"
              phone={phone}
              onSuccess={() => setStep("success")}
            />
          )}

          {step === "success" && <SuccessStep key="success" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
