"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";

const links = [
  { href: "/",        label: "HOME" },
  { href: "/signals", label: "SIGNALS" },
  { href: "/history", label: "HISTORY" },
  { href: "/poster",  label: "POSTER" },
];

export default function NavBar() {
  const path     = usePathname();
  const isProfit = useStore((s) => s.isProfit);
  const stats    = useStore((s) => s.stats);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border/40"
      style={{ background: "rgba(3,3,3,0.85)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl font-display tracking-widest"
            style={{ color: "var(--accent)", textShadow: "0 0 20px var(--accent)" }}
          >
            AGENT-X
          </span>
          <span className="hidden sm:block text-[9px] font-mono text-muted uppercase tracking-widest border border-muted/30 px-1.5 py-0.5 rounded">
            QUANTUM
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 ml-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-widest transition-all rounded-md ${
                path === l.href
                  ? "text-[var(--accent)] bg-[var(--accent-glow)]"
                  : "text-muted hover:text-text hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: live stats */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          {stats && (
            <>
              <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono">
                <span className="text-muted">WIN</span>
                <span className={isProfit ? "text-success" : "text-danger"}>
                  {stats.winrate.toFixed(1)}%
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono">
                <span className="text-muted">BAL</span>
                <span className="text-text">${stats.balance.toFixed(0)}</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: isProfit ? "#22c55e" : "#ef4444" }}
            />
            <span className="text-[9px] font-mono text-muted">LIVE</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
