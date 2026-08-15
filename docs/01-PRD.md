# 📋 Product Requirements Document (PRD)
## Abdullah.me — v2.0 "Signal & Growth"

---

## 1. Product Overview

| Parameter | Details |
|---|---|
| **Project Name** | Abdullah.me — Advanced Digital Platform & CMS |
| **Type** | High-Performance Bilingual Digital Platform, Engineering Portfolio & Brand CMS |
| **Core Objective** | Deliver a rigorous, evidence-grounded digital identity showcasing projects through engineering reasoning, narrating achievements via a scientific single-rail log, providing resilient multi-intent communication, and managing dynamic content via a single-user CMS. |
| **Target Audience** | Academic institutions, admissions reviewers, engineering teams, potential collaborators, and technical employers. |
| **Governing Philosophy** | **Engineering Precision, Visibly Alive** (Systems · Signals · Simulation) |
| **Aesthetic System** | Dark-Only Emerald Palette (`#050f0a` base, `#4ade80` accent, glassmorphic surfaces) |

---

## 2. Functional Requirements (FR)

### FR-01: Home Page & Visual Anchor

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | **No-Identity-Noun Copy Strategy:** Hero section uses evidence-anchored verb sentences (`Systems · Signals · Simulation`), avoiding self-proclaimed titles. | **High** |
| FR-01.2 | **Lissajous Tri-Curve Oscilloscope Engine:** Real-time 2D Canvas parametric curve ($x = \sin(at + \delta), y = \sin(bt)$) with 3 converging phase-offset curves symbolizing multi-model AI orchestration. | **High** |
| FR-01.3 | **Keplerian Orbital Dynamics:** Glowing orbiting points traveling on fixed tracks with variable angular speed ($speed = baseSpeed \times (1 - k(r/maxRadius))$) and phosphor-persistence fading trails. | **High** |
| FR-01.4 | **Lava Lamp Ambient Background:** Deterministic procedural ambient background driven by composed sine waves at irrational frequencies, guaranteed free of SSR hydration mismatches. | **High** |
| FR-01.5 | **Uniform Projects Grid:** Symmetrical card grid replacing legacy auto-cycling card stacks with Framer Motion shared-element in-place expansion (`layoutId`). | **High** |
| FR-01.6 | **Distance-Based Ripple Stagger:** Unselected cards fade and scale down ($0.97$) with staggered delays derived from Euclidean grid distance. | **High** |

---

### FR-02: Journey (The Scientific Milestone Log)

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | **Single-Rail Layout:** Unified reading rail aligned to reading direction (right for Arabic RTL, left for English LTR), discarding generic alternating zigzags. | **High** |
| FR-02.2 | **Logarithmic Time Spacing:** Milestone gaps calculated via elapsed time ($gap(\Delta t) = base + k \cdot \ln(1 + \Delta t / \tau)$) to maintain proportional density without excessive vertical voids. | **High** |
| FR-02.3 | **Uncertainty Interval Brackets (`dateTo`):** Approximated milestones render as uncertainty arcs/brackets spanning the estimated interval rather than fabricated exact points. | **High** |
| FR-02.4 | **Accordion Story Expansion:** In-place expansion toggling between summary and full narrative rendered via secure Markdown without full page reload. | **High** |
| FR-02.5 | **In-Place Project Modal Transition:** Linked project buttons open project detail modals over the timeline with 100% scroll position retention. | **High** |

---

### FR-03: Portfolio & Project Showcase

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | **Uniform Card Presentation:** Consistent card footprints with cover images, title, localized summary, skills tags, and build duration badges. | **High** |
| FR-03.2 | **Standalone Floating Modal Geometry:** Expanded project views render as an isolated floating container (`z-[100]`, `max-w-6xl`, `max-h-[90vh]`) with safe padding and backdrop blur. | **High** |
| FR-03.3 | **Multi-Image Gallery Lightbox:** Connected node-indicator gallery navigation with dark-green tinted scrim and `PulseBorder` navigation arrows. | **High** |
| FR-03.4 | **Dual Gateway Actions:** Independent, distinct buttons for Live Preview (`previewUrl`) and Source Repository (`repoUrl`). | **High** |
| FR-03.5 | **Universal Markdown Narrative:** Detailed body rendering including problem statements, pivotal engineering decisions, and measurable outcomes. | **High** |
| FR-03.6 | **Localized Duration Engine:** Normalized duration strings (`{amount}:{unit}`) converted dynamically into grammatically correct Arabic and English pluralization formats. | **High** |

---

