export interface Signal {
  id: string;
  symbol: string;
  decision: "LONG" | "SHORT" | "NO TRADE";
  entry?: number | null;
  tp?: number | null;
  sl?: number | null;
  invalidation?: number | null;
  current_price?: number | null;
  confidence?: number | null;
  status: "OPEN" | "CLOSED" | "NO TRADE" | "INVALIDATED";
  result?: "TP" | "SL" | null;
  pnl_pct?: number | null;
  pnl_usdt?: number | null;
  entry_hit?: boolean;
  timestamp?: number;
  timeframe?: string;
  reasoning?: string;
}

export interface BotStats {
  trade_count: number;
  win_count: number;
  loss_count: number;
  no_trade_count: number;
  winrate: number;
  total_pnl_pct: number;
  total_pnl_usdt: number;
  balance: number;
  leverage: number;
  entry_usdt: number;
  active_signal_count: number;
  max_active_signals: number;
}

export interface VirtualInfo {
  balance: number;
  initial_balance: number;
  leverage: number;
  entry_usdt: number;
}
