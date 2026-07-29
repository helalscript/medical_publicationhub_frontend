"use client";
import React, { useState, useEffect } from "react";
import { User, Mail, Camera, Edit3, Save, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "@/services/auth";
import { ICurrentUser } from "@/types/auth/auth";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [user, setUser] = useState<ICurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setFormData({
            name: currentUser.name || "",
            email: currentUser.email || "",
            avatar: currentUser.avatar || ""
        });
        setUser(currentUser);
      }
      setIsLoadingUser(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    toast.loading("Updating profile...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEditing(false);
    toast.dismiss();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-[900px] mx-auto w-full">
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Account</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Profile Settings</h2>
            <p className="text-gray-400 text-sm font-medium">Manage your personal information and profile picture.</p>
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.button
                key="edit-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 shrink-0"
              >
                <Edit3 size={18} />
                Edit Profile
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111827] border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-cyan-400">
                <User size={20} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Personal Information</h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                   {isLoadingUser ? (
                       <div className="w-full h-[54px] bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
                   ) : (
                       <input 
                        type="text" 
                        value={formData.name}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your Name"
                        className={`w-full bg-[#0A0C0F] border rounded-2xl py-4 pl-12 pr-4 text-sm text-white transition-all ${
                          isEditing 
                            ? "border-cyan-400/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" 
                            : "border-white/5 opacity-60 cursor-not-allowed"
                        }`}
                       />
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                   {isLoadingUser ? (
                       <div className="w-full h-[54px] bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
                   ) : (
                       <input 
                        type="email" 
                        value={formData.email}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@research.edu"
                        className={`w-full bg-[#0A0C0F] border rounded-2xl py-4 pl-12 pr-4 text-sm text-white transition-all ${
                          isEditing 
                            ? "border-cyan-400/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10" 
                            : "border-white/5 opacity-60 cursor-not-allowed"
                        }`}
                       />
                   )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Picture */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#111827] border border-white/5 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-cyan-400">
                <Camera size={20} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Profile Picture</h2>
            </div>

            <div className="flex flex-col items-center gap-8 py-4">
               <div className="relative group">
                  <div className="w-40 h-40 rounded-full border-4 border-cyan-400/20 group-hover:border-cyan-400/50 transition-all overflow-hidden relative shadow-2xl">
                     {isLoadingUser ? (
                        <div className="w-full h-full bg-white/5 animate-pulse"></div>
                     ) : formData.avatar ? (
                        <Image 
                           src={formData.avatar} 
                           alt="Profile Picture" 
                           fill 
                           className="object-cover transition-transform group-hover:scale-110"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0A0C0F] text-gray-700">
                           <User size={64} />
                        </div>
                     )}
                     {isEditing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="text-white" size={32} />
                        </div>
                     )}
                  </div>
               </div>

               {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full flex flex-col gap-2"
                  >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Avatar URL</label>
                    <div className="relative">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                       <input 
                        type="text" 
                        value={formData.avatar}
                        onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#0A0C0F] border border-cyan-400/30 border-dashed rounded-2xl py-4 pl-12 pr-4 text-xs text-blue-400 focus:outline-none focus:border-cyan-400 transition-all"
                       />
                    </div>
                  </motion.div>
               )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-end gap-4 mt-4"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 rounded-xl bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-10 py-3 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all font-sans"
                style={{ background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)" }}
              >
                <Save size={20} />
                Save Changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileSettings;
