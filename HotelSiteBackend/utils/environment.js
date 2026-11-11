const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const validateEnvironment = (env = process.env) => {
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || /change[-_]?me|replace[-_]?(me|with)|your[-_]|example|test-only/i.test(env.JWT_SECRET)) throw new Error('Set a unique JWT_SECRET with at least 32 random characters');
  if (env.NODE_ENV !== 'production') return;
  const site = new URL(env.PUBLIC_SITE_URL || '');
  const local = LOCAL_HOSTS.has(site.hostname);
  if (!local && site.protocol !== 'https:') throw new Error('PUBLIC_SITE_URL must use HTTPS in production');
  if (!local && env.COOKIE_SECURE === 'false') throw new Error('Secure session cookies cannot be disabled for a public site');
  if (!env.DB_PASSWORD || env.DB_PASSWORD.length < 20 || /change[-_]?me|replace[-_]?(me|with)/i.test(env.DB_PASSWORD)) throw new Error('Set a strong DB_PASSWORD with at least 20 characters');
};

module.exports = { validateEnvironment };
