const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
  const secretKey = process.env.JWT_SECRET;
  
  return jwt.sign(
        {id, email, role},
        secretKey,
        {expiresIn: '24h'}
    )
}

const sessionCookieOptions = (req) => ({
    sameSite: 'lax',
    secure: Boolean(req.secure),
    path: '/api',
    maxAge: 24 * 60 * 60 * 1000
});

// The browser must be able to read only this anti-CSRF value from every
// admin route (including /admin).  Keeping it under /api makes it invisible
// to document.cookie on /admin, so modifying requests lose their header and
// are correctly rejected with 403 by the CSRF middleware.
const csrfCookieOptions = (req) => ({
    sameSite: 'lax',
    secure: Boolean(req.secure),
    path: '/',
    maxAge: 24 * 60 * 60 * 1000
});

const setCsrfCookie = (req, res) => {
    res.cookie('csrf_token', crypto.randomBytes(32).toString('base64url'), {
        ...csrfCookieOptions(req),
        httpOnly: false
    });
};

const setSessionCookies = (req, res, token) => {
    const options = sessionCookieOptions(req);
    res.cookie('hotel_session', token, { ...options, httpOnly: true });
    setCsrfCookie(req, res);
};

class UserController {
    async registration(req, res, next) {
        const {email, password} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 12)
        // This endpoint is protected by the ADMIN role in the router.  Do not
        // accept a role from the request body: it would let a caller choose
        // their own privileges.
        const user = await User.create({email, role: 'ADMIN', password: hashPassword})
        await Basket.create({userId: user.id})
        // Creating a colleague must not silently replace the current
        // administrator's browser session with the newly created account.
        return res.status(201).json({id: user.id, email: user.email, role: user.role})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.unauthorized('Неверный email или пароль'))
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return next(ApiError.unauthorized('Неверный email или пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        setSessionCookies(req, res, token)
        return res.json({id: user.id, email: user.email, role: user.role})
    }

    async check(req, res, next) {
        // Upgrade sessions created before csrf_token was made visible to the
        // admin UI.  GET is exempt from CSRF validation, so this repairs an
        // already logged-in browser without requiring a manual logout/login.
        // Delete the obsolete /api-scoped variant first.  When both cookies
        // coexist, different browser ordering rules can make the server see
        // the legacy value while the UI reads the new one.
        res.clearCookie('csrf_token', { ...sessionCookieOptions(req), maxAge: 0 });
        setCsrfCookie(req, res)
        return res.json({id: req.user.id, email: req.user.email, role: req.user.role})
    }

    async logout(req, res) {
        res.clearCookie('hotel_session', { ...sessionCookieOptions(req), maxAge: 0 });
        res.clearCookie('csrf_token', { ...csrfCookieOptions(req), maxAge: 0 });
        // Remove the previous, /api-scoped CSRF cookie as well.  This is
        // needed only for browsers that logged in before the path correction.
        res.clearCookie('csrf_token', { ...sessionCookieOptions(req), maxAge: 0 });
        return res.sendStatus(204);
    }
}

module.exports = new UserController()
