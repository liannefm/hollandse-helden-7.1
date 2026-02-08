import './PaymentInProgressScreen.scss';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/background.png";

export default function PaymentInProgressScreen({ onClick }: { onClick: () => void }) {
    return (
        <div className="payment-in-progress-screen" onClick={onClick}>
            <header>
                <img src={logo} alt="Logo" />
            </header>
            <main>
                <img className="background" src={background} alt="Background" />

                <h2>follow the instructions on the payment terminal</h2>
            </main>
        </div>
    );
}