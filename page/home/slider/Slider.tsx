"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Video,
    Phone,
    MoreVertical,
    Smile,
    Paperclip,
    Camera,
    Mic,
    CheckCheck,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface ChatMessage {
    type: "received" | "sent";
    text?: string;
    image?: string;
    time: string;
}

interface TestimonialChat {
    id: number;
    name: string;
    avatar: string;
    date: string;
    messages: ChatMessage[];
}

const TESTIMONIALS: TestimonialChat[] = [
    {
        id: 1,
        name: "Dr. Sarah Ahmed",
        avatar: "https://i.pravatar.cc/150?img=5",
        date: "May 10, 2024",
        messages: [
            {
                type: "received",
                text: "Hi! I submitted my manuscript last week. Any update?",
                time: "10:15 AM",
            },
            {
                type: "sent",
                text: "Great news! Your paper has been accepted by the journal. Congratulations! 🎉",
                time: "10:18 AM",
            },
            {
                type: "received",
                text: "Thank you so much! This is amazing news!",
                time: "10:20 AM",
            },
        ],
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        avatar: "https://i.pravatar.cc/150?img=9",
        date: "May 20, 2024",
        messages: [
            {
                type: "received",
                text: "Can you help me with the peer review comments?",
                time: "2:30 PM",
            },
            {
                type: "sent",
                text: "Absolutely! I've reviewed the comments. Here's the revised version ready for resubmission.",
                time: "2:45 PM",
            },
            {
                type: "sent",
                image: "https://images.unsplash.com/photo-1456513087680-66d8e0ecb276?w=400&h=280&fit=crop",
                time: "2:46 PM",
            },
            {
                type: "received",
                text: "Perfect! Submitting today. Thanks for the quick turnaround!",
                time: "3:00 PM",
            },
        ],
    },
    {
        id: 3,
        name: "Dr. James Wilson",
        avatar: "https://i.pravatar.cc/150?img=12",
        date: "May 30, 2024",
        messages: [
            {
                type: "received",
                text: "My paper got rejected. What should I do?",
                time: "11:00 AM",
            },
            {
                type: "sent",
                text: "Don't worry! We've identified 3 alternative journals with higher acceptance rates for your topic.",
                time: "11:15 AM",
            },
            {
                type: "received",
                text: "That's reassuring. Let's proceed with the resubmission plan.",
                time: "11:20 AM",
            },
        ],
    },
    {
        id: 4,
        name: "Dr. Ahmed Khan",
        avatar: "https://i.pravatar.cc/150?img=15",
        date: "June 5, 2024",
        messages: [
            {
                type: "received",
                text: "Is my manuscript ready for submission?",
                time: "9:00 AM",
            },
            {
                type: "sent",
                text: "Yes! Final proofreading is complete. Your paper is publication-ready.",
                time: "9:30 AM",
            },
            {
                type: "received",
                text: "Excellent work! Proceed with submission please.",
                time: "9:35 AM",
            },
        ],
    },
    {
        id: 5,
        name: "Dr. Fatima Hassan",
        avatar: "https://i.pravatar.cc/150?img=20",
        date: "June 12, 2024",
        messages: [
            {
                type: "received",
                text: "What's the status of my Scopus indexing request?",
                time: "4:00 PM",
            },
            {
                type: "sent",
                text: "Your journal is now indexed in Scopus! The official listing will appear within 48 hours.",
                time: "4:20 PM",
            },
            {
                type: "received",
                text: "Wonderful news! Thank you for the update.",
                time: "4:25 PM",
            },
        ],
    },
    {
        id: 6,
        name: "Dr. Elena Rodriguez",
        avatar: "https://i.pravatar.cc/150?img=25",
        date: "June 18, 2024",
        messages: [
            {
                type: "received",
                text: "Can we schedule a call to discuss the revision strategy?",
                time: "1:00 PM",
            },
            {
                type: "sent",
                text: "Of course! I've sent you a calendar invite for tomorrow at 3 PM.",
                time: "1:10 PM",
            },
            {
                type: "received",
                text: "Confirmed. Looking forward to it!",
                time: "1:12 PM",
            },
        ],
    },
];

