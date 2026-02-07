import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useScrollStore } from "../hooks/useScrollStore";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import PaymentInProgressScreen from "../screens/PaymentInProgressScreen/PaymentInProgressScreen.tsx";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen/OrderConfirmationScreen.tsx";

import type { Product } from "../types/Product.ts";
import type { Category } from "../types/Category.ts";

function KioskApp() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [screen, setScreen] = useState("idle");

    const { saveScroll, getScroll } = useScrollStore();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    // const [order, setOrder] = useState<any[]>([]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("products", (data: Product[]) => {
            setProducts(data);
        });

        socket.on("categories", (data: Category[]) => {
            setCategories(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {screen === "idle" && (
                <IdleScreen
                    onStart={() => {
                        setScreen("orderTypeScreen");
                    }}
                />
            )}
            {screen === "orderTypeScreen" && (
                <OrderTypeScreen
                    onOrderTypeSelected={() => {
                        setScreen("menu");
                    }}
                />
            )}
            {screen === "menu" && (
                <MenuScreen
                    categories={categories}
                    products={products}
                    saveScroll={saveScroll}
                    getScroll={getScroll}
                    onSelectProduct={(product: Product) => {
                        setSelectedProduct(product);
                        setScreen("product-detail");
                    }}
                />
            )}
            {screen === "product-detail" && (
                <ProductDetailScreen
                    product={selectedProduct}
                    onCancel={() => {
                        setSelectedProduct(null);
                        setScreen("menu");
                    }}
                    onAddToOrder={() => {
                        setSelectedProduct(null);
                        setScreen("menu");
                    }}
                />
            )}
            {screen === "payment-in-progress" && <PaymentInProgressScreen />}
            {screen === "order-confirmation" && <OrderConfirmationScreen />}
        </>
    );
}

export default KioskApp;
