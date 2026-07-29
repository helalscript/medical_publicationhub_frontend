"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, User, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getResearcherApplications } from "@/services/home";
import Link from "next/link";

interface MyApplicationsContentProps {
    initialApplications?: any[];
    initialPagination?: any;
    applicationsBasePath?: string;
}

export default function MyApplicationsContent({
    initialApplications,
    initialPagination,
    applicationsBasePath = "/myprofile/applications",
}: MyApplicationsContentProps) {
    const [applications, setApplications] = useState<any[]>(initialApplications || []);
    const [loading, setLoading] = useState(!initialApplications);
    const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
    const [totalPages, setTotalPages] = useState(initialPagination?.last_page || 1);

    useEffect(() => {
        if (initialApplications && currentPage === (initialPagination?.current_page || 1)) {
            setLoading(false);
            return;
        }

        const fetchApps = async () => {
            setLoading(true);
            try {
                const res = await getResearcherApplications(currentPage);
                if (res?.status) {
                    setApplications(res.data);
                    setTotalPages(res.pagination?.last_page || 1);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [currentPage, initialApplications, initialPagination]);

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#00D1FF]" />
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Research Applications</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00D1FF]"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 text-[#64748B]">
                        No applications found.
                    </div>
                ) : (
                    applications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#111419] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 hover:border-[#00D1FF]/20 transition-all duration-300 group"
                        >
                            <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-[#1F242D] border border-white/5">
                                {app.opportunity?.thumbnail ? (
                                    <img src={app.opportunity.thumbnail} alt={app.opportunity?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <FileText className="w-8 h-8 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                         <span className="text-[#00D1FF] text-[10px] font-bold uppercase tracking-widest">
                                            Opportunity Application
                                         </span>
                                         <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(app.status)} uppercase tracking-wider`}>
                                             {app.status}
                                         </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#00D1FF] transition-colors">{app.opportunity?.title}</h3>
                                    
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[#64748B] text-xs">
                                         <div className="flex items-center gap-1.5">
                                             <User className="w-3.5 h-3.5 text-[#00D1FF]" />
                                             <span>Mentor ID: {app.opportunity?.mentor_id}</span>
                                         </div>
                                         <div className="flex items-center gap-1.5">
                                             <Clock className="w-3.5 h-3.5 text-[#00D1FF]" />
                                             <span>Applied on: {new Date(app.created_at).toLocaleDateString()}</span>
                                         </div>
                                         {app.opportunity?.dead_line && (
                                             <div className="flex items-center gap-1.5">
                                                 <Calendar className="w-3.5 h-3.5 text-[#00D1FF]" />
                                                 <span>Deadline: {new Date(app.opportunity.dead_line).toLocaleDateString()}</span>
                                             </div>
                                         )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:justify-center">
                                 <Link 
                                    href={`${applicationsBasePath}/${app.id}`}
                                    className="bg-[#1F242D] hover:bg-white/5 text-center text-white border border-white/5 py-2.5 px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                                 >
                                     View Details
                                 </Link>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-white/5">
                    <button
                        onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-[#111419] border border-white/5 text-[#A3A7AE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNumber = i + 1;
                            if (
                                pageNumber === 1 || 
                                pageNumber === totalPages || 
                                Math.abs(currentPage - pageNumber) <= 1
                            ) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`min-w-[40px] h-10 rounded-lg flex items-center justify-center border transition-colors text-sm ${
                                            currentPage === pageNumber
                                                ? "bg-[#00D1FF]/10 border-[#00D1FF]/30 text-[#00D1FF] font-bold"
                                                : "bg-[#111419] border-white/5 text-[#A3A7AE] hover:text-white"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={i} className="text-[#64748B]">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-[#111419] border border-white/5 text-[#A3A7AE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
