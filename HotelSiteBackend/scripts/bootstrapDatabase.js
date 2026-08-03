require('dotenv').config();

const sequelize = require('../db');
const { Page, WineType, WineSweetness } = require('../models/models');
const seedEvents = require('../seed/seedEvents');

const baselineMigrations = [
  '20250910-schema.js',
  '20251016-seed-pages.js',
  '20251016-seed-rooms.js'
];

const defaultPages = [
  {
    name: 'Главная', path: '/', is_active: true,
    content_json: {
      mainBackground: { title: 'Время, которое течёт медленнее', image: '' },
      aboutSection: { title: 'Терраса, вино и время без расписания', description: '' },
      firstGallery: { title: 'Номера с видом на террасы', images: [] },
      secondGallery: { title: 'Винодельня', images: [] }
    }
  },
  { name: 'Винодельня', path: '/Vinery', is_active: true, content_json: { mainBackground: { title: 'Винодельня', image: '' }, introSection: { title: 'Место рассказывает о себе через вино', description: '', image: '' } } },
  { name: 'Витрина вина', path: '/Shop', is_active: true, content_json: { shopHero: { title: 'Коллекция вин', description: '', image: '' } } },
  { name: 'Отель', path: '/Hotel', is_active: true, content_json: { hero: { title: 'Отель', description: 'Номера с видом на террасы.', image: '' } } },
  { name: 'Страница ресторана', path: '/Restaurant', is_active: true, content_json: { hero: { title: 'Ресторан', description: 'Сезонное меню из продуктов своей земли и виноделия.', image: '' } } },
  { name: 'Страница мероприятий', path: '/Events', is_active: true, content_json: { hero: { title: 'Мероприятия', description: 'Дегустации, ужины и события на террасах.', image: '' } } },
  { name: 'Контакты', path: '/Contacts', is_active: true, content_json: { contacts: {} } },
  { name: 'Политика конфиденциальности', path: '/Privacy', is_active: true, content_json: { privacy: {} } }
];

const indexStatements = [
  'CREATE INDEX IF NOT EXISTS dishes_category_id_idx ON dishes (category_id)',
  'CREATE INDEX IF NOT EXISTS dish_images_dish_id_idx ON dish_images (dish_id)',
  'CREATE INDEX IF NOT EXISTS room_images_room_id_idx ON room_images (room_id)',
  'CREATE INDEX IF NOT EXISTS room_properties_room_id_idx ON room_properties (room_id)',
  'CREATE INDEX IF NOT EXISTS room_conveniences_room_id_idx ON room_conveniences (room_id)',
  'CREATE INDEX IF NOT EXISTS room_prices_room_id_idx ON room_prices (room_id)',
  'CREATE INDEX IF NOT EXISTS room_notes_room_id_idx ON room_notes (room_id)',
  'CREATE INDEX IF NOT EXISTS wines_type_id_idx ON wines (type_id)',
  'CREATE INDEX IF NOT EXISTS wines_sweetness_id_idx ON wines (sweetness_id)',
  'CREATE INDEX IF NOT EXISTS wine_images_wine_id_idx ON wine_images (wine_id)',
  'CREATE INDEX IF NOT EXISTS events_category_id_idx ON events (category_id)',
  'CREATE INDEX IF NOT EXISTS event_images_event_id_idx ON event_images (event_id)'
];

async function bootstrapDatabase() {
  await sequelize.authenticate();
  const [result] = await sequelize.query("SELECT to_regclass('public.pages') AS pages_table");
  if (!result[0]?.pages_table) {
    throw new Error('База не инициализирована: таблица pages отсутствует. Сначала выполните миграции на новой базе. Существующие данные не изменялись.');
  }

  await sequelize.query('CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) PRIMARY KEY)');
  for (const name of baselineMigrations) {
    await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT (name) DO NOTHING', { replacements: { name } });
  }
  for (const statement of indexStatements) await sequelize.query(statement);

  for (const name of ['красное', 'белое', 'розовое']) await WineType.findOrCreate({ where: { name } });
  for (const name of ['сухое', 'полусухое', 'полусладкое', 'сладкое']) await WineSweetness.findOrCreate({ where: { name } });
  for (const page of defaultPages) await Page.findOrCreate({ where: { path: page.path }, defaults: page });
  await seedEvents();
}

if (require.main === module) {
  bootstrapDatabase()
    .then(() => { console.log('Database bootstrap completed'); return sequelize.close(); })
    .catch(async (error) => { console.error(error.message); await sequelize.close(); process.exitCode = 1; });
}

module.exports = { bootstrapDatabase };
