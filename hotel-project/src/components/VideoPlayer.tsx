import React from "react";
import Plyr from "plyr-react";
import "../../node_modules/plyr/dist/plyr.css";
import './styles/Vp.css'

interface VideoPlayerProps {
    sourceUrl?: string;
}

const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ sourceUrl }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isBlob, setIsBlob] = React.useState(false);

    // Check if URL is a blob URL
    React.useEffect(() => {
        if (sourceUrl?.startsWith('blob:')) {
            setIsBlob(true);
            console.log('VideoPlayer: Detected blob URL, using native video element');
        } else {
            setIsBlob(false);
        }
    }, [sourceUrl]);

    const plyrSource = React.useMemo(() => {
        if (!sourceUrl) {
            console.warn('VideoPlayer: No source URL provided');
            return null;
        }

        // Skip Plyr for blob URLs
        if (sourceUrl.startsWith('blob:')) {
            return null;
        }

        console.log('VideoPlayer: Processing source URL:', sourceUrl);
        const youtubeId = getYouTubeId(sourceUrl);

        if (youtubeId) {
            console.log('VideoPlayer: Detected YouTube video, ID:', youtubeId);
            return {
                type: "video" as const,
                sources: [
                    {
                        src: youtubeId,
                        provider: "youtube" as const,
                    },
                ],
            };
        } else {
            console.log('VideoPlayer: Using direct video URL:', sourceUrl);
            // Determine video type from URL
            const extension = sourceUrl.split('.').pop()?.split('?')[0]?.toLowerCase() || 'mp4';
            const videoType = extension === 'webm' ? 'video/webm' : 
                             extension === 'ogg' ? 'video/ogg' : 
                             'video/mp4';
            
            return {
                type: "video" as const,
                sources: [
                    {
                        src: sourceUrl,
                        type: videoType,
                    },
                ],
            };
        }
    }, [sourceUrl]);
    
    // If no source URL
    if (!sourceUrl) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Видео не указано</p>
            </div>
        );
    }

    // For blob URLs, use native video element
    if (isBlob && sourceUrl) {
        return (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <video 
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                    controlsList="nodownload"
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
            </div>
        );
    }

    // For regular URLs, use Plyr
    if (!plyrSource) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">Ошибка загрузки видео</p>
            </div>
        );
    }

    return <Plyr source={plyrSource} />;
};

export default VideoPlayer;
