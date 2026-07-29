import React from "react";
import { getSingleDynamicPage } from "@/services/dynamicPages";
import { notFound } from "next/navigation";

interface DynamicPageProps {
    params: Promise<{ slug: string }>;
}

const DynamicContentPage = async ({ params }: DynamicPageProps) => {
    const { slug } = await params;
    let res;
    try {
        res = await getSingleDynamicPage(slug);
    } catch (error) {
        console.error("Error loading dynamic page:", error);
    }
        
    if (!res?.status || !res.data) {
        notFound();
    }

    const page = res.data;

    return (
        <main className="min-h-screen bg-[#0A0C0F] pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        {page.page_title}
                    </h1>
                    <div className="w-20 h-1.5 bg-[#00D1FF] rounded-full" />
                </div>
                
                <div className="max-w-none">
                    <div 
                        dangerouslySetInnerHTML={{ __html: page.page_content }} 
                        className="dynamic-content"
                    />
                </div>
            </div>
        </main>
    );
};

export default DynamicContentPage;
