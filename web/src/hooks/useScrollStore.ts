import { useState } from "react";
import type { ScrollStore, ScrollPosition } from "../types/ScrollStore.ts";

export function useScrollStore() {
    const [store, setStore] = useState<ScrollStore>({});

    const saveScroll = (
        page: string,
        key: string,
        position: ScrollPosition
    ) => {
        setStore(prev => ({
            ...prev,
            [page]: {
                ...prev[page],
                [key]: position
            }
        }));
    };

    const getScroll = (page: string, key: string): ScrollPosition => {
        return store[page]?.[key] ?? { x: 0, y: 0 };
    };

    const resetScroll = () => {
        setStore({});
    };

    return {
        saveScroll,
        getScroll,
        resetScroll
    };
}
