"use client";
import "./globals.css";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { fetchStats, fetchSignals } from "@/lib/api";
import NavBar from "@/components/ui/NavBar";

function StoreHydrator() {
  const setStats = useStore((s) => s.setStats);
  const setSignals = useStore((s) => s.setSignals);

  useEffect(() => {
    const poll = async () => {
      try {
        const [stats, signals] = await Promise.all([fetchStats(), fetchSignals(50)]);
        if (stats) setStats(stats);
        if (signals) setSignals(signals);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [setStats, setSignals]);

  // Sync CSS accent variable
  const accentColor = useStore((s) => s.accentColor);
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor);
  }, [accentColor]);

  return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AGENT-X · Quantum Execution</title>
        <meta name="description" content="AI-powered crypto signal trading engine" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='28'>⚡</text></svg>" />
      </head>
      <body className="scanlines">
        <StoreHydrator />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
