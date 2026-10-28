import React, { useState } from 'react';
import { pad } from './content';

export interface Stage { name: string; months: string; text: string; image: string; fallback: string }

/** «От лозы до бутылки»: список этапов слева, крупное фото и описание справа. */
const WineryStepper: React.FC<{ stages: Stage[] }> = ({ stages }) => {
  const [index, setIndex] = useState(0);
  if (!stages.length) return null;
  const last = stages.length - 1;
  const current = stages[Math.min(index, last)];
  const go = (next: number) => setIndex((next + stages.length) % stages.length);

  return (
    <div className='v4s-stepper'>
      <ol className='v4s-steps' aria-label='Этапы производства'>
        {stages.map((stage, i) => (
          <li key={`${stage.name}-${i}`}>
            <button type='button' className='v4s-step' aria-current={i === index ? 'step' : undefined} onClick={() => setIndex(i)}>
              <span className='v4s-step__n'>{pad(i + 1)}</span>
              <span className='v4s-step__t'>{stage.name}{stage.months && <small>{stage.months}</small>}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className='v4s-stage' aria-live='polite'>
        <div className='v4s-stage__img'>
          <img key={index} src={current.image} alt={current.name} loading='lazy' onError={(event) => { if (event.currentTarget.src !== current.fallback && !event.currentTarget.src.endsWith(current.fallback)) event.currentTarget.src = current.fallback; }} />
          <span className='v4s-stage__num' aria-hidden='true'>{pad(index + 1)}</span>
        </div>
        <div className='v4s-stage__row'>
          <div className='v4s-stage__text'>
            {current.months && <p className='v4s-stage__months'>{current.months}</p>}
            <h3>{current.name}</h3>
            {current.text && <p>{current.text}</p>}
          </div>
          <div className='v4s-stage__ctl'>
            <button type='button' className='v4s-round' onClick={() => go(index - 1)} aria-label='Предыдущий этап'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M15 5l-7 7 7 7' /></svg>
            </button>
            <span className='v4s-stage__count'>{pad(index + 1)} / {pad(stages.length)}</span>
            <button type='button' className='v4s-round' onClick={() => go(index + 1)} aria-label='Следующий этап'>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><path d='M9 5l7 7-7 7' /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WineryStepper;
