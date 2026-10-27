import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';
import { fetchDishCategories } from '../../http/dishAPI';
import {
  BackButton, FormBar, FormBlock, FormHead, Img, ListRow, PhotoGrid, Pills, SectionHead, Thumb,
  confirmDiscard, formStatus, uidOf, useAutoSelect, useDraft, useSaveFlow,
} from '../ui';

type Dish = {
  id: number; name: string; images: Img[]; header: string; description: string; descriptionFull: string; weight: string; price: number;
};

interface DishForm {
  name: string;
  category: string;
  description: string;
  descriptionFull: string;
  weight: string;
  price: string;
  images: Img[];
}

const toForm = (dish: Dish, category: string): DishForm => ({
  name: dish.name,
  category,
  description: dish.description,
  descriptionFull: dish.descriptionFull,
  weight: dish.weight,
  price: dish.price ? String(dish.price) : '',
  images: [...dish.images],
});

const priceText = (price: number) => (price ? `${price} ₽` : '—');

const DishEditor: React.FC<{ product: Dish; category: string; onClose: () => void; onMoved: (category: string) => void }> = observer(({ product, category, onClose, onMoved }) => {
  const { dish } = useContext(Context)!;
  const { draft, patch, dirty, sync } = useDraft<DishForm>(() => toForm(product, category));
  const { saving, msg, setMsg, run } = useSaveFlow();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = 'Введите название блюда.';
    const price = Number(draft.price.replace(/\s/g, '').replace(',', '.'));
    if (draft.price.trim() && (!Number.isFinite(price) || price < 0)) next.price = 'Цена — число, например 950.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) { setMsg({ kind: 'error', text: 'Проверьте подсвеченные поля.' }); return; }
    void run(async () => {
      const id = product.id;
      const moved = draft.category !== category;
      const extra: { category_id?: number } = {};
      if (moved) {
        const target = (await fetchDishCategories()).find((c) => c.name === draft.category);
        if (!target) return 'Такого раздела нет на сервере. Обновите страницу.';
        extra.category_id = target.id;
      }
      const name = draft.name.trim();
      await dish.updateProduct(category, id, {
        name,
        header: product.header && product.header !== product.name ? product.header : name,
        description: draft.description,
        descriptionFull: draft.descriptionFull,
        weight: draft.weight.trim(),
        price: Number(draft.price.replace(/\s/g, '').replace(',', '.')) || 0,
        images: draft.images,
        ...extra,
      });
      const error = dish.getProductSaveError(id);
      if (error) return error;
      if (moved) {
        dish.moveProductLocal(category, draft.category, product.id);
        onMoved(draft.category);
      }
      sync();
      return null;
    });
  };
  const cancel = () => { sync(); setErrors({}); setMsg(null); };
  const remove = () => {
    if (!window.confirm(`Удалить блюдо «${product.name}»? Это действие нельзя отменить.`)) return;
    dish.deleteProduct(category, product.id);
    onClose();
  };
  const status = formStatus(saving, dirty);

  return (
    <div className="adm-card">
      <BackButton onClick={() => { if (confirmDiscard()) onClose(); }} />
      <FormHead title={draft.name || 'Блюдо'} status={status.text} tone={status.tone} />

      <div className="adm-field">
        <label htmlFor="dish-name">Название</label>
        <input id="dish-name" className="adm-input adm-input-lg" value={draft.name} maxLength={160} aria-invalid={!!errors.name} onChange={(e) => patch({ name: e.target.value })} />
        {errors.name && <p className="adm-field-error" role="alert">{errors.name}</p>}
      </div>
      <div className="adm-field">
        <label htmlFor="dish-cat">Раздел меню</label>
        <select id="dish-cat" className="adm-input" value={draft.category} onChange={(e) => patch({ category: e.target.value })}>
          {dish.dishes.map((c: { category: string }) => <option key={c.category} value={c.category}>{c.category}</option>)}
        </select>
        {draft.category !== category && <p className="adm-hint">Блюдо переедет в раздел «{draft.category}» после сохранения.</p>}
      </div>
      <div className="adm-field">
        <label htmlFor="dish-short">Короткое описание</label>
        <input id="dish-short" className="adm-input" value={draft.description} placeholder="Подача и гарнир в одну строку" onChange={(e) => patch({ description: e.target.value })} />
      </div>
      <div className="adm-field">
        <label htmlFor="dish-full">Полное описание</label>
        <textarea id="dish-full" className="adm-input" rows={4} value={draft.descriptionFull} placeholder="Состав, способ приготовления, с каким вином сочетается" onChange={(e) => patch({ descriptionFull: e.target.value })} />
      </div>
      <div className="adm-grid-2">
        <div className="adm-field">
          <label htmlFor="dish-weight">Вес</label>
          <input id="dish-weight" className="adm-input" value={draft.weight} placeholder="250 г" onChange={(e) => patch({ weight: e.target.value })} />
        </div>
        <div className="adm-field">
          <label htmlFor="dish-price">Цена, ₽</label>
          <input id="dish-price" className="adm-input" inputMode="decimal" value={draft.price} placeholder="950" aria-invalid={!!errors.price} onChange={(e) => patch({ price: e.target.value })} />
          {errors.price && <p className="adm-field-error" role="alert">{errors.price}</p>}
        </div>
      </div>

      <FormBlock title="Фотографии" note={`${draft.images.length} фото`}>
        <PhotoGrid items={draft.images} onChange={(images) => patch({ images })} tile={{ w: 88, h: 64 }} max={10} />
      </FormBlock>

      <FormBar dirty={dirty} saving={saving} onSave={save} onCancel={cancel} onDelete={remove} deleteLabel="Удалить" message={msg?.kind === 'error' ? msg : null} />
    </div>
  );
});

