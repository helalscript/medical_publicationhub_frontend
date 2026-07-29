import RubricsView from "@/page/shared/assessment/RubricsView";
import {
    createMentorRubric,
    deleteMentorRubric,
    getMentorRubrics,
    updateMentorRubric,
} from "@/services/mentor/assessment";

export default function MentorRubricsPage() {
    return (
        <RubricsView
            api={{
                getRubrics: getMentorRubrics,
                createRubric: createMentorRubric,
                updateRubric: updateMentorRubric,
                deleteRubric: deleteMentorRubric,
            }}
        />
    );
}
