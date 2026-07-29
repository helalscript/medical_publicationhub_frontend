"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { getResearchOppData } from "@/services/partnership";

interface OppItem {
    id: number;
    title: string;
    image: string;
}

interface ApiOppData {
    content: {
        id: number;
        title: string;
        sub_title: string;
    };
    items: OppItem[];
}

const ArrowRight = () => (
    <svg width="253" height="173" viewBox="0 0 253 173" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[120px] md:w-[180px] lg:w-[253px] h-auto">
        <path d="M243.229 154.928C239.161 152.993 235.312 150.791 234.691 149.962C233.999 149.164 233.253 148.815 232.822 149.176C231.453 150.465 233.113 152.873 237.19 155.399C242.076 158.416 242.147 158.384 231.864 158.615C205.276 159.201 170.38 146.217 155.47 130.137C151.239 125.554 148.116 118.523 148.12 113.59L148.104 109.941L152.945 110.767C166.677 113.17 180.452 107.306 181.411 98.6322C181.864 94.5197 180.281 91.9066 176.002 90.0661C170.812 87.695 165.918 88.083 158.546 91.4429C151.847 94.4186 149.397 96.6971 146.994 101.931L145.504 105.229L140.644 103.221C133.648 100.207 127.135 95.6171 121.772 90.0064C117.038 85.0517 110.152 75.4411 110.612 74.3864C110.697 74.0083 113.464 73.2045 116.608 72.4884C142.823 66.8809 166.994 52.4882 178.538 35.7112C181.782 31.0392 184.783 23.159 185.024 19.1405C185.557 5.89429 172.526 -1.58229 152.247 0.282961C117.516 3.63599 96.0828 27.6116 101.206 57.3922C101.787 60.7905 102.824 64.8363 103.581 66.5407C104.338 68.2451 104.718 69.8618 104.531 70.2001C103.796 71.2068 86.839 71.4265 78.9932 70.49C70.1509 69.401 54.2144 63.5553 47.9757 59.014C43.717 55.8889 37.7733 50.1111 35.3332 46.5184L33.9321 44.5048L40.0986 41.8507C47.7849 38.4365 51.8693 34.3265 53.0793 28.6872C54.5139 21.8428 51.89 16.8862 45.6253 14.5672C36.8405 11.3268 26.9998 15.783 24.6429 23.9724C23.7559 26.9173 24.6892 33.3901 26.5188 37.5091L28.033 40.918L25.7821 40.9825C21.4138 41.2223 13.1059 40.5761 6.96179 39.4789C0.77868 38.4841 -0.757827 38.8265 0.314717 41.2411C1.32417 43.5136 18.2795 45.7606 28.0663 44.9846C30.0426 44.872 30.7496 45.3232 32.3084 47.6919C33.316 49.2 36.1477 52.5338 38.5304 55.0467C51.9059 69.0023 71.7114 75.7652 97.1695 74.9156L106.73 74.5802L109.439 79.1588C116.528 91.3155 128.114 101.814 140.473 107.208L144.446 108.93L144.89 113.92C146.402 129.489 159.044 141.984 183.784 152.252C200.641 159.22 220.604 163.107 236.157 162.576C241.458 162.346 241.662 162.426 239.948 163.698C238.946 164.483 236.667 166.005 234.96 167.104C231.835 169.002 231.109 170.6 232.666 172.204C233.295 172.86 234.423 172.359 238.903 169.518C241.926 167.581 246.25 165.15 248.506 164.147C252.423 162.322 252.462 162.22 251.572 160.405C250.941 158.985 248.348 157.33 243.229 154.928ZM181.877 18.3277C181.383 28.2404 170.599 41.7884 155.11 52.155C144.358 59.3117 120.974 68.253 109.816 69.5532C106.93 69.8996 103.815 59.4644 103.847 49.8419C103.865 38.0995 108.327 27.6149 116.7 19.4742C120.558 15.8048 121.873 14.9653 131.181 10.8307C143.028 5.56843 150.217 4.07576 161.717 4.49463C175.773 4.96806 182.326 9.45513 181.877 18.3277ZM176.906 100.464C175.382 102.926 174.599 103.444 170.101 105.102C164.795 107.033 156.185 107.797 151.806 106.681L149.412 106.044L150.7 103.431C154.228 96.167 167.486 91.0428 175.392 93.8235C178.492 94.912 179.023 97.0571 176.906 100.464ZM50.0602 25.6918C49.5442 29.6623 45.3986 34.3947 39.7424 37.2473C37.1964 38.5483 34.1326 39.8241 33.0508 40.0496C30.9965 40.3669 30.8945 40.3272 29.2912 35.7675C26.4243 27.6026 28.1818 21.2951 34.0346 18.6953C37.7015 17.0665 40.8227 16.8705 44.4339 18.1574C49.2697 19.9207 50.5446 21.6503 50.0602 25.6918Z" fill="url(#grad1)" fillOpacity="0.5"/>
        <defs>
            <linearGradient id="grad1" x1="78.7421" y1="-5.45762" x2="170.283" y2="200.626" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E6FF"/>
                <stop offset="1" stopColor="#9C8BE9"/>
            </linearGradient>
        </defs>
    </svg>
);

