import React from 'react';
import EditableImageSlot, { EditableImageValue } from '../editable/EditableImageSlot';

interface PagePreviewCardProps { title: string; description: string; image: EditableImageValue; type?: 'hero' | 'document'; }

const PagePreviewCard: React.FC<PagePreviewCardProps> = ({ title, description, image, type = 'hero' }) => <article className='w-full overflow-hidden rounded-lg border border-[#19312f]/15 bg-[#f5f2ea] text-left shadow-sm'>
  {type === 'hero' && <div className='relative h-36'><EditableImageSlot value={image} label='Фото хедера' alt={title} editable={false} className='absolute inset-0 !min-h-0 !rounded-none !border-0' /><div className='absolute inset-0 bg-[#19312f]/40' /><div className='absolute bottom-0 p-4 text-[#f5f2ea]'><h3 className='font-display text-2xl'>{title}</h3><p className='mt-1 line-clamp-2 text-xs text-[#f5f2ea]/85'>{description}</p></div></div>}
  {type === 'document' && <div className='p-4'><p className='v4-kicker'>Документ</p><h3 className='font-display text-2xl text-[#19312f]'>{title}</h3><p className='mt-1 line-clamp-2 text-xs text-[#19312f]/70'>{description}</p></div>}
  <p className='px-4 py-3 text-xs font-semibold text-[#c7774d]'>Нажмите, чтобы редактировать</p>
</article>;

export default PagePreviewCard;
