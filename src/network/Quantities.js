import {
    Network
} from "@ikomida/components";
import {
    get
} from 'svelte/store';
import {
    Auth
} from '../stores/Auth';

export async function countProducts(){
    let response = await Network.instance.get("/admin/productsCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}
export async function countOrders(){
    let response = await Network.instance.get("/admin/ordersCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}
export async function countResellers(){
    let response = await Network.instance.get("/admin/resellersCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}
export async function countRestaurants(){
    let response = await Network.instance.get("/admin/restaurantsCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}
export async function countUsers(){
    let response = await Network.instance.get("/admin/usersCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}
export async function countCoupons(){
    let response = await Network.instance.get("/admin/couponsCount", get(Auth));
    if(response?.success){
        return response?.data
    }
    return 0;
}