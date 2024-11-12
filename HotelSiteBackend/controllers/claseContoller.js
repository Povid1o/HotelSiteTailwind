const {Clase} = require('../models/models')
const ApiError = require('../error/ApiError')

class ClaseConroller {
  async create(req,res) {
    const {name, typeId} = req.body
    const clase = await Clase.create({name, typeId})
    return res.json(clase)
  }

  async getAll(req,res){
    const clases = await Clase.findAll()
    return res.json(clases)
  }
}

module.exports = new ClaseConroller()