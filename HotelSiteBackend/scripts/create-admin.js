require('dotenv').config();

const bcrypt = require('bcryptjs');
const sequelize = require('../db');
const { User, Basket } = require('../models/models');
const readline = require('readline');
const { Writable } = require('stream');
const fs = require('fs');

const [rawEmail, argumentPassword] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

const readPassword = async () => {
  if (argumentPassword) return argumentPassword;
  if (!process.stdin.isTTY) return fs.readFileSync(0, 'utf8').replace(/\r?\n$/, '');
  let muted = false;
  const output = new Writable({ write(chunk, _encoding, done) { if (!muted) process.stdout.write(chunk); done(); } });
  const prompt = readline.createInterface({ input: process.stdin, output, terminal: true });
  try {
    return await new Promise(resolve => {
      prompt.question('Пароль администратора (от 12 символов, ввод скрыт): ', resolve);
      muted = true;
    });
  } finally { prompt.close(); process.stdout.write('\n'); }
};

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

async function createAdmin() {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('Usage: npm run create-admin -- admin@example.com'); return; }
  const password = await readPassword();
  if (!email || !password || password.length < 12 || Buffer.byteLength(password) > 72) {
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
