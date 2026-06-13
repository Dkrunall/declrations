"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface Props {
  onContinue: () => void;
}

export default function LandingStep({ onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Premium Elevated Card */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-[#EBEAE5] rounded-[24px] px-8 py-12 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.04)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d723b]/60 to-transparent" />
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-[80px] h-[80px] rounded-full bg-[#FCFBF9] border border-[#9d723b]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_-8px_rgba(157,114,59,0.18)]">
            <Shield className="w-8 h-8 text-[#9d723b]" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-black tracking-[0.3em] text-[#1C1917] uppercase leading-none pl-[0.3em]">
            OPA
          </h1>
          <p className="text-[#9d723b] text-xs tracking-[0.35em] uppercase mt-2.5 font-bold pl-[0.35em]">
            CLUB
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#9d723b]/40 to-transparent mb-8"
        />

        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.45 }}
          className="mb-10 space-y-3"
        >
          <h2 className="text-xl font-bold text-[#1C1917] tracking-tight">
            Entry Declaration
          </h2>
          <p className="text-[#605E5C] text-sm leading-relaxed max-w-[260px] mx-auto">
            We require a quick digital declaration from all guests before entry.
            Takes under 2 minutes.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-[280px]"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full py-4 bg-[#1C1917] hover:bg-[#2E2A27] active:bg-[#0C0A09] text-white font-bold text-xs tracking-[0.2em] uppercase transition-colors duration-150 rounded-xl shadow-[0_10px_20px_-10px_rgba(28,25,23,0.3)]"
          >
            Continue
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="mt-6 text-[#A09E9B] text-[10.5px] tracking-wide max-w-[240px] leading-normal"
        >
          Your data is stored securely and used only for entry verification.
        </motion.p>
      </div>
    </motion.div>
  );
}
