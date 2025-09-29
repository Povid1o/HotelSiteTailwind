import './styles/main.css'
import {useState} from "react";
import {useNavigate} from "react-router";
import Media from './Media'

export default function Main(){
    const [hover, setHover] = useState(null)
    const navigate = useNavigate()
    return(
        <>
            <div className="main-container">
                <div
                    className={`main-side left 
                    ${hover === 'left' ? 'active': hover === 'right' ? 'inactive' : ''}`}
                    onMouseLeave={() => setHover(null)}
                    onMouseEnter={() => setHover('left')}
                    onClick={() => navigate('/Отель')}
                >
                    <div className="main-content ">
                        <Media src="/images/Wine_Background.png" alt="right-content" />
                        <h1>Туристический комплекс</h1>
                    </div>
                </div>
                <div
                    className={`main-side right 
                    ${hover === 'right' ? 'active' : hover === 'left' ? 'inactive' : ''}`}
                    onMouseLeave={() => setHover(null)}
                    onMouseEnter={() => setHover('right')}
                    onClick={() => navigate('/Винодельня')}
                >
                    <div className="main-content">
                        <Media src="/images/VineryBackground.png" alt="right-content" className='h-full'/>
                        <h1>Винодельня</h1>
                    </div>
                </div>
                <div
                    className={`main-logo 
                    ${hover === 'left' ? 'logoRight' : 
                    hover === 'right' ? 'logoLeft' : ''}`}>
                    <img src='/images/VineTerracesLogo.png' alt='logo' className='w-32 h-32'></img>
                </div>
            </div>
        </>
    )
}