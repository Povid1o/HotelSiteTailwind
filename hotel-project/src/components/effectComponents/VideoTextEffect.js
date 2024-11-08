import React, { useEffect, useState } from "react";

const VideoTextEffect = ({ text, video }) => {
  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = () => {
    const element = document.getElementById("scroll-section");
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < window.innerHeight && elementTop > 0) {
      const scrollProgress = 1 - elementTop / window.innerHeight;
      setScrollPos(scrollProgress);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const textSize = 3 + scrollPos * 20; // Текст увеличивается по мере скролла
  const textOpacity = 1 - scrollPos;   // Текст исчезает по мере скролла

  return (
    <div className="h-screen bg-black">
      {/* Видео на фоне */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={video}
        autoPlay
        muted
        loop
      />
      
      {/* Текст поверх видео */}
      <div id="scroll-section" className="h-screen flex justify-center items-center relative bg-black z-10">
        <h1
          className="text-white transition-all duration-500"
          style={{
            fontSize: `${textSize}rem`,
            opacity: textOpacity,
            transform: `scale(${1 + scrollPos})`,
          }}
        >
          {text}
        </h1>
      </div>
    </div>
  );
};

export default VideoTextEffect;