const uuid = require('uuid')
const path = require('path');
const {Product} = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
  async create(req,res,next) {
    try{
      const {name, price, typeId, description, weight, nutrients, claseId} = req.body
      const {img} = req.files
      let fileName = uuid.v4() + ".png"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))
      
      
      const product = await Product.create({
        name,
        price,
        typeId,
        claseId,
        description,
        weight,
        nutrients,
        img: fileName
      })


      return res.json(product)
    } catch(e){
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let {claseId, typeId, limit, page} = req.query
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let products;
    if (!claseId && !typeId) {
        products = await Product.findAndCountAll({limit, offset})
    }
    if (claseId && !typeId) {
        products = await Product.findAndCountAll({where:{claseId}, limit, offset})
    }
    if (!claseId && typeId) {
        products = await Product.findAndCountAll({where:{typeId}, limit, offset})
    }
    if (claseId && typeId) {
        products = await Product.findAndCountAll({where:{typeId, claseId}, limit, offset})
    }
    return res.json(products)
}

  async getOne(req,res){
    const {id} = req.params
    const product = await Product.findOne(
      {
        where: {id},
        include:[{model: ProductInfo, as:'info'}]
      
      },
    )
    return res.json(product)
  }

}

module.exports = new ProductController