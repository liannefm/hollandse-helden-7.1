import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useThermalPrinter } from '../hooks/useThermalPrinter';
import Receipt from '../components/Receipt';

// ─── Config (matches Receipt.jsx) ───
const DISCOUNT_PERCENT = 10;
const SHOW_DISCOUNT = true;

export default function ConfirmationScreen({ orderData, orderType, ticketType, onDone, a11yMode }) {
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  const { isConnected, isSupported, connect, printReceipt } = useThermalPrinter();
  const [countdown, setCountdown] = useState(15);
  const [savingsAnimated, setSavingsAnimated] = useState(0);
  const [printStatus, setPrintStatus] = useState(null);
  const hasPrinted = useRef(false);

  const pickupNumber = orderData?.pickup_number ?? 0;
  const displayNumber = String(pickupNumber).padStart(2, '0');
  const total = orderData?.price_total ?? totalPrice;
  const totalNum = Number(total);
  const savings = SHOW_DISCOUNT ? (totalNum * DISCOUNT_PERCENT / 100) : 0;

  // Animate savings counter
  useEffect(() => {
    if (!SHOW_DISCOUNT || savings <= 0) return;
    const duration = 1200;
    const steps = 30;
    const increment = savings / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(step * increment, savings);
      setSavingsAnimated(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [savings]);

  // Auto-print after 2s (WebUSB if connected, otherwise browser print)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!hasPrinted.current) {
        hasPrinted.current = true;
        if (isConnected) {
          try {
            await printReceipt({ orderData, items, total, orderType, ticketType, discountPercent: DISCOUNT_PERCENT });
            setPrintStatus('done');
          } catch (err) {
            console.error('Thermal print failed:', err);
            window.print();
          }
        } else {
          window.print();
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isConnected]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearCart();
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDone, clearCart]);

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-hh-darker">
      {/* Hidden receipt for printing */}
      <Receipt orderData={orderData} items={items} total={total} orderType={orderType} />

      {/* Background glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 35% at 50% 15%, rgba(140,208,3,0.08) 0%, transparent 60%)'
      }} />

      {/* ─── Landscape: side-by-side / Portrait: stacked ─── */}
      <div className="flex-1 min-h-0 flex flex-col landscape:flex-row z-10">
        {/* A11y: push everything down */}
        {a11yMode && <div style={{ flex: '0 0 25%' }} />}

        {/* Left / Top: Pickup number */}
        <div className={`flex-shrink-0 landscape:flex-1 landscape:flex landscape:flex-col landscape:items-center landscape:justify-center pb-4 text-center ${a11yMode ? 'pt-2' : 'pt-8 landscape:pt-0'}`}>
          <div className="flex items-center justify-center gap-2 mb-2 animate-check-pop">
            <div className="w-6 h-6 rounded-full border-2 border-hh-green/70 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8cd003" strokeWidth="3.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-hh-green font-semibold text-sm uppercase tracking-wider">{t('orderConfirmed')}</span>
          </div>

          <p className="text-white/25 text-xs uppercase tracking-[0.2em] mb-1">{t('pickupNumber')}</p>
          <p className="text-hh-green font-heading leading-none" style={{ fontSize: 'min(150px, 20vh)', lineHeight: '0.8' }}>
            {displayNumber}
          </p>
          <p className="text-white/20 text-xs mt-3">{t('preparing')}</p>

          <p className="text-hh-orange text-lg font-heading mt-4 landscape:mt-6">{t('enjoyMeal')}</p>
        </div>

        {/* Right / Bottom: Order details + savings */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 kiosk-scroll landscape:border-l landscape:border-white/[0.06] landscape:flex landscape:flex-col landscape:justify-center">
          {/* Order summary card */}
          {items.length > 0 && (
            <div className="w-full max-w-[400px] landscape:max-w-none bg-white/[0.025] rounded-xl p-4 mb-3 border border-white/[0.04] mx-auto landscape:mx-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{t('yourOrder')}</span>
                <span className="text-white/20 text-[10px]">{items.reduce((s, i) => s + i.quantity, 0)} {t('items')}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-white/40">{item.quantity}x {item.name}</span>
                    <span className="text-white/25">&euro;{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.05] pt-2.5 flex justify-between items-center">
                <span className="text-white/60 font-semibold text-sm">{t('total')}</span>
                <span className="text-hh-green font-bold text-lg">&euro;{totalNum.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Savings / Discount promo card */}
          {SHOW_DISCOUNT && (
            <div className="w-full max-w-[400px] landscape:max-w-none bg-hh-orange/[0.08] border border-hh-orange/[0.15] rounded-xl p-4 mb-3 mx-auto landscape:mx-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-hh-orange/15 flex flex-col items-center justify-center">
                  <span className="text-hh-orange font-bold text-lg leading-none">&euro;{savingsAnimated.toFixed(2)}</span>
                  <span className="text-hh-orange/60 text-[8px] font-semibold uppercase mt-0.5">saved</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-hh-orange font-bold text-sm mb-0.5">
                    {t('youSave')} &euro;{savings.toFixed(2)} {t('nextVisit')}!
                  </p>
                  <p className="text-white/30 text-[11px] leading-snug">
                    {t('scanQr')}
                  </p>
                  <p className="text-hh-orange/50 text-[10px] mt-1 font-semibold">
                    Code: HERBIVORE10 &middot; {DISCOUNT_PERCENT}% off
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Print receipt + connect printer */}
          <div className="w-full max-w-[400px] landscape:max-w-none flex flex-col items-center gap-2.5 mt-1 mx-auto landscape:mx-0">
            <button
              onClick={async () => {
                if (isConnected) {
                  try {
                    await printReceipt({ orderData, items, total, orderType, ticketType, discountPercent: DISCOUNT_PERCENT });
                    setPrintStatus('done');
                  } catch { window.print(); }
                } else {
                  window.print();
                }
              }}
              className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white/60 font-medium text-sm px-6 py-3 rounded-xl active:scale-95 transition-transform"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8" rx="1"/>
              </svg>
              {printStatus === 'done' ? '✓ Printed' : t('printReceipt')}
            </button>
            {isSupported && !isConnected && (
              <button
                onClick={connect}
                className="text-white/20 text-[11px] underline underline-offset-2 active:text-white/40"
              >
                Connect USB printer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom: Countdown ─── */}
      <div className="flex-shrink-0 pb-4 pt-2 flex flex-col items-center z-10">
        <p className="text-white/15 text-xs mb-2">
          {t('newOrder')} <span className="text-white/25 font-semibold">{countdown}s</span>
        </p>
        <div className="w-36 h-0.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div className="h-full bg-hh-green/30 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 15) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
