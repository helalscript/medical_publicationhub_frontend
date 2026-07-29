import SubmissionsInbox from "@/page/mentor-dashboard/assessment/SubmissionsInbox";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Submissions | Mentor Dashboard",
};

export default function Page() {
    return <SubmissionsInbox />;
}
