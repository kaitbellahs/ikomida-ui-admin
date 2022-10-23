import { Network } from '@ikomida/shared-frontend'

export async function getContract(id?: string) {
  return Network.instance?.get(`/admin/contract/${id}`, true)
}

export async function associate(id?: string, appId?: string) {
  return Network.instance?.patch(`/admin/contract/${id}/app/${appId}/associate`, true)
}

export async function unAssociate(id?: string, appId?: string) {
  return Network.instance?.remove(`/admin/contract/${id}/app/${appId}/associate`, true)
}
