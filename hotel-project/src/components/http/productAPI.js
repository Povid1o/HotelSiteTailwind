import {$authHost, $host} from "./index";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createClase = async (clase) => {
    const {data} = await $authHost.post('api/clase', clase)
    return data
}

export const fetchClase = async () => {
    const {data} = await $host.get('api/clase', )
    return data
}

export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product)
    return data
}

export const fetchProducts = async (typeId, claseId) => {
    const {data} = await $host.get('api/product',)
    return data
}
 
export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/product/' + id)
    return data
}