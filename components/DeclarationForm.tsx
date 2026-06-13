"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import type { FormPayload } from "@/lib/types";
import SignaturePad, { type SignaturePadHandle } from "@/components/SignaturePad";

const DECLARATION_TEXT = `By signing this declaration, I confirm that:

1. I am 18 years of age or above and willingly enter OPA Club.

2. I agree to comply with all club rules, regulations, and the instructions of the management and security staff.

3. I understand that OPA Club reserves the right to refuse entry or remove any guest found to be intoxicated, disorderly, or in breach of club policies.

4. I consent to reasonable security checks upon entry and acknowledge that the club is not liable for loss or damage to personal belongings.

5. I acknowledge that CCTV monitoring is in operation throughout the venue for the safety and security of all guests.

6. I agree to treat fellow guests and staff with respect and not engage in any conduct that may cause harm, distress, or discomfort to others.

7. I understand that the club may share this declaration with relevant authorities if required by law.`;

interface Props {
  phone: string;
  onSuccess: () => void;
}

export default function DeclarationForm({ phone, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(true);
  const sigRef = useRef<SignaturePadHandle>(null);

  // Look up returning visitor and pre-fill name + email
  useEffect(() => {
    fetch(`/api/lookup?phone=${encodeURIComponent(phone)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.found) {
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          toast.success("Welcome back! Your details have been pre-filled.");
        }
      })
      .catch(() => {})
      .finally(() => setPrefilling(false));
  }, [phone]);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRe.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the declaration terms");
      return;
    }
    if (!sigRef.current || sigRef.current.isEmpty()) {
      toast.error("Please provide your signature");
      return;
    }

    const signature: string = sigRef.current.toDataURL("image/png");

    const payload: FormPayload = {
      fullName: fullName.trim(),
      phone,
      email: email.trim(),
      date: new Date().toISOString(),
      signature,
      timestamp: Date.now(),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Submission failed");
      toast.success("Declaration submitted!");
      onSuccess();
    } catch {
      toast.error("Submission failed. Please check your connection and retry.");
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
      className="px-4 py-8"
    >
      {/* Premium Elevated Card */}
      <div className="w-full bg-white/90 backdrop-blur-md border border-[#EBEAE5] rounded-[24px] px-5 py-8 shadow-[0_20px_50px_-12px_rgba(28,25,23,0.04)] relative overflow-hidden">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#9d723b]/60 to-transparent" />
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1C1917] tracking-tight">Declaration Form</h2>
          <p className="text-[#A09E9B] text-xs mt-1">All fields are required to verify entry</p>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
              Full Name
            </label>
            <div className={`flex items-center bg-[#FCFBF9] border border-[#EBEAE5] focus-within:border-[#9d723b] focus-within:ring-2 focus-within:ring-[#9d723b]/10 rounded-xl transition-all duration-200 overflow-hidden ${prefilling ? "animate-pulse" : ""}`}>
              <User className="w-4 h-4 text-[#A09E9B] ml-3.5 shrink-0" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={prefilling ? "Looking up…" : "As per government ID"}
                autoComplete="name"
                disabled={prefilling}
                className="flex-1 bg-transparent px-3 py-3.5 text-[#1C1917] text-sm placeholder-[#C1BFBC] outline-none disabled:cursor-wait font-medium"
              />
            </div>
          </div>

          {/* Phone — read-only verified */}
          <div>
            <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
              Phone Number
            </label>
            <div className="flex items-center bg-[#F5F4F0] border border-[#EBEAE5] rounded-xl overflow-hidden">
              <span className="px-4 py-3.5 text-[#605E5C] text-sm flex-1 font-semibold">
                {phone}
              </span>
              <span className="text-emerald-600 text-xs font-bold mr-3.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" strokeWidth={3} /> Verified
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
              Email Address
            </label>
            <div className={`flex items-center bg-[#FCFBF9] border border-[#EBEAE5] focus-within:border-[#9d723b] focus-within:ring-2 focus-within:ring-[#9d723b]/10 rounded-xl transition-all duration-200 overflow-hidden ${prefilling ? "animate-pulse" : ""}`}>
              <Mail className="w-4 h-4 text-[#A09E9B] ml-3.5 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={prefilling ? "Looking up…" : "you@example.com"}
                autoComplete="email"
                disabled={prefilling}
                className="flex-1 bg-transparent px-3 py-3.5 text-[#1C1917] text-sm placeholder-[#C1BFBC] outline-none disabled:cursor-wait font-medium"
              />
            </div>
          </div>

          {/* Date — read-only */}
          <div>
            <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
              Date
            </label>
            <div className="flex items-center bg-[#F5F4F0] border border-[#EBEAE5] rounded-xl overflow-hidden">
              <Calendar className="w-4 h-4 text-[#A09E9B] ml-3.5 shrink-0" />
              <span className="px-3 py-3.5 text-[#605E5C] text-sm font-semibold">{today}</span>
            </div>
          </div>

          {/* Declaration block */}
          <div>
            <label className="block text-[10px] font-bold text-[#A09E9B] mb-2 tracking-widest uppercase">
              Declaration Terms
            </label>
            <div className="bg-[#FCFBF9] border border-[#EBEAE5] rounded-xl p-4 max-h-40 overflow-y-auto shadow-inner">
              <p className="text-[#605E5C] text-xs leading-relaxed whitespace-pre-line font-medium">
                {DECLARATION_TEXT}
              </p>
            </div>
          </div>

          {/* Terms checkbox */}
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            className="flex items-start gap-3 w-full text-left focus:outline-none select-none py-1"
          >
            <div
              className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all duration-150 ${
                agreed
                  ? "bg-[#9d723b] border-[#9d723b] shadow-[0_2px_8px_rgba(157,114,59,0.2)]"
                  : "bg-white border-[#C1BFBC] hover:border-[#9d723b]"
              }`}
            >
              {agreed && (
                <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
              )}
            </div>
            <p className="text-[#605E5C] text-sm leading-relaxed font-semibold">
              I have read and agree to the above declaration terms
            </p>
          </button>

          {/* Signature pad */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-[#A09E9B] tracking-widest uppercase">
                Signature
              </label>
              <button
                type="button"
                onClick={() => sigRef.current?.clear()}
                className="text-xs font-bold text-[#A09E9B] hover:text-[#9d723b] transition-colors duration-150"
              >
                Clear Pad
              </button>
            </div>
            <div className="bg-[#FCFBF9] border border-[#EBEAE5] rounded-xl overflow-hidden shadow-inner">
              <SignaturePad
                ref={sigRef}
                penColor="#1C1917"
                backgroundColor="#FCFBF9"
              />
            </div>
            <p className="text-[#A09E9B] text-[10.5px] mt-1.5 leading-normal">
              Draw your signature inside the box using your finger or stylus.
            </p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-[#1C1917] hover:bg-[#2E2A27] active:bg-[#0C0A09] disabled:bg-[#F5F4F0] disabled:text-[#A09E9B] text-white font-bold text-xs tracking-[0.2em] uppercase transition-all duration-150 rounded-xl flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(28,25,23,0.3)] disabled:shadow-none mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin block" />
            ) : (
              "Submit Declaration"
            )}
          </motion.button>
        </div>
      </div>

      {/* bottom spacing so content isn't hidden behind mobile nav bars */}
      <div className="h-8" />
    </motion.div>
  );
}
