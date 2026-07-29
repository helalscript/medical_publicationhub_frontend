import ResearcherFeedbackView from "@/page/researcher-dashboard/assessment/ResearcherFeedbackView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Task Feedback | Researcher Dashboard",
};

export default function Page() {
    return <ResearcherFeedbackView />;
}
