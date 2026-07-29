import React from "react";
import ProfileSettings from "@/page/myprofile/ProfileSettings";
import { getCurrentUser, getUserInfo } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function MySettingsPage() {
    let user = null;

    try {
        const userRes = await getUserInfo();
        if (userRes?.status) {
            user = userRes.data;
        } else {
            user = await getCurrentUser();
        }
    } catch (error) {
        console.error("Error fetching user settings on server:", error);
    }

    if (!user) {
        redirect("/login?redirect=/myprofile/settings");
    }

    return <ProfileSettings user={user} />;
}
