import {
    Network
} from "@ikomida/components";

export async function getTerms(timestamp = 0) {
    const response = await Network.instance?.get(`/admin/terms/${timestamp}`, true);
    if (response && response?.success) {
        return response?.data || [];
    }
    return [];
}

export async function newTerm(object) {
    return Network.instance?.post("/admin/term", true, object);
}

export async function editTerm(object) {
    return Network.instance?.put("/admin/term", true, object);
}

export async function activateTerm(object) {
    return Network.instance?.put("/admin/activateTerm", true, object);
}

export async function removeTerm(id) {
    return Network.instance?.remove(`/admin/term/${id}`, true);
}