const CategoryBar: React.FC<{ category: string; count: number; onRenamed: (name: string) => void; onDeleted: () => void }> = observer(({ category, count, onRenamed, onDeleted }) => {
  const { dish } = useContext(Context)!;
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(category);
  useEffect(() => { setName(category); setRenaming(false); }, [category]);

  const rename = () => {
    const next = name.trim();
    if (!next || next === category) { setRenaming(false); return; }
    if (dish.dishes.some((c: { category: string }) => c.category === next)) { window.alert('Раздел с таким названием уже есть.'); return; }
    dish.updateCategoryName(category, next);
    onRenamed(next);
    setRenaming(false);
  };
  const remove = () => {
    if (!window.confirm(`Удалить раздел «${category}»${count ? ` вместе с блюдами (${count})` : ''}? Это действие нельзя отменить.`)) return;
    dish.deleteCategoryLocal(category);
    onDeleted();
  };

  return (
    <div className="adm-catbar">
      {renaming ? (
        <>
          <input className="adm-input" aria-label="Название раздела" value={name} maxLength={80} autoFocus onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') rename(); if (e.key === 'Escape') setRenaming(false); }} />
          <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={rename}>Сохранить</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setRenaming(false)}>Отмена</button>
        </>
      ) : (
        <>
          <span className="adm-muted">Раздел «{category}» · {count} блюд</span>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setRenaming(true)}>Переименовать</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm is-danger" onClick={remove}>Удалить раздел</button>
        </>
      )}
    </div>
  );
});

const MenuAdmin: React.FC = observer(() => {
  const { dish } = useContext(Context)!;
  const categories = dish.dishes as { category: string; products: Dish[] }[];
  const [category, setCategory] = useState<string>(categories[0]?.category || '');
  const [selectedUid, setSelectedUid] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const active = categories.find((c) => c.category === category) || categories[0];
  const products = active?.products || [];
  const current = products.find((p) => uidOf(p) === selectedUid);
  useAutoSelect(products.map((p) => uidOf(p)), selectedUid, setSelectedUid);

  const pickCategory = (name: string) => { if (confirmDiscard()) { setCategory(name); setSelectedUid(null); } };
  const select = (uid: number | null) => { if (confirmDiscard()) setSelectedUid(uid); };
  const addDish = () => {
    if (!active || adding || !confirmDiscard()) return;
    setAdding(true);
    dish.addProduct(active.category);
    const list = dish.dishes.find((c: { category: string }) => c.category === active.category)?.products;
    const created = list?.[list.length - 1];
    if (created) setSelectedUid(uidOf(created));
    window.setTimeout(() => setAdding(false), 500);
  };
  const addCategory = () => {
    const name = (newCategory || '').trim();
    setNewCategory(null);
    if (!name) return;
    dish.addCategory(name);
    const last = dish.dishes[dish.dishes.length - 1];
    if (last) { setCategory(last.category); setSelectedUid(null); }
  };

  return (
    <div>
      <SectionHead title="Меню ресторана" lead="Блюда, цены и фотографии по разделам меню.">
        <button type="button" className="adm-btn adm-btn-primary" onClick={addDish} disabled={!active || adding}>Новое блюдо</button>
      </SectionHead>

      <Pills label="Раздел меню" value={active?.category || ''} onChange={pickCategory} items={categories.map((c) => ({ key: c.category, label: c.category }))}>
        {newCategory === null ? (
          <button type="button" className="adm-pill-add" onClick={() => setNewCategory('')}>+ Раздел</button>
        ) : (
          <span className="adm-pill-form">
            <input className="adm-input" aria-label="Название нового раздела" placeholder="Название раздела" autoFocus value={newCategory} maxLength={80} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCategory(); if (e.key === 'Escape') setNewCategory(null); }} />
            <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={addCategory}>Создать</button>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => setNewCategory(null)}>Отмена</button>
          </span>
        )}
      </Pills>

      {active && <CategoryBar category={active.category} count={products.length} onRenamed={setCategory} onDeleted={() => { setCategory(''); setSelectedUid(null); }} />}

      <div className={`adm-split${current ? ' is-editing' : ''}`}>
        <section className="adm-split-list adm-split-wide" aria-label="Список блюд">
          {products.length > 0 ? (
            <ul className="adm-rows">
              {products.map((p) => (
                <ListRow
                  key={uidOf(p)}
                  active={uidOf(p) === selectedUid}
                  onClick={() => select(uidOf(p))}
                  thumb={<Thumb src={p.images[0]} w={56} h={42} />}
                  title={p.name}
                  sub={dish.isSavingProduct(p.id) ? 'Сохраняем…' : p.description || active.category}
                  facts={<><span>{p.weight}</span><strong>{priceText(p.price)}</strong></>}
                />
              ))}
            </ul>
          ) : (
            <p className="adm-empty">В этом разделе пока нет блюд. Нажмите «Новое блюдо».</p>
          )}
          {active && <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-add-line" onClick={addDish} disabled={adding}>+ Добавить блюдо</button>}
        </section>

        <section className="adm-split-edit adm-split-narrow" aria-label="Редактирование блюда">
          {current ? (
            <DishEditor key={uidOf(current)} product={current} category={active.category} onClose={() => setSelectedUid(null)} onMoved={(name) => setCategory(name)} />
          ) : (
            <div className="adm-card adm-empty"><p>Выберите блюдо слева, чтобы изменить название, цену, описание и фото.</p></div>
          )}
        </section>
      </div>
    </div>
  );
});

export default MenuAdmin;
