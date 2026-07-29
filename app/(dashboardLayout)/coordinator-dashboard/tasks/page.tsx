import GlobalTasksMonitor from "@/page/coordinator-dashboard/assessment/GlobalTasksMonitor";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tasks Monitor | Coordinator Dashboard",
};

export default function Page() {
    return <GlobalTasksMonitor />;
}
