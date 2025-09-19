import { makeAutoObservable } from 'mobx';
import { fetchPageContent, updatePageContent, togglePageActive } from '../components/http/pageAPI';

// Используем интерфейсы из ТЗ
interface GalleryImage {
  src: string | File;
  alt: string;
}

interface ServiceItem {
  name: string;
  image: string | File;
}

interface PageContent {
  name: string;
  path: string;
  isActive: boolean;
  content: {
    mainBackground?: {
      image: string | File;
      title: string;
    };
    aboutSection?: {
      title: string;
      description: string;
    };
    firstGallery?: {
      title: string;
      images: GalleryImage[];
    };
    secondGallery?: {
      title: string;
      images: GalleryImage[];
    };
    videoSection?: {
      title: string;
      videoUrl: string | File;
    };
    servicesSection?: {
      title: string;
      services: ServiceItem[];
    };
    introSection?: {
      title: string;
      description: string;
      image: string | File;
      buttonText: string;
      buttonLink: string;
    };
    historySection?: {
      title: string;
      leftDates: { year: string; description: string }[];
      rightDates: { year: string; description: string }[];
    };
    wineSection?: {
      firstText: string;
      secondText: string;
      buttonText: string;
      buttonLink: string;
    };
    productionSection?: {
      title: string;
      stages: { name: string; image: string | File | null }[];
    };
    regionSection?: {
      title: string;
      firstText: string;
      secondText: string;
      backgroundImage: string | File;
    };
  } | string;
}

export default class PageContentStorage {
  private _pages: PageContent[] = [];
  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Getters
  get pages(): PageContent[] {
    return this._pages;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get error(): string | null {
    return this._error;
  }

  // Setters
  setPages(pages: PageContent[]) {
    this._pages = pages;
  }

  setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  setError(error: string | null) {
    this._error = error;
  }

  // API методы
  async loadPageContent() {
    try {
      this.setLoading(true);
      this.setError(null);

      const response = await fetchPageContent();

      // Проверяем, что есть массив
      const pages = response && Array.isArray(response.pages)
          ? response.pages
          : [];

      this.setPages(pages);
    } catch (error: any) {
      this.setError(error.message);
      console.error("Error loading page content:", error);
      this.setPages([]); // чтобы точно был массив
    } finally {
      this.setLoading(false);
    }
  }

  updatePageContentLocal = (pageName: string, sectionName: string, updatedData: any) => {
    const page = this._pages.find(p => p.name === pageName);

    if (page) {
      // Если content не объект — заменяем на пустой объект
      if (typeof page.content !== 'object' || page.content === null) {
        page.content = {};
      }

      // Сохраняем старое значение для отката
      const oldData = { ...(page.content[sectionName] || {}) };

      // Обновляем или создаём секцию
      page.content = {
        ...page.content,
        [sectionName]: updatedData
      };

      // Отправляем на сервер
      updatePageContent(pageName, page.content).catch(error => {
        console.error('Error updating page content:', error);
        // Откат изменений
        page.content = {
          ...page.content,
          [sectionName]: oldData
        };
      });
    }
  };

  togglePageActiveLocal = (pageName: string) => {
    const page = this._pages.find(p => p.name === pageName);
    if (page) {
      // Если у страницы ещё нет isActive → создаём поле
      if (typeof page.isActive !== "boolean") {
        page.isActive = false;
      }

      page.isActive = !page.isActive;

      togglePageActive(pageName).catch(error => {
        console.error("Error toggling page active:", error);
        // откат
        page.isActive = !page.isActive;
      });
    }
  };}