const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const productRouter = require('./productRouter')
const dishRouter = require('./dishRouter')
const wineRouter = require('./wineRouter')
const roomRouter = require('./roomRouter')
const pageRouter = require('./pageRouter')
const videoRouter = require('./videoRouter')

const claseRouter = require('./claseRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/clase', claseRouter)

router.use('/product', productRouter)
router.use('/products', productRouter)

router.use('/dish', dishRouter)
router.use('/dishes', dishRouter)

router.use('/wine', wineRouter)
router.use('/wines', wineRouter)

router.use('/room', roomRouter)
router.use('/rooms', roomRouter)

router.use('/page', pageRouter)
router.use('/pages', pageRouter)

router.use('/video', videoRouter)
router.use('/videos', videoRouter)

module.exports = router