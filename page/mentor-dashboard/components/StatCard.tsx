"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-[#1E293B]",
  iconColor = "text-[#94A3B8]",
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/10 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
