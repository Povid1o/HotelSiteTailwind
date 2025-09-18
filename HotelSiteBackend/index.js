require('dotenv').config()
const express = require('express')
// const {sequelize} = require('./db')
// const {Product} = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

//обработка ошибок, последний MiddleWare
app.use(errorHandler)

const start = async() => {
  try{
    // await sequelize.authenticate()
    // console.log('DB connected')
    //
    // await sequelize.sync({force: false})
    // console.log('DB synced')
    //
    // // Добавить начальные продукты, если страница пуста
    // const count = await Product.count()
    // if (count === 0) {
    //   await Product.bulkCreate([
    //     { name: "Вино красное", price: 1200, description: "Сухое красное вино" },
    //     { name: "Сыр козий", price: 800, description: "Фермерский продукт" },
    //   ])
    //   console.log('Seed products created')
    // }

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    console.log('DB config:', process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD)
  } catch(e) {
      console.log(e)
  }
  
}
console.log('DB config:', process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD)

start()