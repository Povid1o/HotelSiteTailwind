import React, { useState } from 'react';
import { NewsPageSettings, NewsCategory } from '../../news/newsFormat';

interface Props {
  value: NewsPageSettings;
  saving: boolean;
  error: string | null;
  onChange: (next: NewsPageSettings) => void;
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

/** Ключ категории хранится в новостях, поэтому делаем его латиницей и не меняем при переименовании. */
const makeKey = (label: string, taken: string[]) => {
  const base = label.toLowerCase().split('').map((c) => TRANSLIT[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'category';
  let key = base;
  let n = 2;
  while (taken.includes(key)) key = `${base}-${n++}`;
  return key;
};

const NewsPageSettingsForm: React.FC<Props> = ({ value, saving, error, onChange }) => {
  const [draft, setDraft] = useState<NewsPageSettings>(value);
  const [newCategory, setNewCategory] = useState('');

  const update = (patch: Partial<NewsPageSettings>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onChange(next);
  };
  const updateCta = (patch: Partial<NewsPageSettings['cta']>) => update({ cta: { ...draft.cta, ...patch } });

  const renameCategory = (key: string, label: string) =>
    update({ categories: draft.categories.map((c) => (c.key === key ? { ...c, label } : c)) });

  const moveCategory = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= draft.categories.length) return;
    const list = [...draft.categories];
    [list[index], list[to]] = [list[to], list[index]];
    update({ categories: list });
  };

  const removeCategory = (cat: NewsCategory) => {
    if (draft.categories.length <= 1) return;
    if (!window.confirm(`Удалить категорию «${cat.label}»? Новости в ней останутся, но будут без названия категории.`)) return;
    update({ categories: draft.categories.filter((c) => c.key !== cat.key) });
  };

  const addCategory = () => {
    const label = newCategory.trim();
    if (!label || draft.categories.length >= 12) return;
    update({ categories: [...draft.categories, { key: makeKey(label, draft.categories.map((c) => c.key)), label }] });
    setNewCategory('');
  };

  return (
    <div className="adm-card adm-settings">
      <div className="adm-card-head">
        <h2 className="adm-h2">Страница раздела «Новости»</h2>
        <span className="adm-muted" role="status">{saving ? 'Сохраняем…' : error || 'Сохраняется автоматически'}</span>
      </div>
      <p className="adm-muted adm-lead">
        Эти настройки меняют страницу <strong>/News</strong> и призыв внизу каждой новости.
      </p>

      <div className="adm-fields">
        <div className="adm-field">
          <label htmlFor="p-title">Заголовок страницы</label>
          <input id="p-title" type="text" className="adm-input adm-input-lg" value={draft.title} maxLength={120} onChange={(e) => update({ title: e.target.value })} />
        </div>
        <div className="adm-field">
          <label htmlFor="p-lead">Подзаголовок</label>
          <textarea id="p-lead" className="adm-input" rows={2} value={draft.lead} maxLength={300} onChange={(e) => update({ lead: e.target.value })} />
        </div>

        <fieldset className="adm-group">
          <legend>Категории</legend>
          <ul className="adm-cat-list">
            {draft.categories.map((cat, i) => (
              <li key={cat.key} className="adm-cat-row">
                <input
                  type="text"
                  className="adm-input"
                  aria-label={`Название категории ${i + 1}`}
                  value={cat.label}
                  maxLength={40}
                  onChange={(e) => renameCategory(cat.key, e.target.value)}
                />
                <button type="button" className="adm-iconbtn" aria-label="Выше" disabled={i === 0} onClick={() => moveCategory(i, -1)}>↑</button>
                <button type="button" className="adm-iconbtn" aria-label="Ниже" disabled={i === draft.categories.length - 1} onClick={() => moveCategory(i, 1)}>↓</button>
                <button type="button" className="adm-iconbtn is-danger" aria-label={`Удалить категорию «${cat.label}»`} disabled={draft.categories.length <= 1} onClick={() => removeCategory(cat)}>×</button>
              </li>
            ))}
          </ul>
          <div className="adm-cat-add">
            <input
              type="text"
              className="adm-input"
              placeholder="Новая категория"
              aria-label="Новая категория"
              value={newCategory}
              maxLength={40}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
            />
            <button type="button" className="adm-btn adm-btn-ghost" onClick={addCategory} disabled={!newCategory.trim()}>Добавить</button>
          </div>
        </fieldset>

        <div className="adm-grid-2">
          <label className="adm-check">
            <input type="checkbox" checked={draft.showFeatured} onChange={(e) => update({ showFeatured: e.target.checked })} />
            <span>Крупная карточка для самой свежей новости</span>
          </label>
          <div className="adm-field">
            <label htmlFor="p-per">Новостей на странице</label>
            <select id="p-per" className="adm-input" value={draft.perPage} onChange={(e) => update({ perPage: Number(e.target.value) })}>
              {[3, 6, 9, 12, 18, 24].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <fieldset className="adm-group">
          <legend>Призыв внизу страницы и новостей</legend>
          <label className="adm-check">
            <input type="checkbox" checked={draft.cta.enabled} onChange={(e) => updateCta({ enabled: e.target.checked })} />
            <span>Показывать блок</span>
          </label>
          {draft.cta.enabled && (
            <div className="adm-grid-2">
              <div className="adm-field adm-span-2">
                <label htmlFor="c-title">Заголовок</label>
                <input id="c-title" type="text" className="adm-input" value={draft.cta.title} maxLength={120} onChange={(e) => updateCta({ title: e.target.value })} />
              </div>
              <div className="adm-field adm-span-2">
                <label htmlFor="c-text">Текст</label>
                <textarea id="c-text" className="adm-input" rows={2} value={draft.cta.text} maxLength={300} onChange={(e) => updateCta({ text: e.target.value })} />
              </div>
              <div className="adm-field">
                <label htmlFor="c-btn">Текст кнопки</label>
                <input id="c-btn" type="text" className="adm-input" value={draft.cta.buttonLabel} maxLength={40} onChange={(e) => updateCta({ buttonLabel: e.target.value })} />
              </div>
              <div className="adm-field">
                <label htmlFor="c-href">Ссылка кнопки</label>
                <input id="c-href" type="text" className="adm-input" value={draft.cta.href} maxLength={300} onChange={(e) => updateCta({ href: e.target.value })} />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset className="adm-group">
          <legend>Поиск и соцсети</legend>
          <div className="adm-field">
            <label htmlFor="s-title">Заголовок для поиска</label>
            <input id="s-title" type="text" className="adm-input" value={draft.seoTitle} maxLength={120} onChange={(e) => update({ seoTitle: e.target.value })} />
          </div>
          <div className="adm-field">
            <label htmlFor="s-desc">Описание</label>
            <textarea id="s-desc" className="adm-input" rows={2} value={draft.seoDescription} maxLength={300} onChange={(e) => update({ seoDescription: e.target.value })} />
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default NewsPageSettingsForm;
