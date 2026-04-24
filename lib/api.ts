const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchStats() {
  const r = await fetch(`${BASE}/api/bot/stats`, { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  return j.data;
}

export async function fetchSignals(limit = 50) {
  const r = await fetch(`${BASE}/api/bot/signals?limit=${limit}`, { cache: "no-store" });
  if (!r.ok) return [];
  const j = await r.json();
  return j.data ?? [];
}

export async function fetchHistory(limit = 100) {
  const r = await fetch(`${BASE}/api/history/signals?limit=${limit}`, { cache: "no-store" });
  if (!r.ok) return [];
  const j = await r.json();
  return j.data ?? [];
}

export async function fetchBalance() {
  const r = await fetch(`${BASE}/api/bot/balance`, { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  return j.data;
}

export async function fetchTicker(symbol: string) {
  const r = await fetch(`${BASE}/api/market/ticker/${symbol}`, { cache: "no-store" });
  if (!r.ok) return null;
  const j = await r.json();
  return j.data;
}

export async function fetchCandles(symbol: string, granularity = "5m", limit = 100) {
  const r = await fetch(`${BASE}/api/market/candles/${symbol}?granularity=${granularity}&limit=${limit}`, { cache: "no-store" });
  if (!r.ok) return [];
  const j = await r.json();
  return j.data ?? [];
}
