import ConversationPage from "@/page/mentor-dashboard/conversation/ConversationPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversation | Mentor Dashboard",
  description: "Discuss research projects with your team.",
};

export default function MentorConversationPage() {
  return <ConversationPage />;
}
