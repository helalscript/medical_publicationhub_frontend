"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Phone, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/auth";
import { ICurrentUser } from "@/types/auth/auth";

const ProfileView = () => {
    const [user, setUser] = useState<ICurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: "Coordinator",
        lastName: "Portal",
        email: "coordinator@coordinator.com",
        phone: "+8801712345678",
        gender: "male",
        birthdate: "1998-05-21"
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);
                if (u) {
                    // Split name if possible
                    const names = u.name ? u.name.split(" ") : ["Coordinator", "Portal"];
                    setProfileForm({
                        firstName: names[0] || "Coordinator",
                        lastName: names.slice(1).join(" ") || "Portal",
                        email: u.email || "coordinator@coordinator.com",
                        phone: u.phone || "+8801712345678",
                        gender: u.gender || "male",
                        birthdate: u.birthdate || "1998-05-21"
                    });
                }
            } catch (err) {
                console.error("Failed to load coordinator user details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);

        setTimeout(() => {
            setIsSavingProfile(false);
            toast.success("Profile details updated successfully!");
        }, 1000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setIsSavingPassword(true);

        setTimeout(() => {
            setIsSavingPassword(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Password updated successfully!");
        }, 1200);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="w-10 h-10 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left section: Visual Profile overview */}
            <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl h-fit">
                <div className="w-24 h-24 rounded-full border-2 border-[#2A9D90]/50 overflow-hidden relative bg-[#1F2937] mb-6 flex items-center justify-center text-[#00D1FF] text-4xl font-bold">
                    {user?.name?.charAt(0) || "C"}
                </div>
                <h3 className="text-xl font-bold text-white mb-1.5">{user?.name || "Coordinator"}</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A9D90]/10 border border-[#2A9D90]/25 text-[#2A9D90] text-[10px] uppercase font-bold tracking-wider mb-6">
                    <ShieldCheck size={12} />
                    {user?.role || "Coordinator"}
                </div>
                
                <div className="w-full text-left space-y-4 text-sm text-gray-400 border-t border-white/5 pt-6">
                    <div>
                        <span className="text-xs text-gray-500 block">Email Address</span>
                        <span className="text-white font-medium">{profileForm.email}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Contact Phone</span>
                        <span className="text-white font-medium">{profileForm.phone}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Institution</span>
                        <span className="text-white font-medium">PublicationHub Central Office</span>
                    </div>
                </div>
            </div>

            {/* Right section: Profile & Credentials forms */}
            <div className="col-span-2 space-y-8">
                
                {/* Profile Form */}
                <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                        <User className="text-[#00D1FF]" size={20} />
                        Profile Settings
                    </h3>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    value={profileForm.firstName}
                                    onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                />
                            </div>
                            
                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    value={profileForm.lastName}
                                    onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all opacity-60"
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Contact Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Gender</label>
                                <select
                                    value={profileForm.gender}
                                    onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                >
                                    <option value="male" className="bg-[#111827]">Male</option>
                                    <option value="female" className="bg-[#111827]">Female</option>
                                    <option value="other" className="bg-[#111827]">Other</option>
                                </select>
                            </div>

                            {/* Birthdate */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Birthdate</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                                    <input
                                        type="date"
                                        value={profileForm.birthdate}
                                        onChange={e => setProfileForm({ ...profileForm, birthdate: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 text-sm shrink-0 min-w-[150px]"
                            >
                                {isSavingProfile ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                    </>
                                ) : "Save Updates"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                        <Lock className="text-[#00D1FF]" size={20} />
                        Update Password
                    </h3>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1F2937]/50 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/30 focus:border-[#00D1FF]/50 text-white transition-all"
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2A9D90] to-[#6467F2] text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold flex items-center justify-center gap-2 text-sm shrink-0 min-w-[170px]"
                            >
                                {isSavingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                    </>
                                ) : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    );
};

export default ProfileView;
