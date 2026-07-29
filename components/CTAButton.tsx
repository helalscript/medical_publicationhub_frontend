

import React from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const CTAButton = ({ children, className, ...props }: CTAButtonProps) => {
    return (
        <button
            className={cn(
                "px-7 py-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer",
                "shadow-[0_0_20px_0_rgba(0,230,255,0.12)]",
                "hover:shadow-[0_0_25px_rgba(100,103,242,0.4)] hover:scale-[1.02] active:scale-[0.98]",
                className
            )}
            style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
            {...props}
        >
            {children}
        </button>
    );
};

export default CTAButton;
