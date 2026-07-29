import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/nav-logo.png";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen w-full bg-[#0A0C0F]
   
    flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden"
    >
      {/* Logo */}
      {/* <Link
        href="/"
        className="flex items-center mb-8 transition-transform hover:scale-105 active:scale-95"
      >
        <Image
          src={logo}
          alt="PublicationHub Logo"
          width={240}
          height={60}
          className="h-14 w-auto object-contain"
          priority
        />
      </Link> */}

      {/* Auth Card Container */}
      <div className="w-full max-w-[675px] z-10">{children}</div>

      {/* Footer Section */}
      <div className="mt-16 w-full max-w-5xl z-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <p className="text-center text-gray-500 text-sm tracking-wide">
          Built for researchers, by researchers. &copy; {new Date().getFullYear()} PublicationHub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
