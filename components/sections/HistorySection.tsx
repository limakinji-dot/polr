"use client";
import { motion } from "framer-motion";
import { smartFmt, fmtTime } from "@/lib/utils";
import type { Signal } from "@/lib/types";

export default function HistorySection({ signals }: { signals: Signal[] }) {
  const closed = signals.filter((s) => s.result === "TP" || s.result === "SL").slice(0, 30);
  const wins   = closed.filter((s) => s.result === "TP").length;
  const totalPnl = closed.reduce((acc, s) => acc + (s.pnl_pct ?? 0), 0);

  return (
    <section className="relative min-h-screen py-24 px-4 metal-grid overflow-hidden">
      {/* Metal sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(120,120,180,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-[10px] font-mono text-muted tracking-widest mb-2">
            ── SECTION 03 ──
          </div>
          <h2 className="text-5xl sm:text-7xl font-display tracking-widest text-text">
            TRADE{" "}
            <span style={{ color: "var(--accent)" }}>HISTORY</span>
          </h2>

          {/* Summary pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {[
              { l: "TOTAL CLOSED",  v: closed.length.toString() },
              { l: "WINNERS",       v: wins.toString(),      c: "#22c55e" },
              { l: "LOSERS",        v: (closed.length - wins).toString(), c: "#ef4444" },
              { l: "TOTAL PnL",     v: `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(3)}%`, c: totalPnl >= 0 ? "#22c55e" : "#ef4444" },
            ].map((item) => (
              <div key={item.l} className="glass-strong rounded-xl px-4 py-2 text-center">
                <div className="text-[8px] font-mono text-muted tracking-widest">{item.l}</div>
                <div className="text-xl font-display mt-0.5" style={{ color: item.c ?? "var(--accent)" }}>
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl overflow-hidden fade-table"
        >
          {/* Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 border-b border-border/40">
            {["SYMBOL", "DIR", "ENTRY", "CLOSE", "PnL %", "RESULT"].map((h) => (
              <div key={h} className="text-[9px] font-mono text-muted tracking-widest">{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/20 max-h-[500px] overflow-y-auto">
            {closed.length > 0 ? closed.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <div>
                  <div className="text-xs font-mono font-semibold text-text group-hover:text-[var(--accent)] transition-colors">
                    {s.symbol.replace("_USDT", "")}/USDT
                  </div>
                  <div className="text-[9px] font-mono text-muted">{fmtTime(s.timestamp)}</div>
                </div>
                <div className={`text-xs font-mono ${s.decision === "LONG" ? "text-success" : "text-danger"}`}>
                  {s.decision === "LONG" ? "↗ LONG" : "↘ SHORT"}
                </div>
                <div className="text-xs font-mono text-muted">${smartFmt(s.entry)}</div>
                <div className="text-xs font-mono text-muted">
                  ${smartFmt(s.result === "TP" ? s.tp : s.sl)}
                </div>
                <div className={`text-xs font-mono font-semibold ${(s.pnl_pct ?? 0) >= 0 ? "text-success" : "text-danger"}`}>
                  {(s.pnl_pct ?? 0) >= 0 ? "+" : ""}{(s.pnl_pct ?? 0).toFixed(4)}%
                </div>
                <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full border text-center ${
                  s.result === "TP"
                    ? "border-success/30 text-success bg-success/5"
                    : "border-danger/30 text-danger bg-danger/5"
                }`}>
                  {s.result}
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-16 text-muted font-mono text-xs">
                No closed trades yet
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
