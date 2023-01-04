import { Network, Stores, Types } from '@ikomida/shared-frontend'

export async function GetPaymentMethods(contractId: string) {
  return Network.instance?.get('/payments', true)
}

export async function newCoupon(contractId: string, object: Types.Classes.CCoupon) {
  const response = await Network.instance?.post(`/coupon?contractId=${contractId}`, true, object)
  if (response?.success) {
    await Network.instance?.clearCache(Stores.Cache.Types.STAFF)
  }
  return response
}

export async function countCoupons() {
  const response = await Network.instance?.get(`/couponsCount`, true)
  if (response?.success) {
    return response?.data
  }
  return 0
}

export async function deleteCoupon(id?: string) {
  return Network.instance?.remove(`/coupon/${id}`, true)
}

export async function getSubscription(contractId: string) {
  return Network.instance?.get(`/vendor/subscription?contractId=${contractId}`, true)
}
