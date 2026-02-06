import { useState } from "react";
import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";

function KioskApp() {
    const [screen, setScreen] = useState("idle");
    // const [order, setOrder] = useState<any[]>([]);

    return (
        <>
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
        </>
    );
}

export default KioskApp;
