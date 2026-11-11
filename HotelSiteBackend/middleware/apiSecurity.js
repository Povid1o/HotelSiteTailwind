const { authenticateRequest, parseCookies, equalTokens } = require('../utils/session');

module.exports = async (req, res, next) => {
  try {
    const read = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    const login = req.method === 'POST' && /^\/user\/login\/?$/i.test(req.path);
    const inquiry = req.method === 'POST' && /^\/wine-inquiries\/?$/i.test(req.path);
    if (!read) {
      const origin = req.get('origin');
      const expected = new Set((process.env.CORS_ORIGIN || '').split(',').map(v => v.trim()).filter(Boolean));
      expected.add(`${req.protocol}://${req.get('host')}`);
      if (process.env.PUBLIC_SITE_URL) expected.add(new URL(process.env.PUBLIC_SITE_URL).origin);
      if (req.get('sec-fetch-site') === 'cross-site' || (origin && !expected.has(origin))) return res.status(403).json({ message: 'Недопустимый источник запроса' });
    }
    if (login || inquiry || req.method === 'OPTIONS') return next();
    const user = await authenticateRequest(req);
    if (read) return next();
    if (!user) return res.status(401).json({ message: 'Не авторизован' });
    if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Нет доступа' });
    const cookies = parseCookies(req.headers.cookie);
    if (!equalTokens(cookies.csrf_token, req.adminSession.csrf_token) || !equalTokens(req.get('x-csrf-token'), req.adminSession.csrf_token)) return res.status(403).json({ message: 'Недействительный CSRF-токен' });
    next();
  } catch (error) { next(error); }
};
