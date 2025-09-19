// const uuid = require('uuid')
// const path = require('path');
// const {Room} = require('../models/models')
// const ApiError = require('../error/ApiError');
//
// class RoomController {
//   async create(req,res,next) {
//     try{
//       const {name, price, typeId, description, shortdescription, rules, conveniences, claseId} = req.body
//       const {img} = req.files
//       let fileName = uuid.v4() + ".png"
//       img.mv(path.resolve(__dirname, '..', 'static', fileName))
//
//
//       const room = await Room.create({
//         name,
//         price,
//         typeId,
//         claseId,
//         description,
//         shortdescription,
//         rules,
//         conveniences,
//         img: fileName
//       })
//
//
//       return res.json(room)
//     } catch(e){
//       next(ApiError.badRequest(e.message))
//     }
//   }
//
//   async getAll(req, res) {
//
//     let rooms;
//     rooms = await Room.findAndCountAll({})
//     return res.json(rooms)
// }
//
//   async getOne(req,res){
//     const {id} = req.params
//     const room = await Room.findOne(
//       {
//         where: {id},
//         include:[{model: RoomInfo, as:'info'}]
//
//       },
//     )
//     return res.json(room)
//   }
//
//   async update(req, res) {
//     try {
//       const { id } = req.params;
//       const { name, price, typeId, description, shortdescription, rules, conveniences, claseId } = req.body;
//       const { img } = req.files;
//
//       const room = await Room.findOne({ where: { id } });
//       if (!room) {
//         return res.status(404).json({ message: 'Room not found' });
//       }
//
//       if (img) {
//         const oldFileName = room.img;
//         const newFileName = uuid.v4() + ".png";
//         img.mv(path.resolve(__dirname, '..', 'static', newFileName));
//         await Room.update({ img: newFileName }, { where: { id } });
//
//         fs.unlinkSync(path.resolve(__dirname, '..', 'static', oldFileName));
//       }
//
//       await room.update({
//         name,
//         price,
//         typeId,
//         claseId,
//         description,
//         shortdescription,
//         rules,
//         conveniences,
//         nutrients,
//       });
//
//       return res.json(room);
//     } catch (e) {
//       next(ApiError.badRequest(e.message));
//     }
//   }
//
//   async delete(req, res) {
//     try {
//       const { id } = req.params;
//       const room = await Room.findOne({ where: { id } });
//       if (!room) {
//         return res.status(404).json({ message: 'Room not found' });
//       }
//       await room.destroy();
//       return res.json({ message: 'Room deleted successfully' });
//     } catch (e) {
//       next(ApiError.badRequest(e.message));
//     }
//   }
//
// }
//
// module.exports = new RoomController

const { rooms } = require('../db')
const ApiError = require('../error/ApiError')

class RoomController {
  // CREATE
  async create(req, res, next) {
    try {
      const { name, price, description, shortdescription, rules, conveniences } = req.body

      if (!name || !price) {
        return next(ApiError.badRequest("Name и price обязательны"))
      }

      const newRoom = {
        id: rooms.length ? rooms[rooms.length - 1].id + 1 : 1,
        name,
        price,
        description: description || "",
        shortdescription: shortdescription || "",
        rules: rules || "",
        conveniences: conveniences || "",
      }

      rooms.push(newRoom)
      return res.json(newRoom)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  // GET ALL
  async getAll(req, res) {
    return res.json(rooms)
  }

  // GET ONE
  async getOne(req, res) {
    const { id } = req.params
    const room = rooms.find(r => r.id === parseInt(id))

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    return res.json(room)
  }

  // UPDATE
  async update(req, res, next) {
    try {
      const { id } = req.params
      const { name, price, description, shortdescription, rules, conveniences } = req.body

      const roomIndex = rooms.findIndex(r => r.id === parseInt(id))
      if (roomIndex === -1) {
        return res.status(404).json({ message: "Room not found" })
      }

      rooms[roomIndex] = {
        ...rooms[roomIndex],
        name: name || rooms[roomIndex].name,
        price: price || rooms[roomIndex].price,
        description: description || rooms[roomIndex].description,
        shortdescription: shortdescription || rooms[roomIndex].shortdescription,
        rules: rules || rooms[roomIndex].rules,
        conveniences: conveniences || rooms[roomIndex].conveniences,
      }

      return res.json(rooms[roomIndex])
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  // DELETE
  async delete(req, res, next) {
    try {
      const { id } = req.params
      const index = rooms.findIndex(r => r.id === parseInt(id))

      if (index === -1) {
        return res.status(404).json({ message: "Room not found" })
      }

      const deleted = rooms.splice(index, 1)
      return res.json({ message: "Room deleted", room: deleted[0] })
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
}

module.exports = new RoomController()
