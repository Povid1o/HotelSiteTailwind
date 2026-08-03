module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next()
        }
        try {
            if (!req.user) {
                return res.status(401).json({message: "Не авторизован"})
            }
            if (req.user.role !== role) {
                return res.status(403).json({message: "Нет доступа"})
            }
            next()
        } catch (e) {
            res.status(401).json({message: "Не авторизован"})
        }
    };
}
