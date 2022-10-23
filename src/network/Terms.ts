import { Network, Types } from '@ikomida/shared-frontend'

export async function getTerms(timestamp = 0) {
  const response = await Network.instance?.get(`/admin/terms/${timestamp}`, true)
  if (response && response?.success) {
    return response?.data || []
  }
  return []
}

export async function newTerm(object: Types.Classes.CTerm) {
  return Network.instance?.post('/admin/term', true, object)
}

export async function editTerm(object: Types.Classes.CTerm) {
  return Network.instance?.put('/admin/term', true, object)
}

export async function activateTerm(object: Types.Classes.CTerm) {
  return Network.instance?.put('/admin/activateTerm', true, object)
}

export async function removeTerm(id?: string) {
  return Network.instance?.remove(`/admin/term/${id}`, true)
}

export async function getTermsOfUse() {
  return Network.instance?.get(`/term/${Types.Types.TTerm.TERM_OF_USE_VENDOR}`)
}

export async function getTermOfUse() {
  const response = await Network.instance?.get(`/termID/${Types.Types.TTerm.TERM_OF_USE_VENDOR}`)
  if (response && response?.success) {
    return response?.data
  }
  return null
}

export async function getPrivacyPolicy() {
  return await Network.instance?.get(`/term/${Types.Types.TTerm.PRIVACY_POLICY}`)
}
