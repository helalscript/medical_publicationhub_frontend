import MentorDashboard from "@/page/mentor-dashboard/MentorDashboard";
import { Metadata } from "next";
import { getResearchIdeas } from "@/services/mentor";

export const metadata: Metadata = {
  title: "Mentor Dashboard | PublicationHub",
  description: "Overview of your research opportunities and submissions.",
};

export default async function MentorDashboardPage() {
  let initialIdeas = [];
  let initialPagination = null;

  try {
    const res = await getResearchIdeas(1, 5);
    if (res?.status) {
      initialIdeas = res.data;
      initialPagination = res.pagination;
    }
  } catch (error) {
    console.error("Failed to fetch initial research ideas on server:", error);
  }

  return <MentorDashboard initialIdeas={initialIdeas} initialPagination={initialPagination} />;
}
