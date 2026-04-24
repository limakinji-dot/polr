"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import Link from "next/link";

const TradingCore = dynamic(() => import("@/components/3d/TradingCore"), { ssr: false });

export default function PnLSection() {
  const stats    = useStore((s) => s.stats);
  const isProfit = useStore((s) => s.isProfit);

  const totalPnlPct  = stats?.total_pnl_pct  ?? 0;
  const totalPnlUsdt = stats?.total_pnl_usdt ?? 0;

  return (
    <section className="relative min-h-screen py-24 px-4 flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${
            isProfit ? "rgba(0,212,255,0.05)" : "rgba(255,77,109,0.05)"
          } 0%, transparent 70%)`,
          transition: "background 1.5s ease",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-[10px] font-mono text-muted tracking-widest mb-2">
            ── SECTION 04 ──
          </div>
          <h2 className="text-5xl sm:text-7xl font-display tracking-widest text-text">
            PnL{" "}
            <span style={{ color: isProfit ? "#22c55e" : "#ef4444", textShadow: `0 0 40px ${isProfit ? "#22c55e" : "#ef4444"}` }}>
              {isProfit ? "PROFIT" : "LOSS"}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Spinning 3D core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div
              className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full"
              style={{
                boxShadow: `0 0 80px 20px ${isProfit ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                transition: "box-shadow 1.5s ease",
              }}
            >
              <TradingCore phase={2} />
            </div>

            {/* Big PnL number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-center mt-4"
            >
              <div
                className="text-7xl font-display"
                style={{
                  color: isProfit ? "#22c55e" : "#ef4444",
                  textShadow: `0 0 60px ${isProfit ? "#22c55e" : "#ef4444"}`,
                }}
              >
                {totalPnlPct >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%
              </div>
              <div className="text-muted font-mono text-xs tracking-widest mt-1">TOTAL ROI</div>
            </motion.div>
          </motion.div>

          {/* Right: stats card + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Stats grid */}
            <div className="glass-strong rounded-3xl p-6">
              <div className="text-[9px] font-mono text-muted tracking-widest mb-4">PERFORMANCE METRICS</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: "BALANCE",      v: `$${(stats?.balance ?? 0).toFixed(2)}`,        c: "var(--accent)" },
                  { l: "PnL USDT",     v: `${totalPnlUsdt >= 0 ? "+" : ""}${totalPnlUsdt.toFixed(2)}`, c: isProfit ? "#22c55e" : "#ef4444" },
                  { l: "WIN RATE",     v: `${(stats?.winrate ?? 0).toFixed(1)}%`,         c: isProfit ? "#22c55e" : "#ef4444" },
                  { l: "LEVERAGE",     v: `${stats?.leverage ?? "—"}×`,                   c: "#a78bfa" },
                  { l: "ENTRY SIZE",   v: `$${stats?.entry_usdt ?? "—"}`,                 c: "var(--accent)" },
                  { l: "TOTAL TRADES", v: (stats?.trade_count ?? 0).toString(),           c: "var(--accent)" },
                ].map((item) => (
                  <div key={item.l} className="border border-border/40 rounded-xl p-3">
                    <div className="text-[8px] font-mono text-muted tracking-widest">{item.l}</div>
                    <div className="text-2xl font-display mt-1" style={{ color: item.c }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to poster */}
            <Link href="/poster">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-strong rounded-2xl p-5 cursor-pointer border border-[var(--accent)]/20 hover:border-[var(--accent)]/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-mono text-muted tracking-widest mb-1">SHARE YOUR PERFORMANCE</div>
                    <div className="text-xl font-display" style={{ color: "var(--accent)" }}>
                      CREATE PnL POSTER →
                    </div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full border border-[var(--accent)]/30 flex items-center justify-center text-xl
                                group-hover:border-[var(--accent)] transition-colors"
                    style={{ color: "var(--accent)" }}
                  >
                    ↗
                  </div>
                </div>
                <p className="text-muted font-mono text-[10px] mt-2">
                  Generate shareable HD poster with QR code, candles & branding
                </p>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
