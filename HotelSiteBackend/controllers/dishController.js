// const uuid = require('uuid')
// const fs = require('fs');
// const path = require('path');
// const {products} = require('../db')
// const ApiError = require('../error/ApiError');
//
// class ProductController {
//   async create(req,res,next) {
//     try{
//       const {name, price, typeId, description, weight, nutrients, claseId} = req.body
//       const {img} = req.files
//       let fileName = uuid.v4() + ".png"
//       img.mv(path.resolve(__dirname, '..', 'static', fileName))
//
//
//       const product = await products.create({
//         name,
//         price,
//         typeId,
//         claseId,
//         description,
//         weight,
//         nutrients,
//         img: fileName
//       })
//
//
//       return res.json(product)
//     } catch(e){
//       next(ApiError.badRequest(e.message))
//     }
//   }
//
//   async getAll(req, res) {
//
//     let product;
//     product = await products.findAndCountAll({})
//     return res.json(product)
// }
//
//   async getOne(req,res){
//     const {id} = req.params
//     const product = await products.findOne(
//       {
//         where: {id},
//         include:[{model: ProductInfo, as:'info'}]
//
//       },
//     )
//     return res.json(product)
//   }
//
//   async update(req, res) {
//     try {
//       const { id } = req.params;
//       const { name, price, typeId, description, weight, nutrients, claseId } = req.body;
//       const { img } = req.files;
//
//       const product = await products.findOne({ where: { id } });
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//
//       if (img) {
//         const oldFileName = product.img;
//         const newFileName = uuid.v4() + ".png";
//         img.mv(path.resolve(__dirname, '..', 'static', newFileName));
//         await products.update({ img: newFileName }, { where: { id } });
//
//         fs.unlinkSync(path.resolve(__dirname, '..', 'static', oldFileName));
//       }
//
//       await product.update({
//         name,
//         price,
//         typeId,
//         claseId,
//         description,
//         weight,
//         nutrients,
//       });
//
//       return res.json(product);
//     } catch (e) {
//       next(ApiError.badRequest(e.message));
//     }
//   }
//
//   async delete(req, res) {
//     try {
//       const { id } = req.params;
//       const product = await products.findOne({ where: { id } });
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       await product.destroy();
//       return res.json({ message: 'Product deleted successfully' });
//     } catch (e) {
//       next(ApiError.badRequest(e.message));
//     }
//   }
//
// }
//
// module.exports = new ProductController
//
//

const { products, dishes, wines } = require('../db')
const ApiError = require('../error/ApiError')


class DishesController {
    // CREATE
    async create(req, res, next) {
        try {
            const { name, price, description } = req.body

            if (!name || !price) {
                return next(ApiError.badRequest("Name и price обязательны"))
            }

            const newDish = {
                id: dishes.length ? dishes[dishes.length - 1].id + 1 : 1,
                name,
                price,
                description: description || ""
            }

            dishes.push(newDish)
            return res.json(newDish)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // GET ALL
    async getAll(req, res) {
        return res.json(dishes)
    }

    // GET ONE
    async getOne(req, res) {
        const { id } = req.params
        const product = dishes.find(p => p.id === parseInt(id))

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

            const productIndex = dishes.findIndex(p => p.id === parseInt(id))
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            dishes[productIndex] = {
                ...dishes[productIndex],
                name: name || dishes[productIndex].name,
                price: price || dishes[productIndex].price,
                description: description || dishes[productIndex].description,
            }

            return res.json(dishes[productIndex])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // DELETE
    async delete(req, res, next) {
        try {
            const { id } = req.params
            const index = dishes.findIndex(p => p.id === parseInt(id))

            if (index === -1) {
                return res.status(404).json({ message: "Product not found" })
            }

            const deleted = dishes.splice(index, 1)
            return res.json({ message: "Product deleted", product: deleted[0] })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new DishesController()

