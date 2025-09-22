import React from "react";
import Plyr from "plyr-react";
import "../../node_modules/plyr/dist/plyr.css";
import './styles/Vp.css'


const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPlayer = ({ sourceUrl }) => {
    const plyrSource = React.useMemo(() => {
        if (!sourceUrl) return null;

        const youtubeId = getYouTubeId(sourceUrl);


        if (youtubeId) {
            return {
                type: "video",
                sources: [
                    {
                        src: youtubeId,
                        provider: "youtube",
                    },
                ],
            };
        } else {
            return {
                type: "video",
                sources: [
                    {
                        src: sourceUrl,
                        type: `video/mp4`,
                    },
                ],
            };
        }
    }, [sourceUrl]);
    if (!plyrSource) {
        return null;
    }

    return <Plyr source={plyrSource} />;
};

export default VideoPlayer;
