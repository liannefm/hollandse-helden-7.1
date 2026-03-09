import { QRCodeSVG } from 'qrcode.react';

// ─── Config ───
// Set to false to hide the QR discount code on receipts
const SHOW_DISCOUNT_QR = true;
const DISCOUNT_CODE = 'HERBIVORE10';
const DISCOUNT_PERCENT = 10;
const DISCOUNT_TEXT = 'Scan for 10% off your next order!';
const DISCOUNT_URL = 'https://happyherbivore.nl/discount?code=HERBIVORE10';

export default function Receipt({ orderData, items, total, orderType }) {
  const pickupNumber = String(orderData?.pickup_number ?? 0).padStart(2, '0');
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const orderId = orderData?.order_id ? `#${String(orderData.order_id).padStart(4, '0')}` : '--';
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const vatRate = 0.09;
  const totalNum = Number(total);
  const vatAmount = totalNum - (totalNum / (1 + vatRate));
  const subtotal = totalNum - vatAmount;

  const s = {
    receipt: {
      fontFamily: "'Courier New', 'Courier', monospace",
      fontSize: 11,
      lineHeight: 1.4,
      color: '#000',
      background: '#fff',
      padding: '12px 10px',
      width: '72mm',
    },
    center: { textAlign: 'center' },
    row: { display: 'flex', justifyContent: 'space-between' },
    divider: { borderTop: '1px dashed #555', margin: '6px 0' },
    dividerThick: { borderTop: '2px solid #000', margin: '8px 0' },
    bold: { fontWeight: 'bold' },
    small: { fontSize: 9 },
    big: { fontSize: 48, fontWeight: 'bold', letterSpacing: 6, lineHeight: 1 },
    logo: { fontSize: 16, fontWeight: 'bold', letterSpacing: 3, marginBottom: 2 },
  };

  return (
    <div className="receipt-print" style={{ position: 'fixed', left: '-9999px', top: 0 }}>
      <div style={s.receipt}>
        {/* Header */}
        <div style={s.center}>
          <div style={s.logo}>HAPPY HERBIVORE</div>
          <div style={{ fontSize: 9, letterSpacing: 1, marginBottom: 2 }}>PLANT-POWERED FAST FOOD</div>
          <div style={{ fontSize: 9, color: '#555' }}>happyherbivore.nl</div>
        </div>

        <div style={s.dividerThick} />

        {/* Order info */}
        <div style={{ ...s.row, marginBottom: 2 }}>
          <span>Date: {date}</span>
          <span>Time: {time}</span>
        </div>
        <div style={{ ...s.row, marginBottom: 2 }}>
          <span>Order: {orderId}</span>
          <span>Items: {itemCount}</span>
        </div>
        <div style={{ ...s.row, marginBottom: 2 }}>
          <span style={{ fontSize: 9, color: '#555' }}>Terminal: KIOSK-01</span>
          {orderType && <span style={{ fontSize: 9, fontWeight: 'bold' }}>{orderType === 'eat-in' ? 'EAT IN' : 'TAKEAWAY'}</span>}
        </div>

        <div style={s.divider} />

        {/* Items */}
        <div style={{ ...s.bold, fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>ORDER DETAILS</div>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 3 }}>
            <div style={s.row}>
              <span style={s.bold}>{item.quantity}x {item.name}</span>
            </div>
            <div style={{ ...s.row, paddingLeft: 16 }}>
              <span style={{ color: '#555', fontSize: 10 }}>@ {'\u20AC'}{Number(item.price).toFixed(2)} each</span>
              <span style={s.bold}>{'\u20AC'}{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}

        <div style={s.divider} />

        {/* Totals */}
        <div style={{ ...s.row, fontSize: 10 }}>
          <span>Subtotal (excl. BTW)</span>
          <span>{'\u20AC'}{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ ...s.row, fontSize: 10, color: '#555', marginBottom: 2 }}>
          <span>BTW 9%</span>
          <span>{'\u20AC'}{vatAmount.toFixed(2)}</span>
        </div>

        <div style={s.dividerThick} />

        <div style={{ ...s.row, fontSize: 16, fontWeight: 'bold' }}>
          <span>TOTAL</span>
          <span>{'\u20AC'}{totalNum.toFixed(2)}</span>
        </div>

        <div style={s.dividerThick} />

        {/* Pickup number - BIG */}
        <div style={{ ...s.center, margin: '8px 0' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, marginBottom: 4, fontWeight: 'bold' }}>YOUR PICKUP NUMBER</div>
          <div style={s.big}>{pickupNumber}</div>
          <div style={{ fontSize: 9, color: '#555', marginTop: 4 }}>Please wait for your number to be called</div>
        </div>

        <div style={s.divider} />

        {/* Savings + QR Code (toggleable) */}
        {SHOW_DISCOUNT_QR && (
          <div style={{ ...s.center, margin: '8px 0' }}>
            <div style={{ border: '1px dashed #000', padding: '6px 8px', marginBottom: 8 }}>
              <div style={{ fontSize: 9, letterSpacing: 1, marginBottom: 2 }}>WITH YOUR DISCOUNT YOU SAVE</div>
              <div style={{ fontSize: 20, fontWeight: 'bold' }}>{'\u20AC'}{(totalNum * DISCOUNT_PERCENT / 100).toFixed(2)}</div>
              <div style={{ fontSize: 9, color: '#555' }}>on your next order ({DISCOUNT_PERCENT}% off)</div>
            </div>
            <div style={{ display: 'inline-block', padding: 8, background: '#fff' }}>
              <QRCodeSVG value={DISCOUNT_URL} size={100} level="M" />
            </div>
            <div style={{ fontSize: 10, fontWeight: 'bold', marginTop: 6 }}>{DISCOUNT_TEXT}</div>
            <div style={{ fontSize: 9, color: '#555', marginTop: 2 }}>Code: {DISCOUNT_CODE}</div>
            <div style={s.divider} />
          </div>
        )}

        {/* Footer */}
        <div style={{ ...s.center, ...s.small, color: '#555', marginTop: 4 }}>
          <div>Thank you for choosing Happy Herbivore!</div>
          <div style={{ marginTop: 2 }}>100% plant-based | Made with love</div>
          <div style={{ marginTop: 4, fontSize: 8 }}>KVK 12345678 | BTW NL123456789B01</div>
        </div>
      </div>
    </div>
  );
}
