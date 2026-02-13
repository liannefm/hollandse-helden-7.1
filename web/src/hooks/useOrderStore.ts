import { useState } from "react";
import type { OrderData, OrderType } from "../types/Order";
import type { Product } from "../types/Product";

export function useOrderStore(products: Product[]) {
    const [orderData, setOrderData] = useState<OrderData>({
        orderType: null,
        cart: {},
        totalItems: 0.00,
        totalPrice: 0.00,
        totalKcal: 0.00,
    });

    const setOrderType = (type: OrderType) => {
        setOrderData(prev => ({
            ...prev,
            orderType: type,
        }));
    };

    const getProductPrice = (productId: number) => {
        return products.find(p => p.product_id === productId)?.price || 0;
    };

    const getProductKcal = (productId: number) => {
        return products.find(p => p.product_id === productId)?.kcal || 0;
    };

    const addToCart = (productId: number, quantity: number = 1) => {
        setOrderData(prev => ({
            ...prev,
            cart: {
                ...prev.cart,
                [productId]: (prev.cart[productId] ?? 0) + quantity,
            },
            totalItems: prev.totalItems + quantity,
            totalPrice: prev.totalPrice + quantity * getProductPrice(productId),
            totalKcal: prev.totalKcal + quantity * getProductKcal(productId),
        }));
    };

    const increaseFromCart = (productId: number, quantity: number = 1) => {
        setOrderData(prev => ({
            ...prev,
            cart: {
                ...prev.cart,
                [productId]: (prev.cart[productId] ?? 0) + quantity,
            },
            totalItems: prev.totalItems + quantity,
            totalPrice: prev.totalPrice + quantity * getProductPrice(productId),
            totalKcal: prev.totalKcal + quantity * getProductKcal(productId),
        }));
    };

    const decreaseFromCart = (productId: number, quantity: number = 1) => {
        setOrderData(prev => {
            const currentQty = prev.cart[productId] ?? 0;
            if (currentQty <= quantity) {
                const newCart = { ...prev.cart };
                delete newCart[productId];

                // Calculate price of removed items
                const removedPrice = currentQty * getProductPrice(productId);
                const removedKcal = currentQty * getProductKcal(productId);

                return {
                    ...prev,
                    cart: newCart,
                    totalItems: prev.totalItems - currentQty,
                    totalPrice: prev.totalPrice - removedPrice,
                    totalKcal: prev.totalKcal - removedKcal,
                };
            }

            return {
                ...prev,
                cart: {
                    ...prev.cart,
                    [productId]: currentQty - quantity,
                },
                totalItems: prev.totalItems - quantity,
                totalPrice: prev.totalPrice - quantity * getProductPrice(productId),
                totalKcal: prev.totalKcal - quantity * getProductKcal(productId),
            };
        });
    };

    const removeFromCart = (productId: number) => {
        setOrderData(prev => {
            const newCart = { ...prev.cart };
            delete newCart[productId];

            const currentQty = prev.cart[productId] ?? 0;
            const removedPrice = currentQty * getProductPrice(productId);

            return {
                ...prev,
                cart: newCart,
                totalItems: prev.totalItems - currentQty,
                totalPrice: prev.totalPrice - removedPrice,
                totalKcal: prev.totalKcal - currentQty * getProductKcal(productId),
            };
        });
    };

    const resetOrder = () => {
        setOrderData({
            orderType: null,
            cart: {},
            totalItems: 0.00,
            totalPrice: 0.00,
            totalKcal: 0.00,
        });
    };

    return {
        orderData,
        setOrderType,
        addToCart,
        increaseFromCart,
        decreaseFromCart,
        removeFromCart,
        resetOrder,
    };
}
