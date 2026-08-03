const jwt = require('jsonwebtoken');

const parseCookies = (header = '') => {
  const result = {};
  for (const part of header.split(';')) {
    const [key, ...rawValue] = part.trim().split('=');
    if (!key || rawValue.length === 0) continue;
    try {
      result[key] = decodeURIComponent(rawValue.join('='));
    } catch {
      // An invalid cookie is treated as an absent session, never as a server error.
    }
  }
  return result;
};

const authenticateRequest = (req) => {
  const token = parseCookies(req.headers.cookie).hotel_session;
  return token ? jwt.verify(token, process.env.JWT_SECRET) : null;
};

module.exports = { authenticateRequest, parseCookies };
