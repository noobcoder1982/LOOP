<div align="center">

```
██╗      ██████╗  ██████╗ ██████╗ 
██║     ██╔═══██╗██╔═══██╗██╔══██╗
██║     ██║   ██║██║   ██║██████╔╝
██║     ██║   ██║██║   ██║██╔═══╝ 
███████╗╚██████╔╝╚██████╔╝██║     
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     
```

**`artificial · human`**

*continuous intelligence for modern engineering teams.*

---

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black&labelColor=0d0d0d)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=0d0d0d)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=black&labelColor=0d0d0d)
![NVIDIA NIM](https://img.shields.io/badge/NVIDIA-NIM_API-76B900?style=flat-square&logo=nvidia&logoColor=white&labelColor=0d0d0d)
![License](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=0d0d0d)
![Status](https://img.shields.io/badge/phase-1%20%E2%80%94%20early%20access-ff3c3c?style=flat-square&labelColor=0d0d0d)

</div>

---

## `[overview]`

**loop.** is a customer feedback intelligence platform that bridges the gap between human intuition and artificial precision. It ingests product signals, processes them in real-time, and surfaces executive-grade insights through a conversational AI interface — powered by NVIDIA NIM.

> *Where every feedback signal becomes a decision.*

---

## `[product]`

| `#` | Feature | Description |
|-----|---------|-------------|
| `01` | **real-time signals** | Process and correlate system logs, events, metrics, and user feedback instantly as they stream through your platform |
| `02` | **conversational context** | Inject state context directly into developers' workspaces. Ask questions and review diagnostics in natural language |
| `03` | **self-improving feedback** | Loop trace patterns back to optimizing models and APIs. Continuously refine confidence variables automatically |

---

## `[solutions]`

```
incident response      →   auto-triage pipeline failures, identify anomalies, compile debug context
application monitoring →   track trace routes, optimize UI latency, preempt conversion bottlenecks
model telemetry        →   monitor prompt-response chains, token costs, output safety, prompt drift
```

---

## `[stack]`

```
frontend     react 19 + vite 8
animations   gsap 3 + @gsap/react
ai backend   nvidia nim api  (deepseek-v4-flash / glm-5.2 / gemma-4-31b)
styling      vanilla css — glassmorphism, scroll-snap, micro-animations
bundler      vite with proxy rewrite for nvidia integrate api
linting      oxlint
```

---

## `[quickstart]`

**prerequisites:** `node >= 18`, `npm >= 9`

```bash
# 1. clone
git clone https://github.com/noobcoder1982/LOOP.git
cd LOOP

# 2. install dependencies
npm install

# 3. configure environment
cp .env.example .env
# → add your NVIDIA NIM API key (see below)

# 4. start dev server
npm run dev

# 5. open
# http://localhost:5173
```

> For mobile testing on your local network:
> ```bash
> npm run dev -- --host
> ```

---

## `[environment]`

Create a `.env` file at the root (already in `.gitignore` — **never commit keys**):

```env
VITE_NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your API key at → **[integrate.api.nvidia.com](https://integrate.api.nvidia.com)**

The Vite dev proxy rewrites `/api/nvidia/*` → `https://integrate.api.nvidia.com/v1/*` so no CORS issues in development.

---

## `[scripts]`

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server at `localhost:5173` |
| `npm run dev -- --host` | Expose on LAN (for mobile testing) |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint static analysis |

---

## `[pricing]`

| Plan | Price | Signals | AI Queries |
|------|-------|---------|------------|
| **free** | $0 / mo | 2 / month | Basic |
| **pro** | $29 / mo | Unlimited | Full NIM access |
| **enterprise** | custom | Unlimited + SLA | Dedicated model |

---

## `[project structure]`

```
loop/
├── public/
│   ├── left_hand.png          ← hero human hand asset
│   ├── right_hand.png         ← hero artificial hand asset
│   ├── about_hands.png        ← about section visual
│   ├── footer_text.png        ← footer typographic asset
│   ├── pricing_bg.mp4         ← pricing section background video
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                ← single-file component architecture
│   ├── App.css                ← full design system (3800+ lines)
│   ├── main.jsx
│   └── assets/
│       └── hero.png
├── .env                       ← secret keys (gitignored)
├── .env.example               ← template for contributors
├── vite.config.js             ← proxy + build config
└── package.json
```

---

## `[design system]`

The UI is built on a dark-first, minimal aesthetic:

```
background    #000000 — pure black canvas
accent-red    #ff3c3c — human signal
accent-white  #ffffff — artificial signal  
typography    lowercase, mono-spaced section headers
layout        scroll-snap full-viewport sections
animations    gsap timeline — curtain preloader, hand slide-in, logo reveal
mobile        floating circular hamburger → left-to-right sliding panel menu
```

---

## `[ai integration]`

The embedded LOOP AI agent uses NVIDIA NIM models via a server-side proxied fetch:

```js
// model options used in this project
"deepseek-ai/deepseek-v4-flash"   // reasoning + high throughput
"z-ai/glm-5.2"                    // streaming dialogue
"google/gemma-4-31b-it"           // thinking-enabled responses
```

The AI widget lives inside the **Dashboard** view and answers questions about:
- Latency logs & anomaly analysis
- Webhook & checkout error patterns
- Executive product summaries
- User feedback trend breakdowns

---

## `[contributing]`

```bash
# fork → clone → branch
git checkout -b feat/your-feature

# make changes, then
npm run lint
npm run build   # must pass with 0 errors

# commit with context
git commit -m "feat: describe your change"
git push origin feat/your-feature
# → open a pull request
```

---

## `[roadmap]`

```
phase 1  ✅  landing site + dashboard shell + AI chat (current)
phase 2  🔲  backend api — real signal ingestion pipeline
phase 3  🔲  auth + user workspaces (multi-tenant)
phase 4  🔲  webhook integrations (stripe, linear, airbnb, replicate)
phase 5  🔲  self-hosted model telemetry + custom training hooks
```

---

## `[license]`

```
MIT License — © 2026 loop.intelligence
All consoles / Pure telemetry / EST. 2026
```

---

<div align="center">

*built at the intersection of human intuition and artificial precision.*

**`loop.`**

</div>
