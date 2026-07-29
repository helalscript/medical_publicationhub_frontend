"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, School, Building2, Upload, Save, X, Edit3, Loader2, Lock } from "lucide-react";
import { ICurrentUser } from "@/types/auth/auth";
import { updateProfile, deleteProfile } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PasswordChange from "./Passwordchange";

interface ProfileSettingsProps {
    user: ICurrentUser;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        institution: user.institution || "",
        department: "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        gender: user.gender || "male",
        birthdate: user.birthdate || "",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Split name into first and last name for API
            const nameParts = formData.name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            const res = await updateProfile({
                name: formData.name,
                firstName,
                lastName,
                mobileNumber: formData.phone,
                email: formData.email,
                avatar: avatarFile || formData.avatar,
                institution: formData.institution,
                gender: formData.gender,
                birthdate: formData.birthdate,
            });
            if (res?.status) {
                toast.success("Profile updated successfully");
                setIsEditing(false);
            } else {
                toast.error(res?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (!confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            const res = await deleteProfile();
            if (res?.status) {
                toast.success("Account deleted successfully");
                router.push("/login");
            } else {
                toast.error(res?.message || "Failed to delete account");
            }
        } catch {
            toast.error("An error occurred while deleting your account");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 ">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Profile Settings</h2>
                {!isEditing ? (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-95 border border-white/5"
                        >
                            <Lock className="w-4 h-4" /> Change Password
                        </button>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-[#00D1FF] hover:bg-[#00A3FF] text-black font-bold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-[#00D1FF]/20"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={() => setIsEditing(false)}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-[#00D1FF] hover:bg-[#00A3FF] text-black font-bold py-2.5 px-6 rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-[#00D1FF]/20 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-3 bg-[#111419] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 text-[#00D1FF]">
                        <User className="w-5 h-5" />
                        <h3 className="text-lg font-bold text-white">Personal Information</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#00D1FF] transition-colors" />
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#00D1FF] transition-colors" />
                                <input 
                                    type="email" 
                                    disabled={!isEditing}
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Gender</label>
                                <select 
                                    disabled={!isEditing}
                                    value={formData.gender}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all appearance-none"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Birthdate</label>
                                <input 
                                    type="date" 
                                    disabled={!isEditing}
                                    value={formData.birthdate}
                                    onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                                    className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Institution</label>
                                <div className="relative group">
                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#00D1FF] transition-colors" />
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={formData.institution}
                                        onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                        className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Department</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#00D1FF] transition-colors" />
                                    <input 
                                        type="text" 
                                        disabled={!isEditing}
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:outline-none focus:border-[#00D1FF]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center">
                        <div className="flex items-center gap-3 w-full mb-8 text-[#00D1FF]">
                            <Upload className="w-5 h-5" />
                            <h3 className="text-lg font-bold text-white">Profile Picture</h3>
                        </div>

                        <div className="relative mb-8">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#00D1FF]/30 overflow-hidden relative group shadow-2xl shadow-[#00D1FF]/10 flex items-center justify-center bg-[#1F242D]">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-[#00D1FF]/50" />
                                )}
                                {isEditing && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Upload className="w-8 h-8 text-[#00D1FF] mb-2" />
                                        <span className="text-[10px] font-bold uppercase">Upload Photo</span>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*" 
                            />
                        </div>

                        {isEditing && (
                           <div className="w-full">
                                <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Avatar URL</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter image URL..."
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                                    className="w-full bg-[#1F242D] border border-white/5 rounded-xl py-3 pl-4 pr-4 text-xs text-white focus:outline-none focus:border-[#00D1FF]/30 transition-all font-mono"
                                />
                           </div>
                        )}
                    </div>
                </div>
            </div>

            <PasswordChange 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />

            <div className="bg-[#111419] border border-red-500/20 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-[#64748B] mb-4">Permanently delete your account and all associated data.</p>
                <button
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold py-2.5 px-6 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
