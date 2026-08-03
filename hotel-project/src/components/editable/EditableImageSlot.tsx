import React, { ChangeEvent, useEffect, useId, useRef, useState } from 'react';
import { getMediaUrl } from '../../utils/contentHelpers';
import '../styles/editable-image-slot.css';

export type EditableImageValue = string | File | null | undefined;

interface EditableImageSlotProps {
  value: EditableImageValue;
  label: string;
  onChange?: (value: File | null) => void;
  className?: string;
  aspectRatio?: string;
  alt?: string;
  editable?: boolean;
}

const imageUrl = (value: EditableImageValue): string => typeof value === 'string' ? getMediaUrl(value) : '';

/**
 * Keeps an image target visible even when the content has no file yet.
 * In editor mode the entire slot is a file-picker trigger; the same component
 * can be rendered read-only in previews and public empty states.
 */
const EditableImageSlot: React.FC<EditableImageSlotProps> = ({
  value,
  label,
  onChange,
  className = '',
  aspectRatio = '16 / 9',
  alt = '',
  editable = Boolean(onChange),
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(() => imageUrl(value));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (!(value instanceof File)) {
      setPreviewUrl(imageUrl(value));
      return undefined;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const chooseFile = () => {
    if (editable) inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) onChange?.(file);
    event.target.value = '';
  };

  const hasImage = Boolean(previewUrl) && !failed;
  const slotClassName = `editable-image-slot ${hasImage ? 'editable-image-slot--filled' : ''} ${editable ? 'editable-image-slot--editable' : ''} ${className}`;

  return <div className={slotClassName} style={{ aspectRatio }}>
    {hasImage ? <img src={previewUrl} alt={alt} onError={() => setFailed(true)} /> : <div className='editable-image-slot__placeholder' aria-label={label}>
      <svg aria-hidden='true' viewBox='0 0 24 24'><rect x='3' y='4' width='18' height='16' rx='2' /><circle cx='8.5' cy='9' r='1.5' /><path d='m4 18 5.5-5 3.5 3 2.5-2 4.5 4' /></svg>
      <span>{label}</span>
    </div>}
    {editable && <>
      <button type='button' className='editable-image-slot__action' onClick={chooseFile} aria-label={`Выбрать: ${label}`}>
        {hasImage ? 'Заменить фото' : 'Загрузить фото'}
      </button>
      {hasImage && <button type='button' className='editable-image-slot__remove' onClick={() => onChange?.(null)} aria-label={`Удалить: ${label}`}>Удалить</button>}
      <input id={inputId} ref={inputRef} type='file' accept='image/jpeg,image/png,image/webp' onChange={handleFileChange} />
    </>}
  </div>;
};

export default EditableImageSlot;
