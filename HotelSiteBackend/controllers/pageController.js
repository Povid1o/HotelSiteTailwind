
const { pages } = require('../db')
const ApiError = require('../error/ApiError')

class PageController {
    // CREATE
    async create(req, res, next) {
        try {
            const { name, price, description, shortdescription, rules, conveniences } = req.body

            if (!name || !price) {
                return next(ApiError.badRequest("Name и price обязательны"))
            }

            const newPage = {
                id: pages.length ? pages[pages.length - 1].id + 1 : 1,
                name,
                price,
                description: description || "",
                shortdescription: shortdescription || "",
                rules: rules || "",
                conveniences: conveniences || "",
            }

            pages.push(newPage)
            return res.json(newPage)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // GET ALL
    async getAll(req, res) {
        return res.json({pages})
    }

    // GET ONE
    async getOne(req, res) {
        const { id } = req.params
        const page = pages.find(r => r.id === parseInt(id))

        if (!page) {
            return res.status(404).json({ message: "page not found" })
        }

        return res.json({page})
    }

    // UPDATE
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, price, description, shortdescription, rules, conveniences } = req.body

            const pageIndex = pages.findIndex(r => r.id === parseInt(id))
            if (pageIndex === -1) {
                return res.status(404).json({ message: "page not found" })
            }

            pages[pageIndex] = {
                ...pages[pageIndex],
                name: name || pages[pageIndex].name,
                price: price || pages[pageIndex].price,
                description: description || pages[pageIndex].description,
                shortdescription: shortdescription || pages[pageIndex].shortdescription,
                rules: rules || pages[pageIndex].rules,
                conveniences: conveniences || pages[pageIndex].conveniences,
            }

            return res.json(pages[pageIndex])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // DELETE
    async delete(req, res, next) {
        try {
            const { id } = req.params
            const index = pages.findIndex(r => r.id === parseInt(id))

            if (index === -1) {
                return res.status(404).json({ message: "page not found" })
            }

            const deleted = pages.splice(index, 1)
            return res.json({ message: "page deleted", page: deleted[0] })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new PageController()