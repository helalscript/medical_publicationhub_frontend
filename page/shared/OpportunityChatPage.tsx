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
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const echoRef = useRef<ReturnType<typeof initEcho>>(null);
    const activeConvRef = useRef<Chat | null>(null);
    const subscribedChatIdsRef = useRef<Set<number>>(new Set());

    // Import useSearchParams dynamically if needed, or get it
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const queryChatId = searchParams ? searchParams.get("chat_id") : null;

    useEffect(() => {
        activeConvRef.current = activeConv;
    }, [activeConv]);

    const appendMessage = useCallback((chatId: number, newMessage: Message) => {
        // 1. Append message if it belongs to the active conversation
        if (activeConvRef.current?.id === chatId) {
            setMessages((prev) => {
                const exists = prev.some((m) => m.id === newMessage.id);
                if (exists) return prev;
                return [...prev, newMessage];
            });
        }

        // 2. Update conversation list: update last_message, increment unseen_count, and move to top
        setConversations((prev) => {
            const updated = prev.map((conv) => {
                if (conv.id === chatId) {
                    const isCurrentActive = activeConvRef.current?.id === chatId;
                    return {
                        ...conv,
                        last_message: newMessage,
                        unseen_count: isCurrentActive ? 0 : (conv.unseen_count ?? 0) + 1,
                    };
                }
                return conv;
            });

            // Sort conversations: chats with newer last_message (or created_at) at the top
            return [...updated].sort((a, b) => {
                const timeA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
                const timeB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
                return timeB - timeA;
            });
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
                    // Sort chats initially by last message date
                    const sortedChats = [...chatsData.data].sort((a, b) => {
                        const timeA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
                        const timeB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
                        return timeB - timeA;
                    });

                    setConversations(sortedChats);

                    // Choose active chat
                    let initialActive = sortedChats[0] || null;
                    if (queryChatId) {
                        const found = sortedChats.find((c) => c.id.toString() === queryChatId);
                        if (found) {
                            initialActive = found;
                        }
                    }
                    
                    if (initialActive) {
                        // Mark initial active conversation's unseen count to 0 locally
                        initialActive.unseen_count = 0;
                        setActiveConv(initialActive);
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
    }, [services, queryChatId]);

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

    // Fetch initial chat messages history
    useEffect(() => {
        if (!activeConv) return;

        const fetchMessages = async () => {
            setMessages([]);
            setPage(1);
            setHasMore(false);
            try {
                const data = await services.getChatMessages(activeConv.id, 1);
                if (data?.status) {
                    let msgList: any[] = [];
                    if (Array.isArray(data.data?.messages)) {
                        msgList = data.data.messages;
                    } else if (data.data?.messages?.data) {
                        msgList = data.data.messages.data;
                    } else if (Array.isArray(data.data)) {
                        msgList = data.data;
                    }
                    
                    setMessages([...msgList].reverse());
                    setHasMore(data.pagination ? data.pagination.current_page < data.pagination.last_page : false);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
    }, [activeConv?.id, services]);

    // Load more history messages when scrolling up
    const handleLoadMore = useCallback(async (prevScrollHeight: number) => {
        if (!activeConv || loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const data = await services.getChatMessages(activeConv.id, nextPage);
            if (data?.status) {
                let msgList: any[] = [];
                if (Array.isArray(data.data?.messages)) {
                    msgList = data.data.messages;
                } else if (data.data?.messages?.data) {
                    msgList = data.data.messages.data;
                } else if (Array.isArray(data.data)) {
                    msgList = data.data;
                }

                if (msgList.length > 0) {
                    const reversedNew = [...msgList].reverse();
                    setMessages((prev) => [...reversedNew, ...prev]);
                    setPage(nextPage);
                }
                setHasMore(data.pagination ? data.pagination.current_page < data.pagination.last_page : false);
            }
        } catch (error) {
            console.error("Failed to load more messages:", error);
        } finally {
            setLoadingMore(false);
        }
    }, [activeConv, page, loadingMore, hasMore, services]);

    // Custom set active conversation wrapper to clear unseen count
    const handleSetActiveConv = useCallback((conv: Chat) => {
        setActiveConv(conv);
        setConversations((prev) =>
            prev.map((c) => (c.id === conv.id ? { ...c, unseen_count: 0 } : c))
        );
    }, []);

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
                const sentMsg = res.data;
                setMessages((prev) => {
                    const exists = prev.some((m) => m.id === sentMsg.id);
                    if (exists) return prev;
                    return [...prev, sentMsg];
                });

                // Update last_message and move to top
                setConversations((prev) => {
                    const updated = prev.map((conv) => {
                        if (conv.id === activeConv.id) {
                            return {
                                ...conv,
                                last_message: sentMsg,
                                unseen_count: 0,
                            };
                        }
                        return conv;
                    });
                    return [...updated].sort((a, b) => {
                        const timeA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0;
                        const timeB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0;
                        return timeB - timeA;
                    });
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
                    setActiveConv={handleSetActiveConv}
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
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadingMore={loadingMore}
                />
            </div>
        </div>
    );
};

export default OpportunityChatPage;
