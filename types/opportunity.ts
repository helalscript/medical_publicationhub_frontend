export interface Mentor {
  id: number;
  user_id: number;
  bio: string | null;
  university: string | null;
  department: string | null;
  social_links: any;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface OpportunityDescription {
  title: string;
  description: string;
}

export interface Opportunity {
  id: number;
  mentor_id: number;
  title: string;
  slug: string;
  overview: string;
  price: string;
  total_seats: number | null;
  available_seats: number | null;
  thumbnail: string | null;
  desciptions: OpportunityDescription[];
  dead_line: string;
  durations: string;
  start_date: string;
  end_date: string;
  is_future: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  categories: { id: number; name: string }[];
  specialities: { id: number; name: string }[];
  studydesign_types: { id: number; name: string }[];
  contribution_types: { id: number; name: string }[];
  university_hospitals: { id: number; name: string }[];
  places: { id: number; name: string }[];
  experience_levels: { id: number; name: string }[];
  mentor: Mentor;
}

export type EnrollmentStatus = "enrolled" | "pending" | "failed" | "not_enrolled";

export interface EnrollmentApiResponse {
  success: boolean;
  message?: string;
  data?: {
    status: EnrollmentStatus;
    chat_id?: number | null;
    payment?: {
      id: number;
      status: string;
      payment_gateway_id?: string;
    };
    moyasar_payment?: {
      id: string;
      status: string;
      source?: {
        transaction_url?: string;
      };
    };
    message?: string;
  };
}
