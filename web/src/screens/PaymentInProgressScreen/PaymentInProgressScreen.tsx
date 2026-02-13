import { useEffect } from 'react';
import './PaymentInProgressScreen.scss';
import { socket } from '../../socket';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/background.png";

import type { OrderData } from '../../types/Order';

interface PaymentInProgressProps {
    orderData: OrderData;
    onOrderCreated: (pickupNumber: number) => void;
}

export default function PaymentInProgressScreen({ orderData, onOrderCreated }: PaymentInProgressProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Build items array with one entry per quantity for the server
            const items: { product_id: number; price: number }[] = [];
            Object.entries(orderData.cart).forEach(([productId]) => {
                const qty = orderData.cart[Number(productId)];
                for (let i = 0; i < qty; i++) {
                    items.push({
                        product_id: Number(productId),
                        price: 0,
                    });
                }
            });

            socket.emit('create_order', {
                items,
                totalPrice: orderData.totalPrice,
            });
        }, 3000);

        const handleOrderCreated = (data: { orderId: number; pickupNumber: number }) => {
            onOrderCreated(data.pickupNumber);
        };

        const handleOrderError = (data: { message: string }) => {
            console.error('Order creation failed:', data.message);
        };

        socket.on('order_created', handleOrderCreated);
        socket.on('order_error', handleOrderError);

        return () => {
            clearTimeout(timer);
            socket.off('order_created', handleOrderCreated);
            socket.off('order_error', handleOrderError);
        };
    }, []);

    return (
        <div className="payment-in-progress-screen">
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