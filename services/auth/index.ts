"use server"

import { ICurrentUser } from "@/types/auth/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

// register service
export const registerService = async (data: FieldValues) => {

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("role", data.role);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/register`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        if (responseData?.status) {
            (await cookies()).set("token", responseData.token);
            (await cookies()).set("user", JSON.stringify(responseData.data));
        }
        return responseData;
    } catch (error) {
        throw error;
    }
}

// login service
export const loginService = async (email: string, password: string) => {

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/login`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        if (responseData?.status) {
            (await cookies()).set("token", responseData.token);
            (await cookies()).set("user", JSON.stringify(responseData.data));
        }
        return responseData;
    } catch (error) {
        throw error;
    }
}



// google login service
export const googleLogin = async (token: string) => {
    const formData = new FormData();
    formData.append("provider", "google");
    formData.append("token", token);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/socialite-login`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        
        // Set cookies if login is successful
        if (responseData?.status) {
            (await cookies()).set("token", responseData.token);
            (await cookies()).set("user", JSON.stringify(responseData.data));
        }
        
        return responseData;
    } catch (error) {
        throw error;
    }
}

// get current user
export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("token")?.value;
    const userString = cookieStore.get("user")?.value;

    if (accessToken && userString) {
        try {
            return JSON.parse(userString) as ICurrentUser;
        } catch (err) {
            console.error("Error parsing user cookie:", err);
            return null;
        }
    }
    return null;
}

// change password 
export const changePassword = async (data: FieldValues) => {
    const token = (await cookies()).get("token")?.value;

    const formData = new FormData();
    formData.append("current_password", data.currentPassword);
    formData.append("new_password", data.newPassword);
    formData.append("new_password_confirmation", data.confirmPassword);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/update-password`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}


// get user info
export const getUserInfo = async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        return { status: false, message: "No token found" };
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ["user-info"] }
        });

        if (!response.ok) {
            return { status: false, message: "Failed to fetch user info" };
        }

        const responseData = await response.json();
        if (responseData?.status && responseData?.data) {
            (await cookies()).set("user", JSON.stringify(responseData.data));
        }
        return responseData;
    } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        return { status: false, message };
    }
}

// update profile
export const updateProfile = async (data: FieldValues) => {
    const token = (await cookies()).get("token")?.value;

    const formData = new FormData();
    formData.append("name", data.name || `${data.firstName} ${data.lastName}`.trim());
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("phone", data.mobileNumber);
    formData.append("address", data.address || "");
    formData.append("birthday", data.birthday || data.birthdate || "");
    formData.append("birthdate", data.birthdate || data.birthday || "");
    formData.append("gender", data.gender || "");
    formData.append("institution", data.institution || "");
    formData.append("website", data.website || "");
    formData.append("about", data.about || "");

    if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
    }
    if (data.cover_photo instanceof File) {
        formData.append("cover_photo", data.cover_photo);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/update-profile`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        const responseData = await response.json();
        if (responseData?.status) {
            (await cookies()).set("user", JSON.stringify(responseData.data));
            revalidatePath("/", "layout");
            revalidateTag("user-info", "max");
        }
        return responseData;
    } catch (error) {
        throw error;
    }
}


// forgot password service
export const forgotPasswordService = async (email: string) => {

    const formData = new FormData();
    formData.append("email", email);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/forget-password`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// reset password service
export const resetPasswordService = async (data : FieldValues) => {
    const formData = new FormData();
    formData.append('email', data?.email);
    formData.append('password', data?.password);
    formData.append('password_confirmation', data?.password_confirmation);
    formData.append('token', data?.token);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reset-password`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}

// verify forgot password otp service
export const verifyForgotPasswordOtpService = async (email: string, otp: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/verify-otp`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        throw error;
    }
}

// verify otp service
export const verifyOtpService = async (email: string, otp: string) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/verify-email`, {
            method: "POST",
            body: formData,
        });
        const responseData = await response.json();
        
        // Save to cookies if verification is successful
        if (responseData?.status) {
            (await cookies()).set("token", responseData.token);
            (await cookies()).set("user", JSON.stringify(responseData.data));
        }
        
        return responseData;
    } catch (error) {
        throw error;
    }
}

export const logoutService = async () => {
    const token = (await cookies()).get("token")?.value;

    if (token) {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        } catch (error) {
            console.error("Logout API error:", error);
        }
    }

    (await cookies()).delete("token");
    (await cookies()).delete("user");
}

export const deleteProfile = async () => {
    const token = (await cookies()).get("token")?.value;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/delete-profile`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        const data = await response.json();
        if (data?.status) {
            (await cookies()).delete("token");
            (await cookies()).delete("user");
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export const getToken = async () => {
    return (await cookies()).get("token")?.value;
}

// resend otp
export const resendOtpService = async (email: string) => {
    const formData = new FormData();
    formData.append('email', email)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/resend-otp`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
