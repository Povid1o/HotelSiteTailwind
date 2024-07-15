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
   
    let products;
    products = await Product.findAndCountAll({})
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

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, typeId, description, weight, nutrients, claseId } = req.body;
      const { img } = req.files;
  
      const product = await Product.findOne({ where: { id } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (img) {
        const oldFileName = product.img;
        const newFileName = uuid.v4() + ".png";
        img.mv(path.resolve(__dirname, '..', 'static', newFileName));
        await Product.update({ img: newFileName }, { where: { id } });
        
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', oldFileName));
      }
  
      await product.update({
        name,
        price,
        typeId,
        claseId,
        description,
        weight,
        nutrients,
      });
  
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ where: { id } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await product.destroy();
      return res.json({ message: 'Product deleted successfully' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

}

module.exports = new ProductController