import { useState, useEffect } from "react";
import { getAllCourses, getCourseCategories } from "@/services/home";
import { Course, CourseCategory, PaginationData } from "@/types/course";

export const useCourses = (initialPage: number = 1) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<CourseCategory[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);

    const fetchCategories = async () => {
        try {
            const res = await getCourseCategories();
            if (res.status) {
                setCategories(res.data);
            }
        } catch (err: any) {
            console.error("Failed to fetch course categories", err);
        }
    };

    const fetchCourses = async (page: number, categoryId?: number) => {
        setLoading(true);
        try {
            const res = await getAllCourses(page, categoryId);
            if (res.status) {
                setCourses(res.data);
                setPagination(res.pagination);
                setError(null);
            } else {
                setError(res.message || "Failed to fetch courses");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCourses(currentPage, activeCategoryId);
    }, [currentPage, activeCategoryId]);

    return {
        courses,
        categories,
        pagination,
        loading,
        error,
        currentPage,
        setCurrentPage,
        activeCategoryId,
        setActiveCategoryId,
        refresh: () => fetchCourses(currentPage, activeCategoryId)
    };
};
