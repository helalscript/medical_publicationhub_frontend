"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getToken } from "@/services/auth";
import { Chat, Message } from "@/types/chat";
import { ICurrentUser } from "@/types/auth/auth";
import initEcho, { leaveOpportunityChat, subscribeToOpportunityChat } from "@/lib/echo";
import { toast } from "sonner";
import ChatList from "@/page/mentor-dashboard/conversation/components/ChatList";
import ChatWindow from "@/page/mentor-dashboard/conversation/components/ChatWindow";

interface ChatService {
    getChats: () => Promise<{ status: boolean; data: Chat[]; message?: string }>;
    getChatMessages: (chatId: string | number, page?: number) => Promise<any>;
    sendMessage: (chatId: string | number, message: string, file?: File) => Promise<any>;
}

interface OpportunityChatPageProps {
    backHref: string;
    backLabel: string;
    services: ChatService;
}

const OpportunityChatPage = ({ backHref, backLabel, services }: OpportunityChatPageProps) => {
    const [conversations, setConversations] = useState<Chat[]>([]);
    const [activeConv, setActiveConv] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const echoRef = useRef<ReturnType<typeof initEcho>>(null);
    const activeConvRef = useRef<Chat | null>(null);
    const subscribedChatIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        activeConvRef.current = activeConv;
    }, [activeConv]);

    const appendMessage = useCallback((chatId: number, newMessage: Message) => {
        if (activeConvRef.current?.id !== chatId) return;
        setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
        });
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const [chatsData, userData, token] = await Promise.all([
                    services.getChats(),
                    getCurrentUser(),
                    getToken(),
                ]);

                if (chatsData.status) {
                    setConversations(chatsData.data);
                    if (chatsData.data.length > 0) {
                        setActiveConv(chatsData.data[0]);
                    }
                }
                setCurrentUser(userData);

                if (token) {
                    echoRef.current = initEcho(token);
                }
            } catch (error) {
                console.error("Failed to initialize chat:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [services]);

    useEffect(() => {
        if (!echoRef.current || conversations.length === 0) return;

        conversations.forEach((conv) => {
            if (subscribedChatIdsRef.current.has(conv.id)) return;
            subscribedChatIdsRef.current.add(conv.id);

            subscribeToOpportunityChat(echoRef.current!, conv.id, (newMessage) => {
                appendMessage(conv.id, newMessage);
            });
        });

        return () => {
            if (echoRef.current) {
                conversations.forEach((conv) => {
                    leaveOpportunityChat(echoRef.current!, conv.id);
                    subscribedChatIdsRef.current.delete(conv.id);
                });
            }
        };
    }, [conversations, appendMessage]);

    useEffect(() => {
        if (!activeConv) return;

        const fetchMessages = async () => {
            setMessages([]);
            try {
                const data = await services.getChatMessages(activeConv.id);
                if (data?.status && data?.data?.messages?.data) {
                    setMessages([...data.data.messages.data].reverse());
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [activeConv?.id, services]);

    const handleSendMessage = useCallback(async () => {
        if ((!messageInput.trim() && !selectedFile) || !activeConv || sending) return;

        const text = messageInput;
        const file = selectedFile;

        setMessageInput("");
        setSelectedFile(null);
        setSending(true);

        try {
            const res = await services.sendMessage(activeConv.id, text, file || undefined);
            if (res.status) {
                setMessages((prev) => {
                    const exists = prev.some((m) => m.id === res.data.id);
                    if (exists) return prev;
                    return [...prev, res.data];
                });
            } else {
                toast.error(res.message || "Failed to send message");
                setMessageInput(text);
                setSelectedFile(file);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("An unexpected error occurred while sending");
            setMessageInput(text);
            setSelectedFile(file);
        } finally {
            setSending(false);
        }
    }, [messageInput, selectedFile, activeConv, sending, services]);

    if (loading) {
        return (
            <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-[#0B0F1A]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading your conversations...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 h-[calc(100vh-100px)] flex flex-col overflow-hidden">
            <div className="flex items-center gap-4 mb-4 shrink-0">
                <Link href={backHref} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft size={18} />
                    {backLabel}
                </Link>
            </div>

            <h1 className="text-2xl font-extrabold text-white mb-6 shrink-0">Conversation</h1>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>

            <div className="flex-1 flex gap-6 overflow-hidden h-full min-h-0">
                <ChatList
                    conversations={conversations}
                    activeConv={activeConv}
                    setActiveConv={setActiveConv}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <ChatWindow
                    key={activeConv?.id || "empty"}
                    activeConv={activeConv}
                    messages={messages}
                    currentUser={currentUser}
                    messageInput={messageInput}
                    setMessageInput={setMessageInput}
                    onSendMessage={handleSendMessage}
                    sending={sending}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
            </div>
        </div>
    );
};

export default OpportunityChatPage;
