import Navbar from "./components/Navbar.js"
// import EventContent from "./components/EventContent.js"
import Footer from "./components/Footer.js";
import { useState, lazy } from "react";

const EventContent = lazy(() => import("./components/EventContent.js"));

function Ivents() {

    const [nav, setNav] = useState(false);
    return (
        <div>
            <Navbar nav={nav} setNav={setNav} />
            <EventContent/>
            <Footer />
        </div>
    );
}
 
export default Ivents;