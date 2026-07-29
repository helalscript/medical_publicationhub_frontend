"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Briefcase, Calendar, FileText, Settings, BookOpen, MessageSquare } from "lucide-react";
import { ICurrentUser } from "@/types/auth/auth";

interface ProfileLayoutPresenterProps {
    user: ICurrentUser;
    appCount: number;
    courseCount?: number;
    children: React.ReactNode;
}

export default function ProfileLayoutPresenter({ user, appCount, courseCount = 0, children }: ProfileLayoutPresenterProps) {
    const pathname = usePathname();

    const tabs = [
        { name: "Research Applications", href: "/myprofile/applications", icon: FileText, count: appCount },
        { name: "My Courses", href: "/myprofile/courses", icon: BookOpen, count: courseCount },
        { name: "Messages", href: "/myprofile/conversation", icon: MessageSquare },
        { name: "Settings", href: "/myprofile/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#0A0C0F] text-white pt-10 pb-20 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto">
                {/* Profile Header Card */}
                <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8 shadow-2xl shadow-[#00D1FF]/5">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#00D1FF]/20 overflow-hidden bg-[#1F242D]">
                            {user.avatar ? (
                                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#00D1FF]">
                                    <User size={48} />
                                </div>
                            )}
                        </div>

                        {/* User Details */}
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">{user.name}</h1>
                            <p className="text-[#94A3B8] text-sm md:text-base mb-4">{user.email}</p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#64748B] text-xs md:text-sm">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#00D1FF]" />
                                    <span>{user.institution || "Institution not set"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-[#00D1FF]" />
                                    <span className="capitalize">{user.role || "User"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[#00D1FF]" />
                                    <span>Joined recently</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center justify-center gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-12">
                        <div className="text-center">
                            <p className="text-[#00D1FF] text-2xl md:text-3xl font-bold mb-1">{courseCount}</p>
                            <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">Enrolled Courses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[#00D1FF] text-2xl md:text-3xl font-bold mb-1">{appCount}</p>
                            <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">Applications</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-3 mb-10 pb-2 overflow-x-auto no-scrollbar border-b border-white/5">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;
                        
                        return (
                            <Link 
                                key={tab.name} 
                                href={tab.href}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                    isActive 
                                    ? "bg-[#00D1FF] text-black shadow-lg shadow-[#00D1FF]/20" 
                                    : "bg-[#111419] text-[#94A3B8] hover:text-white hover:bg-white/5 border border-white/5"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                                {tab.count !== undefined && (
                                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/20" : "bg-white/5"}`}>
                                        ({tab.count})
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
