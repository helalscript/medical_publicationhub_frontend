import GroupAnalyticsView from "@/page/mentor-dashboard/assessment/GroupAnalyticsView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics | Mentor Dashboard",
};

export default function Page() {
    return <GroupAnalyticsView />;
}
