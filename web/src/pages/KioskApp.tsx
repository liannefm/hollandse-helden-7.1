import { useState } from "react";
import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("OrderTypeScreen");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "OrderTypeScreen" && <OrderTypeScreen />}
        </>
    );
}

export default KioskApp;
