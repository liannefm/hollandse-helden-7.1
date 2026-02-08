import { useEffect, useRef, useState } from "react";

export function useInactivity(timeoutMs: number) {
    const [isInactive, setIsInactive] = useState(false);
    const lastActivityRef = useRef(Date.now());
    const timeoutRef = useRef<number | null>(null);

    const resetTimer = () => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            setIsInactive(true);
        }, timeoutMs);
    };

    const resetInactivity = () => {
        setIsInactive(false);
        lastActivityRef.current = Date.now();
        resetTimer();
    };

    useEffect(() => {
        resetTimer();

        const handleActivity = () => {
            const now = Date.now();

            if (now - lastActivityRef.current > 1000) {
                resetInactivity();
            }
        };

        window.addEventListener("pointerdown", handleActivity);
        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);
        window.addEventListener("touchstart", handleActivity);
        window.addEventListener("scroll", handleActivity);

        return () => {
            window.removeEventListener("pointerdown", handleActivity);
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
            window.removeEventListener("touchstart", handleActivity);
            window.removeEventListener("scroll", handleActivity);
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [timeoutMs]);

    return { isInactive, resetInactivity };
}
