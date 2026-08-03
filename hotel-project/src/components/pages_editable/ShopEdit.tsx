import React from 'react';
import DescriptionInput from '../text_inputs/DescriptionInput';
import ImageWithButton from '../text_inputs/ImageWithButton';

interface ShopEditProps {
  pageData: {
    shopHero: { title: string; description: string; image: string | File | null };
    shopOrderBanner: { title: string; description: string; email: string };
  };
  onContentChange: (sectionName: string, data: unknown) => void;
}

const ShopEdit: React.FC<ShopEditProps> = ({ pageData, onContentChange }) => {
  const updateHero = (patch: Partial<ShopEditProps['pageData']['shopHero']>) => {
    onContentChange('shopHero', { ...pageData.shopHero, ...patch });
  };

  const updateOrderBanner = (patch: Partial<ShopEditProps['pageData']['shopOrderBanner']>) => {
    onContentChange('shopOrderBanner', { ...pageData.shopOrderBanner, ...patch });
  };

  return (
    <div className='space-y-8 p-4 md:p-6'>
      <section className='space-y-3'>
        <h2 className='font-display text-4xl text-ink'>Витрина вина</h2>
        <label className='block text-sm font-semibold text-gray-700'>Заголовок</label>
        <DescriptionInput inputField text={pageData.shopHero.title} onSave={(title) => updateHero({ title })} />
        <label className='block text-sm font-semibold text-gray-700'>Описание</label>
        <DescriptionInput text={pageData.shopHero.description} onSave={(description) => updateHero({ description })} />
        <label className='block text-sm font-semibold text-gray-700'>Изображение hero</label>
        <ImageWithButton image={pageData.shopHero.image} onImageChange={(image) => updateHero({ image })} />
      </section>

      <section className='space-y-3 border-t border-gray-200 pt-8'>
        <h2 className='font-display text-4xl text-ink'>Баннер заказа</h2>
        <p className='text-sm text-gray-600'>Корзины и оплаты нет: здесь задаётся текст и настоящий email для связи.</p>
        <label className='block text-sm font-semibold text-gray-700'>Заголовок</label>
        <DescriptionInput inputField text={pageData.shopOrderBanner.title} onSave={(title) => updateOrderBanner({ title })} />
        <label className='block text-sm font-semibold text-gray-700'>Текст</label>
        <DescriptionInput text={pageData.shopOrderBanner.description} onSave={(description) => updateOrderBanner({ description })} />
        <label className='block text-sm font-semibold text-gray-700'>Email для заказа</label>
        <DescriptionInput inputField text={pageData.shopOrderBanner.email} onSave={(email) => updateOrderBanner({ email })} />
      </section>
    </div>
  );
};

export default ShopEdit;
