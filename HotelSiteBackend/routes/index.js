const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const productRouter = require('./productRouter')
const claseRouter = require('./claseRouter')



router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/clase', claseRouter)
router.use('/product', productRouter)

module.exports = router