const ArrowDownLeft = () => (
    <svg width="345" height="191" viewBox="0 0 345 191" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[150px] md:w-[250px] lg:w-[345px] h-auto">
        <path d="M12.8294 24.4275C18.377 25.5813 23.7365 27.1269 24.7431 27.9554C25.8267 28.7247 26.8423 28.9291 27.2609 28.3593C28.5513 26.3767 25.8045 23.9273 20.0696 22.0539C13.1997 19.8213 13.1228 19.8806 25.622 16.5377C57.9456 7.90666 104.463 13.39 127.474 28.6059C134.009 32.9482 139.919 40.6121 141.383 46.6432L142.49 51.0982L136.326 51.5303C118.827 52.6803 103.735 63.9475 105.145 74.8353C105.815 79.9967 108.528 82.7195 114.306 83.6954C121.356 85.0486 127.221 83.1177 135.233 76.8164C142.535 71.1852 144.851 67.6711 146.23 60.5585L147.07 56.084L153.608 57.0913C163.056 58.6936 172.383 62.3644 180.608 67.6258C187.869 72.2728 199.147 81.9698 198.898 83.396C198.906 83.8835 195.764 85.6896 192.135 87.5006C161.761 102.158 136.503 126.944 127.386 150.887C124.812 157.563 123.49 168.088 124.391 173.072C127.683 189.421 145.835 194.681 170.066 186.364C211.519 171.928 230.58 136.243 215.454 101.368C213.732 97.387 211.26 92.7506 209.827 90.8927C208.395 89.0348 207.449 87.172 207.577 86.7027C208.176 85.2535 228.837 79.9374 238.705 78.7466C249.837 77.4457 271.056 79.847 280.033 83.5407C286.169 86.0927 295.153 91.3856 299.205 95.0506L301.517 97.0947L294.77 102.174C286.391 108.635 282.623 114.875 282.822 122.128C283.106 130.92 287.789 136.198 296.136 137.167C307.838 138.513 318.54 130.137 318.983 119.426C319.19 115.562 316.123 107.929 312.661 103.439L309.795 99.7228L312.527 98.9739C317.795 97.3806 328.142 95.6975 335.978 95.2096C343.832 94.5851 345.608 93.7092 343.578 91.0772C341.668 88.6 320.275 90.9005 308.544 94.7622C306.162 95.4881 305.163 95.1471 302.553 92.7158C300.873 91.1724 296.419 87.9405 292.759 85.5783C272.256 72.5021 246.035 70.1313 215.171 78.7478L203.585 82.0035L198.911 77.2136C186.628 64.4648 169.341 55.0813 152.63 52.167L147.261 51.2455L145.234 45.2785C138.751 26.699 119.579 15.1892 86.2837 10.0028C63.606 6.50443 38.0483 7.69597 19.1969 12.9745C12.785 14.8328 12.5119 14.7965 14.2291 12.7316C15.2202 11.4736 17.5524 8.93446 19.3121 7.08365C22.5667 3.83321 22.978 1.66433 20.5975 0.166912C19.6334 -0.447517 18.4035 0.500884 13.7735 5.30575C10.6555 8.57431 6.09421 12.8324 3.63447 14.7292C-0.610381 18.1261 -0.627546 18.2628 1.00144 20.2162C2.19537 21.7645 5.85643 23.0151 12.8294 24.4275ZM128.48 173.128C126.133 160.865 135.28 141.096 151.127 123.814C162.139 111.866 188.058 93.9771 201.31 89.0666C204.734 87.7842 211.648 99.6116 214.473 111.382C217.946 125.74 215.614 139.883 207.803 152.326C204.18 157.959 202.821 159.377 192.675 167.202C179.761 177.16 171.419 181.124 157.238 184.035C139.916 187.641 130.572 184.107 128.48 173.128ZM110.107 71.2558C111.236 67.7926 112.039 66.9264 117.043 63.561C122.953 59.621 133.25 56.1246 138.935 56.1848L142.051 56.2512L141.254 59.8281C139.104 69.7568 124.424 79.9668 113.934 78.921C109.82 78.5135 108.532 76.0496 110.107 71.2558ZM287.404 124.89C286.853 119.884 290.511 112.865 296.576 107.695C299.3 105.347 302.665 102.875 303.921 102.278C306.337 101.279 306.473 101.297 309.79 106.393C315.725 115.519 315.454 123.752 309.074 128.672C305.077 131.754 301.321 132.923 296.524 132.425C290.088 131.709 288.015 129.974 287.404 124.89Z" fill="url(#grad2)" fillOpacity="0.5"/>
        <defs>
            <linearGradient id="grad2" x1="261.619" y1="171.501" x2="88.3863" y2="-53.1424" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E6FF"/>
                <stop offset="1" stopColor="#9C8BE9"/>
            </linearGradient>
        </defs>
    </svg>
);

