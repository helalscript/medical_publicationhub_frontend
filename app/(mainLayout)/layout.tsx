
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/shared/footer/Footer";
import Navbar from "@/shared/navbar/Navbar";
import { getCurrentUser } from "@/services/auth";
import { getSystemInfo } from "@/services/home";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();
    let systemInfo = null;

    try {
        const res = await getSystemInfo();
        if (res?.status) {
            systemInfo = res.data;
        }
    } catch (error) {
        console.error("Failed to fetch system info in server layout:", error);
    }

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-background">
                <Navbar initialUser={currentUser} initialSystemInfo={systemInfo} />
                <main>{children}</main>
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default MainLayout;