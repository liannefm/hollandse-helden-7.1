import { useEffect, useRef } from 'react';
import './OrderStatusScreen.scss';

import logo from '../../assets/images/logos/logo.webp';
import background from '../../assets/images/background.png';

function useAutoScroll() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        let animationId: number;
        let direction = 1;
        let paused = false;
        const speed = 1;
        const pauseDuration = 3000;

        const startPause = () => {
            paused = true;
            setTimeout(() => {
                paused = false;
            }, pauseDuration);
        };

        const autoScroll = () => {
            const maxScroll = container.scrollHeight - container.clientHeight;

            if (maxScroll <= 0) {
                animationId = requestAnimationFrame(autoScroll);
                return;
            }

            if (!paused) {
                container.scrollTop += speed * direction;

                if (direction === 1 && container.scrollTop >= maxScroll) {
                    container.scrollTop = maxScroll;
                    direction = -1;
                    startPause();
                } else if (direction === -1 && container.scrollTop <= 0) {
                    container.scrollTop = 0;
                    direction = 1;
                    startPause();
                }
            }

            animationId = requestAnimationFrame(autoScroll);
        };

        // Start after a short delay
        const timeout = setTimeout(() => {
            animationId = requestAnimationFrame(autoScroll);
        }, 1000);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return ref;
}

export default function OrderStatusScreen() {
    const preparingOrders = ['#58', '#59', '#60', '#61', '#62', '#63'];
    const readyOrders = ['#55', '#56', '#57'];

    const preparingRef = useAutoScroll();
    const readyRef = useAutoScroll();

    return (
        <div className="order-status-screen">
            <img className="background" src={background} alt="Background" />

            <header>
                <img src={logo} alt="Logo" />
            </header>

            <div className="status-columns">
                <div className="status-column preparing">
                    <h2>Preparing</h2>
                    <div className="order-list" ref={preparingRef}>
                        {preparingOrders.map((order) => (
                            <div key={order} className="order-card">
                                <p>{order}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="status-column ready">
                    <h2>Ready</h2>
                    <div className="order-list" ref={readyRef}>
                        {readyOrders.map((order) => (
                            <div key={order} className="order-card">
                                <p>{order}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
