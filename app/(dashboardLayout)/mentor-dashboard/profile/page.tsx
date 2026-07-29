import ProfileSettings from "@/page/mentor-dashboard/profile/ProfileSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | Mentor Dashboard",
  description: "Manage your personal information and profile settings.",
};

export default function MentorProfilePage() {
  return <ProfileSettings />;
}
