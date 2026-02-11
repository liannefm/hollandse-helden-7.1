import { useEffect, useState } from "react";
import { socket } from "../socket";

import { useScrollStore } from "../hooks/useScrollStore.ts";
import { useOrderStore } from "../hooks/useOrderStore.ts";

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

    const {
        orderData,
        setOrderType,
        addToCart,
        resetOrder,
        increaseFromCart,
        decreaseFromCart,
        removeFromCart
    } = useOrderStore(products);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [activeDietFilter, setActiveDietFilter] = useState<string>("All");

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
        setActiveDietFilter("All");
        resetScroll();
        resetOrder();
        resetInactivity();
    };

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
                    onOrderTypeSelected={(type) => {
                        setOrderType(type);
                        setScreen("menu");
                    }}
                />
            )}
            {screen === "menu" && (
                <MenuScreen
                    orderData={orderData}
                    categories={categories}
                    products={products}
                    saveScroll={saveScroll}
                    getScroll={getScroll}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    activeDietFilter={activeDietFilter}
                    setActiveDietFilter={setActiveDietFilter}
                    onSelectProduct={(product: Product) => {
                        setSelectedProduct(product);
                        setScreen("product-detail");
                    }}
                    onOrderSummary={() => {
                        setScreen("order-summary");
                    }}
                    onAddToOrder={(productId, quantity) => {
                        addToCart(productId, quantity);
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
                    onAddToOrder={(productId, quantity) => {
                        addToCart(productId, quantity);
                    }}
                    onAnimationEnd={() => {
                        setSelectedProduct(null);
                        setScreen("menu");
                    }}
                />
            )}
            {screen === "order-summary" && (
                <OrderSummaryScreen
                    orderData={orderData}
                    products={products}
                    onRemoveFromOrder={(productId) => {
                        removeFromCart(productId);
                    }}
                    onIncreaseFromCart={(productId) => {
                        increaseFromCart(productId);
                    }}
                    onDecreaseFromCart={(productId) => {
                        decreaseFromCart(productId);
                    }}
                    onContinueOrdering={() => {
                        setScreen("menu");
                    }}
                    onCompleteOrder={() => {
                        setScreen("payment-in-progress");
                    }}
                />
            )}
            {screen === "payment-in-progress" && <PaymentInProgressScreen onClick={() => setScreen("order-confirmation")} />}
            {screen === "order-confirmation" && <OrderConfirmationScreen onClick={() => setScreen("idle")} />}

            {isInactive && screen !== "idle" && screen !== "payment-in-progress" && screen !== "order-confirmation" && (
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
