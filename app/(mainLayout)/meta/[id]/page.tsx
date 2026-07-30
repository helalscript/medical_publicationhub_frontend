"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    List,
    Clock,
    Users,
    CheckCircle2,
    ShieldCheck,
    Play,
    Star,
    ArrowRight,
    CreditCard,
    Globe,
    GraduationCap,
    FileText,
    Download,
    ExternalLink,
    Lock,
    ChevronDown,
    Info
} from "lucide-react";
import metaBg from "@/assets/images/metabg.png";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCourseDetails, getMyCourses } from "@/services/home";
import { buildCheckoutUrl } from "@/lib/payment/utils";
import { Course } from "@/types/course";
import { Loader2 } from "lucide-react";
import VideoModal from "@/page/meta/VideoModal";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CourseDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<{ title: string; videoUrl?: string | null; lessonId?: string | number } | null>(null);
    const [selectedTextContent, setSelectedTextContent] = useState<{ title: string; content: string } | null>(null);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [lastPlayedLesson, setLastPlayedLesson] = useState<{ id: number; title: string; video: string } | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    const handleEnroll = () => {
        if (!course) return;
        const price = Number.parseFloat(course.price);
        if (!Number.isFinite(price) || price <= 0) {
            toast.error("This course is not available for purchase.");
            return;
        }
        router.push(
            buildCheckoutUrl({
                payable_type: "course",
                payable_id: course.id,
                amount: course.price,
                title: course.title,
            })
        );
    };

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId) 
                : [...prev, moduleId]
        );
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const res = await getCourseDetails(id as string);
                if (res.status) {
                    setCourse(res.data);
                } else {
                    setError(res.message);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (!course) return;

        const checkEnrollment = async () => {
            try {
                const res = await getMyCourses();
                if (res?.status) {
                    const enrolledData = Array.isArray(res.data) 
                        ? res.data 
                        : (res.data?.data || []);
                    const enrolled = enrolledData.some((c: any) => c.id.toString() === course.id.toString());
                    setIsEnrolled(enrolled);
                }
            } catch (err) {
                console.error("Error checking course enrollment:", err);
            }
        };
        checkEnrollment();

        // Load completed lessons & last played lesson
        const completed: number[] = [];
        let lastPlayed: typeof lastPlayedLesson = null;
        const lastPlayedId = localStorage.getItem(`course_${course.id}_last_played_lesson`);

        course.modules?.forEach((module: any) => {
            module.lessons?.forEach((lesson: any) => {
                if (localStorage.getItem(`course_${course.id}_lesson_${lesson.id}_completed`) === "true") {
                    completed.push(lesson.id);
                }
                if (lastPlayedId && lesson.id.toString() === lastPlayedId) {
                    lastPlayed = { id: lesson.id, title: lesson.title, video: lesson.video };
                }
            });
        });

        setCompletedLessons(completed);
        setLastPlayedLesson(lastPlayed);
    }, [course]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] flex flex-col items-center justify-center gap-4">
                <p className="text-red-400 text-xl font-bold">{error || "Course not found"}</p>
                <Link href="/meta" className="text-cyan-400 hover:underline">Back to Academy</Link>
            </div>
        );
    }
    return (
        <section className="relative min-h-screen bg-[#0A0C0F] pt-28 pb-24 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={metaBg}
                    alt="Background"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-30 select-none pointer-events-none"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0C0F]/80 via-[#0A0C0F]/90 to-[#0A0C0F]" />
            </div>

            <div className="container mx-auto  relative z-10">
                {/* Back Link */}
                <Link
                    href="/meta"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold tracking-wide uppercase">Back to Academy</span>
                </Link>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Left Content Column */}
                    <div className="flex-1 max-w-4xl">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-3 mb-10">
                            {course.categories?.map((cat) => (
                                <span key={cat.id} className="px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold uppercase tracking-[0.1em] backdrop-blur-md">
                                    {cat.name}
                                </span>
                            ))}
                            {course.is_future && (
                                <span className="px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-[0.1em] backdrop-blur-md">
                                    Upcoming
                                </span>
                            )}
                        </div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-extrabold text-white mb-10 leading-[1.2] tracking-tight"
                        >
                            {course.title}
                        </motion.h1>

                        {/* Overview and Descriptions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-10 text-gray-400 text-lg leading-relaxed mb-12 max-w-3xl"
                        >
                            <div className="prose prose-invert prose-p:text-gray-400 prose-p:leading-relaxed">
                                <p>{course.overview}</p>
                            </div>

                            {course.descriptions?.map((desc, idx) => (
                                <div key={idx} className="space-y-4">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{desc.title}</h3>
                                    <div 
                                        className="prose prose-invert prose-p:text-gray-400 prose-li:text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: desc.description }} 
                                    />
                                </div>
                            ))}
                        </motion.div>

                        {/* Key Stats Bar */}
                        <div className="flex flex-wrap items-center gap-10 text-gray-400 mb-16 py-6 border-y border-white/5">
                            <div className="flex items-center gap-3">
                                <List className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm font-bold text-gray-300">
                                    {course.modules?.length || course.start_module} Modules
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm font-bold text-gray-300">
                                    {course.total_durations}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-cyan-400" />
                                <span className="text-sm font-bold text-gray-300">Active Course</span>
                            </div>
                        </div>

                        {/* Instructor Profile Card */}
                        {course.mentors?.[0] && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col md:flex-row items-center md:items-start gap-8"
                            >
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 shadow-2xl bg-gray-800">
                                    {course.mentors[0].user?.avatar ? (
                                        <Image
                                            src={course.mentors[0].user.avatar}
                                            alt={course.mentors[0].user.name}
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Users className="w-10 h-10 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                        <h4 className="text-2xl font-bold text-white tracking-tight">
                                            {course.mentors[0].user?.name}
                                        </h4>
                                        <div className="p-1 rounded-full bg-blue-500/20">
                                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-base leading-relaxed max-w-xl italic opacity-80">
                                        Expert Research Mentor at PublicationHub Academy. Dedicated to advancing scientific writing and research excellence.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Enrollment Sidebar (Styled like the exact Card Design) */}
                    <aside className="lg:w-[420px] shrink-0">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="sticky top-28 bg-[#111419] border border-white/5 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Media Section */}
                            <div className="relative aspect-video overflow-hidden bg-gray-900 group/media">
                                {course.thumbnail ? (
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 420px"
                                        className="object-cover transition-transform duration-1000 group-hover/media:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Play className="w-12 h-12 text-gray-800" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/40 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button 
                                        onClick={() => setSelectedVideo({ title: "Course Introduction", videoUrl: course.intro_video })}
                                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 z-10"
                                    >
                                        <Play className="w-7 h-7 fill-current ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-8">
                                {isEnrolled ? (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 mb-10">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white font-black text-lg">You are Enrolled</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">You have full access to all curriculum modules and lessons.</p>
                                        </div>
                                        {lastPlayedLesson && (
                                            <button
                                                onClick={() => setSelectedVideo({ title: lastPlayedLesson.title, videoUrl: lastPlayedLesson.video, lessonId: lastPlayedLesson.id })}
                                                className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all active:scale-[0.97] flex items-center justify-center gap-1.5"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                RESUME: {lastPlayedLesson.title.length > 20 ? lastPlayedLesson.title.substring(0, 20) + "..." : lastPlayedLesson.title}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Pricing */}
                                        <div className="mb-8">
                                            <div className="flex items-baseline gap-4 mb-3">
                                                <span className="text-5xl font-black text-cyan-400 tracking-tighter">${course.price}</span>
                                                {course.old_price && (
                                                    <span className="text-xl text-gray-500 line-through font-medium opacity-60">${course.old_price}</span>
                                                )}
                                            </div>
                                            <div className="inline-flex items-center gap-2 text-emerald-400 text-[13px] font-bold uppercase tracking-wider">
                                                <Star className="w-4 h-4 fill-current" />
                                                Limited Time Offer
                                            </div>
                                        </div>

                                        {/* Enrollment CTA */}
                                        <div className="space-y-4 mb-10">
                                            <button
                                                onClick={handleEnroll}
                                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#8E90FF] text-white font-black text-lg transition-all active:scale-[0.98] shadow-[0_10px_25px_rgba(0,212,255,0.2)] flex items-center justify-center gap-2 group"
                                            >
                                                ENROLL NOW
                                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                            </button>

                                            <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10">
                                                {course.thumbnail_button_text || "Try Free Sample"}
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* Feature List */}
                                <div>
                                    <h5 className="text-gray-300 font-extrabold text-xs mb-6 uppercase tracking-[0.2em] opacity-80">Included in this course:</h5>
                                    <div className="space-y-5">
                                        {[
                                            { icon: <Clock className="w-5 h-5" />, text: "Lifetime access to all modules" },
                                            { icon: <GraduationCap className="w-5 h-5" />, text: "Official certificate of completion" },
                                            { icon: <Globe className="w-5 h-5" />, text: "Expert support & community access" },
                                            { icon: <CreditCard className="w-5 h-5" />, text: "Privacy and return guarantee" },
                                        ].map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-4 text-gray-400 group cursor-default">
                                                <div className="mt-0.5 text-cyan-400 transition-transform group-hover:scale-110">
                                                    {feature.icon}
                                                </div>
                                                <span className="text-[15px] font-medium leading-snug group-hover:text-gray-200 transition-colors">{feature.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </aside>
                </div>

                {/* Course Curriculum Section */}
                {course.modules && course.modules.length > 0 && (
                    <div className="mt-24 max-w-4xl">
                        <h2 className="text-3xl font-black text-white mb-10 tracking-tight flex items-center gap-4">
                            <span className="w-1.5 h-8 bg-cyan-400 rounded-full" />
                            Course Curriculum
                        </h2>

                        <div className="space-y-6">
                             {course.modules.map((module, idx) => {
                                const isExpanded = expandedModules.includes(module.id);
                                const isLocked = module.is_locked && !isEnrolled;
                                return (
                                    <div key={module.id} className="space-y-4">
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            onClick={() => toggleModule(module.id)}
                                            className={`group p-6 rounded-3xl bg-white/[0.02] border backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between transition-all shadow-xl cursor-pointer ${
                                                isExpanded ? "border-cyan-500/40 bg-white/[0.05]" : "border-white/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-base shadow-inner">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-lg mb-1.5 group-hover:text-cyan-400 transition-colors">
                                                        {module.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                                                            {module.type === "video" ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                            <span>{module.type}</span>
                                                        </div>
                                                        <span className="opacity-30 text-lg">•</span>
                                                        <span>{module.durations || "N/A"}</span>
                                                        {isLocked && (
                                                            <>
                                                                <span className="opacity-30 text-lg">•</span>
                                                                <span className="text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                                                    <Lock className="w-3 h-3" /> Locked
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                    {/* Module Resources */}
                                                    {module.video && (
                                                        <button 
                                                            onClick={() => !isLocked && setSelectedVideo({ title: module.title, videoUrl: module.video })}
                                                            className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-lg shadow-cyan-500/5 active:scale-90"
                                                            title="Play Module Video"
                                                            disabled={isLocked}
                                                        >
                                                            <Play className="w-5 h-5 fill-current" />
                                                        </button>
                                                    )}
                                                    {module.document && (
                                                        <a 
                                                            href={module.document} 
                                                            target="_blank" 
                                                            className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all active:scale-90"
                                                            title="View Document"
                                                        >
                                                            <FileText className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {module.attached_file && (
                                                        <a 
                                                            href={module.attached_file} 
                                                            download 
                                                            className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                                                            title="Download Resource"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {module.attached_text && (
                                                        <button 
                                                            onClick={() => setSelectedTextContent({ title: module.title, content: module.attached_text || "" })}
                                                            className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition-all active:scale-90"
                                                            title="View Notes"
                                                        >
                                                            <Info className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180 text-cyan-400" : ""}`} />
                                                </div>
                                            </div>
                                        </motion.div>
                                        
                                        {/* Lessons list (Sub-items) */}
                                        <AnimatePresence>
                                            {isExpanded && module.lessons.length > 0 && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-6 md:ml-12 pl-6 border-l border-white/5 space-y-3 pb-4">
                                                        {module.lessons.map((lesson) => (
                                                            <div key={lesson.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group/lesson">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`w-2 h-2 rounded-full ${completedLessons.includes(lesson.id) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-700 group-hover/lesson:bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0)] group-hover/lesson:shadow-[0_0_8px_rgba(6,182,212,0.5)]"} transition-colors`} />
                                                                    <div>
                                                                        <h5 className={`text-sm font-bold transition-colors ${completedLessons.includes(lesson.id) ? "text-emerald-400 line-through opacity-70" : "text-gray-400 group-hover/lesson:text-gray-100"}`}>{lesson.title}</h5>
                                                                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">{lesson.durations || "5-10 min"}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="mt-3 md:mt-0 flex items-center gap-2 opacity-60 group-hover/lesson:opacity-100 transition-opacity">
                                                                    {lesson.video && (
                                                                        <button 
                                                                            onClick={() => !isLocked && setSelectedVideo({ title: lesson.title, videoUrl: lesson.video, lessonId: lesson.id })}
                                                                            className="p-2 rounded-lg text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                                                                            disabled={isLocked}
                                                                        >
                                                                            <Play className="w-4 h-4 fill-current" />
                                                                        </button>
                                                                    )}
                                                                    {lesson.document && (
                                                                        <a href={lesson.document} target="_blank" className="p-2 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors">
                                                                            <FileText className="w-4 h-4" />
                                                                        </a>
                                                                    )}
                                                                    {lesson.attached_file && (
                                                                        <a href={lesson.attached_file} download className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                                                                            <Download className="w-4 h-4" />
                                                                        </a>
                                                                    )}
                                                        {lesson.attached_text && (
                                                            <button 
                                                                onClick={() => !isLocked && setSelectedTextContent({ title: lesson.title, content: lesson.attached_text || "" })}
                                                                className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                                                                disabled={isLocked}
                                                                title="View Notes"
                                                            >
                                                                <Info className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {lesson.file && (
                                                            <a 
                                                                href={lesson.file} 
                                                                target="_blank" 
                                                                className="p-2 rounded-lg text-gray-500 hover:bg-white/10 transition-colors"
                                                                title="View File"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <VideoModal 
                isOpen={!!selectedVideo} 
                onClose={() => {
                    setSelectedVideo(null);
                    if (course) {
                        const completed: number[] = [];
                        let lastPlayed: any = null;
                        const lastPlayedId = localStorage.getItem(`course_${course.id}_last_played_lesson`);
                        course.modules?.forEach((module: any) => {
                            module.lessons?.forEach((lesson: any) => {
                                if (localStorage.getItem(`course_${course.id}_lesson_${lesson.id}_completed`) === "true") {
                                    completed.push(lesson.id);
                                }
                                if (lastPlayedId && lesson.id.toString() === lastPlayedId) {
                                    lastPlayed = { id: lesson.id, title: lesson.title, video: lesson.video };
                                }
                            });
                        });
                        setCompletedLessons(completed);
                        setLastPlayedLesson(lastPlayed);
                    }
                }} 
                title={selectedVideo?.title || ""} 
                videoUrl={selectedVideo?.videoUrl || undefined}
                courseId={course?.id}
                lessonId={selectedVideo?.lessonId}
            />

            <TextContentModal 
                isOpen={!!selectedTextContent}
                onClose={() => setSelectedTextContent(null)}
                title={selectedTextContent?.title || ""}
                content={selectedTextContent?.content || ""}
            />
        </section>
    );
};

// Simple inline Modal for text content
const TextContentModal = ({ isOpen, onClose, title, content }: { isOpen: boolean, onClose: () => void, title: string, content: string }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-2xl bg-[#111419] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                        >
                            <ChevronDown className="w-6 h-6 rotate-180" />
                        </button>
                    </div>
                    <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                            {content}
                        </div>
                    </div>
                    <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 rounded-xl bg-cyan-500 text-black font-black text-sm hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CourseDetails;
