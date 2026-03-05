import { useTranslation } from 'react-i18next';
import './OrderConfirmationScreen.scss';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/background.png";

interface OrderConfirmationProps {
    pickupNumber: number;
    onClick: () => void;
}

export default function OrderConfirmationScreen({ pickupNumber, onClick }: OrderConfirmationProps) {
    const { t } = useTranslation();

    return (
        <div className="order-confirmation-screen" onClick={onClick}>
            <header>
                <img src={logo} alt="Logo" />
            </header>
            <main>
                <img className="background" src={background} alt="Background" />

                <h2>{t("order_preparing")}</h2>

                <p className="order-number">#{pickupNumber}</p>
            </main>
        </div>
    );
}