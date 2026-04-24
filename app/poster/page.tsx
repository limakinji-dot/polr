"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Signal } from "@/lib/types";
import { fetchHistory, fetchSignals } from "@/lib/api";
import { smartFmt, fmtTime } from "@/lib/utils";

// Dynamic import for poster (uses canvas)
import dynamic from "next/dynamic";
const PosterButton = dynamic(() => import("@/components/ui/SignalPoster"), { ssr: false });

function SignalSelectRow({
  signal,
  selected,
  onSelect,
}: {
  signal: Signal;
  selected: boolean;
  onSelect: () => void;
}) {
  const isLong = signal.decision === "LONG";
  const pnl    = signal.pnl_pct ?? 0;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
        selected
          ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
          : "border-border/30 hover:border-border/60 hover:bg-white/[0.02]"
      }`}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
          selected ? "border-[var(--accent)] bg-[var(--accent)]/20" : "border-border"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-sm" style={{ background: "var(--accent)" }} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-text">
            {signal.symbol.replace("_USDT", "")}/USDT
          </span>
          <span className={`text-[9px] font-mono ${isLong ? "text-success" : "text-danger"}`}>
            {isLong ? "↗ LONG" : "↘ SHORT"}
          </span>
        </div>
        <div className="text-[9px] font-mono text-muted">{fmtTime(signal.timestamp)}</div>
      </div>

      <div className="text-right shrink-0">
        {signal.result && (
          <div className={`text-xs font-mono font-bold ${pnl >= 0 ? "text-success" : "text-danger"}`}>
            {pnl >= 0 ? "+" : ""}{pnl.toFixed(3)}%
          </div>
        )}
        <div className={`text-[9px] font-mono ${signal.status === "OPEN" ? "text-[var(--accent)]" : "text-muted"}`}>
          {signal.result ?? signal.status}
        </div>
      </div>
    </div>
  );
}

export default function PosterPage() {
  const storeSignals  = useStore((s) => s.signals);
  const stats         = useStore((s) => s.stats);
  const isProfit      = useStore((s) => s.isProfit);
  const [allSigs, setAllSigs] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<Signal | null>(null);

  useEffect(() => {
    Promise.all([fetchHistory(100), fetchSignals(50)]).then(([hist, live]) => {
      const combined = [...live, ...hist];
      const seen = new Set<string>();
      const unique = combined.filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
      setAllSigs(unique);
      // Auto-select first eligible
      const first = unique.find(
        (s) => (s.entry_hit && s.status === "OPEN") || (s.status === "CLOSED" && s.result != null)
      );
      if (first) setSelected(first);
    });
  }, []);

  const eligible = allSigs.filter(
    (s) => (s.entry_hit && s.status === "OPEN") || (s.status === "CLOSED" && s.result != null)
  );

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-[9px] font-mono text-muted tracking-widest mb-1">SHAREABLE POSTER</div>
          <h1
            className="text-5xl sm:text-7xl font-display tracking-widest"
            style={{ color: "var(--accent)", textShadow: "0 0 40px var(--accent)" }}
          >
            PnL POSTER
          </h1>
          <p className="text-muted font-mono text-xs mt-2 tracking-widest">
            Select a trade below, then generate a premium HD poster to share
          </p>
        </motion.div>

        {/* Stats pill row */}
        {stats && (
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { l: "WIN RATE",   v: `${stats.winrate.toFixed(1)}%`,                          c: isProfit ? "#22c55e" : "#ef4444" },
              { l: "TOTAL PnL",  v: `${stats.total_pnl_usdt >= 0 ? "+" : ""}${stats.total_pnl_usdt.toFixed(2)} USDT`, c: isProfit ? "#22c55e" : "#ef4444" },
              { l: "BALANCE",    v: `$${stats.balance.toFixed(2)}`,                          c: "var(--accent)" },
              { l: "LEVERAGE",   v: `${stats.leverage}×`,                                    c: "#a78bfa" },
            ].map((item) => (
              <div key={item.l} className="glass rounded-xl px-4 py-2">
                <div className="text-[7px] font-mono text-muted tracking-widest">{item.l}</div>
                <div className="text-xl font-display" style={{ color: item.c }}>{item.v}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Signal list */}
          <div>
            <div className="text-[9px] font-mono text-muted tracking-widest mb-3">
              ELIGIBLE TRADES ({eligible.length})
            </div>
            <div className="glass-strong rounded-2xl p-3 max-h-[60vh] overflow-y-auto flex flex-col gap-2">
              {eligible.length === 0 && (
                <div className="text-center py-12 text-muted font-mono text-xs">
                  No eligible trades yet.<br />
                  <span className="text-[10px]">Trades become eligible once entry is hit.</span>
                </div>
              )}
              {eligible.map((s) => (
                <SignalSelectRow
                  key={s.id}
                  signal={s}
                  selected={selected?.id === s.id}
                  onSelect={() => setSelected(s)}
                />
              ))}
            </div>
          </div>

          {/* Right: poster preview / launch */}
          <div className="flex flex-col gap-4">
            <div className="glass-strong rounded-2xl p-5">
              <div className="text-[9px] font-mono text-muted tracking-widest mb-4">SELECTED TRADE</div>

              {selected ? (
                <div className="space-y-3">
                  <div className="text-xl font-display" style={{ color: "var(--accent)" }}>
                    {selected.symbol.replace("_USDT", "")}/USDT
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    {[
                      ["DIRECTION", selected.decision,         selected.decision === "LONG" ? "text-success" : "text-danger"],
                      ["STATUS",    selected.status,           "text-text"],
                      ["ENTRY",     `$${smartFmt(selected.entry)}`, "text-text"],
                      ["TP",        `$${smartFmt(selected.tp)}`, "text-success"],
                      ["SL",        `$${smartFmt(selected.sl)}`, "text-danger"],
                      ["PnL",       selected.pnl_pct != null ? `${selected.pnl_pct >= 0 ? "+" : ""}${selected.pnl_pct.toFixed(4)}%` : "—", (selected.pnl_pct ?? 0) >= 0 ? "text-success" : "text-danger"],
                    ].map(([l, v, c]) => (
                      <div key={l} className="border border-border/30 rounded-lg p-2">
                        <div className="text-[7px] text-muted tracking-widest">{l}</div>
                        <div className={`${c} font-semibold`}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Poster trigger */}
                  <div className="pt-2">
                    <div className="text-[8px] font-mono text-muted tracking-widest mb-2">
                      CLICK THE ICON TO OPEN POSTER CREATOR
                    </div>
                    <div className="flex items-center gap-3 glass rounded-xl p-3 border border-[var(--accent)]/20">
                      <PosterButton
                        signal={selected}
                        leverage={stats?.leverage ?? 10}
                        entryUsdt={stats?.entry_usdt ?? 100}
                        allowForClosed={true}
                      />
                      <div>
                        <div className="text-xs font-mono text-text">Open Poster Creator</div>
                        <div className="text-[9px] font-mono text-muted">HD PNG · QR Code · Branding</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted font-mono text-xs">
                  Select a trade to preview
                </div>
              )}
            </div>

            {/* Info card */}
            <div className="glass rounded-2xl p-4 border border-[var(--accent)]/10">
              <div className="text-[9px] font-mono text-muted tracking-widest mb-2">POSTER FEATURES</div>
              <ul className="space-y-1.5 text-[10px] font-mono text-muted">
                {[
                  "🎨 Premium visual with gradient orb",
                  "📊 Candlestick chart preview",
                  "📱 QR code to your platform",
                  "🔥 Violet & Rose themes",
                  "💾 Save HD PNG",
                  "🔗 Native share (WA, TG, X...)",
                ].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
