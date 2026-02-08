import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useScrollStore } from "../hooks/useScrollStore";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import OrderSummaryScreen from "../screens/OrderSummaryScreen/OrderSummaryScreen.tsx";
import PaymentInProgressScreen from "../screens/PaymentInProgressScreen/PaymentInProgressScreen.tsx";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen/OrderConfirmationScreen.tsx";
import InactivityScreen from "../screens/InactivityScreen/InactivityScreen.tsx";
import { useInactivity } from "../hooks/useInactivity.ts";

import type { Product } from "../types/Product.ts";
import type { Category } from "../types/Category.ts";

function KioskApp() {
    const [screen, setScreen] = useState("idle");
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const { saveScroll, getScroll, resetScroll } = useScrollStore();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const { isInactive, resetInactivity } = useInactivity(45000);

    useEffect(() => {
        if (categories.length > 0 && activeCategory === null) {
            setActiveCategory(categories[0].category_id);
        }
    }, [categories, activeCategory]);

    const handleReset = () => {
        setScreen("idle");
        setSelectedProduct(null);
        setActiveCategory(categories.length > 0 ? categories[0].category_id : null);
        resetScroll();
        resetInactivity();
    };

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
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    onSelectProduct={(product: Product) => {
                        setSelectedProduct(product);
                        setScreen("product-detail");
                    }}
                />
            )}
            {screen === "product-detail" && selectedProduct && (
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
            {screen === "order-summary" && <OrderSummaryScreen />}
            {screen === "payment-in-progress" && <PaymentInProgressScreen />}
            {screen === "order-confirmation" && <OrderConfirmationScreen />}

            {isInactive && screen !== "idle" && (
                <InactivityScreen
                    onContinue={resetInactivity}
                    onStop={handleReset}
                    timeoutSeconds={15}
                />
            )}
        </>
    );
}

export default KioskApp;
