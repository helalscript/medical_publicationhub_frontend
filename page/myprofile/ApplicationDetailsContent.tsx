"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Calendar, User, Clock, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteResearcherApplication } from "@/services/researcher";
import { toast } from "sonner";

interface ApplicationDetailsContentProps {
    application: any;
    applicationsPath?: string;
}

export default function ApplicationDetailsContent({
    application,
    applicationsPath = "/myprofile/applications",
}: ApplicationDetailsContentProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        setDeleting(true);
        try {
            const res = await deleteResearcherApplication(application.id);
            if (res?.status) {
                toast.success("Application deleted successfully");
                router.push(applicationsPath);
            } else {
                toast.error(res?.message || "Failed to delete application");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case "accept":
            case "accepted":
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "reject":
            case "rejected":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    const { opportunity } = application;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href={applicationsPath} className="p-2 bg-[#111419] border border-white/5 rounded-xl text-white hover:border-[#00D1FF]/30 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Application Details</h2>
                    <p className="text-sm text-[#64748B]">View details of your opportunity application</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111419] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(application.status)} uppercase tracking-wider mb-4`}>
                                    {application.status}
                                </span>
                                <h1 className="text-2xl font-bold text-white mb-2">{opportunity?.title}</h1>
                                <p className="text-[#64748B] text-sm">{opportunity?.overview}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1">Mentor ID</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#00D1FF]" />
                                    {opportunity?.mentor_id}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1">Price</span>
                                <span className="text-white font-medium">${opportunity?.price}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1">Duration</span>
                                <span className="text-white font-medium">{opportunity?.durations}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1">Deadline</span>
                                <span className="text-white font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#00D1FF]" />
                                    {opportunity?.dead_line ? new Date(opportunity.dead_line).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {opportunity?.desciptions && opportunity.desciptions.map((desc: any, idx: number) => (
                            <div key={idx} className="space-y-3">
                                <h3 className="text-lg font-bold text-white">{desc.title}</h3>
                                <div 
                                    className="text-[#A3A7AE] text-sm prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: desc.description }}
                                />
                            </div>
                        ))}
                    </motion.div>

                    {/* Applicant details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#111419] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6"
                    >
                        <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Your Application Data</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1 uppercase tracking-wider">Institution</span>
                                <span className="text-white text-sm">{application.institution || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1 uppercase tracking-wider">Field of Study</span>
                                <span className="text-white text-sm">{application.field_of_study || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1 uppercase tracking-wider">Highest Education</span>
                                <span className="text-white text-sm">{application.highest_edu_level || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-[#64748B] mb-1 uppercase tracking-wider">Current Position</span>
                                <span className="text-white text-sm">{application.current_position || 'N/A'}</span>
                            </div>
                        </div>

                        {application.cover_letter && (
                            <div className="mt-6">
                                <span className="block text-xs text-[#64748B] mb-2 uppercase tracking-wider">Cover Letter</span>
                                <div className="bg-[#1A1E26] p-4 rounded-xl text-sm text-[#A3A7AE] whitespace-pre-wrap">
                                    {application.cover_letter}
                                </div>
                            </div>
                        )}
                        
                        {application.research_experience && (
                            <div className="mt-6">
                                <span className="block text-xs text-[#64748B] mb-2 uppercase tracking-wider">Research Experience</span>
                                <div className="bg-[#1A1E26] p-4 rounded-xl text-sm text-[#A3A7AE] whitespace-pre-wrap">
                                    {application.research_experience}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#111419] border border-white/5 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Timeline</h3>
                        
                        <div className="space-y-6">
                            <div className="relative pl-6 border-l-2 border-[#00D1FF]">
                                <div className="absolute w-3 h-3 bg-[#00D1FF] rounded-full -left-[7px] top-1"></div>
                                <h4 className="text-sm font-bold text-white">Application Submitted</h4>
                                <p className="text-xs text-[#64748B] mt-1">{new Date(application.created_at).toLocaleString()}</p>
                            </div>
                            
                            {application.status === 'accept' && (
                                <div className="relative pl-6 border-l-2 border-emerald-500">
                                    <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 flex items-center justify-center">
                                    </div>
                                    <h4 className="text-sm font-bold text-emerald-500">Application Accepted</h4>
                                    <p className="text-xs text-[#64748B] mt-1">{new Date(application.updated_at).toLocaleString()}</p>
                                </div>
                            )}

                            {application.status === 'reject' && (
                                <div className="relative pl-6 border-l-2 border-red-500">
                                    <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1"></div>
                                    <h4 className="text-sm font-bold text-red-500">Application Rejected</h4>
                                    <p className="text-xs text-[#64748B] mt-1">{new Date(application.updated_at).toLocaleString()}</p>
                                </div>
                            )}

                            {application.status === 'pending' && (
                                <div className="relative pl-6 border-l-2 border-white/10">
                                    <div className="absolute w-3 h-3 bg-[#111419] border-2 border-[#64748B] rounded-full -left-[7px] top-1"></div>
                                    <h4 className="text-sm font-bold text-[#64748B]">Under Review</h4>
                                    <p className="text-xs text-[#64748B] mt-1">Pending mentor decision</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {application.documents && application.documents.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#111419] border border-white/5 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Attached Documents</h3>
                            <div className="space-y-3">
                                {application.documents.map((doc: any, idx: number) => (
                                    <a 
                                        key={idx} 
                                        href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://ibraheemaltamim.thesyndicates.team'}/${doc.path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 bg-[#1A1E26] rounded-xl hover:bg-[#00D1FF]/10 transition-colors border border-transparent hover:border-[#00D1FF]/20 group"
                                    >
                                        <FileText className="w-5 h-5 text-[#64748B] group-hover:text-[#00D1FF]" />
                                        <span className="text-sm text-white truncate">{doc.original_name}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete Application
                    </button>
                </div>
            </div>
        </div>
    );
}
