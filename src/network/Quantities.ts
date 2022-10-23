import { Network } from '@ikomida/shared-frontend'

export async function countProducts() {
  const response = await Network.instance?.get('/admin/productsCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
export async function countOrders() {
  const response = await Network.instance?.get('/admin/ordersCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
export async function countResellers() {
  const response = await Network.instance?.get('/admin/resellersCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
export async function countRestaurants() {
  const response = await Network.instance?.get('/admin/restaurantsCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
export async function countUsers() {
  const response = await Network.instance?.get('/admin/usersCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
export async function countCoupons() {
  const response = await Network.instance?.get('/admin/couponsCount', true)
  if (response?.success) {
    return response?.data
  }
  return 0
}
