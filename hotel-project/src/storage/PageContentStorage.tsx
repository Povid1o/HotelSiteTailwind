import { makeAutoObservable, toJS } from 'mobx';
import { fetchPageContent, updatePageSection, togglePageActive, createPage } from '../components/http/pageAPI';

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
  id: number; // Добавили id
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
    shopHero?: {
      title: string;
      description: string;
      image: string | File | null;
    };
    shopOrderBanner?: {
      title: string;
      description: string;
      email: string;
    };
  } | string;
}

export default class PageContentStorage {
  private _pages: PageContent[] = [];
  private _isLoading = false;
  private _error: string | null = null;
  private _saveQueues = new Map<number, Promise<void>>();
  private _savingPageIds = new Set<number>();
  private _pageSaveErrors = new Map<number, string>();
  private _sectionVersions = new Map<string, number>();

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

  isSavingPage(pageId: number): boolean {
    return this._savingPageIds.has(pageId);
  }

  getPageSaveError(pageId: number): string | null {
    return this._pageSaveErrors.get(pageId) || null;
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
      const pages = await fetchPageContent();
      this.setPages(pages);
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error loading page content:', error);
    } finally {
      this.setLoading(false);
    }
  }

  // Локальные методы
  updatePageContentLocal = (pageName: string, sectionName: string, updatedData: any) => {
    const page = this._pages.find(p => p.name === pageName);
    if (page && typeof page.content === 'object') {
      const oldData = { ...page.content[sectionName] };
      page.content = {
        ...page.content,
        [sectionName]: updatedData
      };

      const sectionKey = `${page.id}:${sectionName}`;
      const sectionVersion = (this._sectionVersions.get(sectionKey) || 0) + 1;
      this._sectionVersions.set(sectionKey, sectionVersion);

      // Convert MobX state without losing File values that must be uploaded.
      const preserveFiles = (mobxData: any, plainData: any) => {
        if (!mobxData || !plainData) return;
        
        if (Array.isArray(mobxData) && Array.isArray(plainData)) {
          mobxData.forEach((item: any, idx: number) => {
            // Проверяем File напрямую в mobxData
            if (item instanceof File) {
              plainData[idx] = item;
            } else if (typeof item === 'object' && item !== null && !(item instanceof File)) {
              // Рекурсивно обрабатываем объекты
              preserveFiles(item, plainData[idx]);
            }
          });
        } else if (typeof mobxData === 'object' && typeof plainData === 'object') {
          Object.keys(mobxData).forEach(key => {
            const mobxValue = mobxData[key];
            // Проверяем File напрямую в mobxData
            if (mobxValue instanceof File) {
              plainData[key] = mobxValue;
            } else if (typeof mobxValue === 'object' && mobxValue !== null && !(mobxValue instanceof File)) {
              // Рекурсивно обрабатываем объекты и массивы
              preserveFiles(mobxValue, plainData[key]);
            }
          });
        }
      };
      
      const plainSection = toJS(updatedData);
      preserveFiles(updatedData, plainSection);

      const previousSave = this._saveQueues.get(page.id) || Promise.resolve();
      const save = previousSave
        .catch(() => undefined)
        .then(async () => {
          this._savingPageIds.add(page.id);
          this._pageSaveErrors.delete(page.id);
          const savedPage = await updatePageSection(page.id, sectionName, plainSection);
          const currentPage = this._pages.find(item => item.id === page.id);
          if (
            currentPage &&
            typeof currentPage.content === 'object' &&
            this._sectionVersions.get(sectionKey) === sectionVersion &&
            typeof savedPage.content === 'object'
          ) {
            currentPage.content = {
              ...currentPage.content,
              [sectionName]: savedPage.content[sectionName]
            };
          }
        })
        .catch((error: any) => {
          const message = error?.response?.data?.message || 'Не удалось сохранить изменения. Повторите попытку.';
          this._pageSaveErrors.set(page.id, message);
          const currentPage = this._pages.find(item => item.id === page.id);
          if (
            currentPage &&
            typeof currentPage.content === 'object' &&
            this._sectionVersions.get(sectionKey) === sectionVersion
          ) {
            currentPage.content = { ...currentPage.content, [sectionName]: oldData };
          }
        })
        .finally(() => {
          if (this._saveQueues.get(page.id) === save) {
            this._savingPageIds.delete(page.id);
          }
        });

      this._saveQueues.set(page.id, save);
      return save;
    }
  };

  togglePageActiveLocal = (pageName: string) => {
    const page = this._pages.find(p => p.name === pageName);
    if (page) {
      const oldValue = page.isActive;
      page.isActive = !page.isActive;
      
      // Используем page.id вместо pageName
      togglePageActive(page.id).catch(error => {
        console.error('Error toggling page active:', error);
        page.isActive = oldValue; // Откатываем
      });
    }
  };

  async createPage(pageData: Partial<PageContent>) {
    try {
      const newPage = await createPage(pageData);
      this._pages.push(newPage);
      return newPage;
    } catch (error: any) {
      this.setError(error.message);
      console.error('Error creating page:', error);
      throw error;
    }
  }
}
