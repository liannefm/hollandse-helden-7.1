import { useLanguage } from '../context/LanguageContext';

const TICKET_TYPES = [
  { id: 'animals', emoji: '🐄', title: 'Animal Friends', desc: 'A grateful animal says thanks!' },
  { id: 'maze', emoji: '🌀', title: 'Maze Runner', desc: 'Find your way to the salad bar!' },
  { id: 'certificate', emoji: '🏆', title: 'Plant Hero', desc: 'Your official hero certificate!' },
  { id: 'dare', emoji: '🎲', title: 'Dare Card', desc: 'Complete a fun challenge!' },
  { id: 'fortune', emoji: '🥠', title: 'Fortune Cookie', desc: 'Discover your vegan destiny!' },
  { id: 'agent', emoji: '🕵️', title: 'Secret Agent', desc: 'Your classified mission briefing!' },
  { id: 'loveletter', emoji: '💌', title: 'Love Letter', desc: 'A letter from your food!' },
  { id: 'trivia', emoji: '🧠', title: 'Trivia', desc: 'Test your vegan knowledge!' },
  { id: 'mystery', emoji: '👻', title: 'Mystery', desc: '??? Something unexpected ???' },
];

export default function TicketPickerScreen({ orderData, onSelect, a11yMode }) {
  const { t } = useLanguage();
  const pickupNum = String(orderData?.pickup_number ?? 0).padStart(2, '0');

  return (
    <div className="h-full w-full flex flex-col bg-hh-darker relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(140,208,3,0.06) 0%, transparent 60%)'
      }} />

      {/* ─── Landscape: side-by-side / Portrait: stacked ─── */}
      <div className="flex-1 min-h-0 flex flex-col landscape:flex-row z-10">
        {/* A11y: push everything down */}
        {a11yMode && <div style={{ flex: '0 0 15%' }} />}

        {/* Left / Top: Order confirmed info */}
        <div className={`flex-shrink-0 landscape:w-[280px] landscape:flex landscape:flex-col landscape:items-center landscape:justify-center text-center ${a11yMode ? 'pt-3 pb-2' : 'pt-6 landscape:pt-0 pb-3'}`}>
          <div className="flex items-center justify-center gap-2 mb-1 animate-check-pop">
            <div className="w-5 h-5 rounded-full border-2 border-hh-green/70 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8cd003" strokeWidth="3.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-hh-green font-semibold text-xs uppercase tracking-wider">{t('orderConfirmed')}</span>
          </div>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-0.5">{t('pickupNumber')}</p>
          <p className="text-hh-green font-heading leading-none" style={{ fontSize: 'min(80px, 12vh)', lineHeight: '0.85' }}>
            {pickupNum}
          </p>

          <div className="mt-4 landscape:mt-6">
            <h2 className="font-heading text-2xl landscape:text-3xl text-white mb-1">{t('pickTicket')}</h2>
            <p className="text-white/25 text-xs">{t('ticketSubtitle')}</p>
          </div>
        </div>

        {/* Right / Bottom: Ticket grid */}
        <div className={`flex-1 flex items-center justify-center px-4 pb-4 landscape:border-l landscape:border-white/[0.06] ${a11yMode ? 'items-end' : ''}`}>
          <div className="grid grid-cols-3 gap-3 landscape:gap-4 w-full max-w-[560px] landscape:max-w-[720px]">
            {TICKET_TYPES.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => onSelect(ticket.id)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 landscape:p-5 flex flex-col items-center gap-1.5 active:scale-95 active:bg-white/[0.08] active:border-hh-green/30 transition-all"
                style={{ minHeight: 100 }}
              >
                <span className="text-3xl landscape:text-4xl leading-none">{ticket.emoji}</span>
                <span className="text-white font-bold text-sm landscape:text-base">{ticket.title}</span>
                <span className="text-white/25 text-[11px] landscape:text-xs text-center leading-snug">{ticket.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
