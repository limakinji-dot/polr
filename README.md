# AGENT-X · Quantum Execution

> AI-powered crypto signal trading frontend — "Deep Citadel" aesthetic

## Stack

- **Next.js 14** (App Router)
- **React Three Fiber** — 3D Trading Core orb
- **Framer Motion** — page/component transitions
- **GSAP ScrollTrigger** — scroll-driven 3D animations
- **Zustand** — global state (signals, stats, accent color)
- **Tailwind CSS** — utility styling with CSS variables for dynamic accent
- **SignalPoster** — canvas-based HD PnL poster generator

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Live Signals, History, PnL Showcase |
| `/signals` | Full signal feed with filters |
| `/history` | Closed trade history table |
| `/poster` | PnL poster generator (SignalPoster) |

## Setup

```bash
# 1. Install
npm install

# 2. Configure API
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your backend

# 3. Dev
npm run dev

# 4. Build
npm run build
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL` → your Railway backend URL
4. Deploy!

## Backend Connection

The frontend connects to the FastAPI backend at `NEXT_PUBLIC_API_URL`:

- `GET /api/bot/stats` — win rate, balance, PnL
- `GET /api/bot/signals` — live open signals
- `GET /api/history/signals` — closed trade history
- `GET /api/market/ticker/:symbol` — real-time price
- `WS /api/bot/ws` — (optional) WebSocket for push updates

## Dynamic Theming

The global accent color (`--accent` CSS variable) auto-switches:
- 💙 **Blue** (`#00d4ff`) when total PnL is positive
- ❤️ **Red** (`#ff4d6d`) when total PnL is negative

This affects nav, orb color, all borders, and glow effects globally.
