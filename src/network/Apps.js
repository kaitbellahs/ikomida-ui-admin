import {
    Network,
    Stores
} from "@ikomida/components";

export async function getApp(id) {
    return Network.instance?.get(`/admin/app/${id}`, true);
}

export async function status(id, object) {
    return Network.instance?.patch(`/admin/app/${id}`, true, object);
}