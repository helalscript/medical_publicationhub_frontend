export const isApiSuccess = (res: any) => {
    if (!res) return false;
    if (res.status === true || res.success === true || res.status === "success" || res.success === "success") {
        return true;
    }
    if (typeof res.code === "number" && res.code >= 200 && res.code < 300) {
        return true;
    }
    if ((res.id || res.message) && !res.error && !res.errors) {
        return true;
    }
    return false;
};

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

export const downloadFile = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch {
        window.open(url, "_blank");
    }
};
