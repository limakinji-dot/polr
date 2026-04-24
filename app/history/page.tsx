"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { smartFmt, fmtTime } from "@/lib/utils";
import type { Signal } from "@/lib/types";
import { fetchHistory } from "@/lib/api";

export default function HistoryPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading]  = useState(true);
  const [sym, setSym]          = useState("");

  useEffect(() => {
    fetchHistory(200)
      .then(setSignals)
      .finally(() => setLoading(false));
  }, []);

  const closed   = signals.filter((s) => s.result === "TP" || s.result === "SL");
  const wins     = closed.filter((s) => s.result === "TP");
  const totalPnl = closed.reduce((a, s) => a + (s.pnl_pct ?? 0), 0);
  const winrate  = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;

  const filtered = sym
    ? closed.filter((s) => s.symbol.toLowerCase().includes(sym.toLowerCase()))
    : closed;

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 metal-grid">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="text-[9px] font-mono text-muted tracking-widest mb-1">TRADE HISTORY</div>
          <h1
            className="text-5xl sm:text-7xl font-display tracking-widest"
            style={{ color: "var(--accent)", textShadow: "0 0 40px var(--accent)" }}
          >
            HISTORY
          </h1>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { l: "TOTAL",    v: closed.length.toString(),                     c: "var(--accent)" },
            { l: "WIN RATE", v: `${winrate.toFixed(1)}%`,                     c: winrate >= 50 ? "#22c55e" : "#ef4444" },
            { l: "PnL %",    v: `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(3)}%`, c: totalPnl >= 0 ? "#22c55e" : "#ef4444" },
            { l: "W / L",    v: `${wins.length} / ${closed.length - wins.length}`, c: "var(--accent)" },
          ].map((item) => (
            <div key={item.l} className="glass-strong rounded-xl px-4 py-3 text-center">
              <div className="text-[8px] font-mono text-muted tracking-widest">{item.l}</div>
              <div className="text-2xl font-display mt-1" style={{ color: item.c }}>{item.v}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            value={sym}
            onChange={(e) => setSym(e.target.value)}
            placeholder="Filter by symbol..."
            className="w-full sm:w-64 bg-transparent border border-border/60 rounded-xl px-4 py-2 text-xs font-mono text-text placeholder-muted focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Table */}
        <div className="glass-strong rounded-3xl overflow-hidden fade-table">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-border/40">
            {["SYMBOL", "DIR", "ENTRY", "EXIT", "PnL %", "RESULT"].map((h) => (
              <div key={h} className="text-[8px] font-mono text-muted tracking-widest">{h}</div>
            ))}
          </div>
          <div className="divide-y divide-border/20 max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="text-center py-16 text-muted font-mono text-xs">Loading…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 text-muted font-mono text-xs">No trades found</div>
            )}
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <div>
                  <div className="text-xs font-mono font-semibold text-text group-hover:text-[var(--accent)] transition-colors">
                    {s.symbol.replace("_USDT", "")}/USDT
                  </div>
                  <div className="text-[8px] font-mono text-muted">{fmtTime(s.timestamp)}</div>
                </div>
                <div className={`text-[10px] font-mono ${s.decision === "LONG" ? "text-success" : "text-danger"}`}>
                  {s.decision === "LONG" ? "↗ L" : "↘ S"}
                </div>
                <div className="text-[10px] font-mono text-muted">${smartFmt(s.entry)}</div>
                <div className="text-[10px] font-mono text-muted">${smartFmt(s.result === "TP" ? s.tp : s.sl)}</div>
                <div className={`text-[10px] font-mono font-bold ${(s.pnl_pct ?? 0) >= 0 ? "text-success" : "text-danger"}`}>
                  {(s.pnl_pct ?? 0) >= 0 ? "+" : ""}{(s.pnl_pct ?? 0).toFixed(4)}%
                </div>
                <div className={`text-[9px] font-mono px-2 py-0.5 rounded-full border text-center ${
                  s.result === "TP"
                    ? "border-success/30 text-success bg-success/5"
                    : "border-danger/30 text-danger bg-danger/5"
                }`}>
                  {s.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
