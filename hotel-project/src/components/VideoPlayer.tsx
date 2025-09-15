import React, { useRef, useEffect } from "react";
import Plyr from "plyr/dist/plyr.min.js";
import "plyr/dist/plyr.css";
import './styles/Vp.css';

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPlayer = ({ sourceUrl }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const youtubeId = getYouTubeId(sourceUrl);
    const player = new Plyr(playerRef.current, {
      controls: ["play", "progress", "mute", "volume", "fullscreen"],
    });

    if (youtubeId) {
      player.source = {
        type: "video",
        sources: [
          {
            src: youtubeId,
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

    return () => {
      player.destroy();
    };
  }, [sourceUrl]);

  const youtubeId = getYouTubeId(sourceUrl);

  return youtubeId ? (
      <div
          ref={playerRef}
          className="plyr plyr-react"
          data-plyr-provider="youtube"
          data-plyr-embed-id={youtubeId}
      />
  ) : (
      <video ref={playerRef} className="plyr plyr-react" controls />
  );
};

export default VideoPlayer;
