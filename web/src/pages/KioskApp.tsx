import { useState } from "react";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import PaymentInProgressScreen from "../screens/PaymentInProgressScreen/PaymentInProgressScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("payment-in-progress");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "menu" && <MenuScreen />}
            {screen === "product-detail" && <ProductDetailScreen />}
            {screen === "payment-in-progress" && <PaymentInProgressScreen />}
        </>
    );
}

export default KioskApp;
