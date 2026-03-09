import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThermalPrinter } from '../../hooks/useThermalPrinter';
import Receipt from '../../components/Receipt/Receipt';
import type { OrderData } from '../../types/Order';
import type { Product } from '../../types/Product';
import type { ProductLanguages } from '../../types/ProductLanguages';
import type { ReceiptItem } from '../../utils/receiptPrinter';
import './OrderConfirmationScreen.scss';

import logo       from '../../assets/images/logos/logo.webp';
import background from '../../assets/images/background.png';

interface OrderConfirmationProps {
    pickupNumber: number;
    orderData: OrderData;
    products: Product[];
    productLanguages: ProductLanguages;
    currentLanguage: string;
    onClick: () => void;
}

const COUNTDOWN_SECONDS = 20;

export default function OrderConfirmationScreen({
    pickupNumber,
    orderData,
    products,
    productLanguages,
    currentLanguage,
    onClick,
}: OrderConfirmationProps) {
    const { t }                              = useTranslation();
    const { isConnected, printReceipt }      = useThermalPrinter();
    const [countdown, setCountdown]          = useState(COUNTDOWN_SECONDS);
    const hasPrinted                         = useRef(false);

    const displayNumber = String(pickupNumber).padStart(2, '0');

    // Build receipt items — prefer translated name for the active language
    const receiptItems: ReceiptItem[] = Object.entries(orderData.cart).map(([productId, quantity]) => {
        const id      = Number(productId);
        const product = products.find(p => p.product_id === id);
        const translatedName =
            productLanguages[currentLanguage]?.[id]?.name   // translated name for selected language
            ?? productLanguages['en']?.[id]?.name            // fallback: English
            ?? product?.name                                  // fallback: base product name
            ?? `Product ${productId}`;                        // last resort
        return {
            name:     translatedName,
            quantity,
            price:    product?.price || 0,
        };
    });

    // Auto-print after 2s
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (hasPrinted.current) return;
            hasPrinted.current = true;

            if (isConnected) {
                try {
                    await printReceipt({
                        pickupNumber,
                        orderType:  orderData.orderType,
                        items:      receiptItems,
                        totalPrice: orderData.totalPrice,
                    });
                } catch (err) {
                    console.error('Thermisch printen mislukt:', err);
                    window.print();
                }
            } else {
                window.print();
            }
        }, 2000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    // Countdown → auto-reset
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClick();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onClick]);

    const vatRate   = 0.09;
    const totalNum  = Number(orderData.totalPrice);
    const vatAmount = totalNum - (totalNum / (1 + vatRate));
    const subtotal  = totalNum - vatAmount;

    return (
        <>
            {/* Hidden receipt for window.print() fallback */}
            <Receipt
                pickupNumber={pickupNumber}
                orderType={orderData.orderType}
                items={receiptItems}
                totalPrice={orderData.totalPrice}
            />

            <div className="order-confirmation-screen" onClick={onClick}>
                <img className="background" src={background} alt="" />

                <div className="confirmation-content" onClick={e => e.stopPropagation()}>

                    {/* ─── Logo ─── */}
                    <header className="confirmation-header">
                        <img src={logo} alt="Hollandse Helden" />
                    </header>

                    {/* ─── Pickup number ─── */}
                    <div className="confirmation-pickup">
                        <p className="pickup-label">{t('order_preparing').split('\n')[0]}</p>
                        <div className="pickup-badge">
                            <span className="pickup-number">{displayNumber}</span>
                        </div>
                        <p className="pickup-sub">Wacht tot uw nummer wordt geroepen</p>
                    </div>

                    {/* ─── Order summary ─── */}
                    {receiptItems.length > 0 && (
                        <div className="confirmation-summary">
                            <div className="summary-items">
                                {receiptItems.map((item, i) => (
                                    <div key={i} className="summary-row">
                                        <span className="summary-name">{item.quantity}× {item.name}</span>
                                        <span className="summary-price">&euro;{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-row summary-vat">
                                <span>Subtotaal</span>
                                <span>&euro;{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row summary-vat">
                                <span>BTW 9%</span>
                                <span>&euro;{vatAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row summary-total">
                                <span>Totaal</span>
                                <span>&euro;{totalNum.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* ─── Countdown ─── */}
                    <div className="confirmation-countdown" onClick={onClick}>
                        <p className="countdown-text">
                            Tik om een nieuwe bestelling te beginnen &nbsp;·&nbsp; <strong>{countdown}s</strong>
                        </p>
                        <div className="countdown-bar">
                            <div
                                className="countdown-fill"
                                style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%` }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
