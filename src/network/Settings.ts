import { Network, Types } from '@ikomida/shared-frontend'

export async function getSettings(timestamp = 0) {
  const response = await Network.instance?.get(`/admin/settings/${timestamp}`, true)
  if (response && response?.success) {
    return response?.data || []
  }
  return []
}

export async function newSetting(object: Types.Classes.CSetting) {
  return Network.instance?.post('/admin/setting', true, object)
}

export async function editSetting(object: Types.Classes.CSetting) {
  return Network.instance?.put('/admin/setting', true, object)
}

export async function activateSetting(object: Types.Classes.CSetting) {
  return Network.instance?.put('/admin/activateSetting', true, object)
}

export async function removeSetting(id?: string) {
  return Network.instance?.remove(`/admin/setting/${id}`, true)
}
