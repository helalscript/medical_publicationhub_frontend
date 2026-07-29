import React from "react";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    reviewing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    declined: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => (
    <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border capitalize ${
            STATUS_STYLES[status] || "bg-gray-500/10 text-gray-400 border-white/5"
        } ${className}`}
    >
        {status}
    </span>
);

export default StatusBadge;
