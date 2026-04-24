"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { smartFmt, fmtTime } from "@/lib/utils";
import type { Signal } from "@/lib/types";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

type FilterType = "ALL" | "LONG" | "SHORT" | "OPEN" | "CLOSED";

function SignalCard({ signal }: { signal: Signal }) {
  const isLong    = signal.decision === "LONG";
  const isOpen    = signal.status === "OPEN";
  const pnl       = signal.pnl_pct ?? 0;
  const isWin     = signal.result === "TP";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-strong rounded-2xl p-4 border border-border/40 hover:border-[var(--accent)]/30 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-text group-hover:text-[var(--accent)] transition-colors">
              {signal.symbol.replace("_USDT", "")}/USDT
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
              isLong ? "border-success/30 text-success bg-success/5" : "border-danger/30 text-danger bg-danger/5"
            }`}>
              {isLong ? "↗ LONG" : "↘ SHORT"}
            </span>
          </div>
          <div className="text-[9px] font-mono text-muted mt-0.5">{fmtTime(signal.timestamp)}</div>
        </div>
        <div className={`text-[9px] font-mono px-2 py-1 rounded-full border ${
          isOpen
            ? "border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/5 animate-pulse"
            : signal.result === "TP"
            ? "border-success/30 text-success bg-success/5"
            : signal.result === "SL"
            ? "border-danger/30 text-danger bg-danger/5"
            : "border-border text-muted"
        }`}>
          {signal.result ?? signal.status}
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { l: "ENTRY",  v: signal.entry,       c: "text-text" },
          { l: "TP",     v: signal.tp,           c: "text-success" },
          { l: "SL",     v: signal.sl,           c: "text-danger" },
          { l: "CURRENT",v: signal.current_price,c: "text-[var(--accent)]" },
        ].map((item) => (
          <div key={item.l}>
            <div className="text-[7px] font-mono text-muted tracking-widest">{item.l}</div>
            <div className={`text-[10px] font-mono ${item.c}`}>${smartFmt(item.v)}</div>
          </div>
        ))}
      </div>

      {/* Confidence + PnL */}
      <div className="flex items-center justify-between border-t border-border/30 pt-2">
        {signal.confidence != null && (
          <div className="flex items-center gap-2">
            <div className="text-[8px] font-mono text-muted">CONF</div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-3 rounded-[1px]"
                  style={{
                    background: i < Math.round((signal.confidence ?? 0) / 20)
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
            <div className="text-[9px] font-mono" style={{ color: "var(--accent)" }}>
              {signal.confidence}%
            </div>
          </div>
        )}
        {signal.pnl_pct != null && (
          <div className={`text-xs font-mono font-bold ${pnl >= 0 ? "text-success" : "text-danger"}`}>
            {pnl >= 0 ? "+" : ""}{pnl.toFixed(4)}%
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SignalsPage() {
  const signals   = useStore((s) => s.signals);
  const stats     = useStore((s) => s.stats);
  const isProfit  = useStore((s) => s.isProfit);
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filtered = signals.filter((s) => {
    if (filter === "ALL")    return true;
    if (filter === "LONG")   return s.decision === "LONG";
    if (filter === "SHORT")  return s.decision === "SHORT";
    if (filter === "OPEN")   return s.status === "OPEN";
    if (filter === "CLOSED") return s.status === "CLOSED";
    return true;
  });

  return (
    <main className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-[9px] font-mono text-muted tracking-widest mb-1">LIVE SIGNALS</div>
          <h1
            className="text-5xl sm:text-7xl font-display tracking-widest"
            style={{ color: "var(--accent)", textShadow: "0 0 40px var(--accent)" }}
          >
            SIGNAL FEED
          </h1>
          <p className="text-muted font-mono text-xs mt-2 tracking-widest">
            {signals.length} signals tracked · auto-refresh 5s
          </p>
        </motion.div>

        {/* Stats row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6"
          >
            {[
              { l: "ACTIVE",     v: stats.active_signal_count, c: "var(--accent)" },
              { l: "WIN RATE",   v: `${stats.winrate.toFixed(1)}%`,           c: isProfit ? "#22c55e" : "#ef4444" },
              { l: "WINS",       v: stats.win_count,                          c: "#22c55e" },
              { l: "LOSSES",     v: stats.loss_count,                         c: "#ef4444" },
              { l: "TOTAL PnL",  v: `${stats.total_pnl_pct >= 0 ? "+" : ""}${stats.total_pnl_pct.toFixed(2)}%`, c: isProfit ? "#22c55e" : "#ef4444" },
              { l: "BALANCE",    v: `$${stats.balance.toFixed(0)}`,           c: "var(--accent)" },
            ].map((item) => (
              <div key={item.l} className="glass rounded-xl px-3 py-2 text-center">
                <div className="text-[7px] font-mono text-muted tracking-widest">{item.l}</div>
                <div className="text-lg font-display mt-0.5" style={{ color: item.c }}>{item.v}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["ALL", "OPEN", "CLOSED", "LONG", "SHORT"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-mono tracking-widest rounded-lg border transition-all ${
                filter === f
                  ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-border text-muted hover:text-text hover:border-border/60"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto text-[9px] font-mono text-muted flex items-center">
            {filtered.length} RESULTS
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((s) => (
              <SignalCard key={s.id} signal={s} />
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted font-mono text-sm">
            <div className="text-4xl mb-4">⟳</div>
            No signals match this filter
          </div>
        )}
      </div>
    </main>
  );
}
