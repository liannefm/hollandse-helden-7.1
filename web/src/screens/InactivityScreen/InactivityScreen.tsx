import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './InactivityScreen.scss';

type Props = {
    onContinue: () => void;
    onStop: () => void;
    timeoutSeconds?: number;
};

export default function InactivityScreen({ onContinue, onStop, timeoutSeconds = 15 }: Props) {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(timeoutSeconds);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            onStop();
        }
    }, [timeLeft, onStop]);

    const preventGlobalReset = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="inactivity-screen"
            onPointerDown={preventGlobalReset}
            onTouchStart={preventGlobalReset}
            onKeyDown={preventGlobalReset}
            onClick={preventGlobalReset}
        >
            <div className="backdrop" />
            <div className="content">
                <h2>{t("are_you_still_there")}</h2>
                <p>{t("order_cancelled_in", { seconds: timeLeft })}</p>
                <div className="buttons">
                    <button className="stop-button" onClick={onStop}>
                        {t("cancel")}
                    </button>
                    <button className="continue-button" onClick={onContinue}>
                        {t("continue")}
                    </button>
                </div>
            </div>
        </div>
    );
}
