# EA SPORTS FC 26 — Build Progress

## Project Overview
Marketing/landing page for EA Sports FC 26. Single-page React app (no router).
Stack: React 19 · Tailwind v4 · Vite 8 · JavaScript/JSX · No backend.

---

## Current Build Status: Phase 1 Complete ✓

### Phase 1 — Checkout & Payment ✅ DONE (2026-04-30)
Added a full 3-step checkout modal flow wired to all "Buy Now" buttons.

**What was built:**
- `EDITIONS_DATA` — pricing constants (Standard $59.99 / Icons $79.99)
- `CHECKOUT_PLATFORMS` — 7 platform options
- `CheckoutModal` component — multi-step wizard:
  - **Step 0 — Order Review**: edition picker, platform picker, order summary with price total
  - **Step 1 — Payment**: card form (name, card number, expiry, CVV) with input validation, formatting helpers, 1.8s simulated processing state with spinner
  - **Step 2 — Confirmation**: success checkmark, auto-generated order number, receipt summary
- All "Buy Now" buttons wired: Navbar (desktop + mobile), Hero section
- Edition-specific routing: "Buy Standard →" opens checkout pre-selected on Standard; "Buy Icons Edition →" opens on Icons
- Body scroll lock while modal is open
- Click-outside-to-close backdrop
- `openCheckout(edition?)` function in App root manages state

**Files changed:** `src/App.jsx` only

---

## Known Issues & Technical Debt

| Issue | Severity | Notes |
|-------|----------|-------|
| No real payment gateway | Medium | Simulated 1.8s delay; no Stripe/PayPal integration |
| All external links point to `#` | Low | Social, news, footer nav, "Watch Trailer" |
| No email confirmation | Low | Confirmation screen says "sent to email" but no actual send |
| Single 1200+ line file | Low | Could split into separate component files |
| No TypeScript | Low | All JS/JSX, no type safety |
| ParticleField canvas perf | Low | 80 particles + O(n²) line check on every frame |
| No ARIA labels on buttons | Low | Accessibility gap |
| Hardcoded news dates | Info | Not dynamic |

---

## Planned Phases

### Phase 2 — Routing & Deep Links
- Add React Router
- `/buy`, `/news/:slug`, `/player/:name` routes
- Section IDs → proper routes

### Phase 3 — Real Payment Gateway
- Integrate Stripe (or similar)
- Replace simulated delay with actual API call
- Webhook for order confirmation email

### Phase 4 — Backend / CMS
- Replace hardcoded NEWS, MODES, PLAYERS data with API/CMS
- User authentication (EA Account-style)
- Order history

### Phase 5 — Polish & Production
- Image assets (replace emoji placeholders in news cards)
- Video embed for "Watch Trailer"
- SEO meta tags, Open Graph
- Accessibility audit (ARIA, keyboard nav, color contrast)
- Performance: throttle ParticleField on mobile/low-power
- Analytics integration

---

## Component Map

```
App
├── CheckoutModal          ← NEW (Phase 1)
├── Navbar                 ← onBuy wired (Phase 1)
├── Hero                   ← onBuy wired (Phase 1)
├── StatsBar
├── GameModes
├── FeaturesCarousel
├── Editions               ← onBuy("standard"|"icons") wired (Phase 1)
├── News
├── Community
├── PlayerStats
├── Legal
└── Footer

Shared primitives: BorderBeam · ShimmerText · Counter · ParticleField · Noise · Orb
Shared components:  Badge · Button · Card
```

---

## Dev Commands
```bash
npm run dev      # Start dev server (Vite HMR)
npm run build    # Production build → /dist
npm run preview  # Preview production build
npm run lint     # ESLint check
```
