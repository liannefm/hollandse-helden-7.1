import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PaymentInProgressScreen.scss';
import { socket } from '../../socket';

import logo from "../../assets/images/logos/logo.webp";
import background from "../../assets/images/background.png";

import type { OrderData } from '../../types/Order';
import type { Product } from '../../types/Product';
import { printReceipt } from '../../utils/receiptPrinter';
import type { ReceiptItem } from '../../utils/receiptPrinter';

interface PaymentInProgressProps {
    orderData: OrderData;
    products: Product[];
    currentLanguage: string;
    onOrderCreated: (pickupNumber: number) => void;
}

export default function PaymentInProgressScreen({ orderData, products, currentLanguage, onOrderCreated }: PaymentInProgressProps) {
    const { t } = useTranslation();

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
            // Build receipt items from the cart
            const receiptItems: ReceiptItem[] = Object.entries(orderData.cart).map(([productId, quantity]) => {
                const product = products.find(p => p.product_id === Number(productId));
                return {
                    name: product?.name || `Product #${productId}`,
                    quantity,
                    price: product?.price || 0,
                };
            });

            // Print receipt in background (don't block order flow)
            printReceipt({
                pickupNumber: data.pickupNumber,
                orderType: orderData.orderType,
                items: receiptItems,
                totalPrice: orderData.totalPrice,
                language: currentLanguage,
            }).then(success => {
                if (success) {
                    console.log('Bon geprint voor bestelling #' + data.pickupNumber);
                } else {
                    console.warn('Bon printen mislukt voor bestelling #' + data.pickupNumber);
                }
            });

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

                <h2>{t("payment_instructions")}</h2>
            </main>
        </div>
    );
}