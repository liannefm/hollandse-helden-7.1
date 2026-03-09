import type { ReceiptItem } from '../../utils/receiptPrinter';

interface ReceiptProps {
    pickupNumber: number;
    orderType: 'here' | 'take_away' | null;
    items: ReceiptItem[];
    totalPrice: number;
}

export default function Receipt({ pickupNumber, orderType, items, totalPrice }: ReceiptProps) {
    const pickupStr = String(pickupNumber).padStart(2, '0');
    const now       = new Date();
    const date      = now.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time      = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
    const vatRate   = 0.09;
    const totalNum  = Number(totalPrice);
    const vatAmount = totalNum - (totalNum / (1 + vatRate));
    const subtotal  = totalNum - vatAmount;
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    const s: Record<string, React.CSSProperties> = {
        receipt: {
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 11,
            lineHeight: 1.4,
            color: '#000',
            background: '#fff',
            padding: '14px 12px',
            width: '72mm',
            boxSizing: 'border-box',
            overflow: 'hidden',
        },
        center:      { textAlign: 'center' },
        // Flex row: left text shrinks/clips, right text (price) never wraps
        row:         { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 },
        left:        { minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
        right:       { flexShrink: 0, whiteSpace: 'nowrap', marginLeft: 4 },
        divider:     { borderTop: '1px dashed #555', margin: '6px 0' },
        dividerThick:{ borderTop: '2px solid #000', margin: '8px 0' },
        bold:        { fontWeight: 'bold' },
        big:         { fontSize: 52, fontWeight: 'bold', letterSpacing: 6, lineHeight: 1 },
        logo:        { fontSize: 20, fontWeight: 'bold', letterSpacing: 3, marginBottom: 2 },
    };

    return (
        /* Hidden off-screen, only visible during window.print() */
        <div className="receipt-print-wrapper" style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
            <div style={s.receipt}>

                {/* ─── Header ─── */}
                <div style={s.center}>
                    <div style={s.logo}>HOLLANDSE HELDEN</div>
                    <div style={{ fontSize: 9, letterSpacing: 1, marginBottom: 2 }}>HET HAAGSE STRAATVOEDSEL</div>
                    <div style={{ fontSize: 9, color: '#555' }}>hollandsehelden.nl</div>
                </div>

                <div style={s.dividerThick} />

                {/* ─── Bestelinfo ─── */}
                <div style={{ ...s.row, marginBottom: 2 }}>
                    <span style={s.left}>Datum: {date}</span>
                    <span style={s.right}>Tijd: {time}</span>
                </div>
                <div style={{ ...s.row, marginBottom: 2 }}>
                    <span style={s.left}>Bon: #{pickupStr}</span>
                    <span style={s.right}>Art.: {itemCount}</span>
                </div>
                <div style={{ ...s.row, marginBottom: 2 }}>
                    <span style={{ ...s.left, fontSize: 9, color: '#555' }}>Terminal: KIOSK-01</span>
                    {orderType && (
                        <span style={{ ...s.right, fontSize: 9, fontWeight: 'bold' }}>
                            {orderType === 'here' ? 'HIER ETEN' : 'MEENEMEN'}
                        </span>
                    )}
                </div>

                <div style={s.divider} />

                {/* ─── Items ─── */}
                <div style={{ ...s.bold, fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>BESTELLING</div>

                {items.map((item, i) => (
                    <div key={i} style={{ marginBottom: 3 }}>
                        {/* Product name — truncate if too long */}
                        <div style={{ ...s.bold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.quantity}x {item.name}
                        </div>
                        {/* Unit price left, line total right */}
                        <div style={{ ...s.row, paddingLeft: 12 }}>
                            <span style={{ ...s.left, color: '#555', fontSize: 10 }}>@ &euro;{Number(item.price).toFixed(2)}</span>
                            <span style={{ ...s.right, ...s.bold }}>&euro;{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                ))}

                <div style={s.divider} />

                {/* ─── Totalen ─── */}
                <div style={{ ...s.row, fontSize: 10 }}>
                    <span style={s.left}>Subtotaal excl. BTW</span>
                    <span style={s.right}>&euro;{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ ...s.row, fontSize: 10, color: '#555', marginBottom: 2 }}>
                    <span style={s.left}>BTW 9%</span>
                    <span style={s.right}>&euro;{vatAmount.toFixed(2)}</span>
                </div>

                <div style={s.dividerThick} />

                <div style={{ ...s.row, fontSize: 16, fontWeight: 'bold' }}>
                    <span style={s.left}>TOTAAL</span>
                    <span style={s.right}>&euro;{totalNum.toFixed(2)}</span>
                </div>

                <div style={s.dividerThick} />

                {/* ─── Bestelnummer ─── */}
                <div style={{ ...s.center, margin: '10px 0' }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, marginBottom: 4, fontWeight: 'bold' }}>
                        UW BESTELNUMMER
                    </div>
                    <div style={s.big}>{pickupStr}</div>
                    <div style={{ fontSize: 9, color: '#555', marginTop: 4 }}>
                        Wacht tot uw nummer wordt geroepen
                    </div>
                </div>

                <div style={s.divider} />

                {/* ─── Footer ─── */}
                <div style={{ ...s.center, fontSize: 9, color: '#555', marginTop: 4 }}>
                    <div style={{ fontWeight: 'bold', color: '#000', marginBottom: 2 }}>Bedankt voor uw bestelling!</div>
                    <div>Eet smakelijk!</div>
                    <div style={{ marginTop: 6, fontSize: 8 }}>KVK 12345678 | BTW NL123456789B01</div>
                </div>

            </div>
        </div>
    );
}