const SLIDE_COUNT = TESTIMONIALS.length;
const INITIAL_SLIDE_INDEX = 1;
const LOOP_COPIES = 3;
const START_INDEX = SLIDE_COUNT + INITIAL_SLIDE_INDEX;

const LOOP_TESTIMONIALS = Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
    TESTIMONIALS.map((item) => ({
        ...item,
        slideKey: `${item.id}-copy-${copyIndex}`,
    }))
).flat();

const getRealIndex = (activeIndex: number) =>
    ((activeIndex % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

const fixInfiniteLoopPosition = (swiper: SwiperType) => {
    const index = swiper.activeIndex;

    if (index < SLIDE_COUNT) {
        swiper.slideTo(index + SLIDE_COUNT, 0);
        return;
    }

    if (index >= SLIDE_COUNT * 2) {
        swiper.slideTo(index - SLIDE_COUNT, 0);
    }
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const SliderHeader = () => (
    <div className="text-center mb-8 sm:mb-12 md:mb-14 px-2 flex flex-col items-center gap-4 sm:gap-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-[#171A21]/80">
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90 uppercase">
                WhatsApp Reviews
            </span>
        </div>

        <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-tight max-w-3xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            Real Feedback From Our{" "}
            <span className="text-[#00D1FF]">Clients</span>
        </h2>

        <p
            className="text-[#A3A7AE] text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            Genuine WhatsApp conversations from researchers who achieved their publication goals with PublicationHub.
        </p>
    </div>
);

const ChatBubble = ({ message }: { message: ChatMessage }) => {
    const isSent = message.type === "sent";

    return (
        <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[88%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                    isSent ? "bg-[#DCF8C6] rounded-tr-none" : "bg-white rounded-tl-none"
                }`}
            >
                {message.image && (
                    <div className="relative w-full h-[72px] sm:h-[88px] rounded-md overflow-hidden mb-1">
                        <Image
                            src={message.image}
                            alt="Shared document"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}
                {message.text && (
                    <p className="text-[11px] sm:text-xs text-[#111B21] leading-snug">{message.text}</p>
                )}
                <div className={`flex items-center gap-1 mt-0.5 ${isSent ? "justify-end" : "justify-end"}`}>
                    <span className="text-[9px] sm:text-[10px] text-[#667781]">{message.time}</span>
                    {isSent && <CheckCheck size={12} className="text-[#53BDEB] shrink-0" />}
                </div>
            </div>
        </div>
    );
};

const WhatsAppChatCard = ({ data }: { data: TestimonialChat }) => {
    return (
        <div
            className="w-full max-w-[220px] sm:max-w-[240px] md:max-w-[260px] mx-auto rounded-2xl overflow-hidden bg-[#ECE5DD] shadow-xl transition-all duration-300 [.swiper-slide-active_&]:ring-2 [.swiper-slide-active_&]:ring-[#00D1FF] [.swiper-slide-active_&]:shadow-[0_0_24px_rgba(0,209,255,0.35)]"
        >
            {/* Header */}
            <div className="bg-[#075E54] px-2.5 py-2 flex items-center gap-2">
                <ArrowLeft size={16} className="text-white/80 shrink-0" />
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <Image src={data.avatar} alt={data.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{data.name}</p>
                    <p className="text-[10px] text-white/70">online</p>
                </div>
                <div className="flex items-center gap-2 text-white/80 shrink-0">
                    <Video size={14} />
                    <Phone size={14} />
                    <MoreVertical size={14} />
                </div>
            </div>

            {/* Chat body */}
            <div
                className="px-2 py-3 space-y-2 min-h-[200px] sm:min-h-[220px] max-h-[220px] sm:max-h-[240px] overflow-y-auto"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundColor: "#ECE5DD",
                }}
            >
                <div className="flex justify-center">
                    <span className="text-[10px] text-[#54656F] bg-[#E1F2FA] px-2 py-0.5 rounded-md shadow-sm">
                        {data.date}
                    </span>
                </div>
                {data.messages.map((msg, idx) => (
                    <ChatBubble key={idx} message={msg} />
                ))}
            </div>

            {/* Input bar */}
            <div className="bg-[#F0F2F5] px-2 py-1.5 flex items-center gap-1.5">
                <Smile size={16} className="text-[#54656F] shrink-0" />
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-[#667781]">
                    Type a message
                </div>
                <Paperclip size={14} className="text-[#54656F] shrink-0" />
                <Camera size={14} className="text-[#54656F] shrink-0" />
                <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center shrink-0">
                    <Mic size={14} className="text-white" />
                </div>
            </div>
        </div>
    );
};

const WhatsAppCtaBanner = () => (
    <div
        className="mt-8 sm:mt-10 rounded-2xl border border-white/10 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
        style={{ background: "rgba(29, 32, 41, 0.88)" }}
    >
        <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
                <h3
                    className="text-white text-base sm:text-lg font-bold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Have questions?
                </h3>
                <p className="text-[#A3A7AE] text-sm">Chat with our experts on WhatsApp</p>
            </div>
        </div>
        <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#25D366] text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/10 transition-colors whitespace-nowrap"
        >
            <WhatsAppIcon className="w-4 h-4" />
            Chat on WhatsApp
        </a>
    </div>
);

const Slider = () => {
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [activeDot, setActiveDot] = useState(INITIAL_SLIDE_INDEX);

    useEffect(() => {
        if (!swiperInstance || !prevEl || !nextEl) return;

        swiperInstance.params.navigation = {
            ...(typeof swiperInstance.params.navigation === "object" ? swiperInstance.params.navigation : {}),
            prevEl,
            nextEl,
        };
        swiperInstance.navigation.destroy();
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();

        requestAnimationFrame(() => {
            swiperInstance.slideTo(START_INDEX, 0);
            swiperInstance.update();
            swiperInstance.autoplay.start();
        });
    }, [swiperInstance, prevEl, nextEl]);

    const goToSlide = (index: number) => {
        swiperInstance?.slideTo(SLIDE_COUNT + index);
    };

    return (
        <section className="w-full bg-[#0A0C0F] py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 overflow-x-clip border-t border-[#2A9D90]/20">
            <div className="container mx-auto max-w-[1440px]">
                <SliderHeader />

                <div className="relative px-10 sm:px-14 md:px-16 overflow-visible">
                    <button
                        ref={(node) => setPrevEl(node)}
                        aria-label="Previous slide"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-[#171A21] border border-white/10 text-white hover:border-[#00D1FF]/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group shrink-0"
                    >
                        <ChevronLeft size={20} className="group-hover:text-[#00D1FF] transition-colors" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setActiveDot(getRealIndex(swiper.activeIndex))}
                        onSlideChangeTransitionEnd={fixInfiniteLoopPosition}
                        navigation={{ prevEl, nextEl }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={600}
                        spaceBetween={12}
                        slidesPerView={1.2}
                        centeredSlides
                        initialSlide={START_INDEX}
                        watchSlidesProgress
                        breakpoints={{
                            480: { slidesPerView: 1.6, spaceBetween: 14 },
                            768: { slidesPerView: 2.2, spaceBetween: 16 },
                            1024: { slidesPerView: 3, spaceBetween: 18 },
                            1280: { slidesPerView: 3, spaceBetween: 20 },
                        }}
                        className="testimonial-swiper !overflow-visible !pb-4 [&_.swiper-slide]:flex [&_.swiper-slide]:items-stretch [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-300 [&_.swiper-slide:not(.swiper-slide-active)]:scale-[0.88] [&_.swiper-slide:not(.swiper-slide-active)]:opacity-50"
                    >
                        {LOOP_TESTIMONIALS.map((item) => (
                            <SwiperSlide key={item.slideKey}>
                                <WhatsAppChatCard data={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
                        {TESTIMONIALS.map((item, index) => (
                            <button
                                key={item.id}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeDot === index
                                        ? "w-6 bg-[#00D1FF] shadow-[0_0_10px_rgba(0,209,255,0.5)]"
                                        : "w-2 bg-white/20 hover:bg-white/40"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        ref={(node) => setNextEl(node)}
                        aria-label="Next slide"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-[#171A21] border border-white/10 text-white hover:border-[#00D1FF]/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group shrink-0"
                    >
                        <ChevronRight size={20} className="group-hover:text-[#00D1FF] transition-colors" />
                    </button>

                </div>

                <WhatsAppCtaBanner />
            </div>
        </section>
    );
};

export default Slider;
