import React from 'react';
import { mediaSrc } from './newsFormat';

// Запасная иллюстрация, пока у новости нет обложки: холмы в палитре сайта.
const PALETTES = [
  ['#DCE5DE', '#7FA08F', '#1F4D4A', '#C7774D'],
  ['#EAD9C4', '#C7774D', '#8F4524', '#F5F2EA'],
  ['#CFD9D2', '#5E8272', '#19312F', '#EAD9C4'],
  ['#E8DCC8', '#A9B8A3', '#4B6B5F', '#C7774D'],
];

interface Props {
  id: number;
  url?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

const NewsCover: React.FC<Props> = ({ id, url, alt = '', className = '', priority = false }) => {
  if (url) {
    return <img className={className} src={mediaSrc(url)} alt={alt} loading={priority ? 'eager' : 'lazy'} />;
  }
  const [c0, c1, c2, c3] = PALETTES[Math.abs(id) % PALETTES.length];
  return (
    <svg className={className} viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="160" height="100" fill={c0} />
      <circle cx="118" cy="28" r="10" fill={c3} />
      <path d="M0 68 C30 52 55 58 80 64 C105 70 130 56 160 60 L160 100 L0 100Z" fill={c1} />
      <path d="M0 82 C25 74 50 78 80 82 C110 86 135 76 160 80 L160 100 L0 100Z" fill={c2} />
    </svg>
  );
};

export default NewsCover;
