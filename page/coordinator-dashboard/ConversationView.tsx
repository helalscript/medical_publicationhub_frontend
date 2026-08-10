"use client";

import React, { useMemo } from "react";
import OpportunityChatPage from "@/page/shared/OpportunityChatPage";
import {
    getCoordinatorChats,
    getCoordinatorChatMessages,
    sendCoordinatorChatMessage,
} from "@/services/coordinator";
import { Chat } from "@/types/chat";

const ConversationView = () => {
    const services = useMemo(
        () => ({
            getChats: async () => {
                const res = await getCoordinatorChats();
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
                getCoordinatorChatMessages(chatId, page),
            sendMessage: sendCoordinatorChatMessage,
        }),
        []
    );

    return (
        <OpportunityChatPage
            backHref="/coordinator-dashboard"
            backLabel="Back to Dashboard"
            services={services}
        />
    );
};

export default ConversationView;
