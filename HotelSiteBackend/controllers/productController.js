const uuid = require('uuid')
const path = require('path');
const {Product, ProductInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
  async create(req,res,next) {
    try{
      const {name, price, typeid, roomclassid, info} = req.body
      const {img} = req.files
      let fileName = uuid.v4() + ".png"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))
      
      const product = await Product.create({name, price, typeid, roomclassid, img: fileName})
      if(info){
        info = JSON.parse(info)
        info.forEach(i => 
          ProductInfo.create({
            title: i.title,
            descripton: i.descripton,
            productId: product.id
          })
        );
      }


      return res.json(product)
    } catch(e){
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req,res){
    const product = await Product.findAll()
    return res.json(product)
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