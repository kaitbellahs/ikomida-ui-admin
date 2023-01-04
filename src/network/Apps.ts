import { Network, Types } from '@ikomida/shared-frontend'

export async function getApp(id?: string) {
  return Network.instance?.get(`/admin/app/${id}`, true)
}

export async function status(id?: string, object?: Types.Classes.CApp) {
  return Network.instance?.patch(`/admin/app/${id}`, true, object)
}

export async function updateApp(contractId: string, object: Types.Classes.CApp[]) {
  const payload = object.map(app => {
    return app.toJSON()
  })
  return Network.instance?.patch(`/vendor/app?contractId=${contractId}`, true, payload)
}
