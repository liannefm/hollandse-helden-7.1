import './idleScreen.scss';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/idleScreen/background.png";

export default function IdleScreen({ onStart }) {
    return (
        <div className="idle-screen" onClick={onStart}>
            <header>
                <div className="logo">
                    <img src={logo} alt="Logo" width="153" height="153" />
                </div>
                <h1>Fresh, Healthy<br />&<br />Enjoy Quickly</h1>
                <div className="background"></div>
            </header>
            <main>
                <img className="background" src={background} alt="Background" />
            </main>
            <footer>
                <button>CLICK THE SCREEN TO START</button>
            </footer>
        </div>
    );
}