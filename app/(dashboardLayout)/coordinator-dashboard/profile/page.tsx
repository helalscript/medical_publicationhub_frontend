import ProfileSettings from "@/page/myprofile/ProfileSettings";
import { getCurrentUser, getUserInfo } from "@/services/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Profile Settings | Coordinator | PublicationHub",
    description: "Update your coordinator profile information and account credentials.",
};

export default async function CoordinatorProfilePage() {
    let user = null;

    try {
        const userRes = await getUserInfo();
        if (userRes?.status) {
            user = userRes.data;
        } else {
            user = await getCurrentUser();
        }
    } catch (error) {
        console.error("Error fetching coordinator user settings:", error);
    }

    if (!user) {
        redirect("/login?redirect=/coordinator-dashboard/profile");
    }

    return (
        <div className="max-w-[900px] mx-auto w-full">
            <div className="flex flex-col gap-1.5 mb-6">
                <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">Account</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Profile Settings</h2>
                <p className="text-gray-400 text-sm font-medium">Manage your personal information and account.</p>
            </div>
            <ProfileSettings user={user} />
        </div>
    );
}
