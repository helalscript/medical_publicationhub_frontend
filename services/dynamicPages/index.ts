"use server"

export const getDynamicPages = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/dynamic-pages`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export const getSingleDynamicPage = async (slug: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/dynamic-pages/single/${slug}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
