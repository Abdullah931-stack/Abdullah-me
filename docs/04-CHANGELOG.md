# 📝 Project History & Changelog
## Abdullah.me — v2.0 "Signal & Growth"

> **Status:** ✅ All Architectural Transformations Applied & Deployed — August 2026

---

## 1. Confirmed Assumptions (v2.0)

| ID | Assumption | Status | Source |
|---|---|---|---|
| A-01 | TypeScript 5 selected as the core programming language | ✅ Confirmed | Architecture Standard |
| A-02 | Tailwind CSS 4 & CSS Custom Properties selected for styling | ✅ Confirmed | System Specifications |
| A-03 | Prisma 7 chosen as ORM to interface with Supabase PostgreSQL | ✅ Confirmed | Architecture Standard |
| A-04 | Responsive lifecycle management with breakpoint-based canvas unmounting | ✅ Confirmed | Performance Specification |
| A-05 | Single-user administrative dashboard (Owner only) | ✅ Confirmed | Security Protocol |
| A-06 | Supabase Auth SSR utilized for server session validation | ✅ Confirmed | Security Protocol |
| A-07 | Privacy-first Edge Analytics (`@vercel/analytics`) providing cookieless Web Vitals | ✅ Confirmed | Analytics Specification |
| A-08 | Framer Motion 12 + HTML5 Canvas 2D selected for animations & physics simulations | ✅ Confirmed | Motion Specification |
| A-09 | ISR (Incremental Static Regeneration) & Server Components utilized to optimize loads | ✅ Confirmed | Performance Specification |
| A-10 | Next.js API Routes chosen for backend REST integration | ✅ Confirmed | Architecture Standard |
| A-11 | Next.js image optimization features utilized for media assets | ✅ Confirmed | Performance Specification |
| A-12 | FrozenRouter context preservation used to prevent unmounting translation context tearing | ✅ Confirmed | Routing Resilience |
| A-13 | Dark-Only emerald theme (`#050f0a`) replacing dual light/dark variants | ✅ Confirmed | UI/UX Specification v2.0 |

---

## 2. Resolved Architectural Inquiries

| ID | Topic | Resolution / Decision | Specification Impact |
|---|---|---|---|
| Q-01 | **Design Philosophy** | Replaced "Luxury & Serenity" with **"Engineering Precision, Visibly Alive"** (Systems · Signals · Simulation). | `01-PRD`, `03-UI-UX-SPECIFICATIONS` |
| Q-02 | **Hero Anchor** | Removed 2.5D floating character; implemented **Lissajous Tri-Curve Canvas Engine** with Kepler orbital dynamics and phosphor trails. | `01-PRD`, `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-03 | **Ambient Background** | Replaced ad-hoc CSS gradients with deterministic **Lava Lamp** composed sine waves (SSR hydration-safe). | `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-04 | **Project Showcase** | Retired Card Shuffle and legacy `isFeatured` filtering; implemented **Uniform Grid with Shared-Element Expand** (`layoutId`) and Euclidean distance ripple stagger. | `01-PRD`, `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-05 | **Journey Timeline** | Replaced zigzag layout with **Single-Rail Scientific Log** using logarithmic time compression ($base + k \cdot \ln(1 + \Delta t/\tau)$) and uncertainty brackets (`dateTo`). | `01-PRD`, `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-06 | **Contact Form** | Reframed from freelance intake to **Multi-Intent Contact Engine** (4 intents, project issue picker, debounced draft auto-save with 10-min TTL, `locale` persistence). | `01-PRD`, `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-07 | **Micro-Interactions** | Implemented **PulseBorder** with directional conic mask sweep from contact entry point. | `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-08 | **Typography** | Replaced Readex Pro / Plus Jakarta Sans with **Space Grotesk** (Display), **IBM Plex Sans Arabic** (Body), **JetBrains Mono** (Code & Metadata). | `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-09 | **Theme Strategy** | Retired Light Mode; established **Dark-Only** obsidian-emerald system (`#050f0a`, `#4ade80`, `#a7f3c4`). | `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |
| Q-10 | **Router Context** | Implemented **FrozenRouter** to eliminate `<AnimatePresence>` exit translation context tearing. | `02-SYSTEM-ARCHITECTURE` |
| Q-11 | **Analytics & Cleanliness** | Retired intrusive survey popup; implemented **Vercel Edge Analytics & Speed Insights** with zero database load. | `01-PRD`, `02-SYSTEM-ARCHITECTURE`, `03-UI-UX` |

---

## 3. Changelog & Architectural Decisions

### v1.1 — Initial Specification
- Initial PRD and architecture blueprints (Vercel, Supabase, Resend, i18n dual routing).

