import AnalyticsView from "@/page/coordinator-dashboard/assessment/AnalyticsView";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics | Coordinator Dashboard",
};

export default function Page() {
    return <AnalyticsView />;
}
