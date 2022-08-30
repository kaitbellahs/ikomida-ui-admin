import {
    Network,
    Stores
} from "@ikomida/components";

export async function getContract(id) {
    return Network.instance.get(`/admin/contract/${id}`, true);
}

export async function associate(id, appId) {
    return Network.instance.patch(`/admin/contract/${id}/app/${appId}/associate`, true);
}

export async function unAssociate(id, appId) {
    return Network.instance.remove(`/admin/contract/${id}/app/${appId}/associate`, true);
}