const {RoomClass} = require('../models/models')
const ApiError = require('../error/ApiError')

class roomclassConroller {
  async create(req,res) {
    const {name} = req.body
    const roomclass = await RoomClass.create({name})
    return res.json(roomclass)
  }

  async getAll(req,res){
    const roomclass = await RoomClass.findAll()
    return res.json(roomclass)
  }
}

module.exports = new roomclassConroller