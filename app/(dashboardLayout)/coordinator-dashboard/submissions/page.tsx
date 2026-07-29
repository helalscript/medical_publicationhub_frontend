import SubmissionsView from "@/page/coordinator-dashboard/SubmissionsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Submissions | Coordinator | PublicationHub",
  description: "Review and approve/decline mentor research ideas.",
};

export default function SubmissionsPage() {
  return <SubmissionsView />;
}
