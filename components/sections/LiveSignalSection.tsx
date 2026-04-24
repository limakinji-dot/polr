"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import type { Signal } from "@/lib/types";
import { smartFmt, fmtTime } from "@/lib/utils";

const TradingCore = dynamic(() => import("@/components/3d/TradingCore"), { ssr: false });

function SignalRow({ signal, isNew }: { signal: Signal; isNew: boolean }) {
  const isLong = signal.decision === "LONG";
  const isClosed = signal.status === "CLOSED";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, filter: "brightness(2)" }}
      animate={{ opacity: 1, x: 0, filter: "brightness(1)" }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4 }}
      className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center px-3 py-2.5 rounded-xl border transition-all ${
        isNew
          ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
          : "border-border/40 hover:border-border/60 hover:bg-white/[0.02]"
      }`}
    >
      {/* Direction badge */}
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
          isLong ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
        }`}
      >
        {isLong ? "↗" : "↘"}
      </div>

      {/* Symbol */}
      <div>
        <div className="text-xs font-mono font-semibold text-text">
          {signal.symbol.replace("_USDT", "")}/USDT
        </div>
        <div className="text-[9px] font-mono text-muted">{fmtTime(signal.timestamp)}</div>
      </div>

      {/* Entry */}
      <div className="text-right hidden sm:block">
        <div className="text-[9px] font-mono text-muted">ENTRY</div>
        <div className="text-xs font-mono text-text">${smartFmt(signal.entry)}</div>
      </div>

      {/* TP/SL */}
      <div className="text-right">
        <div className="text-[9px] font-mono text-success">${smartFmt(signal.tp)}</div>
        <div className="text-[9px] font-mono text-danger">${smartFmt(signal.sl)}</div>
      </div>

      {/* Status */}
      <div
        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
          signal.status === "OPEN"
            ? "border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/5"
            : signal.result === "TP"
            ? "border-success/40 text-success bg-success/5"
            : signal.result === "SL"
            ? "border-danger/40 text-danger bg-danger/5"
            : "border-border text-muted"
        }`}
      >
        {signal.result ?? signal.status}
      </div>
    </motion.div>
  );
}

export default function LiveSignalSection() {
  const signals = useStore((s) => s.signals);
  const stats   = useStore((s) => s.stats);
  const isProfit = useStore((s) => s.isProfit);
  const prevIds  = useRef<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Detect new signals for glitch effect
  useEffect(() => {
    const incoming = new Set<string>();
    signals.forEach((s) => {
      if (!prevIds.current.has(s.id)) incoming.add(s.id);
    });
    if (incoming.size > 0) {
      setNewIds(incoming);
      setTimeout(() => setNewIds(new Set()), 2000);
    }
    prevIds.current = new Set(signals.map((s) => s.id));
  }, [signals]);

  const open   = signals.filter((s) => s.status === "OPEN").slice(0, 12);
  const recent = signals.filter((s) => s.status === "CLOSED").slice(0, 4);

  return (
    <section className="relative min-h-screen py-24 px-4 overflow-hidden">
      {/* Dim grid */}
      <div className="absolute inset-0 grid-texture opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-[10px] font-mono text-muted tracking-widest mb-2">
            ── SECTION 02 ──
          </div>
          <h2 className="text-5xl sm:text-7xl font-display tracking-widest text-text">
            LIVE{" "}
            <span style={{ color: "var(--accent)", textShadow: "0 0 30px var(--accent)" }}>
              LOGIC
            </span>
          </h2>
          <p className="text-muted font-mono text-xs mt-3 tracking-widest">
            REAL-TIME SIGNAL FEED · AUTO-REFRESHED EVERY 5S
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Signal list */}
          <div className="flex flex-col gap-3">
            {/* Stats row */}
            {stats && (
              <div className="grid grid-cols-3 gap-3 mb-2">
                {[
                  { l: "ACTIVE",   v: stats.active_signal_count, c: "var(--accent)" },
                  { l: "OPEN PNL", v: `${stats.total_pnl_pct >= 0 ? "+" : ""}${stats.total_pnl_pct.toFixed(2)}%`, c: isProfit ? "#22c55e" : "#ef4444" },
                  { l: "WINRATE",  v: `${stats.winrate.toFixed(1)}%`, c: isProfit ? "#22c55e" : "#ef4444" },
                ].map((item) => (
                  <div key={item.l} className="glass rounded-xl p-3 text-center">
                    <div className="text-[8px] font-mono text-muted tracking-widest">{item.l}</div>
                    <div className="text-xl font-display mt-0.5" style={{ color: item.c }}>{item.v}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="glass-strong rounded-2xl p-4 fade-table max-h-[520px] overflow-y-auto">
              <div className="text-[9px] font-mono text-muted tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse inline-block" />
                OPEN SIGNALS ({open.length})
              </div>
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {open.length > 0 ? open.map((s) => (
                    <SignalRow key={s.id} signal={s} isNew={newIds.has(s.id)} />
                  )) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted font-mono text-xs"
                    >
                      <div className="text-2xl mb-2">⟳</div>
                      Scanning markets...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recent closed */}
            {recent.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="text-[9px] font-mono text-muted tracking-widest mb-3">RECENTLY CLOSED</div>
                <div className="flex flex-col gap-1.5">
                  {recent.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-border/30 last:border-0">
                      <span className="text-muted">{s.symbol.replace("_USDT", "")}</span>
                      <span className={s.result === "TP" ? "text-success" : "text-danger"}>
                        {s.result === "TP" ? "+" : ""}{(s.pnl_pct ?? 0).toFixed(3)}%
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] ${s.result === "TP" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                        {s.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky 3D core (desktop) */}
          <div className="hidden lg:block sticky top-24">
            <div
              className="w-full h-[380px] rounded-3xl overflow-hidden orb-pulse"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <TradingCore phase={1} />
            </div>
            <div className="mt-4 glass rounded-2xl p-4 text-center">
              <div className="text-[9px] font-mono text-muted tracking-widest mb-1">AI ENGINE STATUS</div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-sm font-mono" style={{ color: "var(--accent)" }}>SCANNING</span>
              </div>
              {stats && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="text-left">
                    <span className="text-muted">TOTAL PnL</span>
                    <div className={stats.total_pnl_usdt >= 0 ? "text-success" : "text-danger"}>
                      {stats.total_pnl_usdt >= 0 ? "+" : ""}{stats.total_pnl_usdt.toFixed(2)} USDT
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-muted">BALANCE</span>
                    <div style={{ color: "var(--accent)" }}>${stats.balance.toFixed(2)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
