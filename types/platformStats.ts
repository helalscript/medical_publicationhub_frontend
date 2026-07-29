export type PlatformStatCategory = "opportunities" | "services" | "academy";

export interface PlatformStatItem {
    id?: number;
    number: string;
    label: string;
    category: PlatformStatCategory;
}

export interface PlatformStatsData {
    items: PlatformStatItem[];
}

export interface PlatformStatCategoryMeta {
    key: PlatformStatCategory;
    label: string;
    description: string;
    accent: string;
    glow: string;
}

export const PLATFORM_STAT_CATEGORIES: PlatformStatCategoryMeta[] = [
    {
        key: "opportunities",
        label: "Opportunities",
        description: "Research pathways & mentorship",
        accent: "#00D1FF",
        glow: "rgba(0, 209, 255, 0.12)",
    },
    {
        key: "services",
        label: "Services",
        description: "Expert research support",
        accent: "#2A9D90",
        glow: "rgba(42, 157, 144, 0.12)",
    },
    {
        key: "academy",
        label: "Academy",
        description: "Courses & skill building",
        accent: "#7661FF",
        glow: "rgba(118, 97, 255, 0.12)",
    },
];

export const DEFAULT_PLATFORM_STATS: PlatformStatItem[] = [
    { id: 1, number: "500+", label: "Research Opportunities", category: "opportunities" },
    { id: 2, number: "150+", label: "Expert Mentors", category: "opportunities" },
    { id: 3, number: "10k+", label: "Active Researchers", category: "opportunities" },
    { id: 4, number: "12+", label: "Research Services", category: "services" },
    { id: 5, number: "800+", label: "Projects Completed", category: "services" },
    { id: 6, number: "98%", label: "Client Satisfaction", category: "services" },
    { id: 7, number: "20+", label: "Academy Courses", category: "academy" },
    { id: 8, number: "5k+", label: "Students Enrolled", category: "academy" },
    { id: 9, number: "50+", label: "Expert Instructors", category: "academy" },
];
