export interface ICurrentUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    cover_photo: string | null;
    birthdate: string | null;
    institution: string | null;
    gender: string | null;
    role: "mentor" | "researcher";
    last_seen: string | null;
    is_agreed_terms: number;
    deleted_at: string | null;
}
