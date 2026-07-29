/**
 * Fetches the Hero Section data for the Partnership page
 */
export const getPartnershipHeroData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/hero-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partnership hero data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partnership hero:", error);
        throw error;
    }
};

/**
 * Fetches the About Us Section data for the Partnership page
 */
export const getPartnershipAboutData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/about-us-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partnership about data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partnership about us:", error);
        throw error;
    }
};

/**
 * Fetches the Our Mission Section data for the Partnership page
 */
export const getPartnershipMissionData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/our-mission-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partnership mission data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partnership mission:", error);
        throw error;
    }
};

/**
 * Fetches the Partnership Value Section data
 */
export const getPartnershipValueData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/partnership-value-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partnership value data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partnership value:", error);
        throw error;
    }
};

/**
 * Fetches the Core Research Section data
 */
export const getCoreResearchData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/core-research-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch core research data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching core research data:", error);
        throw error;
    }
};

/**
 * Fetches the Systematic Review Section data
 */
export const getSystematicReviewData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/systematic-review-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch systematic review data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching systematic review data:", error);
        throw error;
    }
};

/**
 * Fetches the Manuscript Section data
 */
export const getManuscriptData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/manuscript-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch manuscript data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching manuscript data:", error);
        throw error;
    }
};

/**
 * Fetches the Partnership Model Section data
 */
export const getPartnershipModelData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/partnership-model-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partnership model data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partnership model data:", error);
        throw error;
    }
};

/**
 * Fetches the Reviewer Comment Section data
 */
export const getReviewerCommentData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/reviewer-comment-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch reviewer comment data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reviewer comment data:", error);
        throw error;
    }
};

/**
 * Fetches the Journal Handling Section data
 */
export const getJournalSupportData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/journal-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch journal support data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching journal support data:", error);
        throw error;
    }
};

/**
 * Fetches the Research Opportunities Section data
 */
export const getResearchOppData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/research-opportunitie-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch research opportunities data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching research opportunities data:", error);
        throw error;
    }
};

/**
 * Fetches the Why Partner Section data
 */
export const getWhyPartnerData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/why-partner-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch why partner data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching why partner data:", error);
        throw error;
    }
};

/**
 * Fetches the Partner Model Section data
 */
export const getPartnerModelSectionData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/partnership-page/partner-model-section`, {
            method: "GET",
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch partner model section data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching partner model section data:", error);
        throw error;
    }
};

/**
 * Submits a partnership enquiry request
 */
export const submitPartnershipRequest = async (formData: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/partnership-requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error submitting partnership request:", error);
        throw error;
    }
};

