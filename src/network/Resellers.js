import {
    Network
} from "@ikomida/components";

export async function getResellers(timestamp = 0) {
    const response = await Network.instance.get(`/resellers/${timestamp}`, true);
    if (response && response?.success) {
        return response?.data ?? [];
    }
    return [];
}

export async function getRestaurants(timestamp = 0) {
    const response = await Network.instance.get(`/restaurants/${timestamp}`, true);
    if (response && response?.success) {
        return response?.data ?? [];
    }
    return [];
}

export async function newReseller(object) {
    return Network.instance.post("/reseller", true, object, "newReseller");
}

export async function GetAddressByCep(cep) {
    return Network.instance.get(`/cep/${cep}`, true);
}