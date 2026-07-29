"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#0A0C0F] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D1FF]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6467F2]/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Animated 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent select-none">
                        404
                    </h1>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-[-4rem] md:mt-[-6rem]"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Lost in the Research?
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                        The page you are looking for has been moved, deleted, or never existed in our database. Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2.5 bg-[#00D1FF] hover:bg-[#00A3FF] text-black font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[#00D1FF]/20 group"
                            >
                                <Home size={20} />
                                Back to Homepage
                            </motion.button>
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all border border-white/10 backdrop-blur-md"
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </motion.div>

                {/* Footer Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-8 text-gray-500 text-sm font-medium"
                >
                    <Link href="/faq" className="hover:text-white transition-colors">Help Center</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
                    <Link href="/researchopportunities" className="hover:text-white transition-colors">Opportunities</Link>
                </motion.div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
        </main>
    );
}
