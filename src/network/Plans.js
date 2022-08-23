import {
    Network
} from "@ikomida/components";

export async function getPlans(timestamp = 0) {
    const response = await Network.instance.get(`/admin/plans/${timestamp}`, true);
    if (response && response?.success) {
        return (response?.data || []).map(plan => {
            plan.details = (typeof plan.details === 'string' ? JSON.parse(plan.details) : plan.details).map(detail => {
                return {
                    key: detail?.key || null,
                    value: detail?.value || null
                }
            });
            return plan;
        });
    }
    return [];
}

export async function newPlan(object) {
    return Network.instance.post("/admin/plan", true, object);
}

export async function editPlan(object) {
    return Network.instance.put("/admin/plan", true, object);
}

export async function activatePlan(object) {
    return Network.instance.put("/admin/activatePlan", true, object);
}

export async function removePlan(id) {
    return Network.instance.remove(`/admin/plan/${id}`, true);
}