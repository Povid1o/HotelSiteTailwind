import React from "react";
import ReactPlayer from "react-player";
import './styles/Vp.css'

interface VideoPlayerProps {
    sourceUrl?: string;
}

const isYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    return /(?:youtube\.com|youtu\.be)/.test(url);
};

const isLocalVideoFile = (url: string): boolean => {
    if (!url) return false;
    // Проверяем, что это локальный файл (не YouTube, не внешний URL)
    return !url.startsWith('http') || url.match(/\.(mp4|webm|avi|mov|wmv|flv|ogg)$/i) !== null;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ sourceUrl }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isBlob, setIsBlob] = React.useState(false);
    const [loadError, setLoadError] = React.useState(false);
    const [isLocal, setIsLocal] = React.useState(false);

    React.useEffect(() => {
        const isBlobUrl = sourceUrl?.startsWith('blob:') || false;
        const isLocalFile = sourceUrl ? isLocalVideoFile(sourceUrl) : false;
        const isYouTube = sourceUrl ? isYouTubeUrl(sourceUrl) : false;
        
        setIsBlob(isBlobUrl);
        setIsLocal(isLocalFile && !isYouTube);
        setLoadError(false);
        
        console.log('🎥 VideoPlayer: URL analysis:', {
            sourceUrl,
            isBlob: isBlobUrl,
            isLocal: isLocalFile,
            isYouTube,
            willUseNative: isBlobUrl || isLocalFile
        });
    }, [sourceUrl]);
    
    if (!sourceUrl) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Видео не указано</p>
            </div>
        );
    }

    // ✅ ИСПРАВЛЕНИЕ: Используем нативный video для ВСЕХ локальных файлов (не только blob)
    if (isBlob || isLocal) {
        return (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
                <video 
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                    onError={(e) => {
                        console.error('🎥 VideoPlayer: Native video error:', e);
                        console.error('🎥 Video currentSrc:', e.currentTarget.currentSrc);
                        console.error('🎥 Video error code:', e.currentTarget.error?.code);
                        console.error('🎥 Video error message:', e.currentTarget.error?.message);
                        setLoadError(true);
                    }}
                    onLoadedMetadata={() => {
                        console.log('✅ VideoPlayer: Video metadata loaded');
                    }}
                    onCanPlay={() => {
                        console.log('✅ VideoPlayer: Video can play');
                    }}
                    style={{
                        maxHeight: '100%',
                        display: 'block'
                    }}
                >
                    <source src={sourceUrl} type="video/mp4" />
                    <source src={sourceUrl} type="video/webm" />
                    <source src={sourceUrl} type="video/ogg" />
                    Ваш браузер не поддерживает воспроизведение видео.
                </video>
                {loadError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="text-white text-center p-4">
                            <p className="font-bold mb-2">❌ Ошибка загрузки видео</p>
                            <p className="text-sm mb-2">URL: {sourceUrl}</p>
                            <button 
                                onClick={() => {
                                    setLoadError(false);
                                    if (videoRef.current) {
                                        videoRef.current.load();
                                    }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                            >
                                Попробовать снова
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Для YouTube и других внешних URL используем ReactPlayer
    console.log('🎥 VideoPlayer: Using ReactPlayer for external URL:', sourceUrl);
    return (
        <div className="video-player-wrapper w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
            <ReactPlayer
                url={sourceUrl}
                controls
                width="100%"
                height="100%"
                onError={(error) => {
                    console.error('🎥 VideoPlayer: ReactPlayer error:', error);
                    setLoadError(true);
                }}
                style={{
                    maxHeight: '600px',
                    margin: '0 auto',
                }}
                config={{
                    youtube: {
                        playerVars: { 
                            showinfo: 1,
                            playsinline: 1 
                        }
                    },
                    file: {
                        attributes: {
                            controlsList: 'nodownload',
                            preload: 'metadata',
                            playsInline: true,
                            crossOrigin: 'anonymous'
                        },
                        forceVideo: true,
                    }
                }}
            />
            {loadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center">
                    <div>
                        <p className="font-bold mb-2">Ошибка загрузки видео</p>
                        <p className="text-sm">URL: {sourceUrl}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
