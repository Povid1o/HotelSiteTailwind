const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        const authorization = req.headers.authorization || ''
        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        // ✅ КРИТИЧНО: Используем JWT_SECRET, как и в userController.js
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
};
