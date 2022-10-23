import { Network, Types } from '@ikomida/shared-frontend'

export async function getApp(id?: string) {
  return Network.instance?.get(`/admin/app/${id}`, true)
}

export async function status(id?: string, object?: Types.Classes.CApp) {
  return Network.instance?.patch(`/admin/app/${id}`, true, object)
}
