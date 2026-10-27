// Преобразование заголовка в адрес страницы: «Сбор урожая 2026» -> sbor-urozhaya-2026.
const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

const slugify = (text, maxLength = 80) => {
  const latin = String(text || '')
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => TRANSLIT[ch] ?? '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!latin) return 'news';
  if (latin.length <= maxLength) return latin;
  // Не обрываем слово посередине, если рядом есть дефис.
  const cut = latin.slice(0, maxLength);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > maxLength * 0.5 ? cut.slice(0, lastDash) : cut).replace(/-+$/g, '');
};

/**
 * Возвращает свободный адрес: base, base-2, base-3 ...
 * `exists(slug)` — асинхронная проверка занятости.
 */
const uniqueSlug = async (base, exists) => {
  let candidate = base;
  let n = 2;
  while (await exists(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
    if (n > 500) throw new Error('Не удалось подобрать адрес страницы');
  }
  return candidate;
};

module.exports = { slugify, uniqueSlug };
