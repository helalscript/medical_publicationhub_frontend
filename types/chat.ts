export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
}

export interface ChatUser {
    id: number;
    chat_id: number;
    user_id: number;
    role: string;
    status: string;
    user: User;
}

export interface Opportunity {
    id: number;
    title: string;
    thumbnail: string | null;
}

export interface Chat {
    id: number;
    type: string;
    status: string;
    chatable: Opportunity;
    users?: ChatUser[];
}

export interface Message {
    id: number;
    chat_id: number;
    user_id: number;
    message: string;
    file: string | null;
    created_at: string;
    user: User;
}

export interface ChatResponse {
    status: boolean;
    data: Chat[];
}

export interface ChatDetailResponse {
    status: boolean;
    data: {
        chat: Chat;
        messages: {
            data: Message[];
            current_page: number;
            last_page: number;
        };
    };
}

export interface SendMessageResponse {
    status: boolean;
    data: Message;
}
