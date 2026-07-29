import CoordinatorRubricsPage from "@/page/coordinator-dashboard/assessment/CoordinatorRubricsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Global Rubrics | Coordinator Dashboard",
};

export default function Page() {
    return <CoordinatorRubricsPage />;
}
