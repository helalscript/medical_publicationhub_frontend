"use client";

import React, { useRef, useEffect } from "react";
import { X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl?: string;
    title: string;
    courseId?: string | number;
    lessonId?: string | number;
}

const VideoModal = ({ isOpen, onClose, videoUrl, title, courseId, lessonId }: VideoModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Restore time progress when modal opens and video ref is ready
    useEffect(() => {
        if (isOpen && videoUrl && courseId && lessonId) {
            // Save last played lesson ID for the course
            localStorage.setItem(`course_${courseId}_last_played_lesson`, lessonId.toString());

            const timer = setTimeout(() => {
                if (videoRef.current) {
                    const savedTime = localStorage.getItem(`course_${courseId}_lesson_${lessonId}_time`);
                    if (savedTime) {
                        const parsedTime = parseFloat(savedTime);
                        if (!isNaN(parsedTime)) {
                            videoRef.current.currentTime = parsedTime;
                        }
                    }
                }
            }, 300); // Small delay to let video metadata load
            return () => clearTimeout(timer);
        }
    }, [isOpen, videoUrl, courseId, lessonId]);

    // Handle updates to saving position
    const handleTimeUpdate = () => {
        if (videoRef.current && courseId && lessonId) {
            localStorage.setItem(
                `course_${courseId}_lesson_${lessonId}_time`,
                videoRef.current.currentTime.toString()
            );
        }
    };

    // Mark as completed when the video ends
    const handleEnded = () => {
        if (courseId && lessonId) {
            localStorage.setItem(`course_${courseId}_lesson_${lessonId}_completed`, "true");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-5xl aspect-video bg-[#0A0C0F] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                >
                    {/* Header */}
                    <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10">
                        <h3 className="text-white font-medium truncate pr-8">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Video Player */}
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        {videoUrl ? (
                            <video
                                ref={videoRef}
                                controls
                                className="w-full h-full object-contain"
                                autoPlay
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleEnded}
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Play size={40} className="text-gray-600" />
                                </div>
                                <p className="text-gray-400 font-medium text-lg">Intro video not available for this course</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VideoModal;
