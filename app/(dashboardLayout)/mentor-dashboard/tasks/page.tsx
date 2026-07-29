import TasksView from "@/page/mentor-dashboard/assessment/TasksView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tasks | Mentor Dashboard",
};

export default function Page() {
    return <TasksView />;
}
