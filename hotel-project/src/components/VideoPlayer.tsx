import React from "react";
import ReactPlayer from "react-player";
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

    // For regular URLs (YouTube, direct video files, etc.), use ReactPlayer
    return (
        <div className="video-player-wrapper w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <ReactPlayer
                url={sourceUrl}
                controls
                width="100%"
                height="100%"
                style={{
                    maxHeight: '600px',
                    margin: '0 auto',
                }}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 }
                    },
                    file: {
                        attributes: {
                            controlsList: 'nodownload',
                            preload: 'metadata'
                        }
                    }
                }}
            />
        </div>
    );
};

export default VideoPlayer;
