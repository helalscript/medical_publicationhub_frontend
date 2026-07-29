export const isApiSuccess = (res: { status?: boolean; success?: boolean } | null | undefined) =>
    Boolean(res?.status || res?.success);

export const extractList = <T>(res: { data?: T[] | { data?: T[] } } | null | undefined): T[] => {
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res.data as { data?: T[] }).data)) return (res.data as { data: T[] }).data;
    return [];
};

export const extractData = <T>(res: { data?: T } | null | undefined): T | null =>
    res?.data ?? null;

/** Feedback endpoints may return a flat object or `{ data: {...} }` per backend. */
export const extractFeedback = <T extends { overall_score?: number }>(
    res: T | { data?: T } | null | undefined
): T | null => {
    if (!res) return null;
    if ("data" in res && res.data && typeof res.data === "object") {
        const inner = res.data as T;
        if (inner.overall_score !== undefined) return inner;
    }
    if ("overall_score" in res && (res as T).overall_score !== undefined) return res as T;
    return null;
};

export const toEmbedVideoUrl = (url: string) => {
    if (!url) return url;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
};

export const isOverdue = (deadline: string) => new Date(deadline) < new Date();

export const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
