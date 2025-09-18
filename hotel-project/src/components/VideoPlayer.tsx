import React, { useRef, useEffect } from "react";
import "plyr/dist/plyr.css";
import Plyr from "plyr";

interface VideoPlayerProps {
    sourceUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ sourceUrl }) => {
    const playerRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!playerRef.current) return;

        const player = new Plyr(playerRef.current, {
            controls: ["play", "progress", "mute", "volume", "fullscreen"],
        });

        // Для YouTube можно использовать:
        if (sourceUrl.includes("youtube.com") || sourceUrl.includes("youtu.be")) {
            player.source = {
                type: "video",
                sources: [
                    {
                        src: sourceUrl.split("v=")[1], // достаем ID
                        provider: "youtube",
                    },
                ],
            };
        } else {
            player.source = {
                type: "video",
                sources: [
                    {
                        src: sourceUrl,
                        type: "video/mp4",
                    },
                ],
            };
        }

        return () => player.destroy();
    }, [sourceUrl]);

    return <video ref={playerRef} src={sourceUrl} className="w-full h-full object-cover rounded-xl" controls playsInline />;
};

export default VideoPlayer;
