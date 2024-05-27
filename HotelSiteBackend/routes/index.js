const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const productRouter = require('./productRouter')
const roomclassRouter = require('./roomclassRouter')



router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/product', productRouter)
router.use('/roomclass', roomclassRouter)

module.exports = router