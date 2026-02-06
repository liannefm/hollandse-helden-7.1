import './OrderConfirmationScreen.scss';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/background.png";

export default function OrderConfirmationScreen() {
    return (
        <div className="order-confirmation-screen">
            <header>
                <img src={logo} alt="Logo" />
            </header>
            <main>
                <img className="background" src={background} alt="Background" />

                <h2>We’re preparing your order. Don’t forget to take your receipt.</h2>

                <p className="order-number">#61</p>
            </main>
        </div>
    );
}