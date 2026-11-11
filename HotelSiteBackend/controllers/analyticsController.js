const asyncHandler = require('express-async-handler');
const ApiError = require('../error/ApiError');
const { MetrikaError, getDashboard } = require('../utils/metrika');

const PERIODS = new Set([7, 30, 90]);

const dashboard = asyncHandler(async (req, res, next) => {
  const days = Number.parseInt(String(req.query.days ?? '30'), 10);
  if (!PERIODS.has(days)) return next(ApiError.badRequest('Период: 7, 30 или 90 дней'));
  try {
    res.set('Cache-Control', 'no-store');
    res.json(await getDashboard(days, { refresh: req.query.refresh === '1' }));
  } catch (e) {
    if (e instanceof MetrikaError) return next(new ApiError(e.status, e.message));
    throw e;
  }
});

module.exports = { dashboard };
