import { Network, Types } from '@ikomida/shared-frontend'

export async function getPlans(timestamp = 0) {
  const response = await Network.instance?.get(`/admin/plans/${timestamp}`, true)
  if (response && response?.success) {
    const plans: Types.Classes.CPlan[] = Types.Classes.CPlan.fromObject(response?.data) ?? []
    return plans
  }
  return []
}

export async function newPlan(object: Types.Classes.CPlan) {
  return Network.instance?.post('/admin/plan', true, object)
}

export async function editPlan(object: Types.Classes.CPlan) {
  return Network.instance?.put('/admin/plan', true, object)
}

export async function activatePlan(object: Types.Classes.CPlan) {
  return Network.instance?.patch('/admin/plan', true, object)
}

export async function removePlan(id?: string) {
  return Network.instance?.remove(`/admin/plan/${id}`, true)
}
