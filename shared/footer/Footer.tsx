"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TwitterIcon, LinkedInIcon, YoutubeIcon, MailIcon } from "@/components/icons/SocialIcons";
import navLogo from "@/assets/images/nav-logo.png";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { subscribeNewsletter, getSystemInfo, getSocialLinks } from "@/services/home";
import { getDynamicPages } from "@/services/dynamicPages";

interface SystemInfo {
    system_name: string;
    logo: string;
    favicon: string;
    copyright_text: string;
    description: string | null;
}

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [dynamicPages, setDynamicPages] = useState<any[]>([]);
    const [apiSocialLinks, setApiSocialLinks] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [systemRes, pagesRes, socialRes] = await Promise.all([
                    getSystemInfo(),
                    getDynamicPages(),
                    getSocialLinks(),
                ]);
                
                if (systemRes?.status) {
                    setSystemInfo(systemRes.data);
                }
                
                if (pagesRes?.status) {
                    setDynamicPages(pagesRes.data);
                }

                if (socialRes?.status && Array.isArray(socialRes.data)) {
                    setApiSocialLinks(socialRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch footer data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("email", email);
            const res = await subscribeNewsletter(formData);
            if (res.status) {
                toast.success(res.message || "Subscribed successfully!");
                setEmail("");
            } else {
                toast.error(res.message || "Failed to subscribe");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const footerLinks = {
        platform: [
            { name: "Research Opportunities", href: "/research" },
            { name: "About", href: "/about" },
            { name: "Research Services", href: "/services" },
            
        ],
        resources: [
            { name: "FAQ", href: "/faq" },
           
            { name: "Mentors", href: "/mentors" },
            { name: "Contact", href: "/contact" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
        ],
    };

    const defaultSocialLinks = [
        { icon: <TwitterIcon size={18} />, href: "#", label: "Twitter" },
        { icon: <LinkedInIcon size={18} />, href: "#", label: "LinkedIn" },
        { icon: <YoutubeIcon size={18} />, href: "#", label: "YouTube" },
        { icon: <MailIcon size={18} />, href: "#", label: "Email" },
    ];

    const socialLinks = apiSocialLinks.length > 0
        ? apiSocialLinks.map((link: any) => ({
            icon: link.platform?.toLowerCase().includes("linkedin") ? <LinkedInIcon size={18} />
                : link.platform?.toLowerCase().includes("youtube") ? <YoutubeIcon size={18} />
                : link.platform?.toLowerCase().includes("twitter") || link.platform?.toLowerCase().includes("x") ? <TwitterIcon size={18} />
                : <MailIcon size={18} />,
            href: link.url || link.link || "#",
            label: link.platform || link.name || "Social",
        }))
        : defaultSocialLinks;

    return (
        <footer className="w-full bg-[#171A21] border-t border-white/10 pt-20 pb-8 px-4 md:px-8 lg:px-12">
            <div className="container mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-6 mb-20">

                    {/* Brand Section */}
                    <div className="lg:col-span-3 flex flex-col gap-2">
                        <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
                            <div className="relative w-15 h-12">
                                <Image
                                    src={systemInfo?.logo || navLogo}
                                    alt={systemInfo?.system_name || "PublicationHub Logo"}
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    unoptimized={!!systemInfo?.logo}
                                />
                               
                            </div>
                             <h2 className="text-transparent font-bold text-2xl bg-gradient-to-r from-[#00D1FF] to-[#3F5EFB] bg-clip-text ">{systemInfo?.system_name}</h2>
                        </Link>
                        <p className="text-[#A3A7AE]  text-sm font-normal leading-5 max-w-[280px]">
                            {systemInfo?.description || "The centralized platform for research opportunities, mentorship, and academic growth."}
                        </p>
                        <div className="flex items-center gap-2.5">
                            {socialLinks.map((social, idx) => (
                                <Link
                                    key={idx}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#20232D] border border-white/10 text-gray-400 hover:text-[#00D1FF] hover:border-[#00D1FF]/30 transition-all duration-300"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#E5E7EB] text-base font-semibold leading-6 mb-7">Platform</h4>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className=" hover:text-[#00D1FF] text-[#A3A7AE]  text-sm font-normal leading-5 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-semibold mb-7 text-[16px]">Resources</h4>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-[#00D1FF] text-[#A3A7AE]  text-sm font-normal leading-5 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-white font-semibold mb-7 text-[16px]">Legal</h4>
                        <ul className="flex flex-col gap-4">
                            {dynamicPages.map((page) => (
                                <li key={page.id}>
                                    <Link
                                        href={`/${page.page_slug}`}
                                        className="hover:text-[#00D1FF] text-[#A3A7AE]  text-sm font-normal leading-5 transition-colors duration-200"
                                    >
                                        {page.page_title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h4 className="text-white font-semibold text-[16px]">Stay Updated</h4>
                        <p className="text-[#94A3B8] text-[14px] leading-relaxed">
                            Get the latest opportunities delivered to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-[#20232D] border border-white/10 rounded-xl py-3.5 pl-5 pr-12 text-[14px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00D1FF]/40 transition-all duration-300 shadow-lg"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] hover:bg-[#00D1FF] hover:text-white transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm tracking-tight text-center md:text-left">
                        {systemInfo?.copyright_text || `© ${currentYear} PublicationHub. All rights reserved.`}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Built for researchers, by researchers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;