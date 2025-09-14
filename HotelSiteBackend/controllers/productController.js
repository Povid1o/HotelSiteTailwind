const uuid = require('uuid');
const path = require('path');
const fs = require('fs'); // FIX: импорт fs
const { Product, ProductInfo } = require('../models/models'); // FIX: добавить ProductInfo
const ApiError = require('../error/ApiError');

class ProductController {
  async create(req, res, next) {
    try {
      const { name, price, typeId, description, weight, nutrients, claseId } = req.body;

      let fileName = null;
      if (req.files && req.files.img) { // FIX: защита от отсутствия файла
        const { img } = req.files;
        fileName = uuid.v4() + '.png';
        await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      }

      const product = await Product.create({
        name,
        price,
        typeId,
        claseId,
        description,
        weight,
        nutrients,
        img: fileName
      });

      return res.json(product);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await Product.findAndCountAll({});
      return res.json(products);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
        include: [{ model: ProductInfo, as: 'info' }]
      });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) { // FIX: добавить next
    try {
      const { id } = req.params;
      const { name, price, typeId, description, weight, nutrients, claseId } = req.body;

      const product = await Product.findOne({ where: { id } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (req.files && req.files.img) {
        const { img } = req.files;
        const oldFileName = product.img;
        const newFileName = uuid.v4() + '.png';
        await img.mv(path.resolve(__dirname, '..', 'static', newFileName));
        product.img = newFileName;
        if (oldFileName) {
          const oldPath = path.resolve(__dirname, '..', 'static', oldFileName);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      await product.update({
        name,
        price,
        typeId,
        claseId,
        description,
        weight,
        nutrients
      });

      return res.json(product);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) { // FIX: добавить next
    try {
      const { id } = req.params;
      const product = await Product.findOne({ where: { id } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      // удалить файл, если есть
      if (product.img) {
        const imgPath = path.resolve(__dirname, '..', 'static', product.img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
      await product.destroy();
      return res.json({ message: 'Product deleted successfully' });
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ProductController();
