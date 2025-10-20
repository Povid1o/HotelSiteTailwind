import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/errorBoundary.css';

interface Props {
  children: ReactNode;
  fallbackPath?: string;
  navigate?: (path: string) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🍷 ErrorBoundary перехватил ошибку:', error, errorInfo);
  }

  private handleRedirect = () => {
    const navigate = this.props.navigate!;
    const fallbackPath = this.props.fallbackPath || '/';
    navigate(fallbackPath);
  };

  public render() {
    if (this.state.hasError) {
      setTimeout(this.handleRedirect, 4000); // авто-редирект через 4 сек

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
              onClick={this.handleRedirect}
              className="btn-primary"
            >
              <span>🏠</span> Вернуться на главную
            </button>
          </div>

          <div className="vine-decor vine-left"></div>
          <div className="vine-decor vine-right"></div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryWithNavigate = ({ children, fallbackPath }: Props) => {
  const navigate = useNavigate();
  return <ErrorBoundary children={children} fallbackPath={fallbackPath} navigate={navigate} />;
};

export default ErrorBoundaryWithNavigate;