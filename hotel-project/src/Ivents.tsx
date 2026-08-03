import Navbar from "./components/Navbar"
// import EventContent from "./components/EventContent.js"
import Footer from "./components/Footer";
import { useState } from "react";

import EventContent from './components/EventContent';

function Ivents() {

    const [nav, setNav] = useState(false);
    return (
        <div>
            <Navbar nav={nav} setNav={setNav} />
            <EventContent />
            <Footer />
        </div>
    );
}
 
export default Ivents;
