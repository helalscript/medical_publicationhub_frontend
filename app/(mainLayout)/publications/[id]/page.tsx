import PublicationDetail from "@/page/publications/PublicationDetail";
import { getSinglePublication } from "@/services/home";

export default async function DetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const pubId = Number(id);

    if (Number.isNaN(pubId)) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] text-white flex justify-center items-center">
                <h2>Publication not found</h2>
            </div>
        );
    }

    let publication = null;
    try {
        const res = await getSinglePublication(pubId);
        if (res?.status && res?.data) {
            publication = res.data;
        }
    } catch (e) {
        console.error(e);
    }

    if (!publication) {
        return (
            <div className="min-h-screen bg-[#0A0C0F] text-white flex justify-center items-center">
                <h2>Publication not found</h2>
            </div>
        );
    }

    return <PublicationDetail pub={publication} />;
}
