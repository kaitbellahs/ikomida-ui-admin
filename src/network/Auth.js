import {
    Network
} from "@ikomida/components";

export async function doLogin(areaCode, phone, password) {
    return Network.instance.post("/auth", null, {
        areaCode,
        phone,
        password
    }, "login");
}

export async function updatePassword(object) {
    return Network.instance.post("/password", true, object, "updatePassword");
}

export async function logout() {
    return Network.instance.logout();
}