import { Network, Types, Stores } from '@ikomida/shared-frontend'
const cache = Stores.Cache.createInstance(`Products`)

export async function all(contractId: string): Promise<Types.Classes.CCategoryProducts[]> {
  const response = await Network.instance?.get(`/products?contractId=${contractId}`, true)
  if (response?.success) {
    cache.setObject(`Products`, response?.data)
    return Types.Classes.CCategoryProducts.fromObject(response?.data)
  } else {
    return []
  }
}

export async function getCategories(contractId: string) {
  return await Network.instance?.get(`/categories?contractId=${contractId}`, true)
}

export async function getOrder(contractId: string, id: string) {
  return Network.instance?.get(`/product/${id}?contractId=${contractId}`, true)
}

export async function deleteProduct(contractId: string, id?: string) {
  return Network.instance?.remove(`/product/${id}?contractId=${contractId}`, true)
}

export async function activateProduct(contractId: string, id?: string) {
  return Network.instance?.patch(`/product/${id}?contractId=${contractId}`, true)
}

export async function deleteProductOption(contractId: string, id?: string) {
  return Network.instance?.remove(`/productoption/${id}?contractId=${contractId}`, true)
}

export async function deleteProductOptionsCategory(contractId: string, id?: string) {
  return Network.instance?.remove(`/productoptionscategory/${id}?contractId=${contractId}`, true)
}

export async function deleteCategory(contractId: string, id?: string) {
  return Network.instance?.remove(`/category/${id}?contractId=${contractId}`, true)
}

export async function newProduct(contractId: string, object: Types.Classes.CProduct) {
  return Network.instance?.post(`/product?contractId=${contractId}`, true, object)
}

export async function getProduct(contractId: string, id?: string) {
  return Network.instance?.get(`/product/${id}?contractId=${contractId}`, true)
}

export async function updateProduct(contractId: string, object: Types.Classes.CProduct | Types.Classes.CProduct[]) {
  return Network.instance?.put(`/product?contractId=${contractId}`, true, object)
}

export async function newCategory(contractId: string, object: Types.Classes.CCategoryProducts) {
  return Network.instance?.post(`/category?contractId=${contractId}`, true, object)
}

export async function updateCategory(contractId: string, object: Types.Classes.CCategoryProducts | Types.Classes.CCategoryProducts[]) {
  return Network.instance?.put(`/category?contractId=${contractId}`, true, object)
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
