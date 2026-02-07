import { useState } from "react";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import PaymentInProgressScreen from "../screens/PaymentInProgressScreen/PaymentInProgressScreen.tsx";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen/OrderConfirmationScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("idle");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "orderTypeScreen" && <OrderTypeScreen />}
            {screen === "menu" && <MenuScreen />}
            {screen === "product-detail" && <ProductDetailScreen />}
            {screen === "payment-in-progress" && <PaymentInProgressScreen />}
            {screen === "order-confirmation" && <OrderConfirmationScreen />}
        </>
    );
}

export default KioskApp;
