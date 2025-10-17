import React, { useCallback, useMemo } from 'react';
import DescriptionInput from '../text_inputs/DescriptionInput';
import TextEditor from '../text_inputs/TextEditor';
import PagesPhotoSelector from '../text_inputs/PagesPhotoSelector';
import Button from '../text_inputs/Button';
import { getMediaUrl } from '../../utils/contentHelpers';

interface EventsEditProps {
  eventData: {
    id: number;
    title: string;
    description: string;
    images: Array<{ url: string; alt_text?: string; order?: number }>;
  };
  onSave: (data: { title?: string; description?: string; images?: Array<string | File | { src?: string | File; alt?: string }> }) => void;
}

const EventsEdit: React.FC<EventsEditProps> = ({ eventData, onSave }) => {
  const normalizedPhotos = useMemo(() => {
    return (eventData.images || []).map((img) => ({ src: getMediaUrl(img.url), alt: img.alt_text || '' }));
  }, [eventData.images]);

  const handleTitleSave = useCallback((newTitle: string) => {
    onSave({ title: newTitle });
  }, [onSave]);

  const handleDescriptionSave = useCallback((newText: string) => {
    onSave({ description: newText });
  }, [onSave]);

  const handleImagesChange = useCallback((newImgs: any[]) => {
    onSave({ images: newImgs });
  }, [onSave]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <DescriptionInput text={eventData.title} inputField={true} horizontal={false} onSave={handleTitleSave} />
      </div>
      <div className="mb-4">
        <TextEditor text={eventData.description} format="paragraph" onSave={handleDescriptionSave} />
      </div>
      <div className="mb-4">
        <PagesPhotoSelector photos={normalizedPhotos} withSlider={true} onPhotosChange={handleImagesChange} />
      </div>
    </div>
  );
};

export default EventsEdit;
