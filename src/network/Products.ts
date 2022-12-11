import { Network, Types, Stores } from '@ikomida/shared-frontend'
const cache = Stores.Cache.createInstance(`Products`)
let timeout = 0
export function resetTimeout() {
  timeout = 0
}

export async function all(contractId: string): Promise<Types.Classes.CCategoryProducts[]> {
  if (timeout < new Date().getTime() - 2 * 60 * 1000) {
    const response = await Network.instance?.get(`/products?id=${contractId}`, true)
    if (response?.success) {
      cache.setObject(`Products`, response?.data)
      timeout = new Date().getTime()
      return Types.Classes.CCategoryProducts.fromObject(response?.data)
    } else {
      return []
    }
  } else {
    return Types.Classes.CCategoryProducts.fromObject(cache.getObject(`Products`))
  }
}

export async function getCategories(contractId: string) {
  return await Network.instance?.get(`/categories?id=${contractId}`, true)
}

export async function getOrder(contractId: string, id: string) {
  return Network.instance?.get(`/product/${id}?id=${contractId}`, true)
}

export async function deleteProduct(contractId: string, id?: string) {
  return Network.instance?.remove(`/product/${id}?id=${contractId}`, true)
}

export async function activateProduct(contractId: string, id?: string) {
  return Network.instance?.patch(`/product/${id}?id=${contractId}`, true)
}

export async function deleteProductOption(contractId: string, id?: string) {
  return Network.instance?.remove(`/productoption/${id}?id=${contractId}`, true)
}

export async function deleteProductOptionsCategory(contractId: string, id?: string) {
  return Network.instance?.remove(`/productoptionscategory/${id}?id=${contractId}`, true)
}

export async function deleteCategory(contractId: string, id?: string) {
  return Network.instance?.remove(`/category/${id}?id=${contractId}`, true)
}

export async function newProduct(contractId: string, object: Types.Classes.CProduct) {
  return Network.instance?.post(`/product?id=${contractId}`, true, object)
}

export async function getProduct(contractId: string, id?: string) {
  return Network.instance?.get(`/product/${id}?id=${contractId}`, true)
}

export async function updateProduct(contractId: string, object: Types.Classes.CProduct | Types.Classes.CProduct[]) {
  return Network.instance?.put(`/product?id=${contractId}`, true, object)
}

export async function newCategory(contractId: string, object: Types.Classes.CCategoryProducts) {
  return Network.instance?.post(`/category?id=${contractId}`, true, object)
}

export async function updateCategory(contractId: string, object: Types.Classes.CCategoryProducts | Types.Classes.CCategoryProducts[]) {
  return Network.instance?.put(`/category?id=${contractId}`, true, object)
}

export async function search(contractId: string, query: string): Promise<Types.Classes.CCategoryProducts[]> {
  return (await all(contractId))
    .map(section => {
      return {
        title: section.title,
        products: section.products?.filter(item => {
          if (typeof item == `object`) {
            return (
              item.title?.toLowerCase().includes(query.toLowerCase()) ||
              item.description?.toLowerCase().includes(query.toLowerCase())
            )
          } else {
            return true
          }
        })
      } as Types.Classes.CCategoryProducts
    })
    .filter(item => (item.products?.length ?? 0) > 0)
}