const ResearchOpportunities = () => {
    const [data, setData] = useState<ApiOppData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getResearchOppData();
                if (res?.status) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Error fetching research opportunities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-20 bg-[#0A0C0F] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#00D1FF] animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    // Items map for easier access
    const i = data.items;

    return (
        <section className="relative bg-[#0A0C0F] py-40 px-6 overflow-hidden">
            <div className="container mx-auto ">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-32"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Research{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D1FF] via-[#4AB8FF] to-[#8B8FF9]">
                            Opportunities
                        </span>
                    </h2>
                    <p className="text-[#6B7280] text-sm md:text-base font-medium max-w-2xl mx-auto uppercase tracking-widest">
                        {data.content.sub_title}
                    </p>
                </motion.div>

                {/* ── Journey Container ── */}
                <div className="relative container mx-auto min-h-[800px] md:min-h-[1000px] lg:min-h-[900px]">
                    
                    {/* Item 1: Top Left */}
                    <div className="absolute top-0 left-0 lg:left-[5%] flex flex-col items-center">
                        <OppCircle item={i[0]} delay={0} />
                        {/* Arrow 1 -> 2 */}
                        <div className="hidden lg:block absolute left-[240px] top-[40px] pointer-events-none scale-75 xl:scale-100">
                            <ArrowRight />
                        </div>
                    </div>

                    {/* Item 2: Top Center */}
                    <div className="absolute top-10 md:top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <OppCircle item={i[1]} delay={0.2} />
                        {/* Arrow 2 -> 3 */}
                        <div className="hidden lg:block absolute left-[250px] top-[40px] pointer-events-none scale-75 xl:scale-100">
                            <ArrowRight />
                        </div>
                    </div>

                    {/* Item 3: Top Right */}
                    <div className="absolute top-40 md:top-60 right-0 lg:right-[5%] flex flex-col items-center">
                        <OppCircle item={i[2]} delay={0.4} />
                        {/* Big Arrow 3 -> 4 (AI Section) */}
                        <div className="hidden lg:block absolute right-0 top-[350px] pointer-events-none rotate-[300deg] scale-110">
                            <ArrowDownLeft />
                        </div>
                    </div>

                    {/* Item 4: Bottom Left (AI & Digital Health) */}
                    <div className="absolute top-[450px] md:top-[600px] lg:top-[550px] left-0 md:left-20 lg:left-[15%] flex flex-col items-center">
                        <OppCircle item={i[3]} delay={0.6} />
                        {/* Arrow 4 -> 5 */}
                        <div className="hidden lg:block absolute left-[280px] top-[140px] pointer-events-none rotate-[-340deg] scale-x-[-1] scale-90">
                            <ArrowRight />
                        </div>
                    </div>

                    {/* Item 5: Bottom Center/Right (CDC Wonder) */}
                    <div className="absolute top-[550px] md:top-[750px] lg:top-[750px] right-60 lg:right-[27%] flex flex-col items-center">
                        <OppCircle item={i[4]} delay={0.8} />
                    </div>

                </div>
            </div>
        </section>
    );
};

const OppCircle = ({ item, delay }: { item: OppItem; delay: number }) => (
    <div className="flex flex-col items-center group">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay }}
            className="relative w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 border-white/10 shadow-3xl shadow-black/80 ring-1 ring-white/5"
        >
            <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        </motion.div>
        <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.3 }}
            className="mt-6 text-white text-center text-[10px] md:text-sm lg:text-base font-black max-w-[120px] md:max-w-[170px] lg:max-w-[210px] uppercase tracking-tighter leading-tight group-hover:text-[#00D1FF] transition-colors"
        >
            {item.title}
        </motion.p>
    </div>
);

export default ResearchOpportunities;
