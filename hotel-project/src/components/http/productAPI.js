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

export const updateProduct = async (id, product) => {
    const {data} = await $authHost.put('api/product/' + id, product)
    return data
}

export const deleteProduct = async (id) => {
    const {data} = await $authHost.delete('api/product/' + id)
    return data
}


export const createRoom = async (room) => {
    const {data} = await $authHost.post('api/room', room)
    return data
}

export const fetchRoom = async (typeId, claseId) => {
    const {data} = await $host.get('api/room',)
    return data
}
 
export const fetchOneRoom = async (id) => {
    const {data} = await $host.get('api/room/' + id)
    return data
}

export const updateRoom = async (id, room) => {
    const {data} = await $authHost.put('api/room/' + id, room)
    return data
}

export const deleteRoom = async (id) => {
    const {data} = await $authHost.delete('api/room/' + id)
    return data
}