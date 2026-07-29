import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";

export default async function ProfileDashboardPage() {
    const user = await getCurrentUser();

    if (user?.role === "researcher") {
        redirect("/researcher-dashboard");
    }

    redirect("/myprofile/applications");
}
