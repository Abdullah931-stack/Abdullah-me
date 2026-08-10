# 📝 Project History & Changelog
## Advanced Personal Page — v1.3

> **Status:** ✅ All questions resolved + ✅ CTO review applied — February 2025

---

## 1. Confirmed Assumptions

| ID | Assumption | Status | Source |
|---|---|---|---|
| A-01 | TypeScript selected as the main programming language | ✅ Confirmed | Owner Approval |
| A-02 | CSS Modules or Tailwind CSS selected for interface styling | ✅ Confirmed | Owner Approval |
| A-03 | Prisma chosen as ORM to interface with Supabase PostgreSQL | ✅ Confirmed | Owner Approval |
| A-04 | Custom, independent layouts implemented for PC and Mobile | ✅ Confirmed | Owner Approval |
| A-05 | Single-user dashboard design (Owner only) | ✅ Confirmed | Owner Approval |
| A-06 | ~~NextAuth.js~~ → **Supabase Auth** utilized for authentication | ✅ Confirmed | Answer to Q-06 |
| A-07 | Anonymous tracker UUID set via Cookie to bind survey responses | ✅ Confirmed | Owner Approval |
| A-08 | Framer Motion selected as the main animation engine | ✅ Confirmed | Owner Approval |
| A-09 | ISR (Incremental Static Regeneration) utilized to optimize loads | ✅ Confirmed | Owner Approval |
| A-10 | Next.js API Routes chosen as backend integration | ✅ Confirmed | Owner Approval |
| A-11 | Next.js image optimization features utilized for media assets | ✅ Confirmed | Owner Approval |
| A-12 | Soft fade transitions used between page routing | ✅ Confirmed | Owner Approval |

---

## 3. Resolved Questions

### Critical Questions (Must Answer) ✅

| ID | Question | Answer | Specification Impact |
|---|---|---|---|
| Q-01 | Is the website Arabic only or bilingual? | **Bilingual (AR + EN)** with header language detection and manual toggling. | 🆕 FR-07, NFR-06, i18n strategy, Dual field columns in DB. |
| Q-02 | What is the hosting and database stack? | **Vercel** for hosting + **Supabase** (PostgreSQL) for database. | Update Architecture, Infrastructure. |
| Q-03 | What is the email forwarding provider? | **Resend**. | Update API, Data Flow. |
| Q-04 | Is the character asset a true 3D model or a flat PNG? | **Transparent PNG** styled with perspective transformations. | Update PRD, Animation Spec. |
| Q-05 | Are projects static or managed via CMS? | **Managed via Admin CMS Dashboard** — support CRUD actions. | 🆕 Admin CMS, CRUD API. |

### Important Questions ✅

| ID | Question | Answer | Specification Impact |
|---|---|---|---|
| Q-06 | What authentication engine will be used? | **Supabase Auth** (replacing NextAuth.js). | Update A-06, Architecture. |
| Q-07 | When does the survey popup appear? | **Welcome overlay prompt on first visit only** using Cookies. | Update Page Specs, Animation. |
| Q-08 | What does the contact form look like? | **Smart Contact Form — Glassmorphic card** with fields for budget, service type, and CTA. | Update Page Specs, UI. |
| Q-09 | What typography will be used? | **Readex Pro** (Arabic) + **Plus Jakarta Sans** (English). | Update UI/UX Guidelines. |
| Q-10 | What is the landing page project gallery motion? | **Card Shuffle stack** powered by Framer Motion. | 🆕 Animation Spec section. |

### Enhancement Questions ✅

| ID | Question | Answer | Specification Impact |
|---|---|---|---|
| Q-11 | Is SEO optimization required? | **Yes — configured dynamically per route**. | 🆕 FR-08, NFR-07, SEO Policy. |
| Q-12 | Are analytics required? | **Yes — survey categorization and Vercel Analytics**. | 🆕 InteractionEvent model, Analytics API. |
| Q-13 | Is Light Mode required? | **Dark Mode is default**, with an option to toggle Light Mode manually. | 🆕 NFR-08, Theme Strategy, UI Guidelines. |

---

## 4. Changelog & Architectural Decisions

### v1.1 — Updates Based on Owner Approval

| Target File | Main Changes |
|---|---|
| `01-PRD.md` | 🆕 FR-07 (i18n), FR-08 (SEO), NFR-06/07/08 · Update FR-04 (Smart Contact Form) · Update FR-05 (CMS + Supabase Auth) |
| `02-SYSTEM-ARCHITECTURE.md` | Vercel + Supabase + Resend · 🆕 i18n Strategy · 🆕 Theme Strategy · Update Project Structure · Update Data Flow |
| `03-UI-UX-GUIDELINES.md` | 🆕 Dual Theme System · Confirmed Typography · 🆕 Glassmorphism Component · Theme/Language Switchers |
| `04-PAGE-SPECIFICATIONS.md` | Survey → Welcome Popup · Smart Contact Form wireframes · CMS Admin · Language/Theme Switchers |
| `05-ANIMATION-SPEC.md` | PNG character classification · 🆕 Card Shuffle section · 🆕 Success Modal · Survey Popup context |
| `06-API-DATA-MODEL.md` | Localized schema columns (_ar/_en) · 🆕 InteractionEvent model · Supabase Auth integration · CMS CRUD · Resend email forwarding · 🆕 SEO Policy |
| `07-ANALYSIS-NOTES.md` | ✅ All questions resolved · Changelog documentation |

### v1.2 — Updates Based on CTO Code Review

| ID | Code Review Comment | Resolution / Action | Affected Files |
|---|---|---|---|
| R-01 | ❌ `InteractionEvent` relation causes write bottlenecks and violates GDPR | **Remove relation** → utilize **Vercel Analytics** wrapper | 06, 01, 02 |
| R-02 | ⚠️ Card Shuffle stack causes clipping and visual glitches | Assign stable `layoutId` + handle interactive `zIndex` updates + configure `exit: { scale: 0.9, opacity: 0 }` | 05 |
| R-03 | ❌ Missing rate limits leaves Resend email credits open to exploitation | Implement **Upstash Rate Limit** (max 5 requests/IP/hour) | 06, 01, 02 |
| R-04 | Projects database relation requires featured priority fields | Add **`isFeatured`** (Boolean) field to restrict landing page arrays | 06 |

### v1.3 — Updates Based on CTO Code Review (Round 2)

| ID | Code Review Comment | Resolution / Action | Affected Files |
|---|---|---|---|
| R2-01 | 🔴 **Security:** Disable public signup + configure Row Level Security | Disable Supabase public registration + enable PostgreSQL RLS policies | 06, 02 |
| R2-02 | 🟡 Handling duplicate slugs + orphaned media cleanup | Programmatic slug incremental suffixes + cascading media asset deletes | 06 |
| R2-03 | 🟡 Client hydration mismatches + Flash of Invisible Text (FOIT) | Resolve locale routing in middleware + apply `display: 'swap'` on typography assets | 02, 03 |
| R2-04 | 🔴 Mobile parallax listeners cause FCP lag and battery drain | Toggle dynamic character renders using `useMediaQuery` media hooks | 05 |
| R2-05 | 🟡 Resend delivery failure alerts and retry capabilities | Add database status fields + manual resend fallback triggers | 06, 04 |
