import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, User, FileText, Tag } from "lucide-react";

// Types
interface ApiCategory {
    id: number;
    name: string;
}

interface ApiPublication {
    id: number;
    title: string;
    overview: string;
    description: string;
    attachment: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    categories: ApiCategory[];
}

const CATEGORY_COLORS = [
    { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    { bg: "bg-blue-500/10", text: "text-blue-400" },
    { bg: "bg-orange-500/10", text: "text-orange-400" },
    { bg: "bg-purple-500/10", text: "text-purple-400" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    { bg: "bg-pink-500/10", text: "text-pink-400" },
    { bg: "bg-red-500/10", text: "text-red-400" },
];

const getColorsForCategory = (id: number) => CATEGORY_COLORS[id % CATEGORY_COLORS.length];

export default function PublicationDetail({ pub }: { pub: ApiPublication }) {
    const year = pub.created_at ? new Date(pub.created_at).getFullYear() : new Date().getFullYear();

    return (
        <section className="min-h-screen bg-[#0A0C0F] text-white py-12 px-6 md:px-12 lg:px-20 font-inter">
            <div className="container mx-auto max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-[#64748B] hover:text-white mb-10 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to About
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {pub.categories && pub.categories.length > 0 ? (
                            pub.categories.map((cat) => {
                                const colors = getColorsForCategory(cat.id);
                                return (
                                    <span key={cat.id} className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold ${colors.bg} ${colors.text} uppercase tracking-wider`}>
                                        <Tag className="w-3 h-3 mr-1.5" /> {cat.name}
                                    </span>
                                );
                            })
                        ) : (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold ${CATEGORY_COLORS[0].bg} ${CATEGORY_COLORS[0].text} uppercase tracking-wider`}>
                                Uncategorized
                            </span>
                        )}
                        <span className="text-[#64748B] text-sm font-semibold ml-2 inline-flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" /> Published {year}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-[#EBEEF1]">
                        {pub.title}
                    </h1>

                    <div className="flex items-center gap-3 text-[#A3A7AE] text-sm mb-10">
                        <User className="w-4 h-4 shrink-0 text-[#00D1FF]" />
                        <span>PublicationHub Group</span>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5 mb-10" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                        <div 
                            className="prose prose-invert max-w-none text-[#A3A7AE] prose-a:text-[#00D1FF] prose-headings:text-white marker:text-[#00D1FF] font-inter leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: pub.description }}
                        />
                    </div>

                    {/* Action Panel */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-[#111419] border border-white/5 rounded-2xl p-6 sticky top-24">
                            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#00D1FF]" /> Document Options
                            </h3>
                            
                            <p className="text-[#A3A7AE] text-sm mb-6 leading-relaxed">
                                {pub.overview}
                            </p>

                            {pub.attachment ? (
                                <a
                                    href={pub.attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#00E5FF] hover:bg-[#00D1FF] text-black font-bold py-3.5 px-6 rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-[#00E5FF]/10 text-center"
                                >
                                    Open PDF Reader <ArrowUpRight className="w-5 h-5" />
                                </a>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-white/5 text-[#A3A7AE] font-bold py-3.5 px-6 rounded-xl text-sm cursor-not-allowed text-center"
                                >
                                    Document Unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
