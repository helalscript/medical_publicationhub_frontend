import ApplicationsView from "@/page/coordinator-dashboard/ApplicationsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunity Applications | Coordinator | PublicationHub",
  description: "Review opportunity applications sent by researchers.",
};

export default function ApplicationsPage() {
  return <ApplicationsView />;
}
