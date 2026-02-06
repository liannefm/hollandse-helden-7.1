import { useState } from "react";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("menu");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "menu" && <MenuScreen />}
        </>
    );
}

export default KioskApp;
