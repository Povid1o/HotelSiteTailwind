require('dotenv').config();

const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const { User, Basket } = require('../models/models');

const [email, password] = process.argv.slice(2);

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

async function createAdmin() {
  if (!email || !password || password.length < 12) {
    fail('Usage: npm run create-admin -- admin@example.com <password-with-at-least-12-characters>');
    return;
  }

  await sequelize.authenticate();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    await existing.update({ password: passwordHash, role: 'ADMIN' });
    await Basket.findOrCreate({ where: { userId: existing.id } });
  } else {
    const user = await User.create({ email, password: passwordHash, role: 'ADMIN' });
    await Basket.create({ userId: user.id });
  }

  console.log(`Administrator account is ready for ${email}.`);
}

createAdmin()
  .catch((error) => fail(`Could not create administrator: ${error.message}`))
  .finally(() => sequelize.close());