### v1.2 — First Review Refinements
- Replaced `InteractionEvent` relation with Vercel Analytics wrapper to comply with GDPR.
- Implemented Upstash Redis rate limiting on transactional endpoints.
- Added `isFeatured` priority field to Project schema.

### v1.3 — Security & Stability Hardening
- Disabled public Supabase user registration; enabled PostgreSQL Row-Level Security (RLS) policies.
- Programmatic slug auto-uniqueness with incremental suffix fallbacks.
- Media cleanup cascading deletions in Supabase Storage.

---

### v2.0 — "Signal & Growth" Transformation (August 2026)

| Component / Area | Architectural Change | Rationale & Impact |
|---|---|---|
| **Identity & Tone** | "No-Identity-Noun" copy strategy (`Systems · Signals · Simulation`) | Focus on verified shipped software and engineering reasoning rather than unbacked titles. |
| **Hero Section** | Lissajous Tri-Curve Canvas Simulation Engine | Parametric curves ($x = \sin(at + \delta), y = \sin(bt)$) with Kepler orbital speed modulation and CRT phosphor decay trails; unmounted on phone breakpoints. |
| **Background Engine** | Deterministic Lava Lamp Composed Sine Waves | Eliminates `Math.random()` and noise libraries, guaranteeing zero SSR hydration mismatch errors. Decouples translation and shape morph keyframes. |
| **Project Grid** | Uniform Grid + Shared-Element Morph (`layoutId`) | Clean visual uniformity with in-place expansion into standalone modal geometry (`z-[100]`, `max-w-6xl`, `max-h-[90vh]`) and distance-stagger ripple fade. Removed legacy `isFeatured` filters. |
| **Journey / Timeline** | Single-Rail Scientific Log & Logarithmic Compression | Replaced zigzag layout with reading-direction rail. Gaps compressed logarithmically ($gap(\Delta t) = base + k \cdot \ln(1 + \Delta t/\tau)$). Added `dateTo` uncertainty intervals. |
| **Smart Contact Form** | Multi-Intent Routing + Draft Persistence Engine | 4 intent pathways, dynamic published project picker for issue reporting, client-side `sessionStorage` auto-save (500ms debounce + rolling 10-minute TTL), `PulseBorder`-wrapped clear action, and `locale` database persistence. |
| **Media Lifecycle Cleanup** | Supabase Storage Automated Media Purge | Deleting a project automatically purges physical media assets from the Supabase Storage `uploads` bucket to prevent orphaned cloud storage bloat. |
| **Media Delivery & Mobile LCP** | Next.js `<Image />` AVIF/WebP Pipeline & Ingestion Compression | Converted raw `<img>` tags to Next.js optimized `<Image />` across all components with responsive `sizes` and `priority` preloading; implemented client-side Canvas WebP 90% ingestion compression in `ImageUpload.tsx` to safeguard Supabase quotas and slash mobile LCP. |
| **SEO & Indexing Architecture** | Dynamic `sitemap.ts`, `robots.ts`, OpenGraph & JSON-LD | Implemented dynamic multilingual sitemap generator with Prisma project slugs, dynamic robots handler, full OpenGraph/Twitter metadata, and Schema.org `Person`/`WebSite` JSON-LD for Google rich results. |
| **Edge Analytics & Speed Insights** | Vercel Web Vitals & Cookieless Visitor Analytics | Removed legacy survey popup; integrated `@vercel/analytics/next` and `@vercel/speed-insights/next` for zero-overhead, GDPR-compliant performance, traffic, and Core Web Vitals metrics. |
| **Micro-Interactions** | Directional `PulseBorder` Conic Mask Sweep | Sweep originates from entry coordinate, settling to static emerald glow without DOM element accumulation. |
| **Navigation & i18n** | `FrozenRouter` & 60fps Scroll Restoration | Preserves unmounting route context during exit animations; throttled RAF scroll coordinate restoration across language toggles (`scroll={false}`). |
| **Brand Identity & Vector Iconography** | Lissajous Physics Logo (`/logo.svg` & `/icon.svg`) | Integrated custom emerald glowing Lissajous curve SVG as official brand icon in Navbar with hover glow micro-interaction, App Router vector favicon/tab icon, and Schema.org structured data. |
| **Security & Auth Guard** | Dynamic `ENABLE_ADMIN_SIGNUP` Toggle & Safe Deactivation | Public registration safely disabled via feature flag with 403 status guard and disabled UI state, allowing immediate re-activation without file deletion. |
| **Quality Assurance** | 83 Passing Unit Tests across 13 Vitest Suites | Comprehensive test suites validating math models, physics loops, draft persistence, API routes, auth guards, and components. |
