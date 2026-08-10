export type TaskAssignmentStatus = "pending" | "submitted" | "rejected" | "approved";
export type SubmissionInboxStatus = "pending" | "submitted" | "reviewing" | "approved" | "rejected";

export interface RubricCriterion {
    name: string;
    points: number;
}

export interface Rubric {
    id: number;
    title: string;
    description?: string;
    criteria: RubricCriterion[];
    is_global?: boolean;
    user_id?: number;
    created_at?: string;
}

export interface RubricPayload {
    title: string;
    description?: string;
    criteria: RubricCriterion[];
}

export interface ResearcherTask {
    id: number;
    task_id: number;
    title: string;
    deadline: string;
    status: TaskAssignmentStatus;
    is_notified?: boolean;
    description?: string;
    video_url?: string;
    submission_id?: number;
    document_path?: string;
    document_name?: string;
}

export interface MentorTask {
    id: number;
    title: string;
    description: string;
    rubric_id: number;
    rubric?: Rubric;
    deadline: string;
    video_url?: string;
    status?: string;
    mentor_name?: string;
    created_at?: string;
    opportunity_id?: number;
    opportunity?: { id: number; title: string };
    assignments?: { id: number; status: string; researcher_id: number }[];
    document_path?: string;
    document_name?: string;
}

export interface MentorTaskPayload {
    title: string;
    description: string;
    rubric_id?: number;
    deadline: string;
    video_url?: string;
    opportunity_id: number;
    assign_type: string;
    researcher_ids: number[];
}

export interface SubmissionInboxItem {
    id: number;
    feedback_id?: number;
    researcher_name: string;
    task_name: string;
    task_title?: string;
    submitted_at: string;
    status: SubmissionInboxStatus;
}

export interface RubricScore {
    name: string;
    score: number;
    max: number;
}

export interface SubmissionFeedback {
    id?: number;
    feedback_id?: number;
    overall_score: number;
    mentor_comments?: string;
    ai_general_feedback?: string;
    mentor_score_override?: number;
    mentor_comments_override?: string;
    rubric_scores: RubricScore[];
    flagged_issues?: string[];
    ai_excerpt?: string;
    file_url?: string;
    content_text?: string;
    ai_overall_score?: number;
}

export interface GroupAnalytics {
    average_score: number;
    completion_rate: number;
    total_tasks?: number;
    total_submissions?: number;
    pending_reviews?: number;
    score_trend?: { period: string; score: number }[];
}

export interface CoordinatorOverview {
    total_researchers: number;
    total_mentors: number;
    active_tasks: number;
    system_avg_score: number;
    completion_rate: number;
}

export interface ApiListResponse<T> {
    status?: boolean;
    success?: boolean;
    message?: string;
    data?: T[];
}

export interface ApiDataResponse<T> {
    status?: boolean;
    success?: boolean;
    message?: string;
    data?: T;
}
