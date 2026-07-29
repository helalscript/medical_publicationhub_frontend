"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, User, ChevronDown, Menu, Settings, MessageSquare, LayoutDashboard } from "lucide-react";
import { getCurrentUser, logoutService } from "@/services/auth";
import { getSystemInfo } from "@/services/home";
import { ICurrentUser } from "@/types/auth/auth";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
import DashboardSidebar from "@/page/mentor-dashboard/components/DashboardSidebar";
import ResearcherDashboardSidebar from "@/page/researcher-dashboard/components/ResearcherDashboardSidebar";
import CoordinatorDashboardSidebar from "@/page/coordinator-dashboard/components/CoordinatorDashboardSidebar";

interface ISystemInfo {
  logo: string;
  system_name: string;
}

const MENTOR_PAGE_TITLES: Record<string, string> = {
  "/mentor-dashboard": "Dashboard",
  "/mentor-dashboard/rubrics": "Rubrics",
  "/mentor-dashboard/tasks": "Tasks",
  "/mentor-dashboard/submissions": "Submissions Inbox",
  "/mentor-dashboard/analytics": "Analytics",
  "/mentor-dashboard/conversation": "Messages",
  "/mentor-dashboard/profile": "Profile Settings",
};

const RESEARCHER_PAGE_TITLES: Record<string, string> = {
  "/researcher-dashboard": "Dashboard",
  "/researcher-dashboard/tasks": "My Tasks",
  "/researcher-dashboard/applications": "Applications",
  "/researcher-dashboard/courses": "My Courses",
  "/researcher-dashboard/favourites": "Saved Opportunities",
  "/researcher-dashboard/conversation": "Messages",
  "/researcher-dashboard/profile": "Profile Settings",
};

const COORDINATOR_PAGE_TITLES: Record<string, string> = {
  "/coordinator-dashboard": "Dashboard",
  "/coordinator-dashboard/submissions": "Research Submissions",
  "/coordinator-dashboard/rubrics": "Global Rubrics",
  "/coordinator-dashboard/tasks": "Tasks Monitor",
  "/coordinator-dashboard/analytics": "Analytics",
  "/coordinator-dashboard/applications": "Opportunity Applications",
  "/coordinator-dashboard/conversation": "Messages",
  "/coordinator-dashboard/profile": "Profile Settings",
};

