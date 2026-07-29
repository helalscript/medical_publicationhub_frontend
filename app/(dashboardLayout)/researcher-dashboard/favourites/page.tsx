import ResearcherFavourites from "@/page/researcher-dashboard/ResearcherFavourites";
import { getFavourites } from "@/services/researcher";

export default async function ResearcherFavouritesPage() {
    let initialFavourites: any[] = [];

    try {
        const res = await getFavourites();
        if (res?.status) {
            initialFavourites = Array.isArray(res.data) ? res.data : res.data?.data || [];
        }
    } catch (error) {
        console.error("Error fetching favourites:", error);
    }

    return <ResearcherFavourites initialFavourites={initialFavourites} />;
}
