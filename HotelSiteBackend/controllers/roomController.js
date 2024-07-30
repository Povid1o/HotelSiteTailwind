const uuid = require('uuid')
const path = require('path');
const {Room} = require('../models/models')
const ApiError = require('../error/ApiError');

class RoomController {
  async create(req,res,next) {
    try{
      const {name, price, typeId, description, shortdescription, rules, conveniences, claseId} = req.body
      const {img} = req.files
      let fileName = uuid.v4() + ".png"
      img.mv(path.resolve(__dirname, '..', 'static', fileName))
      
      
      const room = await Room.create({
        name,
        price,
        typeId,
        claseId,
        description,
        shortdescription,
        rules,
        conveniences,
        img: fileName
      })


      return res.json(room)
    } catch(e){
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
   
    let rooms;
    rooms = await Room.findAndCountAll({})
    return res.json(rooms)
}

  async getOne(req,res){
    const {id} = req.params
    const room = await Room.findOne(
      {
        where: {id},
        include:[{model: RoomInfo, as:'info'}]
      
      },
    )
    return res.json(room)
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, typeId, description, shortdescription, rules, conveniences, claseId } = req.body;
      const { img } = req.files;
  
      const room = await Room.findOne({ where: { id } });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      if (img) {
        const oldFileName = room.img;
        const newFileName = uuid.v4() + ".png";
        img.mv(path.resolve(__dirname, '..', 'static', newFileName));
        await Room.update({ img: newFileName }, { where: { id } });
        
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', oldFileName));
      }
  
      await room.update({
        name,
        price,
        typeId,
        claseId,
        description,
        shortdescription,
        rules,
        conveniences,
        nutrients,
      });
  
      return res.json(room);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const room = await Room.findOne({ where: { id } });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      await room.destroy();
      return res.json({ message: 'Room deleted successfully' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

}

module.exports = new RoomController