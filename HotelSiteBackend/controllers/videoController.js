const { videos } = require('../db')
const ApiError = require('../error/ApiError')


class VideosController {
    // CREATE
    async create(req, res, next) {
        try {
            const { name, price, description } = req.body

            if (!name || !price) {
                return next(ApiError.badRequest("Name и price обязательны"))
            }

            const newVideo = {
                id: videos.length ? videos[videos.length - 1].id + 1 : 1,
                name,
                price,
                description: description || ""
            }

            videos.push(newVideo)
            return res.json(newVideo)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // GET ALL
    async getAll(req, res) {
        return res.json(videos)
    }

    // GET ONE
    async getOne(req, res) {
        const { id } = req.params
        const product = videos.find(p => p.id === parseInt(id))

        if (!product) {
            return res.status(404).json({ message: "Dish not found" })
        }

        return res.json(product)
    }

    // UPDATE
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, price, description } = req.body

            const productIndex = videos.findIndex(p => p.id === parseInt(id))
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            videos[productIndex] = {
                ...videos[productIndex],
                name: name || videos[productIndex].name,
                price: price || videos[productIndex].price,
                description: description || videos[productIndex].description,
            }

            return res.json(videos[productIndex])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // DELETE
    async delete(req, res, next) {
        try {
            const { id } = req.params
            const index = videos.findIndex(p => p.id === parseInt(id))

            if (index === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            const deleted = videos.splice(index, 1)
            return res.json({ message: "Product deleted", product: deleted[0] })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new VideosController()