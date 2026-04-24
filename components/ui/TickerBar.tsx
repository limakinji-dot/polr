"use client";
import { useStore } from "@/lib/store";

const FALLBACK = [
  "BTC/USDT · $67,420",
  "ETH/USDT · $3,812",
  "SOL/USDT · $189.4",
  "BNB/USDT · $612.0",
  "ARB/USDT · $1.234",
  "DOGE/USDT · $0.1821",
  "MATIC/USDT · $0.867",
  "AVAX/USDT · $38.20",
  "INJ/USDT · $28.43",
  "SUI/USDT · $1.092",
];

export default function TickerBar() {
  const signals = useStore((s) => s.signals);
  const isProfit = useStore((s) => s.isProfit);

  const items = signals.length > 0
    ? signals.slice(0, 10).map(
        (s) => `${s.symbol.replace("_USDT", "")}/USDT · ${s.decision} · ${s.status}`
      )
    : FALLBACK;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden border-b border-border/30 py-1.5"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="ticker-inner flex gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-[10px] font-mono text-muted flex items-center gap-1.5 shrink-0">
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: isProfit ? "#22c55e" : "#ef4444" }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
