
"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, User, LogOut, ChevronDown, Settings, LayoutDashboard, MessageSquare } from "lucide-react";
import navLogo from "@/assets/images/nav-logo.png";
import CTAButton from "@/components/CTAButton";
import { getCurrentUser, logoutService, getUserInfo } from "@/services/auth";
import NotificationsDropdown from "@/components/notifications/NotificationsDropdown";
import { ICurrentUser } from "@/types/auth/auth";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { getSystemInfo } from "@/services/home";

interface ISystemInfo {
    logo: string;
    system_name: string;
}

interface NavbarProps {
    initialUser?: ICurrentUser | null;
    initialSystemInfo?: ISystemInfo | null;
}

const getUserPortalPaths = (role?: string) => {
    switch (role) {
        case "researcher":
            return {
                dashboard: "/researcher-dashboard",
                profile: "/researcher-dashboard/profile",
                settings: "/researcher-dashboard/profile",
                messages: "/researcher-dashboard/conversation",
                hasDashboard: true,
            };
        case "coordinator":
            return {
                dashboard: "/coordinator-dashboard",
                profile: "/coordinator-dashboard/profile",
                settings: "/coordinator-dashboard/profile",
                messages: "/coordinator-dashboard/conversation",
                hasDashboard: true,
            };
        case "mentor":
            return {
                dashboard: "/mentor-dashboard",
                profile: "/mentor-dashboard/profile",
                settings: "/mentor-dashboard/profile",
                messages: "/mentor-dashboard/conversation",
                hasDashboard: true,
            };
        default:
            return {
                dashboard: "/myprofile",
                profile: "/myprofile",
                settings: "/myprofile/settings",
                messages: "/myprofile/conversation",
                hasDashboard: false,
            };
    }
};

const ProfileDropdownLinks = ({
    portalPaths,
    onNavigate,
    onLogout,
    variant = "desktop",
}: {
    portalPaths: ReturnType<typeof getUserPortalPaths>;
    onNavigate: () => void;
    onLogout: () => void;
    variant?: "desktop" | "mobile";
}) => {
    const linkClass =
        variant === "desktop"
            ? "flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            : "text-gray-300 text-lg font-medium px-4 flex items-center gap-3 hover:text-white transition-colors";
    const iconSize = variant === "desktop" ? 18 : 20;

    return (
        <>
            {portalPaths.hasDashboard && (
                <Link href={portalPaths.dashboard} onClick={onNavigate} className={linkClass}>
                    <LayoutDashboard size={iconSize} />
                    <span className={variant === "desktop" ? "text-sm font-medium" : ""}>Dashboard</span>
                </Link>
            )}

            <Link href={portalPaths.profile} onClick={onNavigate} className={linkClass}>
                <User size={iconSize} />
                <span className={variant === "desktop" ? "text-sm font-medium" : ""}>My Profile</span>
            </Link>

            <Link href={portalPaths.settings} onClick={onNavigate} className={linkClass}>
                <Settings size={iconSize} />
                <span className={variant === "desktop" ? "text-sm font-medium" : ""}>Settings</span>
            </Link>

            <Link href={portalPaths.messages} onClick={onNavigate} className={linkClass}>
                <MessageSquare size={iconSize} />
                <span className={variant === "desktop" ? "text-sm font-medium" : ""}>Messages</span>
            </Link>

            <div className={variant === "desktop" ? "h-px bg-white/5 my-2" : "h-px bg-white/5 my-2 mx-4"} />

            <button
                onClick={onLogout}
                className={
                    variant === "desktop"
                        ? "w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        : "text-red-400 text-lg font-bold px-4 flex items-center gap-3 text-left hover:text-red-300 transition-colors"
                }
            >
                <LogOut size={iconSize} />
                <span className={variant === "desktop" ? "text-sm font-bold" : ""}>Sign Out</span>
            </button>
        </>
    );
};

