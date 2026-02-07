import { useEffect, useState } from "react";
import { socket } from "../socket";

import IdleScreen from "../screens/IdleScreen/IdleScreen.tsx";
import OrderTypeScreen from "../screens/OrderTypeScreen/OrderTypeScreen.tsx";
import MenuScreen from "../screens/MenuScreen/MenuScreen.tsx";

import type { Product } from "../types/Product.ts";
import type { Category } from "../types/Category.ts";

function KioskApp() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [screen, setScreen] = useState("menu");
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
            {screen === "idle" && <IdleScreen onStart={() => setScreen("menu")} />}
            {screen === "orderTypeScreen" && <OrderTypeScreen />}
            {screen === "menu" && <MenuScreen categories={categories} products={products} />}
        </>
    );
}

export default KioskApp;
