import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/notFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="wine-bottle-animation">
        <div className="bottle">
          <div className="bottle-neck"></div>
          <div className="bottle-body"></div>
          <div className="wine-splash"></div>
        </div>
      </div>
      
      <div className="content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Эта страница испарилась, как аромат вина...</h2>
        <p className="error-description">
          Похоже, вы заблудились в наших винных погребах. 
          Эта бутылка ещё не откупорена.
        </p>
        
        <div className="button-group">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            <span>🏠</span> На главную
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate('/Каталог')}
          >
            <span>🍷</span> В каталог вин
          </button>
        </div>
      </div>

      <div className="decorative-vines">
        <div className="vine vine-1"></div>
        <div className="vine vine-2"></div>
        <div className="vine vine-3"></div>
      </div>
    </div>
  );
};

export default NotFound;