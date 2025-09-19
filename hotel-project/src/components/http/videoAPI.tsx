import { $authHost, $host } from "./index";

export interface Video {
    title?:string;
    description?:string;
    spesialTitle?:string;
    spesialDesc?:string;
    imageStyle?:string;
    bgImg?:string;
    flexReverse?:boolean;
    specialStyle?:string;
    extraBlock ?:boolean;
    videoUrl?:string;
}

// === GET all videos ===
export const fetchVideos = async (): Promise<Video[]> => {
    const { data } = await $host.get("api/video");
    return data;
};

// === CREATE new video ===
export const createVideo = async (video: Omit<Video, "id">): Promise<Video> => {
    const { data } = await $authHost.post("api/video", video, {
        headers: { "x-admin-key": "secret123" }, // если нужен ключ для админа
    });
    return data;
};

// === UPDATE video ===
export const updateVideo = async (id: number, video: Partial<Video>): Promise<Video> => {
    const { data } = await $authHost.put(`api/video/${id}`, video, {
        headers: { "x-admin-key": "secret123" },
    });
    return data;
};

// === DELETE video ===
export const deleteVideo = async (id: number): Promise<void> => {
    await $authHost.delete(`api/video/${id}`, {
        headers: { "x-admin-key": "secret123" },
    });
};
