/**
 * Fetches the About Hero Section data
 */
export const getAboutHeroData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/aboutus-page/hero-section`, {
            method: "GET",
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching about hero data:", error);
        throw error;
    }
};

/**
 * Fetches the About Us Mission Section data
 */
export const getOurMissionData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/aboutus-page/our-mission-section`, {
            method: "GET",
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching about mission data:", error);
        throw error;
    }
};

