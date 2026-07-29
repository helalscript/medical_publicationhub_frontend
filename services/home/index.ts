"use server"

import { cookies } from "next/headers";

// get all faq service
export const getAllFaq = async (page: number = 1) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/faqs?page=${page}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get hero banner service
export const getBannerContent = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/hero-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get counter/stats service
export const getCounterContent = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/counter-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get why researchers choose service
export const getWhyChooseContent = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/why-researchers-choose-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get meta academy service
export const getMetaAcademyContent = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/meta-academy-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get research journey service
export const getResearchJourneyContent = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/research-journey-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get all services
export const getAllServices = async (page: number = 1) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/services?page=${page}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get faq categories
export const getFaqCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/faqs-categories`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get faqs by category id
export const getFaqsByCategory = async (categoryId: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/faqs-categories/${categoryId}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// send contact message
export const sendContactMessage = async (formData: FormData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contact-support-message/sent`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// subscribe newsletter
export const subscribeNewsletter = async (formData: FormData) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/newsletter/subscribe`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get system info
export const getSystemInfo = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/system-info`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get all opportunities with pagination
export const getAllOpportunities = async (page: number = 1) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/opportunities?page=${page}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get opportunity by id
export const getOpportunityById = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/opportunities/?opportunity_id=${id}`, {
            method: "GET", // Changed to POST to allow passing a body. If it must be GET, body is not allowed. Let's send it POST.
            headers: {
                "Content-Type": "application/json",
            },
           // body: JSON.stringify({ opportunity_id: id })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// resolves a single opportunity item from API response
export const getSingleOpportunity = async (id: number) => {
    const res = await getOpportunityById(id);

    if (!res?.status || !Array.isArray(res.data) || res.data.length === 0) {
        return null;
    }

    return res.data.find((o: { id: number }) => o.id === id) || res.data[0] || null;
}

// submit opportunity application
export const submitOpportunityApplication = async (formData: FormData) => {
    const token = (await cookies()).get("token")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/researcher/opportunity-applications`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get all publications with pagination
export const getAllPublications = async (page: number = 1) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/publications?page=${page}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get single publication by id
export const getSinglePublication = async (id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/publications/${id}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get all courses with pagination
export const getAllCourses = async (page: number = 1, categoryId?: number) => {
    try {
        let url = `${process.env.NEXT_PUBLIC_BASE_API}/courses?page=${page}`;
        if (categoryId) {
            url += `&category_id=${categoryId}`;
        }
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get course categories
export const getCourseCategories = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/courses-categories`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get course details by id
export const getCourseDetails = async (id: string | number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/courses/${id}`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get meta academy hero content
export const getMetaAcademyHero = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/meta-academy-page/hero-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get meta academy counter content
export const getMetaAcademyCounter = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/meta-academy-page/counter-section`, {
            method: "GET",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get researcher applications
export const getResearcherApplications = async (page: number = 1) => {
    const token = (await cookies()).get("token")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/researcher/opportunity-applications?page=${page}&per_page=5`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// get my enrolled courses (mentor & researcher)
export const getMyCourses = async () => {
    const token = (await cookies()).get("token")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/my-courses`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// buy a course
export const buyCourse = async (courseId: string | number) => {
    const token = (await cookies()).get("token")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/courses/${courseId}/buy`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: featured research opportunities section
export const getFeaturedOpportunitiesSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/featured-research-opportunities-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: home review section
export const getHomeReviewSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/review-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: home faq section
export const getHomeFaqSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/home-page/faq-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: faq page hero
export const getFaqPageHero = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/faq-page/hero-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: faq page questions section
export const getFaqPageQuestionsSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/faq-page/question-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: research page section
export const getResearchPageSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/research-page/research-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// CMS: service page section
export const getServicePageSection = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/cms/service-page/service-section`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get social links
export const getSocialLinks = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/social-links`, { method: "GET" });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get opportunity filter lists
export const getOpportunityFilterList = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/opportunities/fillter-list`, {
            method: "POST",
            headers: { Accept: "application/json" },
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get mentor by id from opportunities
export const getOpportunityMentorById = async (mentorId: string | number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/opportunities/mentors/${mentorId}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get single service by id
export const getServiceById = async (id: string | number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/services/${id}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get calendly schedule link
export const getCalendlyScheduleLink = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/calendly/schedule-link`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get all offers
export const getAllOffers = async (page = 1, perPage = 10) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/offers?page=${page}&per_page=${perPage}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// get single offer
export const getOfferById = async (id: string | number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/offers/${id}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}
