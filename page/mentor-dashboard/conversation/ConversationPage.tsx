"use client";

import React, { useMemo } from "react";
import OpportunityChatPage from "@/page/shared/OpportunityChatPage";
import { getChats, getChatMessages, sendMessage } from "@/services/mentor";

const MentorConversationPage = () => {
    const services = useMemo(
        () => ({ getChats, getChatMessages, sendMessage }),
        []
    );

    return (
        <OpportunityChatPage
            backHref="/mentor-dashboard"
            backLabel="Back to Dashboard"
            services={services}
        />
    );
};

export default MentorConversationPage;
