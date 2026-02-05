import { useState } from "react";
import IdleScreen from "../screens/IdleScreen/IdleScreen.jsx";

function KioskApp() {
  const [screen, setScreen] = useState("idle");
  const [order, setOrder] = useState([]);

  return (
    <>
      {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
    </>
  );
}

export default KioskApp;