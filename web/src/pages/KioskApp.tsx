import { useEffect, useState } from "react";
import { socket } from "../socket";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import PaymentInProgressScreen from "../screens/PaymentInProgressScreen/PaymentInProgressScreen.tsx";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen/OrderConfirmationScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("order-confirmation");
    // const [order, setOrder] = useState<any[]>([]);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
