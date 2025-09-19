const ApiError = require("../error/ApiError");
const {wines, products, dishes} = require("../db");

class WineController {
    // CREATE
    async create(req, res, next) {
        try {
            const { name, price, description } = req.body

            if (!name || !price) {
                return next(ApiError.badRequest("Name и price обязательны"))
            }

            const newDish = {
                id: wines.length ? wines[wines.length - 1].id + 1 : 1,
                name,
                price,
                description: description || ""
            }

            wines.push(newDish)
            return res.json(newDish)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // GET ALL
    async getAll(req, res) {
        return res.json(wines)
    }

    // GET ONE
    async getOne(req, res) {
        const { id } = req.params
        const product = wines.find(p => p.id === parseInt(id))

        if (!product) {
            return res.status(404).json({ message: "Wine not found" })
        }

        return res.json(product)
    }

    // UPDATE
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, price, description } = req.body

            const productIndex = wines.findIndex(p => p.id === parseInt(id))
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            wines[productIndex] = {
                ...wines[productIndex],
                name: name || wines[productIndex].name,
                price: price || wines[productIndex].price,
                description: description || wines[productIndex].description,
            }

            return res.json(wines[productIndex])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // DELETE
    async delete(req, res, next) {
        try {
            const { id } = req.params
            const index = wines.findIndex(p => p.id === parseInt(id))

            if (index === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            const deleted = wines.splice(index, 1)
            return res.json({ message: "Product deleted", product: deleted[0] })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new WineController()