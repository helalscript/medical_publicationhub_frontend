"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginService } from "@/services/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await loginService(data.email, data.password);
      if (res?.status) {
        toast.success(res.message || "Logged in successfully!");
        if (redirectTo) {
          router.push(redirectTo);
        } else if (res.data?.role === "mentor") {
          router.push("/mentor-dashboard");
        } else if (res.data?.role === "researcher") {
          router.push("/researcher-dashboard");
        } else if (res.data?.role === "coordinator") {
          router.push("/coordinator-dashboard");
        } else {
          router.push("/");
        }
      } else {
        // Show the specific error message from the API (e.g. "No account found...")
        toast.error(res?.message || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login.");
    }
  };

  const gradientBtnStyle = { background: "linear-gradient(135deg, #00D1FF 0%, #6467F2 100%)" };
  const inputBaseClass = "w-full pl-11 pr-4 py-3.5 bg-[#1F242D] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 transition-all placeholder:text-gray-500 text-white";

  return (
    <div className="bg-[#171A21] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-cyan-500/5">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-[#00D1FF]/10 text-[#00D1FF] text-xs font-semibold tracking-wide uppercase">
          Welcome Back
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Sign In to <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #00D1FF, #6467F2)" }}>PublicationHub</span>
        </h1>
        <p className="text-gray-400">Access your research dashboard and collaboration tools</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-[#1F242D] rounded-2xl mb-10">
        <button 
          className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg transition-all"
          style={gradientBtnStyle}
        >
          Sign In
        </button>
        <Link href="/register" className="flex-1 py-2.5 text-sm font-medium rounded-xl text-gray-400 hover:text-white transition-all text-center">
          Sign Up
        </Link>
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

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-semibold text-gray-300">Password *</label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#00D1FF]">
              <Lock size={18} className="text-gray-500 group-focus-within:text-inherit" />
            </div>
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="w-4 h-4 rounded-md border-white/10 bg-[#1F242D] text-[#00D1FF] focus:ring-[#00D1FF]/20 transition-all"
            />
            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#00D1FF] hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting}
          type="submit"
          style={gradientBtnStyle}
          className="w-full py-4 text-white font-bold rounded-2xl shadow-[0_0_20px_0_rgba(0,209,255,0.15)] hover:shadow-[0_0_25px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign In"}
          </span>
        </button>

        {/* Footer */}
        <div className="pt-6 text-center border-t border-white/5">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[#00D1FF] font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;