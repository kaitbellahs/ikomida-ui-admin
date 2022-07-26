import {
    Network
} from "@ikomida/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function getResellers(timestamp = 0) {
    const response = await Network.instance.get(`/resellers/${timestamp}`, get(Auth));
    if (response && response?.success) {
        return response?.data || [];
    }
    return [];
}

export async function getRestaurants(timestamp = 0) {
    const response = await Network.instance.get(`/restaurants/${timestamp}`, get(Auth));
    if (response && response?.success) {
        return response?.data || [];
    }
    return [];
}

export async function newReseller(object) {
    return Network.instance.post("/reseller", get(Auth), object);
}

export async function GetAddressByCep(cep) {
    return Network.instance.get(`/cep/${cep}`, get(Auth));
}