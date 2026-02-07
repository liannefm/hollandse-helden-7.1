import { useState, useEffect } from 'react';
import './idleScreen.scss';

import logo from "../../assets/images/logos/logo.webp";
import image1 from "../../assets/images/idleScreen/1.jpg";
import image2 from "../../assets/images/idleScreen/2.jpg";
import image3 from "../../assets/images/idleScreen/3.jpg";
import image4 from "../../assets/images/idleScreen/4.jpg";

const images = [image1, image2, image3, image4];

export default function IdleScreen({ onStart }: { onStart: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="idle-screen" onClick={onStart}>
            <header>
                <div className="logo">
                    <img src={logo} alt="Logo" width="200" height="200" />
                </div>
                <h1>Fresh, Healthy<br />&<br />Enjoy Quickly</h1>
                <div className="background"></div>
            </header>
            <main>
                {images.map((img, index) => (
                    <img
                        key={index}
                        className={`background ${index === currentIndex ? 'active' : ''}`}
                        src={img}
                        alt={`Background ${index + 1}`}
                    />
                ))}
            </main>
            <footer>
                <button>CLICK THE SCREEN TO START</button>
            </footer>
        </div>
    );
}