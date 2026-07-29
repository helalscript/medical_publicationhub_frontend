"use client";

import React, { useMemo } from "react";
import OpportunityChatPage from "@/page/shared/OpportunityChatPage";
import {
    getResearcherChats,
    getResearcherChatMessages,
    sendResearcherChatMessage,
} from "@/services/researcher";
import { Chat } from "@/types/chat";

const ResearcherConversationPage = () => {
    const services = useMemo(
        () => ({
            getChats: async () => {
                const res = await getResearcherChats();
                if (res?.status) {
                    const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
                    const chats = raw.map((chat: Chat) => ({
                        ...chat,
                        users: chat.users ?? [],
                        chatable: chat.chatable ?? { id: 0, title: "Conversation", thumbnail: null },
                    }));
                    return { status: true, data: chats };
                }
                return { status: false, data: [], message: res?.message };
            },
            getChatMessages: (chatId: string | number, page = 1) =>
                getResearcherChatMessages(chatId, page),
            sendMessage: sendResearcherChatMessage,
        }),
        []
    );

    return (
        <OpportunityChatPage
            backHref="/researcher-dashboard"
            backLabel="Back to Dashboard"
            services={services}
        />
    );
};

export default ResearcherConversationPage;
