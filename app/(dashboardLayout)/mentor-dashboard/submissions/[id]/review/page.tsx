import SubmissionReviewPage from "@/page/mentor-dashboard/assessment/SubmissionReviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Review Submission | Mentor Dashboard",
};

export default function Page() {
    return <SubmissionReviewPage />;
}
