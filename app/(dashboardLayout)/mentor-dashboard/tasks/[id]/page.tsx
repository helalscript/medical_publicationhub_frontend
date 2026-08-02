import MentorTaskDetailPage from "@/page/mentor-dashboard/assessment/MentorTaskDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Task Details | Mentor Dashboard",
};

export default function Page() {
    return <MentorTaskDetailPage />;
}
