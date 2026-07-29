export interface CourseMentor {
    id: number;
    user_id: number;
    user: {
        id: number;
        name: string;
        avatar: string | null;
    };
}

export interface CourseCategory {
    id: number;
    name: string;
}

export interface CourseDescription {
    title: string;
    description: string;
}

export interface Lesson {
    id: number;
    module_id: number;
    title: string;
    file: string | null;
    video: string | null;
    attached_text: string | null;
    attached_file: string | null;
    document: string | null;
    order_by: number;
    durations: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Module {
    id: number;
    course_id: number;
    mentor_id: number | null;
    type: string;
    title: string;
    video: string | null;
    attached_file: string | null;
    attached_text: string| null;
    document: string | null;
    order_by: number;
    durations: string | null;
    is_locked: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    title: string;
    price: string;
    old_price: string | null;
    short_description: string;
    thumbnail: string | null;
    thumbnail_description: string | null;
    thumbnail_button_text: string | null;
    intro_video: string | null;
    overview: string;
    descriptions: CourseDescription[];
    is_future: boolean;
    total_durations: string;
    start_module: number;
    status: string;
    created_at: string;
    updated_at: string;
    categories: CourseCategory[];
    mentors: CourseMentor[];
    modules?: Module[];
}

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    from: number;
    to: number;
    path: string;
}

export interface CourseApiResponse {
    status: boolean;
    message: string;
    code: number;
    data: Course[];
    pagination: PaginationData;
}
