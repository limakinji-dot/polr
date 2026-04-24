import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function smartFmt(n: number | null | undefined, withDollar = false): string {
  if (n == null) return "—";
  const abs = Math.abs(n);
  let str: string;
  if (abs === 0)           str = "0";
  else if (abs >= 10000)   str = n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  else if (abs >= 1)       str = n.toFixed(4);
  else if (abs >= 0.01)    str = n.toFixed(6);
  else if (abs >= 0.0001)  str = n.toFixed(8);
  else                     str = n.toPrecision(4);
  return withDollar ? `$${str}` : str;
}

export function fmtTime(ts?: number) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
