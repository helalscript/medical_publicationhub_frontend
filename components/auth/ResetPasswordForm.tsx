"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { resetPasswordService } from "@/services/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Try search params first, then session storage
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlToken = searchParams.get("token");
    
    if (urlEmail && urlToken) {
      setEmail(urlEmail);
      setToken(urlToken);
    } else {
      const sessionEmail = sessionStorage.getItem("reset_email");
      const sessionToken = sessionStorage.getItem("reset_token");
      if (sessionEmail && sessionToken) {
        setEmail(sessionEmail);
        setToken(sessionToken);
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");
  const gradientBtnStyle = { background: "linear-gradient(135deg, #00D1FF 0%, #6467F2 100%)" };
  const inputBaseClass = "w-full pl-11 pr-12 py-3.5 bg-[#1F242D] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 transition-all placeholder:text-gray-500 text-white";

  const onSubmit = async (data: any) => {
    try {
      const res = await resetPasswordService({
        ...data,
        email,
        token,
      });
      if (res?.status) {
        toast.success(res.message || "Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(res?.message || "Failed to reset password.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <div className="bg-[#171A21] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-cyan-500/5 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#00D1FF]/10 text-[#00D1FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Set Your new <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #00D1FF, #6467F2)" }}>Password</span>
        </h1>
        <p className="text-gray-400 text-sm">Password must be at least 6 characters</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 ml-1">New password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00D1FF]">
              <Lock size={18} className="text-gray-500 group-focus-within:text-inherit" />
            </div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${inputBaseClass} ${errors.password ? "border-red-500/50" : ""}`}
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#00D1FF] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-400 ml-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300 ml-1">Confirm password</label>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00D1FF]">
              <Lock size={18} className="text-gray-500 group-focus-within:text-inherit" />
            </div>
            <input
              {...register("password_confirmation", {
                required: "Confirm password is required",
                validate: (value) => value === password || "Passwords do not match",
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`${inputBaseClass} ${errors.password_confirmation ? "border-red-500/50" : ""}`}
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#00D1FF] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-xs font-medium text-red-400 ml-1">{errors.password_confirmation.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          style={gradientBtnStyle}
          className="w-full py-4 text-white font-bold rounded-2xl shadow-[0_0_20px_0_rgba(0,209,255,0.15)] hover:shadow-[0_0_25px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Resetting..." : "Login Now"}
        </button>

        {/* Footer */}
        <div className="pt-6 text-center border-t border-white/5">
          <Link
            href="/login"
            className="text-sm font-bold text-[#00D1FF] hover:underline underline-offset-4 transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
