import React from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoId, onEnd }) => {
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
        },
    };

    const handleEnd = (event) => {
        if (onEnd) {
            onEnd();
        }
    };

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
            <YouTube
                videoId={videoId}
                opts={opts}
                onEnd={handleEnd}
                className="absolute top-0 left-0 w-full h-full"
                iframeClassName="w-full h-full"
            />
        </div>
    );
};

export default YouTubePlayer;
