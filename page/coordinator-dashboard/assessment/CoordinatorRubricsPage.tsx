import RubricsView from "@/page/shared/assessment/RubricsView";
import {
    createCoordinatorRubric,
    deleteCoordinatorRubric,
    getCoordinatorRubrics,
    updateCoordinatorRubric,
} from "@/services/coordinator";

export default function CoordinatorRubricsPage() {
    return (
        <RubricsView
            api={{
                getRubrics: getCoordinatorRubrics,
                createRubric: createCoordinatorRubric,
                updateRubric: updateCoordinatorRubric,
                deleteRubric: deleteCoordinatorRubric,
            }}
            portalLabel="System Admin"
            isGlobal
        />
    );
}
