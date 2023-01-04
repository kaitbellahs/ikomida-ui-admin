import { Network, Types } from '@ikomida/shared-frontend'

export async function getLayout(contractId: string) {
  return Network.instance?.get(`/layout?contractId=${contractId}`)
}

export async function updateLayout(contractId: string, object: Types.Classes.CLayout) {
  return Network.instance?.put(`/layout?contractId=${contractId}`, true, object)
}
