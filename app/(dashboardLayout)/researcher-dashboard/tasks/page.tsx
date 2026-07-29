import ResearcherTasksView from "@/page/researcher-dashboard/assessment/ResearcherTasksView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Tasks | Researcher Dashboard",
};

export default function Page() {
    return <ResearcherTasksView />;
}
