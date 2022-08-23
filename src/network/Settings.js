import {
    Network
} from "@ikomida/components";

export async function getSettings(timestamp = 0) {
    const response = await Network.instance.get(`/admin/settings/${timestamp}`, true);
    if (response && response?.success) {
        return response?.data || [];
    }
    return [];
}

export async function newSetting(object) {
    return Network.instance.post("/admin/setting", true, object);
}

export async function editSetting(object) {
    return Network.instance.put("/admin/setting", true, object);
}

export async function activateSetting(object) {
    return Network.instance.put("/admin/activateSetting", true, object);
}

export async function removeSetting(id) {
    return Network.instance.remove(`/admin/setting/${id}`, true);
}