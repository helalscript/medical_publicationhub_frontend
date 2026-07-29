"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { forgotPasswordService } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const [isSent, setIsSent] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isSent) {
      const timer = setTimeout(() => {
        router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(emailValue)}`);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSent, emailValue, router]);

  const onSubmit = async (data: any) => {
    try {
      const res = await forgotPasswordService(data.email);
      if (res?.status) {
        setEmailValue(data.email);
        toast.success(res.message || "OTP sent successfully!");
        setIsSent(true);
      } else {
        toast.error(res?.message || "Failed to send reset link.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  const gradientBtnStyle = { background: "linear-gradient(135deg, #00D1FF 0%, #6467F2 100%)" };
  const inputBaseClass = "w-full pl-11 pr-4 py-3.5 bg-[#1F242D] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 transition-all placeholder:text-gray-500 text-white";

  if (isSent) {
    return (
      <div className="bg-[#171A21] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-cyan-500/5 text-center">
        <div className="w-20 h-20 bg-[#00D1FF]/10 text-[#00D1FF] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Check Your Email</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          We've sent a password reset link to your email address. Please follow the instructions to reset your password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#00D1FF] font-bold hover:underline transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#171A21] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-cyan-500/5">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] text-xs font-semibold tracking-wide uppercase">
          Account Recovery
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Reset Your <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #00D1FF, #6467F2)" }}>Password</span>
        </h1>
        <p className="text-gray-400">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 ml-1">Email Address *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00D1FF]">
              <Mail size={18} className="text-gray-500 group-focus-within:text-inherit" />
            </div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="your.email@domain.com"
              className={`${inputBaseClass} ${errors.email ? "border-red-500/50" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-400 ml-1">{errors.email.message}</p>
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-[#00D1FF]/5 rounded-2xl border border-[#00D1FF]/10 flex gap-3">
          <div className="text-[#00D1FF] mt-0.5">
           <Send size={16} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Password Reset Instructions</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              The reset link will be valid for 1 hour. If you don't receive the email within a few minutes, please check your spam folder.
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          style={gradientBtnStyle}
          className="w-full py-4 text-white font-bold rounded-2xl shadow-[0_0_20px_0_rgba(0,209,255,0.15)] hover:shadow-[0_0_25px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? "Sending..." : "Send link"}
            {!isSubmitting && <Send size={18} className="translate-x-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
          </span>
        </button>

        {/* Footer */}
        <div className="pt-6 text-center border-t border-white/5 flex flex-col gap-4">
           <p className="text-sm text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-[#00D1FF] font-bold hover:underline transition-colors">
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;