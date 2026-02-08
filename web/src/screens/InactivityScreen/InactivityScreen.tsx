import { useEffect, useState } from 'react';
import './InactivityScreen.scss';

type Props = {
    onContinue: () => void;
    onStop: () => void;
    timeoutSeconds?: number;
};

export default function InactivityScreen({ onContinue, onStop, timeoutSeconds = 15 }: Props) {
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
                <h2>Are you still there?</h2>
                <p>
                    Your order will be cancelled in <br />
                    <span className="countdown">{timeLeft}</span> seconds.
                </p>
                <div className="buttons">
                    <button className="stop-button" onClick={onStop}>
                        Cancel
                    </button>
                    <button className="continue-button" onClick={onContinue}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
