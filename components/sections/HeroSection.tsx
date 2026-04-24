"use client";
import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

const TradingCore = dynamic(() => import("@/components/3d/TradingCore"), { ssr: false });

const LATEX_OVERLAYS = [
  { label: "ROI",     formula: "ROI = (P_f - P_i) / P_i × 100",  pos: "top-20 left-6",  align: "left"  },
  { label: "SHARPE",  formula: "S = (R_p - R_f) / σ_p",           pos: "top-20 right-6", align: "right" },
  { label: "WINRATE", formula: "W% = Wins / (Wins + Losses)",      pos: "bottom-28 left-6", align: "left" },
  { label: "PnL",     formula: "PnL = ΔP × Qty × Leverage",       pos: "bottom-28 right-6", align: "right" },
];

export default function HeroSection() {
  const stats = useStore((s) => s.stats);
  const isProfit = useStore((s) => s.isProfit);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-14">
      {/* Background grid */}
      <div className="absolute inset-0 grid-texture opacity-60" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${
            isProfit ? "rgba(0,212,255,0.07)" : "rgba(255,77,109,0.07)"
          } 0%, transparent 70%)`,
          transition: "background 1s ease",
        }}
      />

      {/* LaTeX overlays */}
      {LATEX_OVERLAYS.map((o) => (
        <motion.div
          key={o.label}
          className={`absolute ${o.pos} latex-overlay hidden lg:block`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ textAlign: o.align as "left" | "right" }}
        >
          <div className="text-[8px] uppercase tracking-widest text-muted mb-0.5">{o.label}</div>
          <div style={{ color: "var(--accent)", opacity: 0.6 }}>{o.formula}</div>
        </motion.div>
      ))}

      {/* 3D Core (sticky via position) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] orb-pulse rounded-full">
          <TradingCore phase={0} />
        </div>

        {/* Hero text */}
        <motion.div
          className="text-center mt-6 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1
            className="text-6xl sm:text-8xl md:text-[10rem] font-display tracking-widest leading-none"
            style={{
              color: "var(--accent)",
              textShadow: "0 0 60px var(--accent), 0 0 120px rgba(0,212,255,0.2)",
            }}
          >
            QUANTUM
          </h1>
          <h2 className="text-3xl sm:text-5xl font-display tracking-[0.4em] text-text mt-1">
            EXECUTION
          </h2>
          <p className="mt-4 text-muted font-mono text-xs sm:text-sm tracking-widest max-w-md mx-auto">
            AI-POWERED · MULTI-SIGNAL · REAL-TIME CRYPTO ANALYSIS
          </p>
        </motion.div>

        {/* Live stats pills */}
        {stats && (
          <motion.div
            className="flex flex-wrap gap-3 justify-center mt-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { label: "WIN RATE",  val: `${stats.winrate.toFixed(1)}%`,   color: isProfit ? "#22c55e" : "#ef4444" },
              { label: "BALANCE",   val: `$${stats.balance.toFixed(0)}`,   color: "var(--accent)" },
              { label: "TRADES",    val: stats.trade_count.toString(),      color: "var(--accent)" },
              { label: "LEVERAGE",  val: `${stats.leverage}x`,             color: "#a78bfa" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl px-4 py-2 text-center min-w-[90px]">
                <div className="text-[9px] font-mono text-muted tracking-widest">{item.label}</div>
                <div className="text-lg font-display mt-0.5" style={{ color: item.color }}>
                  {item.val}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Scroll cue */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[9px] font-mono text-muted tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-px h-10 bg-gradient-to-b from-[var(--accent)] to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
}
