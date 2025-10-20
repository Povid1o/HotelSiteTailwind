import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/errorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Внутренний компонент для использования хуков
const ErrorDisplay: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  React.useEffect(() => {
    const timer = setTimeout(onNavigate, 4000); // авто-редирект через 4 сек
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="error-boundary-container">
      <div className="barrel-animation">
        <div className="barrel">
          <div className="barrel-ring top"></div>
          <div className="barrel-body"></div>
          <div className="barrel-ring bottom"></div>
        </div>
        <div className="wine-spill"></div>
      </div>

      <div className="error-boundary-content">
        <h1 className="error-title">Упс… Приложение перебродило 🍇</h1>
        <p className="error-description">
          Кажется, система слегка перебрала и упала под стол.  
          Дайте ей глоточек отдыха — мы вас сейчас вернём на главную.
        </p>

        <button 
          onClick={onNavigate}
          className="btn-primary"
        >
          <span>🏠</span> Вернуться на главную
        </button>
      </div>

      <div className="vine-decor vine-left"></div>
      <div className="vine-decor vine-right"></div>
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🍷 ErrorBoundary перехватил ошибку:', error);
    console.error('📍 Component stack:', errorInfo.componentStack);
    
    // Специальная обработка для ошибки #310
    if (error.message.includes('Rendered more hooks than during the previous render')) {
      console.error('🔧 Это ошибка #310 - проблема с хуками React');
      console.error('💡 Рекомендация: Проверьте условный рендеринг хуков в компонентах');
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorDisplayWrapper />;
    }

    return this.props.children;
  }
}

// Обёртка для использования хуков вне классового компонента
const ErrorDisplayWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate('/');
  };

  return <ErrorDisplay onNavigate={handleNavigate} />;
};

export default ErrorBoundary;