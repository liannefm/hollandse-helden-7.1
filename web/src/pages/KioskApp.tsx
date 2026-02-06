import { useState } from "react";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";
import ProductDetailScreen from "../screens/ProductDetailScreen/ProductDetailScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("product-detail");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "orderTypeScreen" && <OrderTypeScreen />}
            {screen === "menu" && <MenuScreen />}
            {screen === "product-detail" && <ProductDetailScreen />}
        </>
    );
}

export default KioskApp;
