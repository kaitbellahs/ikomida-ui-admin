import {
    Network
} from "@ikomida/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function getTerms(timestamp = 0) {
    const response = await Network.instance.get(`/admin/terms/${timestamp}`, get(Auth));
    if(response && response?.success){
        return response?.data || [];
    }
    return [];
}

export async function newTerm(object) {
    return Network.instance.post("/admin/term", get(Auth), object);
}

export async function editTerm(object) {
    return Network.instance.put("/admin/term", get(Auth), object);
}

export async function activateTerm(object) {
    return Network.instance.put("/admin/activateTerm", get(Auth), object);
}

export async function removeTerm(id) {
    return Network.instance.remove(`/admin/term/${id}`, get(Auth));
}