const Navbar = ({ initialUser, initialSystemInfo }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<ICurrentUser | null>(initialUser || null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    const [systemInfo, setSystemInfo] = useState<ISystemInfo | null>(initialSystemInfo || null);
    const [isLoading, setIsLoading] = useState(!initialSystemInfo);

    useEffect(() => {
        if (initialSystemInfo) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const [userRes, systemRes] = await Promise.all([
                getUserInfo(),
                getSystemInfo()
            ]);
            
            if (userRes?.status) {
                setUser(userRes.data);
            } else {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            }

            if (systemRes?.status) {
                setSystemInfo(systemRes.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [initialUser, initialSystemInfo]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutService();
            setUser(null);
            setIsProfileOpen(false);
            toast.success("Logged out successfully");
            router.push("/login"); // Updated to your login route
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const navLinks = [
        { name: "Home", shortName: "Home", href: "/" },
        { name: "Services", shortName: "Services", href: "/service" },
        { name: "Research Opportunities", shortName: "Research", href: "/researchopportunities" },
        { name: "Meta Academy", shortName: "Meta", href: "/meta" },
        { name: "Partnership", shortName: "Partnership", href: "/partnership" },
        { name: "About", shortName: "About", href: "/about" },
        { name: "FAQ", shortName: "FAQ", href: "/faq" },
    ];

    const portalPaths = user ? getUserPortalPaths(user.role) : null;

    const closeProfileDropdown = () => setIsProfileOpen(false);
    const closeMobileMenu = () => setIsOpen(false);
    const handleProfileLogout = () => {
        closeProfileDropdown();
        closeMobileMenu();
        handleLogout();
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#171A21] border-b border-white/10 shadow-[0_10px_15px_-3px_rgba(0,230,255,0.05),0_4px_6px_-4px_rgba(0,230,255,0.05)] backdrop-blur-[12px] py-3 md:py-4 px-4 md:px-6 lg:px-8 2xl:px-12">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 xl:gap-4">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0 transition-opacity hover:opacity-90">
                    {isLoading ? (
                        <div className="h-9 md:h-10 w-32 md:w-36 bg-white/10 animate-pulse rounded shrink-0"></div>
                    ) : systemInfo?.logo ? (
                        <img
                            src={systemInfo.logo}
                            alt={systemInfo.system_name || "PublicationHub Logo"}
                            className="h-9 md:h-10 w-auto object-contain shrink-0"
                        />
                    ) : (
                        <Image
                            src={navLogo}
                            alt="PublicationHub Logo"
                            className="h-9 md:h-10 w-auto object-contain shrink-0"
                            priority
                        />
                    )}
                    {systemInfo?.system_name && (
                        <span className="hidden sm:block text-transparent font-bold text-sm md:text-base bg-gradient-to-r from-[#00D1FF] to-[#3F5EFB] bg-clip-text truncate max-w-[100px] md:max-w-[140px] xl:max-w-[160px] 2xl:max-w-none whitespace-nowrap">
                            {systemInfo.system_name}
                        </span>
                    )}
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden xl:flex flex-1 items-center justify-center gap-3 2xl:gap-6 min-w-0 px-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`whitespace-nowrap text-[13px] 2xl:text-[15px] font-medium transition-colors duration-200 hover:text-[#00D1FF] shrink-0 ${isActive ? "text-[#00D1FF]" : "text-[#94A3B8]"
                                    }`}
                            >
                                <span className="2xl:hidden">{link.shortName}</span>
                                <span className="hidden 2xl:inline">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Section: User Profile or Sign In, CTA */}
                <div className="hidden xl:flex items-center gap-3 2xl:gap-5 shrink-0">
                    {/* <button className="text-white hover:text-[#00D1FF] transition-colors p-1.5 focus:outline-none">
                        <Search size={22} strokeWidth={2.5} />
                    </button> */}

                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse border-2 border-[#00D1FF]/30"></div>
                            <div className="flex flex-col items-start gap-1">
                                <div className="h-3.5 w-20 bg-white/10 animate-pulse rounded"></div>
                                <div className="h-2 w-12 bg-white/10 animate-pulse rounded"></div>
                            </div>
                        </div>
                    ) : user && portalPaths ? (
                        <>
                            {/* <NotificationsDropdown /> */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 group focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full border-2 border-[#00D1FF]/30 group-hover:border-[#00D1FF] transition-all overflow-hidden relative bg-[#1F242D]">
                                    {user.avatar ? (
                                        <Image src={user.avatar} alt={user.name || "User avatar"} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#00D1FF]">
                                            <User size={20} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-white text-sm font-bold group-hover:text-[#00D1FF] transition-colors line-clamp-1 max-w-[100px]">
                                        {user.name}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <span className="capitalize">{user.role}</span>
                                        <ChevronDown size={10} className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
                                    </div>
                                </div>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-60 bg-[#1F242D] border border-white/10 rounded-2xl shadow-2xl py-3 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                                        <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                                        <p className="text-sm font-bold text-white truncate">{user.email}</p>
                                    </div>

                                    <ProfileDropdownLinks
                                        portalPaths={portalPaths}
                                        onNavigate={closeProfileDropdown}
                                        onLogout={handleProfileLogout}
                                        variant="desktop"
                                    />
                                </div>
                            )}
                        </div>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="whitespace-nowrap text-[13px] 2xl:text-[15px] font-medium text-white hover:text-[#00D1FF] transition-colors"
                        >
                            Sign In
                        </Link>
                    )}

                    <Link href="/register">
                        <CTAButton className="whitespace-nowrap px-4 py-2.5 text-sm 2xl:px-7 2xl:py-3 2xl:text-base">
                            <span className="2xl:hidden">Join mentor</span>
                            <span className="hidden 2xl:inline">Join as a mentor</span>
                        </CTAButton>
                    </Link>
                </div>

                {/* Tablet/Mobile Toggle */}
                <div className="flex xl:hidden items-center gap-2 shrink-0">
                    <button className="text-white p-2">
                        <Search size={24} />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white p-2"
                    >
                        {isOpen ? <X size={30} /> : <Menu size={30} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`xl:hidden absolute top-full left-0 w-full bg-[#171A21]/95 backdrop-blur-[12px] border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100 border-t border-white/5" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="flex flex-col gap-1 p-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-lg font-medium transition-colors ${isActive ? "text-[#00D1FF]" : "text-gray-400"
                                    } hover:text-white py-3 px-4 rounded-lg hover:bg-white/5`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-5">
                        {isLoading ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 px-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse border border-[#00D1FF]/30"></div>
                                    <div className="flex flex-col gap-2 justify-center">
                                        <div className="h-4 w-24 bg-white/10 animate-pulse rounded"></div>
                                        <div className="h-3 w-32 bg-white/10 animate-pulse rounded"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 px-4 mt-2">
                                    <div className="h-6 w-28 bg-white/10 animate-pulse rounded"></div>
                                    <div className="h-6 w-24 bg-white/10 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ) : user && portalPaths ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 px-4">
                                     <div className="w-12 h-12 rounded-full border border-[#00D1FF]/30 overflow-hidden relative">
                                        {user.avatar ? (
                                            <Image src={user.avatar} alt={user.name || "User avatar"} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#1F242D] flex items-center justify-center text-[#00D1FF]">
                                                <User size={24} />
                                            </div>
                                        )}
                                     </div>
                                     <div>
                                        <p className="text-white font-bold">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                     </div>
                                </div>

                                <ProfileDropdownLinks
                                    portalPaths={portalPaths}
                                    onNavigate={closeMobileMenu}
                                    onLogout={handleProfileLogout}
                                    variant="mobile"
                                />
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-white text-lg font-medium px-4 hover:text-[#00D1FF]"
                            >
                                Sign In
                            </Link>
                        )}
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                            <CTAButton className="w-full py-4">
                                Join as a mentor
                            </CTAButton>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;