const getPageTitle = (pathname: string, isResearcher: boolean, isCoordinator: boolean) => {
  if (isResearcher) {
    if (RESEARCHER_PAGE_TITLES[pathname]) return RESEARCHER_PAGE_TITLES[pathname];
    if (pathname.startsWith("/researcher-dashboard/applications/")) {
      return "Application Details";
    }
    if (pathname.startsWith("/researcher-dashboard/tasks/")) {
      return "Task Details";
    }
    if (pathname.startsWith("/researcher-dashboard/submissions/")) {
      return "Task Feedback";
    }
    return "Researcher Dashboard";
  }
  if (isCoordinator) {
    if (COORDINATOR_PAGE_TITLES[pathname]) return COORDINATOR_PAGE_TITLES[pathname];
    return "Coordinator Dashboard";
  }
  if (MENTOR_PAGE_TITLES[pathname]) return MENTOR_PAGE_TITLES[pathname];
  if (pathname.startsWith("/mentor-dashboard/submissions/")) return "Review Submission";
  return "Mentor Dashboard";
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ICurrentUser | null>(null);
  const [systemInfo, setSystemInfo] = useState<ISystemInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingSystem, setIsLoadingSystem] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isResearcherPortal = pathname.startsWith("/researcher-dashboard");
  const isCoordinatorPortal = pathname.startsWith("/coordinator-dashboard");

  let portalLabel = "Mentor Portal";
  if (isResearcherPortal) portalLabel = "Researcher Portal";
  else if (isCoordinatorPortal) portalLabel = "Coordinator Portal";

  let profilePath = "/mentor-dashboard/profile";
  let messagesPath = "/mentor-dashboard/conversation";
  let dashboardPath = "/mentor-dashboard";
  if (isResearcherPortal) {
    profilePath = "/researcher-dashboard/profile";
    messagesPath = "/researcher-dashboard/conversation";
    dashboardPath = "/researcher-dashboard";
  } else if (isCoordinatorPortal) {
    profilePath = "/coordinator-dashboard/profile";
    messagesPath = "/coordinator-dashboard/conversation";
    dashboardPath = "/coordinator-dashboard";
  }

  const pageTitle = getPageTitle(pathname, isResearcherPortal, isCoordinatorPortal);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingUser(true);
      setIsLoadingSystem(true);

      const [currentUser, systemRes] = await Promise.all([
        getCurrentUser(),
        getSystemInfo(),
      ]);

      setUser(currentUser);
      setIsLoadingUser(false);

      if (systemRes?.status) {
        setSystemInfo(systemRes.data);
      }
      setIsLoadingSystem(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      router.push("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const sidebar = useMemo(() => {
    const props = {
      user,
      systemInfo,
      isLoadingSystem,
      isOpen: sidebarOpen,
      onClose: () => setSidebarOpen(false),
    };
    if (isResearcherPortal) {
      return <ResearcherDashboardSidebar {...props} />;
    }
    if (isCoordinatorPortal) {
      return <CoordinatorDashboardSidebar {...props} />;
    }
    return <DashboardSidebar {...props} />;
  }, [isResearcherPortal, isCoordinatorPortal, user, systemInfo, isLoadingSystem, sidebarOpen]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0A0C0F] text-white">
        {sidebar}

        <div className="lg:pl-[260px] flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 w-full bg-[#0A0C0F]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-6 lg:px-8 py-3.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                  aria-label="Open sidebar"
                >
                  <Menu size={22} />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] hidden sm:block">
                    {portalLabel}
                  </p>
                  <h1 className="text-lg md:text-xl font-bold text-white truncate">{pageTitle}</h1>
                </div>
              </div>

              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 pl-3 md:pl-4 border-l border-white/10 hover:opacity-80 transition-all focus:outline-none group"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    {isLoadingUser ? (
                      <>
                        <div className="h-3.5 w-20 bg-white/10 animate-pulse rounded mb-1" />
                        <div className="h-2.5 w-14 bg-white/10 animate-pulse rounded" />
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#00D1FF] transition-colors max-w-[120px]">
                          {user?.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider capitalize">
                          {user?.role}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/10 group-hover:border-[#00D1FF]/40 transition-all overflow-hidden relative bg-[#1F2937]">
                    {isLoadingUser ? (
                      <div className="w-full h-full bg-white/10 animate-pulse" />
                    ) : user?.avatar ? (
                      <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <User size={20} className="absolute inset-0 m-auto text-gray-400" />
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 hidden sm:block transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 bg-[#1F242D] border border-white/10 rounded-2xl shadow-2xl py-3 z-[100] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                        {isLoadingUser ? (
                          <div className="h-4 w-32 bg-white/10 animate-pulse rounded mt-1" />
                        ) : (
                          <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                        )}
                      </div>

                      <Link
                        href={dashboardPath}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>

                      <Link
                        href={profilePath}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User size={18} />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>

                      <Link
                        href={profilePath}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings size={18} />
                        <span className="text-sm font-medium">Settings</span>
                      </Link>

                      <Link
                        href={messagesPath}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <MessageSquare size={18} />
                        <span className="text-sm font-medium">Messages</span>
                      </Link>

                      <div className="h-px bg-white/5 my-2" />

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-bold">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[radial-gradient(circle_at_top_right,rgba(0,209,255,0.04),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(100,103,242,0.04),transparent_40%)]">
            {children}
          </main>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default DashboardLayout;
