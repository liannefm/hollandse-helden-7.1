import { useState, useCallback, useRef, useEffect } from 'react';
import { ThermalPrinter } from '../utils/thermal-printer';

export function useThermalPrinter() {
  const printerRef = useRef(new ThermalPrinter());
  const [isConnected, setIsConnected] = useState(false);
  const [isSupported] = useState(() => ThermalPrinter.isSupported());
  const [deviceName, setDeviceName] = useState(null);

  // Auto-reconnect to previously paired device
  useEffect(() => {
    if (!isSupported) return;
    let cancelled = false;

    (async () => {
      const paired = await printerRef.current.getPairedDevices();
      if (paired.length > 0 && !cancelled) {
        try {
          await printerRef.current.connect(paired[0]);
          setIsConnected(true);
          setDeviceName(paired[0].productName || 'Thermal Printer');
        } catch {
          // Not physically connected, ignore
        }
      }
    })();

    return () => { cancelled = true; };
  }, [isSupported]);

  const connect = useCallback(async () => {
    const printer = printerRef.current;
    const selected = await printer.requestDevice();
    if (!selected) return false;
    await printer.connect();
    setIsConnected(true);
    setDeviceName(printer.device.productName || 'Thermal Printer');
    return true;
  }, []);

  const disconnect = useCallback(async () => {
    await printerRef.current.disconnect();
    setIsConnected(false);
    setDeviceName(null);
  }, []);

  const printReceipt = useCallback(async ({ orderData, items, total, orderType, ticketType, discountPercent = 10 }) => {
    const discountCode = orderData?.discount_code || 'HERBIVORE10';
    const discountUrl = `${window.location.origin}/?discount=${discountCode}`;
    const p = printerRef.current;
    const pickupNum = String(orderData?.pickup_number ?? 0).padStart(2, '0');
    const orderId = orderData?.order_id ? `#${String(orderData.order_id).padStart(4, '0')}` : '--';
    const totalNum = Number(total);
    const vatRate = 0.09;
    const vatAmount = totalNum - (totalNum / (1 + vatRate));
    const subtotal = totalNum - vatAmount;
    const savings = totalNum * discountPercent / 100;
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);
    await p
      .init()
      // Header
      .center()
      .bold(true).size(2, 2).text('HAPPY HERBIVORE')
      .size(1, 1).bold(false)
      .text('PLANT-POWERED FAST FOOD')
      .text('happyherbivore.nl')
      .doubleLine()
      // Order info
      .left()
      .row(`Date: ${date}`, `Time: ${time}`)
      .row(`Order: ${orderId}`, `Items: ${itemCount}`)
      .row('Terminal: KIOSK-01', orderType === 'eat-in' ? 'EAT IN' : 'TAKEAWAY')
      .line()
      // Items
      .bold(true).text('ORDER DETAILS').bold(false)
      .feed(0);

    for (const item of items) {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      p.bold(true).text(`${item.quantity}x ${item.name}`).bold(false);
      p.row(`  @ EUR ${Number(item.price).toFixed(2)} each`, `EUR ${lineTotal}`);
    }

    p.line()
      .row('Subtotal (excl. BTW)', `EUR ${subtotal.toFixed(2)}`)
      .row('BTW 9%', `EUR ${vatAmount.toFixed(2)}`)
      .doubleLine()
      .bold(true).size(1, 2)
      .row('TOTAL', `EUR ${totalNum.toFixed(2)}`)
      .size(1, 1).bold(false)
      .doubleLine()
      // Pickup number
      .center()
      .bold(true).text('YOUR PICKUP NUMBER')
      .size(4, 4).text(pickupNum).size(1, 1)
      .bold(false)
      .text('Please wait for your number')
      .line()
      // Discount
      .center()
      .bold(true).text(`SAVE EUR ${savings.toFixed(2)} NEXT TIME!`).bold(false)
      .text(`${discountPercent}% off with code: ${discountCode}`)
      .feed(1)
      .qrCode(discountUrl, 6, 'M')
      .feed(1)
      // Ticket content
      .printTicket(ticketType, pickupNum)
      .feed(1)
      .line()
      .center()
      .text('Thank you for choosing')
      .text('Happy Herbivore!')
      .text('100% plant-based | Made with love')
      .feed(1)
      .text('KVK 12345678 | BTW NL123456789B01')
      .feed(3)
      .cut()
      .print();
  }, []);

  return {
    printer: printerRef.current,
    isConnected,
    isSupported,
    deviceName,
    connect,
    disconnect,
    printReceipt,
  };
}
