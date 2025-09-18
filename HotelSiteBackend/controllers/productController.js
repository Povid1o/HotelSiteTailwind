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

const { products } = require('../db');

class ProductController {
  async getAll(req, res) {
    return res.json(products);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const product = products.find(p => p.id == id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  }

  async create(req, res) {
    const { name, price, description } = req.body;
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      description,
    };
    products.push(newProduct);
    return res.json(newProduct);
  }

  async delete(req, res) {
    const { id } = req.params;
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products.splice(index, 1);
    return res.json({ message: 'Product deleted' });
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, description } = req.body;

      const idx = products.findIndex(p => p.id == id);
      if (idx === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Обновляем поля только если они переданы
      if (name !== undefined) products[idx].name = name;
      if (price !== undefined) products[idx].price = price;
      if (description !== undefined) products[idx].description = description;

      return res.json(products[idx]);
    } catch (err) {
      console.error('Update error (mock):', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new ProductController();
