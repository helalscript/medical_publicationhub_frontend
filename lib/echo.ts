import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Message } from '@/types/chat';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

const initEcho = (token: string) => {
    if (typeof window === 'undefined') return null;

    window.Pusher = Pusher;

    if (window.Echo) {
        window.Echo.disconnect();
    }

    const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'https';
    const host = process.env.NEXT_PUBLIC_REVERB_HOST || 'dashboard.hooray-entertainment.online';
    const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 443);
    const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'gau9dawhoh68o0x4qcha';

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${process.env.NEXT_PUBLIC_BASE_API}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    return window.Echo;
};

/** Normalize Laravel broadcast payloads: { message }, { data }, or nested JSON strings */
export const parseOpportunityChatMessage = (payload: unknown): Message | null => {
    if (!payload) return null;

    if (typeof payload === 'string') {
        try {
            return parseOpportunityChatMessage(JSON.parse(payload));
        } catch {
            return null;
        }
    }

    if (typeof payload !== 'object') return null;

    const record = payload as Record<string, unknown>;

    if (record.message && typeof record.message === 'object') {
        const msg = record.message as Record<string, unknown>;
        if ('chat_id' in msg && 'id' in msg) {
            return msg as unknown as Message;
        }
    }

    if (record.data !== undefined) {
        return parseOpportunityChatMessage(record.data);
    }

    if ('chat_id' in record && 'id' in record) {
        return record as unknown as Message;
    }

    return null;
};

export const subscribeToOpportunityChat = (
    echo: Echo<any>,
    chatId: string | number,
    onMessage: (message: Message) => void
) => {
    const channel = echo.private(`opportunity_chat.${chatId}`);
    channel.listen('.opportunity.chat', (payload: unknown) => {
        const message = parseOpportunityChatMessage(payload);
        if (message) onMessage(message);
    });
    return channel;
};

export const leaveOpportunityChat = (echo: Echo<any>, chatId: string | number) => {
    echo.leave(`opportunity_chat.${chatId}`);
};

export default initEcho;
