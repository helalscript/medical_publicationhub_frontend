"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, List, Loader2, Play, User } from "lucide-react";
import { getAllCourses } from "@/services/home";
import { Course } from "@/types/course";

interface AcademySectionData {
    title?: string;
    sub_title?: string;
    description?: string;
    button_text?: string;
    image?: string;
}

const AcademyCourseCard = ({ course }: { course: Course }) => {
    const categoryName = course.categories?.[0]?.name || "Course";
    const instructorName = course.mentors?.[0]?.user?.name || "Expert Instructor";
    const instructorAvatar = course.mentors?.[0]?.user?.avatar;
    const moduleCount = course.modules?.length || course.start_module || 0;

    return (
        <div
            className="group relative rounded-[16px] border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#00D1FF]/30 h-full"
            style={{
                background: "rgba(29, 32, 41, 0.88)",
                boxShadow: "0 1.593px 6.373px 0 rgba(29, 126, 135, 0.10)",
            }}
        >
            <Link href={`/meta/${course.id}`} className="relative aspect-video overflow-hidden block">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#1C1F26] flex items-center justify-center">
                        <Play className="w-10 h-10 text-[#00D1FF]/30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F]/80 via-transparent to-transparent" />
                {course.intro_video && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Preview</span>
                    </div>
                )}
                <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider text-[#9C8BE9] bg-[#3B384D] px-3 py-1 rounded-full">
                    {categoryName}
                </span>
            </Link>

            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#1F242D] shrink-0">
                        {instructorAvatar ? (
                            <Image src={instructorAvatar} alt={instructorName} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={14} className="text-[#A3A7AE]" />
                            </div>
                        )}
                    </div>
                    <span className="text-xs font-medium text-[#A3A7AE] truncate">{instructorName}</span>
                </div>

                <div className="space-y-2 flex-1">
                    <Link href={`/meta/${course.id}`}>
                        <h3
                            className="text-[#E5E7EB] text-lg font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {course.title}
                        </h3>
                    </Link>
                    <p className="text-[#A3A7AE] text-sm leading-5 line-clamp-2">{course.short_description}</p>
                </div>

                <div className="flex items-center gap-4 text-[#A3A7AE] text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                        <List size={14} className="text-[#00D1FF]" />
                        <span>{moduleCount} modules</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#00D1FF]" />
                        <span>{course.total_durations}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
                    <div>
                        <p className="text-[10px] text-[#A3A7AE] uppercase tracking-wider mb-0.5">Price</p>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">${course.price}</span>
                            {course.old_price && (
                                <span className="text-sm text-[#A3A7AE] line-through">${course.old_price}</span>
                            )}
                        </div>
                    </div>
                    <Link
                        href={`/meta/${course.id}`}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(42,157,144,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shrink-0"
                        style={{ background: "linear-gradient(135deg, #2A9D90 0%, #6467F2 100%)" }}
                    >
                        {course.thumbnail_button_text || "View Course"}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface AcademyShowcaseProps {
    initialCourses?: Course[];
    sectionData?: AcademySectionData | null;
}

const AcademyShowcase = ({ initialCourses, sectionData }: AcademyShowcaseProps) => {
    const [courses, setCourses] = useState<Course[]>(initialCourses || []);
    const [isLoading, setIsLoading] = useState(!initialCourses);

    useEffect(() => {
        if (initialCourses) {
            setIsLoading(false);
            return;
        }

        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCourses(1);
                if (data.status) {
                    const items = Array.isArray(data.data) ? data.data : [];
                    setCourses(items.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [initialCourses]);

    return (
        <section className="relative w-full bg-[#0A0C0F] py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-[#7661FF]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#2A9D90]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1C28] border border-white/10 mb-6">
                            <BookOpen size={14} className="text-[#9C8BE9]" />
                            <span className="text-[#A3A7AE] text-sm font-medium">Meta Academy</span>
                        </div>
                        <h2
                            className="text-4xl md:text-4xl font-bold text-white mb-6"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            Featured{" "}
                            <span className="bg-gradient-to-r from-[#00D1FF] to-[#7661FF] bg-clip-text text-transparent">
                                Academy Courses
                            </span>
                        </h2>
                        <p className="text-[#A3A7AE] text-base font-normal leading-6">
                            {sectionData?.sub_title ||
                                "Comprehensive courses designed by leading researchers to help you master essential skills—from methodology to publication."}
                        </p>
                    </div>
                    <Link
                        href="/meta"
                        className="flex items-center gap-2 text-[#00D1FF] font-medium hover:gap-3 transition-all shrink-0"
                    >
                        {sectionData?.button_text || "Explore All Courses"}
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <AcademyCourseCard key={course.id} course={course} />
                        ))}
                        {courses.length === 0 && (
                            <div className="col-span-full text-center text-[#A3A7AE] py-10">
                                No courses found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AcademyShowcase;
