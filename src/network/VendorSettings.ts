import { Network, Types } from '@ikomida/shared-frontend'

export async function getSettings(contractId: string) {
  const response = await Network.instance?.get(`/vendor/settings?contractId=${contractId}`, true)
  response.data = Types.Classes.CVendorSettings.fromObject(response.data) as Types.Classes.CVendorSettings
  return response
}
export async function getLimits(contractId: string) {
  return Network.instance?.get(`/vendor/limits?contractId=${contractId}`, true)
}

export async function getPagSeguroUrl(contractId: string) {
  return Network.instance?.get(`/vendor/pagSeguroUrl?contractId=${contractId}`, true, undefined, `pagSeguroUrl`)
}

export async function setSettings(contractId: string, object: Types.Classes.CVendorSettings) {
  return Network.instance?.put(`/vendor/settings?contractId=${contractId}`, true, object)
}

export async function updatePaymentGateway(contractId: string, object: any) {
  return Network.instance?.put(
    `/vendor/updatePaymentGateway?contractId=${contractId}`,
    true,
    object,
    `updatePaymentGateway`
  )
}

export async function revokePaymentGateway(contractId: string) {
  return Network.instance?.remove(
    `/vendor/revokePaymentGateway?contractId=${contractId}`,
    true,
    undefined,
    `revokePaymentGateway`
  )
}

export async function updateBusinessHours(contractId: string, object: Types.Classes.CBusinessTime[]) {
  return Network.instance?.put(`/vendor/businessHours?contractId=${contractId}`, true, object)
}

export async function setDelivery(contractId: string, vendorSettings: Types.Classes.CVendorSettings) {
  return Network.instance?.put(`/vendor/delivery?contractId=${contractId}`, true, vendorSettings)
}