### FR-04: Engagement & Smart Contact Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | **Multi-Intent Reason Routing:** 4 structured intent pathways: General Inquiry, Project Issue Report, Academic / Research Inquiry, Collaboration or Hiring. | **High** |
| FR-04.2 | **Dynamic Project Issue Picker:** Automatically lists published project titles when "Report an issue in a project" is selected, with a custom text fallback. | **High** |
| FR-04.3 | **Client-Side Draft Persistence:** `sessionStorage` caching with 500ms typing debounce and a rolling 10-minute TTL to preserve input across locale switches. | **High** |
| FR-04.4 | **Explicit Clear Form Action:** `PulseBorder`-wrapped clear button appearing when form is dirty, with SSR `isMounted` hydration protection. | **High** |
| FR-04.5 | **Automated Email Forwarding:** Contact submissions dispatched asynchronously to administrator email via **Resend** with non-blocking database status logging. | **High** |

---

### FR-05: Admin Dashboard (CMS)

| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | **Single-User Admin Guard:** Secure login restricted exclusively to the site owner via **Supabase Auth SSR**; public registration guarded via `ENABLE_ADMIN_SIGNUP` toggle. | **Critical** |
| FR-05.2 | **Project CMS:** Full CRUD authoring for projects, cover image assignment, multi-image upload to Supabase Storage, and slug auto-uniqueness. | **High** |
| FR-05.3 | **Timeline CMS:** Full CRUD for milestones with date ranges (`date` / `dateTo`), age, stories, and linked project slugs. | **High** |
| FR-05.4 | **Social Shortcuts CMS:** Dynamic management of social links with automatic platform icon detection in Navigation and Footer. | **High** |
| FR-05.5 | **Contact Inbox & Data Export:** Centralized dashboard for managing contact submissions, message statuses, and raw JSON data export. | **High** |
| FR-05.6 | **Media Cleanup Lifecycle:** Deleting projects automatically purges all associated media assets from Supabase Storage buckets. | **High** |

---

### FR-06: Navigation, i18n & Shared Architecture

| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | **Bilingual Localization:** Full Arabic (RTL) and English (LTR) dictionary routing via `next-intl` and edge header detection (`proxy.ts`). | **High** |
| FR-06.2 | **`FrozenRouter` Context Preservation:** Wraps unmounting layouts during Framer Motion `<AnimatePresence>` exit transitions to eliminate translation context tearing. | **Critical** |
| FR-06.3 | **Path-Preserving Scroll Restoration:** Throttled 60fps RAF scroll caching across language toggles (`scroll={false}`) and page reloads. | **High** |
| FR-06.4 | **`PulseBorder` Interaction:** Reusable directional-reveal sweep on cursor/touch entry, settling to static lit emerald borders. | **High** |

---

## 3. Non-Functional Requirements (NFR)

| ID | Requirement | Priority |
|---|---|---|
| NFR-01 | **Performance & Fluidity:** Target steady 60fps animation loops, sub-1.5s First Contentful Paint (FCP), and GPU-safe composite properties (`transform`, `opacity`). | **Critical** |
| NFR-02 | **Responsive Lifecycle Management:** Lissajous Canvas and intensive loops unmount on phone breakpoints (`<768px`) to preserve battery and CPU. | **Critical** |
| NFR-03 | **Dark-Only Visual Identity:** Base `#050f0a`, emerald `#4ade80`/`#a7f3c4`, typography `Space Grotesk`, `IBM Plex Sans Arabic`, `JetBrains Mono`. | **High** |
| NFR-04 | **API Security & Rate Limiting:** Upstash Redis sliding-window limiters restricting public endpoints (max 5 contact messages/IP/hr). | **Critical** |
| NFR-05 | **Database Security & RLS:** PostgreSQL Row-Level Security active across all tables with public registration guarded. | **Critical** |
| NFR-06 | **Edge Analytics & Speed Insights:** Integrated `@vercel/analytics` & `@vercel/speed-insights` cookieless, GDPR-compliant privacy-first visitor and Core Web Vitals performance analytics with zero database overhead. | **High** |
| NFR-07 | **Accessibility & Reduced Motion:** Respect `prefers-reduced-motion` with graceful calm-motion degradation (e.g. constant-speed Lissajous trails). | **High** |
| NFR-08 | **Automated Test Quality:** 100% pass rate across Vitest unit and integration suites covering math models, draft persistence, API routes, and components. | **High** |
| NFR-09 | **Next-Gen Media Delivery & Mobile LCP:** Next.js `<Image />` optimization with AVIF/WebP formats, responsive `sizes`, above-the-fold `priority` preloading, and client-side canvas WebP 90% ingestion compression. | **Critical** |
| NFR-10 | **Search Engine Optimization & Indexing:** Dynamic `sitemap.xml` with multilingual alternates, dynamic `robots.txt`, OpenGraph metadata, and Schema.org JSON-LD structured data for Google Knowledge Graph. | **High** |
