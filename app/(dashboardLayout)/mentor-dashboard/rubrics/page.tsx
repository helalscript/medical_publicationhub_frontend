import MentorRubricsPage from "@/page/mentor-dashboard/assessment/MentorRubricsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rubrics | Mentor Dashboard",
};

export default function Page() {
    return <MentorRubricsPage />;
}
