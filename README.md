# Abdullah.div — Advanced Digital Platform & CMS
### v2.0 "Signal & Growth" — Engineering Precision, Visibly Alive

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20Storage-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-78%20Passed-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Theme](https://img.shields.io/badge/Theme-Dark--Only%20%23050f0a-050f0a?style=flat-square)](https://github.com/Abdullah931-stack/Abdullah-div)

> ∿ A high-performance, bilingual (Arabic RTL / English LTR) digital portfolio & CMS built on **Next.js 16 (App Router)**, **React 19**, **Prisma 7**, and **Supabase**. Built around the philosophy of **"Engineering Precision, Visibly Alive"** — combining physical simulation, procedural mathematical motion, and resilient system architecture.

---

## 🧭 Core Philosophy & Identity

```
Systems · Signals · Simulation
```

The platform moves beyond traditional static portfolios and template-driven designs. Every visual element, motion timing, and architectural decision is grounded in mathematical modeling, interaction physics, and defensible system logic:

- **Evidence-Anchored Narrative:** Professional experience is communicated through shipped software and engineering decisions rather than inflated identity nouns or freelancer intake framing.
- **Zero Gratuitous Decoration:** Motion and visual shaders reflect real-world phenomena (oscilloscope persistence, orbital Kepler mechanics, wave interference, and logarithmic time compression).
- **Resilient Engineering:** Zero hydration mismatches, strict SSR context preservation (`FrozenRouter`), localized pluralization engines, and comprehensive automated test suites.

---

## ✨ Architectural Highlights & Key Features

### 1. ∿ Generative Lissajous Tri-Curve Hero Engine
- **Oscilloscope Persistence:** Real-time 2D Canvas parametric curve ($x = \sin(at + \delta), y = \sin(bt)$) simulating electronic signal beams with phosphor decay trails.
- **3-Curve Convergence:** Three layered curves at irrational phase offsets converging toward a bright central curve, visually representing multi-model AI orchestration.
- **Keplerian Orbital Dynamics:** Variable orbital velocity modeled after Kepler's second law ($speed = baseSpeed \times (1 - k(r/maxRadius))$), accelerating near periapsis.
- **Adaptive Lifecycle:** Unmounted at mobile breakpoints to eliminate CPU/battery background drain; graceful reduced-motion mode keeps steady-speed trails.

### 2. 🫧 Deterministic "Lava Lamp" Ambient Background
- **Composed Sine Waves:** Procedural ambient blobs driven by sums of 2–3 irrational-frequency sine terms evaluated as a pure function of elapsed time.
- **Hydration Safe:** 100% deterministic generation between server-render and client-hydration passes without `Math.random()` or runtime noise libraries.
- **Viewport Fluidity:** Dynamic sizing computed via `calc(Xvw + Ypx)` and decoupled position (`translateY`) vs. shape (`morph`) animation keyframes.

### 3. 🎴 Uniform Project Grid & Shared-Element Expand
- **Shared-Element Morphing:** In-place expansion powered by Framer Motion `layoutId`, transitioning clicked cards into standalone modal geometry (`z-[100]`, `max-w-6xl`, `max-h-[90vh]`).
- **Distance-Based Ripple Stagger:** Unopened cards smoothly fade and scale down ($0.97$) with ripple delays calculated from Euclidean grid distance ($\sqrt{\Delta r^2 + \Delta c^2} \times \text{unitDelay}$).
- **Single-Layer Backdrop Dimming:** GPU-accelerated opacity transition across a single backdrop layer, eliminating per-card blur re-paint overhead.

### 4. ⚡ Directional `PulseBorder` Micro-Interaction
- **Contact-Point Sweep:** Border lighting originates from the exact cursor/touch contact coordinate, sweeping outward around the perimeter via CSS conic mask gradients.
- **Static Lit State:** Settles into a stable emerald glow (`#4ade80`) without continuous looping or DOM element accumulation.
- **Controlled Scope:** Applied selectively to primary transition gateways (cards, CTAs, repo links, gallery controls, and clear actions).

### 5. ⏱️ Single-Rail Scientific Journey / Timeline
- **Logarithmic Time Spacing:** Gaps between chronological milestones are proportional to elapsed days ($gap(\Delta t) = base + k \cdot \ln(1 + \Delta t / \tau)$).
- **Uncertainty Arcs (`dateTo`):** Approximated or ranged milestones render as translucent measurement brackets rather than fabricated points.
- **Accordion Markdown Story:** Seamless in-place transition between summary and full Markdown narrative.
- **In-Place Project Transition:** Linked project buttons open project modals over the timeline with 100% scroll position retention.

### 6. 📨 Multi-Intent Smart Contact Engine
- **Contextual Intent Routing:** 4 distinct pathways: General Inquiry, Project Issue Report, Academic / Research, and Collaboration.
- **Dynamic Project Picker:** Auto-populated with published projects when reporting an issue, with custom name fallback.
- **Client-Side Draft Persistence:** `sessionStorage` draft caching with 500ms typing debounce and a rolling 10-minute TTL.
- **Explicit Reset Affordance:** `PulseBorder`-wrapped clear action guarded with `isMounted` SSR safety.

### 7. 🛡️ Enterprise Security & Rate Limiting
- **Supabase Auth SSR:** Session verification for admin routes with public registration strictly disabled.
- **PostgreSQL Row Level Security (RLS):** Granular policies across all relations.
- **Upstash Redis Rate Limiting:** Sliding-window protection (5 contact submissions/IP/hr, 3 survey responses/IP/hr).
- **Resend Mail Gateway:** Automated email notifications with non-blocking database status fallbacks.

### 8. 🌐 Resilient Bilingual i18n & Context Preservation
- **`next-intl` Dynamic Routing:** Full Arabic (RTL) and English (LTR) support via `/[locale]` routes and edge language negotiation (`proxy.ts`).
- **`FrozenRouter` Context Preservation:** Solves App Router context tearing during Framer Motion `<AnimatePresence mode="wait">` unmount transitions.
- **Path-Preserving Scroll Restoration:** Throttled 60fps RAF scroll caching across language toggles (`scroll={false}`) and page reloads.

### 9. 📝 Universal Markdown Pipeline & Pluralization Engine
- **Universal Markdown Renderer:** Secure pipeline combining `react-markdown`, `remark-gfm`, and `remark-breaks` with `JetBrains Mono` code blocks.
- **Structured Build Duration Parser:** Normalizes `{amount}:{unit}` durations into grammatical Arabic and English pluralization strings.

### 10. 🛠️ Admin CMS Dashboard
- **Projects Management:** Full CRUD with multi-image drag-and-drop to Supabase Storage, cover image assignment, tech stack tags, and repo/preview URLs.
- **Timeline Management:** Milestone authoring with date ranges, age, stories, and linked project slugs.
- **Social Links & Messages Inbox:** Dynamic platform detection, message status tracking, and survey analytics with JSON export.

---

## 🏗️ Tech Stack Matrix

| Layer | Technologies | Role / Justification |
|---|---|---|
| **Framework** | **Next.js 16.1** (App Router, Server Components) | Hybrid static/server rendering, Edge middleware, optimized routing |
| **UI & Core** | **React 19.2**, **TypeScript 5** | Strict type safety, modern concurrent rendering |
| **Styling** | **Tailwind CSS 4**, CSS Custom Properties | Dark-only emerald design tokens, glassmorphism, responsive utilities |
| **Typography** | `Space Grotesk`, `IBM Plex Sans Arabic`, `JetBrains Mono` | Geometric Latin display, legible Arabic RTL body, precision technical metadata |
| **Motion & Physics** | **Framer Motion 12**, HTML5 Canvas 2D | Shared-element `layoutId`, parametric physics simulations, CSS hardware-accelerated animations |
| **Database & ORM** | **PostgreSQL (Supabase)**, **Prisma 7.3** | Relational data integrity, `@prisma/adapter-pg`, custom client output |
| **Authentication** | **Supabase Auth SSR** (`@supabase/ssr`) | Cookie-based session validation, single-user admin guard, RLS enforcement |
| **Object Storage** | **Supabase Storage** (`uploads` bucket) | Project image hosting, automatic media cleanup on deletion |
| **Edge & Security** | **Upstash Redis**, `@upstash/ratelimit` | Serverless sliding-window API rate limiting |
| **Email Services** | **Resend 6.9** | Asynchronous email forwarding with transactional fail-safes |
| **Internationalization** | **`next-intl` 4.8** | Dual-locale dictionary routing, edge header negotiation |
| **Markdown Pipeline** | `react-markdown`, `remark-gfm`, `remark-breaks` | Safe rich-text rendering with automated line breaks and GitHub markdown extensions |
| **Testing** | **Vitest 4**, `@testing-library/react`, `jsdom` | 78 automated unit tests covering math models, components, API endpoints, and storage |

---

## 📐 Mathematical & Algorithmic Foundations

```
   1. Lissajous Parametric Trajectory:
      x(t) = A · sin(a · t + δ)
      y(t) = B · sin(b · t)

   2. Kepler-Inspired Orbital Speed:
      v(r) = v_base · [1 - k · (r / r_max)]

   3. Deterministic Sine Field Drift:
      drift(t) = Σ A_i · sin(ω_i · t + φ_i)

   4. Logarithmic Timeline Spacing:
      gap(Δt) = base + k · ln(1 + Δt_days / τ)

   5. Distance-Based Ripple Delay:
      delay(i) = √[(row_i - row_0)² + (col_i - col_0)²] · unitDelay
```

---

## 📁 Repository Structure

```
abdullah-div/
├── docs/                               # 📚 Comprehensive technical documentation
│   ├── 01-PRD.md                       # Product Requirements Document
│   ├── 02-SYSTEM-ARCHITECTURE.md       # Architecture, Data Flow, FrozenRouter & Pipeline Specs
│   ├── 03-UI-UX-SPECIFICATIONS.md      # Design System, Motion Specs & Math Models (v2.0)
│   └── 04-CHANGELOG.md                 # Architecture Decision Records & CTO Review Log
├── prisma/
│   ├── schema.prisma                   # Active Prisma schema (6 core models)
│   └── migrations/                     # SQL migration history
├── public/
│   └── favicon.ico                     # Static branding assets
├── src/
│   ├── app/
│   │   ├── [locale]/                   # 🌐 Bilingual Dynamic Routes (next-intl)
│   │   │   ├── page.tsx                # Home (Lissajous Hero + Featured Projects Grid)
│   │   │   ├── portfolio/              # Full Portfolio listing + Project details
│   │   │   ├── journey/                # Single-Rail Journey Timeline
│   │   │   ├── contact/                # Multi-Intent Smart Contact Form
│   │   │   └── layout.tsx              # Locale Layout with FrozenRouter & ScrollRestoration
│   │   ├── admin/                      # 🔐 Protected Admin CMS Dashboard
│   │   │   ├── projects/               # Project CRUD & Image Management
│   │   │   ├── timeline/               # Timeline Milestone Management
│   │   │   ├── social-links/           # Social Link Shortcuts Management
│   │   │   ├── messages/               # Contact Form Submissions Inbox
│   │   │   ├── survey/                 # Survey Questions & Metrics Analytics
│   │   │   ├── login/                  # Admin Authentication Entry
│   │   │   └── layout.tsx              # Admin Shell & Auth Guard
│   │   ├── api/
│   │   │   ├── admin/                  # Authenticated CMS API Endpoints
│   │   │   ├── auth/                   # Session & Login Endpoints
│   │   │   └── public/                 # Public Endpoints (Projects, Timeline, Messages, Survey)
│   │   ├── globals.css                 # Dark-only design tokens & global CSS utilities
│   │   └── fonts.ts                    # Google Fonts loader (Space Grotesk, IBM Plex Sans, JetBrains)
│   ├── components/
│   │   ├── hero/                       # LissajousCurve, FloatingText, HeroSection
│   │   ├── portfolio/                  # PortfolioList, ProjectDetail, ProjectLightbox
│   │   ├── journey/                    # Timeline, timelineMath
│   │   ├── contact/                    # ContactForm
│   │   ├── survey/                     # SurveyPopup
│   │   ├── admin/                      # ImageUpload, ProjectImagesManager, SkillsManager
│   │   └── shared/                     # LavaBackground, PulseBorder, MarkdownRenderer,
│   │                                   # PageTransition, ScrollRestoration, Navbar, Footer
│   ├── generated/
│   │   └── prisma/                     # Generated Prisma client artifacts
│   ├── i18n/                           # Routing configuration & navigation helpers
│   ├── lib/
│   │   ├── auth/                       # require-admin middleware & session helpers
│   │   ├── prisma.ts                   # Prisma client singleton instance
│   │   ├── rate-limit.ts               # Upstash Redis rate limiter
│   │   ├── format-build-time.ts        # Localized pluralization duration engine
│   │   ├── supabase/                   # Server, Client & Service Role Supabase clients
│   │   └── resend/                     # Email client & localized HTML templates
│   ├── messages/                       # Localized dictionaries (ar.json & en.json)
│   ├── proxy.ts                        # Edge locale detection helper
│   ├── tests/                          # Test setup & mock configurations
│   └── types/                          # Shared TypeScript interfaces & API payload schemas
├── package.json                        # Scripts & dependencies
├── vitest.config.ts                    # Vitest testing configuration
├── tsconfig.json                       # TypeScript compiler options
└── next.config.ts                      # Next.js configuration
```

---

## 🗄️ Database Schema & Entity Relations

```mermaid
erDiagram
    Project ||--o{ ProjectImage : "has many (cascade)"
    SurveyQuestion ||--o{ SurveyResponse : "receives many"

    Project {
        string id PK "cuid"
        string slug UK "Unique URI slug"
        string titleAr "title_ar"
        string titleEn "title_en"
        text summaryAr "summary_ar"
        text summaryEn "summary_en"
        text bodyAr "body_ar (Markdown)"
        text bodyEn "body_en (Markdown)"
        string previewUrl "preview_url"
        string repoUrl "repo_url"
        string[] skills "Tech stack tags"
        string buildTime "build_time {amount}:{unit}"
        int order "Display order weight"
        boolean isPublished "is_published"
        boolean isFeatured "is_featured"
        datetime createdAt "created_at"
        datetime updatedAt "updated_at"
    }

    ProjectImage {
        string id PK "cuid"
        string url "Supabase Storage URL"
        string altAr "alt_ar"
        string altEn "alt_en"
        int order "Display sequence"
        boolean isCover "is_cover"
        string projectId FK "project_id"
    }

    TimelineEntry {
        string id PK "cuid"
        datetime date "Primary milestone date"
        datetime dateTo "date_to (Optional uncertainty end)"
        string projectSlug "project_slug (Modal transition link)"
        int age "Age at milestone"
        string titleAr "title_ar"
        string titleEn "title_en"
        text summaryAr "summary_ar (Markdown)"
        text summaryEn "summary_en (Markdown)"
        text storyAr "story_ar (Markdown)"
        text storyEn "story_en (Markdown)"
        string imageUrl "image_url (Badge/icon)"
        int order "Display priority"
        datetime createdAt "created_at"
        datetime updatedAt "updated_at"
    }

    SocialLink {
        string id PK "cuid"
        string platform "Auto-detected icon platform"
        string url "Destination URL"
        string labelAr "label_ar"
        string labelEn "label_en"
        string icon "Optional custom icon key"
        int order "Sorting weight"
        boolean isActive "is_active"
        datetime createdAt "created_at"
        datetime updatedAt "updated_at"
    }

    SurveyQuestion {
        string id PK "cuid"
        string textAr "text_ar"
        string textEn "text_en"
        string type "multiple_choice | free_text"
        string[] optionsAr "options_ar"
        string[] optionsEn "options_en"
        int order "Sequence order"
        boolean isRequired "is_required"
        boolean isActive "is_active"
        datetime createdAt "created_at"
        datetime updatedAt "updated_at"
    }

    SurveyResponse {
        string id PK "cuid"
        string visitorId "visitor_id (Anonymous tracker)"
        string questionId FK "question_id"
        string answer "Choice value or free text"
        string locale "ar | en"
        datetime createdAt "created_at"
    }

    Message {
        string id PK "cuid"
        string senderName "sender_name"
        string senderEmail "sender_email"
        string reason "general | bug-report | academic | collaboration"
        string projectRef "project_ref (Associated project)"
        string budget "budget (Legacy optional)"
        text body "Message description"
        boolean isRead "is_read"
        string emailStatus "email_status (pending | sent | failed)"
        string locale "ar | en"
        datetime createdAt "created_at"
    }
```

---

## 📡 API Reference

### Public Endpoints (Rate-Limited, No Auth Required)

| Method | Endpoint | Description | Rate Limit |
|---|---|---|---|
| `GET` | `/api/public/projects` | List published portfolio projects (`?featured=true` filter) | — |
| `GET` | `/api/public/projects/:slug` | Retrieve single project details by unique slug | — |
| `GET` | `/api/public/projects-list` | Minimal project id/title catalog for issue report pickers | — |
| `GET` | `/api/public/timeline` | List chronological journey milestones | — |
| `GET` | `/api/public/social-links` | List active social navigation links | — |
| `GET` | `/api/public/survey/questions` | Retrieve active visitor survey questions | — |
| `POST` | `/api/public/survey/responses` | Submit welcome survey response payload | 3 requests / IP / hour |
| `POST` | `/api/public/messages` | Submit contact message with auto email forwarding | 5 requests / IP / hour |

### Admin Endpoints (Session Authentication Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/admin/projects` | Fetch all projects (including drafts) / Create new project |
| `PUT` / `DELETE` | `/api/admin/projects/:id` | Update project parameters / Delete project & purge media |
| `GET` / `POST` | `/api/admin/timeline` | Fetch all milestones / Create timeline milestone |
| `PUT` / `DELETE` | `/api/admin/timeline/:id` | Update milestone parameters / Delete timeline milestone |
| `GET` / `PUT` | `/api/admin/social-links` | Fetch all social links / Batch update social links |
| `GET` | `/api/admin/messages` | Fetch contact messages inbox (read/unread status) |
| `PUT` / `DELETE` | `/api/admin/messages/:id` | Mark message as read / Delete message record |
| `GET` | `/api/admin/survey` | Fetch survey metrics categorized by options |
| `GET` | `/api/admin/export` | Dump raw survey response logs as a JSON payload |
| `POST` | `/api/admin/upload` | Upload image assets directly to Supabase Storage bucket |

---

## 🚀 Getting Started & Local Development

### Prerequisites

- **Node.js** ≥ 18.18.0
- **npm** ≥ 9.0.0
- **Supabase Account** (PostgreSQL, Auth & Storage)
- **Upstash Redis Account** (Rate limiting)
- **Resend Account** (Email notifications)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Abdullah931-stack/Abdullah-div.git
cd abdullah-div
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
# ── Supabase Configuration ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── Database Connections (Prisma) ──
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# ── Upstash Redis (Rate Limiting) ──
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# ── Resend (Email Gateway) ──
RESEND_API_KEY=re_your_api_key
ADMIN_EMAIL=your-admin-email@domain.com
```

### 3. Database Initialization

```bash
# Generate the Prisma 7 client
npx prisma generate

# Apply migrations to your database
npx prisma migrate deploy
```

### 4. Supabase Storage Setup

1. Open your **Supabase Dashboard** → **Storage**.
2. Create a new bucket named **`uploads`**.
3. Toggle **"Public bucket"** to **Enabled** ✅.

### 5. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Assurance

The codebase includes an extensive automated test suite built on **Vitest** and **React Testing Library**, verifying algorithmic computations, math models, DOM interactions, draft persistence, and security layers:

```bash
# Run the complete test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Suite Coverage (78 Tests Passing across 12 Suites)

- `LissajousCurve.test.tsx` — Parametric trajectory coordinates, Kepler speed variation, canvas rendering lifecycle.
- `LavaBackground.test.tsx` — Composed sine deterministic parameters, fluid viewport calculations, CSS custom properties.
- `Timeline.test.tsx` — Single-rail layout, logarithmic time compression math, uncertainty bracket rendering (`dateTo`).
- `ProjectLightbox.test.tsx` — Lightbox image switching, keyboard navigation, thumbnail node bar indicators.
- `ContactForm.test.tsx` — Multi-intent reason routing, 500ms debounced auto-save, rolling 10-minute TTL expiration, and `clearForm` action.
- `MarkdownRenderer.test.tsx` — Safe rich-text markdown parsing, tables, soft-line break preservation, JetBrains code formatting.
- `format-build-time.test.ts` — Structured `{amount}:{unit}` parser with Arabic and English grammatical pluralization keys.
- `rate-limit.test.ts` — Upstash Redis sliding window enforcement and IP extraction.
- `resend/templates.test.ts` — Localized email notification template rendering.
- `api/admin/projects` & `types` — Admin API route guards, payload validations, and TypeScript schema contracts.

---

## 📦 Build & Production Deployment

```bash
# Verify TypeScript types and compile production bundle
npm run build

# Launch the production server
npm start
```

### Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy ✅ — Vercel Edge Network automatically provisions CDN caching, image optimization, and analytics.

---

## 📜 License & Acknowledgments

Private project. All rights reserved © **Abdullah**.
Built with precision using Next.js, Framer Motion, Prisma, Supabase, and Tailwind CSS.
