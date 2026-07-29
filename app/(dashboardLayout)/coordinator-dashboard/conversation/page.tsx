import ConversationView from "@/page/coordinator-dashboard/ConversationView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Coordinator | PublicationHub",
  description: "Chat with mentors and researchers.",
};

export default function ConversationPage() {
  return <ConversationView />;
}
