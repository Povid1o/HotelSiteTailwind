import React from "react";
import Plyr from "plyr-react";
import "../../node_modules/plyr/dist/plyr.css";
import './Vp.css'

const videoSrc = {
  type: "video",
  sources: [
    {
      src: "watch?v=SygkuD4g8XA",
      provider: "youtube"
    }
  ]
};


export default function App() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}

export const MyComponent = () => {
  return (
    <>
      <Plyr source={videoSrc} />
    </>
  );
};
