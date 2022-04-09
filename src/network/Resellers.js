import {
    Network
} from "@tian/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function getResellers() {
    const response = await Network.instance.get("/resellers", get(Auth));
    if(response && response?.success){
        return response?.data || [];
    }
    return [];
}

export async function getRestaurants() {
    const response = await Network.instance.get("/restaurants", get(Auth));
    if(response && response?.success){
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