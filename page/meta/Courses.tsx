"use client";

import React, { useState } from "react";
import CourseCard from "./CourseCard";
import VideoModal from "./VideoModal";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";

const Courses = () => {
    const {
        courses,
        categories,
        pagination,
        loading,
        error,
        currentPage,
        setCurrentPage,
        activeCategoryId,
        setActiveCategoryId
    } = useCourses();

    const [selectedVideo, setSelectedVideo] = useState<{ title: string; videoUrl?: string | null } | null>(null);

    // Helpers for pagination
    const totalPages = pagination?.last_page || 1;
    
    // Simple pagination numbers logic
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <section className="bg-[#0A0C0F] py-20 px-6 md:px-12 lg:px-20 min-h-screen">
            <div className="container mx-auto">
                {/* Filters */}
                <div className="flex items-start justify-start border-b border-white/10 mb-5">
                    <div className="flex flex-wrap items-center justify-start gap-3 mb-10 text-left">
                        <button
                            onClick={() => setActiveCategoryId(undefined)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategoryId === undefined
                                ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                : "bg-[#1C1F26] border-white/5 text-gray-400 hover:border-white/10 hover:bg-[#252a32]"
                                }`}
                        >
                            All Courses
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategoryId === category.id
                                    ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                                    : "bg-[#1C1F26] border-white/5 text-gray-400 hover:border-white/10 hover:bg-[#252a32]"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="min-h-[400px] flex items-center justify-center text-red-400 font-medium">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onPlay={() => setSelectedVideo({ title: course.title, videoUrl: course.intro_video })}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-gray-500">
                                    No courses found in this category.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <span>Prev</span>
                                </button>

                                <div className="flex items-center gap-2">
                                    {pageNumbers.map((page) => (
                                        <button
                                            key={page}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${page === currentPage
                                                ? "bg-cyan-500 text-white"
                                                : "text-gray-500 hover:text-white"
                                                }`}
                                            onClick={() => setCurrentPage(page as number)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                title={selectedVideo?.title || ""}
                videoUrl={selectedVideo?.videoUrl || undefined}
            />
        </section>
    );
};

export default Courses;