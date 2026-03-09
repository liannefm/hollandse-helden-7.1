import { useState, useCallback, useRef, useEffect } from 'react';
import { ThermalPrinter } from '../utils/receiptPrinter';
import type { ReceiptData } from '../utils/receiptPrinter';

export function useThermalPrinter() {
    const printerRef = useRef(new ThermalPrinter());
    const [isConnected, setIsConnected] = useState(false);
    const [isSupported] = useState(() => ThermalPrinter.isSupported());
    const [deviceName, setDeviceName] = useState<string | null>(null);

    // Auto-reconnect to previously paired device on mount
    useEffect(() => {
        if (!isSupported) return;
        let cancelled = false;

        (async () => {
            const paired = await printerRef.current.getPairedDevices();
            if (paired.length > 0 && !cancelled) {
                try {
                    await printerRef.current.connect(paired[0]);
                    setIsConnected(true);
                    setDeviceName(paired[0].productName || 'Thermische printer');
                } catch {
                    // Printer niet fysiek verbonden, negeer
                }
            }
        })();

        return () => { cancelled = true; };
    }, [isSupported]);

    // Must be called from a user gesture (click)
    const connect = useCallback(async () => {
        const printer = printerRef.current;
        const selected = await printer.requestDevice();
        if (!selected) return false;
        await printer.connect();
        setIsConnected(true);
        setDeviceName(printer.deviceName || 'Thermische printer');
        return true;
    }, []);

    const disconnect = useCallback(async () => {
        await printerRef.current.disconnect();
        setIsConnected(false);
        setDeviceName(null);
    }, []);

    const printReceipt = useCallback(async (data: ReceiptData) => {
        await printerRef.current.printReceipt(data);
    }, []);

    return {
        isConnected,
        isSupported,
        deviceName,
        connect,
        disconnect,
        printReceipt,
    };
}
