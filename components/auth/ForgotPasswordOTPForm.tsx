"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { verifyForgotPasswordOtpService, resendOtpService } from "@/services/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const ForgotPasswordOTPForm = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const otpString = otp.join("");
    try {
      const res = await verifyForgotPasswordOtpService(email, otpString);
      if (res?.status) {
        toast.success(res.message || "OTP verified successfully!");
        // Store token for password reset
        sessionStorage.setItem("reset_token", res.token);
        sessionStorage.setItem("reset_email", email);
        router.push("/reset-password");
      } else {
        toast.error(res?.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during verification.");
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtpService(email);
      if (res?.status) {
        toast.success(res.message || "OTP resent successfully!");
      } else {
        toast.error(res?.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while resending OTP.");
    }
  };

  const gradientBtnStyle = { background: "linear-gradient(135deg, #00D1FF 0%, #6467F2 100%)" };

  return (
    <div className="bg-[#171A21] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-cyan-500/5 text-center max-w-md mx-auto">
      <div className="mb-10 text-center">
         <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">
          Publication<span className="text-[#00D1FF]">Hub</span>
        </h1>
        <h2 className="text-2xl font-bold text-white mb-2">Verify Reset Code</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Enter the reset code sent to: <br />
          <span className="font-semibold text-gray-300">{email || "your email"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="flex justify-between items-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el) as any}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-full h-16 text-center text-2xl font-bold bg-[#1F242D] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 transition-all text-white shadow-sm"
            />
          ))}
        </div>

        <div className="space-y-4">
          <button
            disabled={isSubmitting || otp.some((d) => !d)}
            type="submit"
            style={gradientBtnStyle}
            className="w-full py-4 text-white font-bold rounded-2xl shadow-[0_0_20px_0_rgba(0,209,255,0.15)] hover:shadow-[0_0_25px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Verify Code"}
              {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="flex items-center justify-center gap-2 mx-auto text-sm font-semibold text-gray-500 hover:text-[#00D1FF] transition-colors py-2"
          >
            <RotateCcw size={16} />
            Didn't receive code? <span className="text-[#00D1FF] hover:underline">Resend</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordOTPForm;
