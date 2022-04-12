import {
    Network
} from "@tian/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function getPlans() {
    const response = await Network.instance.get("/admin/plans", get(Auth));
    if(response && response?.success){
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
    return Network.instance.post("/admin/plan", get(Auth), object);
}

export async function editPlan(object) {
    return Network.instance.put("/admin/plan", get(Auth), object);
}

export async function activatePlan(object) {
    return Network.instance.put("/admin/activatePlan", get(Auth), object);
}

export async function removePlan(id) {
    return Network.instance.remove(`/admin/plan/${id}`, get(Auth));
}