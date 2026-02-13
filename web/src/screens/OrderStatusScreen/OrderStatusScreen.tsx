import { useEffect, useRef, useState, useCallback } from 'react';
import './OrderStatusScreen.scss';

import logo from '../../assets/images/logos/logo.webp';
import background from '../../assets/images/background.png';

import { socket } from "../../socket";

interface Order {
    order_id: number;
    pickup_number: number;
    order_status_id: number;
    status_description: string;
    price_total: number;
    datetime: string;
    isNew?: boolean;
}

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
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = useCallback((order: Order) => {
        setOrders(prev => {
            if (prev.find(o => o.order_id === order.order_id)) {
                return prev;
            }
            return [...prev, { ...order, isNew: true }];
        });

        setTimeout(() => {
            setOrders(prev =>
                prev.map(o =>
                    o.order_id === order.order_id ? { ...o, isNew: false } : o
                )
            );
        }, 600);
    }, []);

    useEffect(() => {
        socket.auth = { screenType: "statusOrder" };
        socket.connect();

        socket.on("active_orders", (activeOrders: Order[]) => {
            setOrders(activeOrders.map(o => ({ ...o, isNew: false })));
        });

        socket.on("new_order", (order: Order) => {
            addOrder(order);
        });

        return () => {
            socket.off("active_orders");
            socket.off("new_order");
            socket.disconnect();
        };
    }, [addOrder]);

    const preparingOrders = orders.filter(o => [1, 2, 3].includes(o.order_status_id));
    const readyOrders = orders.filter(o => o.order_status_id === 4);

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
                        {preparingOrders.length === 0 && (
                            <div className="empty-state">
                                <p>No orders yet</p>
                            </div>
                        )}
                        {preparingOrders.map((order) => (
                            <div
                                key={order.order_id}
                                className={`order-card ${order.isNew ? 'order-card--enter' : ''}`}
                            >
                                <p>#{order.pickup_number}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="status-column ready">
                    <h2>Ready</h2>
                    <div className="order-list" ref={readyRef}>
                        {readyOrders.length === 0 && (
                            <div className="empty-state">
                                <p>No orders ready</p>
                            </div>
                        )}
                        {readyOrders.map((order) => (
                            <div
                                key={order.order_id}
                                className={`order-card ${order.isNew ? 'order-card--enter' : ''}`}
                            >
                                <p>#{order.pickup_number}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
