import { create } from "zustand";
import type { Signal, BotStats } from "./types";

interface AppStore {
  signals: Signal[];
  stats: BotStats | null;
  isProfit: boolean;
  accentColor: string;
  setSignals: (s: Signal[]) => void;
  setStats: (s: BotStats) => void;
}

export const useStore = create<AppStore>((set) => ({
  signals: [],
  stats: null,
  isProfit: true,
  accentColor: "#00d4ff",
  setSignals: (signals) => set({ signals }),
  setStats: (stats) => {
    const isProfit = (stats.total_pnl_usdt ?? 0) >= 0;
    set({
      stats,
      isProfit,
      accentColor: isProfit ? "#00d4ff" : "#ff4d6d",
    });
  },
}));
