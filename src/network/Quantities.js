import {
    Network
} from "@ikomida/components";

export async function countProducts() {
    let response = await Network.instance?.get("/admin/productsCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}
export async function countOrders() {
    let response = await Network.instance?.get("/admin/ordersCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}
export async function countResellers() {
    let response = await Network.instance?.get("/admin/resellersCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}
export async function countRestaurants() {
    let response = await Network.instance?.get("/admin/restaurantsCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}
export async function countUsers() {
    let response = await Network.instance?.get("/admin/usersCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}
export async function countCoupons() {
    let response = await Network.instance?.get("/admin/couponsCount", true);
    if (response?.success) {
        return response?.data
    }
    return 0;
}