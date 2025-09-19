// storage/VideoStorage.ts
import { makeAutoObservable } from "mobx";
import axios from "axios";

export interface Video {
    id: number;
    title: string;
    description: string;
    spesialTitle?: string;
    imageStyle?: string;
    specialStyle?: string;
    extraBlock?: string;
    videoUrl: string;
}

export default class VideoStorage {
    private _videos: Video[] = [];
    private _isLoading = false;
    private _error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get videos() {
        return this._videos;
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    setVideos(videos: Video[]) {
        this._videos = videos;
    }

    setLoading(loading: boolean) {
        this._isLoading = loading;
    }

    setError(error: string | null) {
        this._error = error;
    }

    // Загружаем видео с сервера
    async loadVideos() {
        this.setLoading(true);
        this.setError(null);
        try {
            const response = await axios.get<Video[]>("/api/videos");
            this.setVideos(response.data);
        } catch (e: any) {
            console.error("Ошибка загрузки видео:", e);
            this.setError(e.message ?? "Ошибка загрузки видео");
        } finally {
            this.setLoading(false);
        }
    }

    // Добавляем новое видео
    async addVideo(video: Omit<Video, "id">) {
        try {
            const response = await axios.post<Video>("/api/videos", video);
            this.setVideos([...this._videos, response.data]);
        } catch (e) {
            console.error("Ошибка добавления видео:", e);
        }
    }

    // Удаляем видео
    async deleteVideo(id: number) {
        try {
            await axios.delete(`/api/videos/${id}`);
            this.setVideos(this._videos.filter(v => v.id !== id));
        } catch (e) {
            console.error("Ошибка удаления видео:", e);
        }
    }

    // Обновляем видео
    async updateVideo(id: number, data: Partial<Video>) {
        try {
            const response = await axios.put<Video>(`/api/videos/${id}`, data);
            this.setVideos(this._videos.map(v => v.id === id ? response.data : v));
        } catch (e) {
            console.error("Ошибка обновления видео:", e);
        }
    }
}
