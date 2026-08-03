import React from 'react';
import V4HeroEdit, { V4HeroContent } from './V4HeroEdit';

interface RestaurantEditProps { content: Record<string, unknown>; onSave: (section: string, value: V4HeroContent) => void | Promise<void>; }

const RestaurantEdit: React.FC<RestaurantEditProps> = ({ content, onSave }) => <V4HeroEdit pageTitle='Ресторан' content={content} onSave={onSave} imageLabel='Фото хедера ресторана' />;

export default RestaurantEdit;
