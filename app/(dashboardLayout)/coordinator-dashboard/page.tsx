import CoordinatorDashboard from "@/page/coordinator-dashboard/CoordinatorDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coordinator Dashboard | PublicationHub",
  description: "Overview and coordination of research projects, opportunities, and reviewer submissions.",
};

export default function CoordinatorDashboardPage() {
  return <CoordinatorDashboard />;
}
