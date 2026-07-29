import TaskDetailView from "@/page/researcher-dashboard/assessment/TaskDetailView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Task Details | Researcher Dashboard",
};

export default function Page() {
    return <TaskDetailView />;
}
