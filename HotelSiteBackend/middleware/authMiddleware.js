const { authenticateRequest } = require('../utils/session')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next()
    }
    try {
        const decoded = authenticateRequest(req)
        if (!decoded) {
            return res.status(401).json({message: "Не авторизован"})
        }
        req.user = decoded
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
};
