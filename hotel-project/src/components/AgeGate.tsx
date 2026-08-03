import React from 'react';
import './styles/age-gate.css';

const AgeGate = ({ onConfirm }: { onConfirm: () => void }) => (
  <div className='age-gate' role='dialog' aria-modal='true' aria-labelledby='age-gate-title'>
    <div className='age-gate__panel'>
      <p>Винные Террасы</p>
      <h1 id='age-gate-title'>Вам уже есть 18 лет?</h1>
      <span>Сайт содержит информацию об алкогольной продукции.</span>
      <button type='button' onClick={onConfirm}>Да, мне исполнилось 18</button>
    </div>
  </div>
);

export default AgeGate;
