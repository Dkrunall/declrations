"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessStep() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      {/* Premium Elevated Card */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-[#EBEAE5] rounded-[24px] px-8 py-12 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.04)] flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d723b]/60 to-transparent" />
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(16,185,129,0.2)]">
            <CheckCircle2
              className="w-10 h-10 text-emerald-600"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="space-y-1.5"
        >
          <h2 className="text-3xl font-black text-[#1C1917] tracking-tight">
            Thank You!
          </h2>
          <p className="text-[#9d723b] text-xs font-bold tracking-[0.2em] uppercase pl-[0.2em]">
            Declaration Submitted
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#9d723b]/40 to-transparent my-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="text-[#605E5C] text-sm leading-relaxed max-w-[240px]"
        >
          Your declaration has been recorded. Welcome to OPA — have an incredible
          night!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8 text-[#A09E9B] text-xs font-bold tracking-wider uppercase"
        >
          You may now enter the venue
        </motion.p>
      </div>
    </motion.div>
  );
}
