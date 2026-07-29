"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, CheckCircle2, List, Clock, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import { Course } from "@/types/course";

interface CourseCardProps {
    course: Course;
    onPlay?: () => void;
}

const CourseCard = ({ course, onPlay }: CourseCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-[#111419] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
        >
            {/* Thumbnail */}
            <div
                className="relative aspect-video overflow-hidden cursor-pointer group/thumb"
                onClick={onPlay}
            >
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover/thumb:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1C1F26] flex items-center justify-center group-hover/thumb:bg-[#252a32] transition-colors">
                        <Play className="w-12 h-12 text-white/5 group-hover/thumb:text-cyan-500/20 transition-colors" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 group-hover/thumb:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                </div>

                {/* Intro Video Badge */}
                {course.intro_video && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Intro Video</span>
                    </div>
                )}
            </div>

            {/* Instructor Row */}
            <div className="px-5 py-4 flex items-center justify-between bg-[#111419] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-gray-800">
                        {course.mentors?.[0]?.user?.avatar ? (
                            <Image
                                src={course.mentors[0].user.avatar}
                                alt={course.mentors[0].user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={18} className="text-gray-600" />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-300">
                            {course.mentors?.[0]?.user?.name || "TBA Instructor"}
                        </span>
                        <div className="p-0.5 rounded-full bg-[#5D5DFF]/10">
                            <CheckCircle2 className="w-3 h-3 text-[#5D5DFF]" />
                        </div>
                    </div>
                </div>
                
                {/* Categories */}
                <div className="flex gap-2">
                    {course.categories?.slice(0, 1).map((cat) => (
                        <span key={cat.id} className="text-[9px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {cat.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <Link href={`/meta/${course.id}`}>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 hover:text-cyan-400 transition-colors tracking-tight">
                        {course.title}
                    </h3>
                </Link>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {course.short_description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center gap-6 text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-2">
                        <List className="w-4 h-4 text-cyan-500/60" />
                        <span>{course.modules?.length || course.start_module} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-500/60" />
                        <span>{course.total_durations}</span>
                    </div>
                </div>

                {/* Pricing & CTA Section */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1">Price</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white">${course.price}</span>
                            {course.old_price && (
                                <span className="text-sm text-gray-600 line-through font-medium">${course.old_price}</span>
                            )}
                        </div>
                    </div>
                    
                    <Link href={`/meta/${course.id}`} className="shrink-0">
                        <button className="px-6 py-3 rounded-xl bg-white/[0.03] hover:bg-white/10 text-white font-bold text-xs transition-all border border-white/10 active:scale-95 uppercase tracking-widest">
                            {course.thumbnail_button_text || "Details"}
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
