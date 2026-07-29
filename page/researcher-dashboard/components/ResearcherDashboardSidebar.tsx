"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    Heart,
    MessageSquare,
    Settings,
    Home,
    X,
    FlaskConical,
    ListTodo,
} from "lucide-react";
import navLogo from "@/assets/images/nav-logo.png";
import { ICurrentUser } from "@/types/auth/auth";

interface ISystemInfo {
    logo: string;
    system_name: string;
}

interface ResearcherDashboardSidebarProps {
    user: ICurrentUser | null;
    systemInfo: ISystemInfo | null;
    isLoadingSystem: boolean;
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { label: "Dashboard", href: "/researcher-dashboard", icon: LayoutDashboard },
    { label: "My Tasks", href: "/researcher-dashboard/tasks", icon: ListTodo },
    { label: "Applications", href: "/researcher-dashboard/applications", icon: FileText },
    { label: "My Courses", href: "/researcher-dashboard/courses", icon: BookOpen },
    { label: "Saved Opportunities", href: "/researcher-dashboard/favourites", icon: Heart },
    { label: "Messages", href: "/researcher-dashboard/conversation", icon: MessageSquare },
    { label: "Profile Settings", href: "/researcher-dashboard/profile", icon: Settings },
];

const isNavActive = (pathname: string, href: string) => {
    if (href === "/researcher-dashboard") return pathname === "/researcher-dashboard";
    return pathname.startsWith(href);
};

const ResearcherDashboardSidebar = ({
    user,
    systemInfo,
    isLoadingSystem,
    isOpen,
    onClose,
}: ResearcherDashboardSidebarProps) => {
    const pathname = usePathname();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[#111419] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2.5 min-w-0" onClick={onClose}>
                        {isLoadingSystem ? (
                            <div className="h-9 w-36 bg-white/5 animate-pulse rounded" />
                        ) : systemInfo?.logo ? (
                            <img
                                src={systemInfo.logo}
                                alt={systemInfo.system_name || "Logo"}
                                className="h-9 w-auto object-contain"
                            />
                        ) : (
                            <Image src={navLogo} alt="PublicationHub" className="h-9 w-auto object-contain" priority />
                        )}
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 py-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#7661FF]/10 border border-[#7661FF]/20">
                        <FlaskConical size={16} className="text-[#9C8BE9] shrink-0" />
                        <span className="text-xs font-bold text-[#9C8BE9] uppercase tracking-wider">Researcher Portal</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = isNavActive(pathname, href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? "bg-gradient-to-r from-[#7661FF]/15 to-[#6467F2]/10 text-[#9C8BE9] border border-[#7661FF]/20 shadow-[0_0_20px_rgba(118,97,255,0.08)]"
                                        : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                            >
                                <Icon size={18} className={active ? "text-[#9C8BE9]" : "text-[#64748B]"} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-3">
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1F242D] border border-white/10 relative shrink-0">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#9C8BE9] text-sm font-bold">
                                        {user.name?.charAt(0) || "R"}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                <p className="text-[10px] text-[#64748B] uppercase tracking-wider capitalize">{user.role}</p>
                            </div>
                        </div>
                    )}

                    <Link
                        href="/researchopportunities"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <Home size={18} />
                        Browse Opportunities
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default ResearcherDashboardSidebar;
