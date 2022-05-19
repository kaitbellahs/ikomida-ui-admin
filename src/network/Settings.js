import {
    Network
} from "@ikomida/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function getSettings() {
    const response = await Network.instance.get("/admin/settings", get(Auth));
    if(response && response?.success){
        return response?.data || [];
    }
    return [];
}

export async function newSetting(object) {
    return Network.instance.post("/admin/setting", get(Auth), object);
}

export async function editSetting(object) {
    return Network.instance.put("/admin/setting", get(Auth), object);
}

export async function activateSetting(object) {
    return Network.instance.put("/admin/activateSetting", get(Auth), object);
}

export async function removeSetting(id) {
    return Network.instance.remove(`/admin/setting/${id}`, get(Auth));
}