"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import {
    getMyNotifications,
    markNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} from "@/services/researcher";
import { toast } from "sonner";

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await getMyNotifications();
            if (res?.status) {
                setNotifications(res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    const handleMarkAllRead = async () => {
        const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
        if (unreadIds.length === 0) return;
        const res = await markNotificationsAsRead(unreadIds);
        if (res?.status) {
            setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
            toast.success("Notifications marked as read");
        }
    };

    const handleDelete = async (id: number) => {
        const res = await deleteNotification(id);
        if (res?.status) {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
    };

    const handleDeleteAll = async () => {
        const res = await deleteAllNotifications();
        if (res?.status) {
            setNotifications([]);
            toast.success("All notifications deleted");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg text-[#94A3B8] hover:text-[#00D1FF] hover:bg-white/5 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00D1FF] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#171A21] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <h3 className="text-sm font-bold text-white">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handleMarkAllRead} className="text-[#00D1FF] hover:text-white" title="Mark all read">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={handleDeleteAll} className="text-red-400 hover:text-red-300" title="Delete all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-[#94A3B8] hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-[#64748B] text-sm py-8">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center text-[#64748B] text-sm py-8">No notifications</p>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 ${!n.read_at ? "bg-[#00D1FF]/5" : ""}`}
                                >
                                    <div className="flex justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{n.title || n.message}</p>
                                            {n.message && n.title && (
                                                <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{n.message}</p>
                                            )}
                                            <p className="text-[10px] text-[#64748B] mt-1">
                                                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(n.id)}
                                            className="text-[#64748B] hover:text-red-400 shrink-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
