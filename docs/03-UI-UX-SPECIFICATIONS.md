# 🎨 UI/UX Design System & Motion Specifications
## Abdullah.me — v2.0 "Signal & Growth"

> **File status:** This document is a **full replacement** for both `docs/03-UI-UX-SPECIFICATIONS.md` and `docs/04-MOTION-SPEC.md`. Delete both source files and replace them with this one before beginning implementation. Visual and motion specifications are merged into a single document because, in this redesign, they are not separable: several components (the background system, the card-grid transition, the border-pulse interaction) are defined by their motion behavior as much as by their static appearance.
>
> **Status legend used throughout:** ✅ Decided & final · 🔭 Documented future upgrade path, explicitly out of v1 scope. (Database schema specifications are centrally maintained in `docs/02-SYSTEM-ARCHITECTURE.md`).

---

## 1. Design Philosophy

The v1.3 principle — **"Luxury & Serenity"** — is superseded. The new governing principle is:

> **Engineering Precision, Visibly Alive.**
> The site must feel vivid and in motion, not the static black/white minimalism of v1.3 — but every instance of color, motion, size, or timing must be traceable to a real, defensible reason (data, physics, or interaction logic). Decoration that exists only because "it looks nice" or "it's common" is not, by itself, sufficient justification.

Every design decision in this document was required to survive one test, applied repeatedly during the planning sessions that produced it:

> *"Why this, and not the plain/common alternative?"* — if the only answer is aesthetic preference, the decision was reconsidered. Where a structural choice (e.g. single-rail timeline, uniform card sizing) is *conditional* on another decision remaining true, that dependency is called out explicitly so it isn't carried forward blindly if the underlying decision ever changes.

This replaces the old "Luxury & Serenity" checklist as the filter for all future additions to the design system.

---

## 2. Color System

> [!IMPORTANT]
> The old dual dark/light theme system (§2 of v1.3) is retired. The site is **dark-only**. A light-background variant was explored in planning and explicitly rejected — see §4.6.

### 2.1 Core Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#050f0a` | Base page background |
| `--bg-radial-inner` | `#081a10` | Inner stop of the hero radial gradient wash |
| `--accent` | `#4ade80` | Primary interactive green — borders, links, pulse trailing edge |
| `--accent-bright` | `#a7f3c4` | Highlight green — active states, pulse leading edge, headline gradient stop |
| `--text` | `#eafbf1` | Primary text |
| `--muted` | `#82a898` | Secondary text, captions, eyebrow labels |
| `--card-border` | `rgba(134, 239, 172, 0.16)` | Default (non-hovered) card/container border |

### 2.2 Background Blob Palette

Six fixed gradient pairs, cycled across the generated blobs (see §4). Both colors in each pair are **brighter than `--bg`** — this is the confirmed dark-background/bright-blob relationship. An inverted "dark blob on lighter background" variant was prototyped and rejected; see §4.6.

```css
--blob-pair-1: #86efac, #22c55e;
--blob-pair-2: #4ade80, #16653b;
--blob-pair-3: #a7f3c4, #22c55e;
--blob-pair-4: #22c55e, #0f3d24;
--blob-pair-5: #86efac, #16653b;
--blob-pair-6: #4ade80, #22c55e;
```

### 2.3 Color Usage Rules

1. No pure black or pure white anywhere in the system — `--bg` and `--text` are both green-tinted.
2. `--accent` / `--accent-bright` are the **only** colors used for interactive affordances (borders, hover states, links, active indicators). Blue was considered and explicitly rejected for the `PulseBorder` hover effect (see §7) as it clashes with the green identity despite being a conventional "electric spark" color.
3. Card/container surfaces use `rgba(255,255,255,0.03–0.045)` over the dark background (glassmorphism), never a solid fill.

---

## 3. Typography

> [!IMPORTANT]
> Replaces v1.3 typography (Readex Pro / Plus Jakarta Sans) entirely.

| Role | Font | Rationale |
|---|---|---|
| **Display / Headings (Latin, numerals)** | `Space Grotesk` | Geometric, technical character — matches the systems/signals identity |
| **Arabic body & headings** | `IBM Plex Sans Arabic` | High-quality RTL rendering at all weights |
| **Technical labels** (eyebrow text, timestamps, tags, section markers) | `JetBrains Mono` | Reinforces numerical/technical precision — used narrowly, not for body copy |

### Typography Rules (retained from v1.3, still valid)

- RTL for Arabic, LTR for English, toggling with locale.
- Line height: `1.6` body / `1.2` headings.
- Load via `next/font/google` with `display: 'swap'`.

---

## 4. Background System — "Lava Lamp"

This is the site's signature ambient background, used on the Hero and (at reduced density, TBD by implementer) other full-bleed sections. It went through five prototyping iterations before the current specification was confirmed; the rejected approaches are documented in §4.6 so they are not re-proposed without re-reading the reasoning.

### 4.1 Visual Description

An ambient field of large, softly blurred, vertically-elongated organic shapes ("blobs") continuously rising from below the viewport to above it, in a dark-background / bright-blob relationship. The design target, stated explicitly during planning: **at rest, a viewer should sense motion without being able to identify individual shapes; only on deliberate focus should the shapes resolve.** This is a QA acceptance criterion, not just an aesthetic description — verify it manually before sign-off.

### 4.2 Randomness Model — Composed Sine Waves (binding default)

> [!IMPORTANT]
> This is the canonical procedural-motion algorithm for the entire site, not just this component. Any future ambient/organic motion should default to this method. See §11.1 for the full rationale.

Each blob's horizontal wobble is the sum of 2–3 sine terms at **irrational-ratio, per-blob-unique frequencies and phases**, evaluated as a pure deterministic function of elapsed time. **`Math.random()` and Simplex/Perlin noise were both evaluated and rejected** for this component:

- `Math.random()` per blob would differ between Next.js server-render and client-hydration passes → **hydration mismatch errors**. The composed-sine approach is fully deterministic (same output on server and client) with zero risk of this class of bug.
- Simplex noise is visually closer to "true" organic motion, but once the field is blurred at the radius specified below, the difference from composed sine waves is imperceptible — while Simplex noise requires an external dependency and materially heavier per-frame computation. Not justified for this use case.

### 4.3 Shape & Field Parameters (confirmed values)

| Parameter | Value | Notes |
|---|---|---|
| Blob count | 11 | |
| Width | `calc(Xvw + Ypx)` per blob, X ≈ 4–9.8, Y ≈ 30–70 | **Must be viewport-relative, not fixed px** — see §4.5 for why this matters |
| Height | width × (2.4–2.9) | Elongated vertically — "closer to a line than a bubble," per the original brief |
| Border-radius | `45% 55% 60% 40% / 60% 45% 55% 40%` | Asymmetric, organic |
| Shape "breathing" | Separate `morph` animation, own duration (`--mdur`, 8–18s), animates `border-radius` only | Must never share a keyframe timeline with position — see §11.2 |
| Field blur | `filter: blur(145px)` on the aggregate blob container | See §4.4 for a critical caveat on this value |
| Gradient fill (per blob) | `radial-gradient(ellipse at 40% 30%, c1, c2 55%, transparent 85%)` | Soft falloff |
| Field container margin | `inset: -20% -20%` | Widened from an initial `-10%` for horizontal safety on narrow viewports |

### 4.4 ⚠️ Blur Radius Caveat

> [!WARNING]
> `blur()` values much beyond ~150px risk browser-internal downsampling (the browser renders the layer at reduced internal resolution before blurring, to protect performance), which produces visible chunky pixelation instead of a smooth falloff — this was observed directly during prototyping when an outer CSS `blur()` was combined with an SVG filter's own internal blur on the same layer. **Rule: never stack two blur stages on the same visual layer.** If pixelation reappears during implementation, reduce to ~120px and compensate with softer gradient stops rather than increasing blur further.

### 4.5 Responsiveness — Must Scale With Actual Viewport

An early implementation pass used fixed-pixel widths/heights (sized for a ~1440px desktop). This was flagged as a real defect: the site must render correctly down to mobile widths, and a ~215px-wide blob is roughly half the width of a typical phone screen — disproportionate and unintended.

**Fix (binding):** width/height are computed as `calc(Xvw + Ypx)` — a real viewport-width-relative component plus a small fixed baseline. This resizes automatically via the browser's live `vw` unit resolution, with no JS resize listener required. On mobile, blobs shrink proportionally instead of retaining desktop sizing.

### 4.6 Rejected Approaches (documented for institutional memory)

| Approach | Why rejected |
|---|---|
| **Light-green background, dark blobs, crisp SVG edges, drop-shadow, per-blob linear-gradient "thickness" shading** | Visually explored in full via prototype. Rejected because (a) it inverts the entire site's light/dark contract, which would require cascading rework of every already-decided text-contrast and glassmorphism-card spec, and (b) on reflection it was not actually what was pictured — the intent was a background *slightly* lighter than the blobs while **both remain dark**, not a literal light background. |
| **SVG `goo` filter (`feGaussianBlur`+`feColorMatrix`) combined with per-blob `box-shadow` for directional lighting** | The `box-shadow` layer, when passed through the goo filter's alpha-threshold merge logic, produced visible banding/multi-layer artifacts instead of a smooth single blend — shadow and merge logic must be computed in separate passes, not composited through the same threshold filter. |
| **Metaballs / true scalar-field simulation (Canvas, per-pixel `1/distance` summation)** | Technically superior merge quality and full control over directional shadow (via a second offset field pass) — a working prototype was built and performs well (~15k grid cells × 2 passes per frame is cheap). **Not adopted for v1** because it requires a persistent `requestAnimationFrame` JS loop instead of a GPU-compositor-accelerated CSS animation, and the CSS approach already meets the "ambient, not-fully-resolved" perceptual target once blurred. 🔭 **Documented as a future upgrade path** if the CSS version ever proves visually insufficient — reference implementation available in the planning history (Canvas-based anisotropic-distance metaballs with a directional second-pass shadow field). |
| **Simplex/Perlin noise-driven motion** | See §4.2. |

### 4.7 Motion — Rise Path

- **Direction:** continuous bottom-to-top rise (`translateY`), `linear` timing, `infinite` iteration. Each blob's rise duration is independently randomized in range ~20–70s (index-derived, not `Math.random`, per §4.2) so blobs move at visibly different speeds and merge/separate rather than moving as a uniform block.
- **Off-screen spawn offset:** `bottom: calc(-1 * var(--h) - 20vh)`. This must be derived from the blob's **own** height (`var(--h)`), not a fixed percentage of the container. A fixed `-40%` offset was an earlier defect: a very tall blob's top edge could already sit inside the visible viewport at the start of its cycle, causing a visible partial "pop-in" instead of rising fully from below. Deriving the offset from the blob's own rendered height guarantees full concealment regardless of size.
- **Winding path (tilt):** each blob carries a fixed per-blob `--tilt` value (≈ ±40–130px, alternating sign by index), which the horizontal position interpolates toward progressively across the rise (`0 → tilt×0.22 → tilt×0.5 → tilt×0.78 → tilt`). The existing sine-based wobble (`--drift1` / `--drift2`) is layered **on top of** this tilt progression at the 25%/75% keyframe stops, producing a winding (S-curve) path. **The net vertical direction remains strictly upward regardless of tilt** — `translateY` is never affected by the tilt calculation.

### 4.8 ⚠️ Critical Motion Rule — Never Correlate Position and Shape

> [!WARNING]
> During implementation, adding `scaleY()` to the *same* keyframe timeline as the tilt/`translateX` path produced a distinct visual bug: viewers perceived the blob's **shape itself** as leaning/tilting, even though `translate()` and `scale()` cannot mathematically rotate or skew a shape. This is a real, reproducible perceptual effect (not a rendering bug): when position and size change **in synchronized timing**, the eye reads it as the object banking into its direction of travel — the same illusion that makes a car look like it's leaning into a turn.
>
> **Binding rule for this component and any future one built the same way:** an element's position-animation (`rise`) must animate `translateX`/`translateY` **only**. Any shape-affecting property (`scale`, `border-radius`, `skew`, `rotate`) must live in a fully separate animation with independent timing (`morph`, above), never sharing keyframe percentages with the position animation.

### 4.9 Reference Implementation

```css
.blob-field {
  position: absolute;
  inset: -20% -20%;
  filter: blur(145px);
}

.blob {
  position: absolute;
  left: var(--x);
  width: var(--w);   /* calc(Xvw + Ypx) — see §4.5 */
  height: var(--h);  /* calc(Xvw + Ypx) × elongation multiplier */
  background: radial-gradient(ellipse at 40% 30%, var(--c1), var(--c2) 55%, transparent 85%);
  border-radius: 45% 55% 60% 40% / 60% 45% 55% 40%;
  bottom: calc(-1 * var(--h) - 20vh); /* §4.7 — derived from own height, not a fixed % */
  animation:
    rise var(--dur) linear infinite,
    morph var(--mdur) ease-in-out infinite; /* independently timed — §4.8 */
  animation-delay: var(--delay), 0s;
}

/* Position ONLY — never add scale/skew/rotate here (§4.8) */
@keyframes rise {
  0%   { transform: translateY(0)      translateX(0); }
  25%  { transform: translateY(-140vh) translateX(calc(var(--tilt) * 0.22 + var(--drift1))); }
  50%  { transform: translateY(-280vh) translateX(calc(var(--tilt) * 0.5)); }
  75%  { transform: translateY(-420vh) translateX(calc(var(--tilt) * 0.78 + var(--drift2))); }
  100% { transform: translateY(-560vh) translateX(var(--tilt)); }
}

/* Shape ONLY — independently timed via --mdur */
@keyframes morph {
  0%, 100% { border-radius: 45% 55% 60% 40% / 60% 45% 55% 40%; }
  50%      { border-radius: 55% 45% 40% 60% / 45% 60% 40% 55%; }
}
```

```js
// Per-blob parameter generation — index-derived, deterministic (§4.2), NOT Math.random
for (let i = 0; i < count; i++) {
  const wVw = 4 + (i % 5) * 1.2;
  const wPx = 30 + (i * 7 % 40);
  const mult = 2.4 + (i % 3) * 0.5;
  el.style.setProperty('--w', `calc(${wVw}vw + ${wPx}px)`);
  el.style.setProperty('--h', `calc(${wVw * mult}vw + ${wPx * mult}px)`);
  el.style.setProperty('--dur', `${26 + (i * 11 % 24)}s`);
  el.style.setProperty('--mdur', `${8 + (i % 5) * 2}s`);
  el.style.setProperty('--delay', `${-(i * 3.4)}s`);
  el.style.setProperty('--tilt', `${(i % 2 === 0 ? 1 : -1) * (40 + (i * 17 % 90))}px`);
  el.style.setProperty('--drift1', `${(i % 2 === 0 ? 1 : -1) * (35 + i * 5)}px`);
  el.style.setProperty('--drift2', `${(i % 2 === 0 ? -1 : 1) * (28 + i * 4)}px`);
}
```

---

## 5. Hero Section

### 5.1 Removed From v1.3

| Element | Reason for removal |
|---|---|
| `ParallaxCharacter.tsx` — floating mascot SVG with 2.5D mouse-parallax | Identified as a generic, widely-templated "hire-me freelancer" pattern; does not match the target identity or the (unstated) EECS-leaning professional direction |
| 🚀 emoji badge, "Available for new projects" copy | Freelancer-marketplace tone; wrong register for a university-admissions-facing portfolio |
| Indigo (`indigo-500`) spotlight blur | Leftover from the v1.3 palette; conflicts with the new green system |

The entire old §2 (2.5D Parallax three-layer system) of `04-MOTION-SPEC.md` is retired along with the character asset it animated.

### 5.2 New Visual Anchor — Lissajous Curve

Replaces the character. A Lissajous curve is a parametric curve `x = sin(a·t + δ)`, `y = sin(b·t)` — the classic oscilloscope/signal-comparison image.

**Rationale (this element carries real semantic weight, not just decoration):**
1. Directly evokes signal/oscilloscope imagery — the canonical image of an EECS lab, without naming the field.
2. Structurally resembles the interference patterns from the double-slit quantum simulation project — a genuine link to existing work, not an arbitrary shape choice.
3. Reuses the **same composed-sine-wave mathematics** as the background system (§4.2), unifying the hero and the background under one generative language instead of two unrelated effects that happen to coexist.

**P0 treatment (do this first):** render **three** layered curves at different phase offsets, converging toward one bright central curve, rather than a single curve. This is a literal visual metaphor for *orchestration* — multiple sources converging into one coherent output — directly mirroring the actual multi-model workflow (Claude + multiple Gemini instances + an executor) used to build the flagship projects. This is the single highest-priority visual decision in the hero and should not be simplified to a lone curve without revisiting this rationale.

**No mouse interaction.** The shape is fixed geometry — no property of it responds to cursor position or movement. This was reconsidered from an earlier draft that had mouse movement slowly perturb the frequency ratio `a/b`; that directly conflicted with the "precomputed, fixed track" mechanic in §5.2.1 once that was locked in, so it's removed rather than left as a contradiction. The curve's only "interaction" with the viewer is being looked at.

#### 5.2.1 Motion Mechanic — Precomputed Invisible Track, Orbiting Points (revised)

> [!IMPORTANT]
> **Revision note:** the first implementation animated the curve's *geometry itself* — distorting the phase offset frame-by-frame (`effectivePhaseOffset`). This produced an unstable shape that self-intersected at sharp, unpredictable angles as it deformed, which read as visually chaotic rather than precise. The mechanic below **replaces** that approach.

- **The curve is computed once, from a fixed equation, and never redrawn as a visible line.** `a` and `b` are fixed constants per curve, set once and never recomputed at runtime (no mouse interaction — see §5.2, corrected above). The curve's role is purely as a **track**: a precomputed sequence of `(x, y)` coordinates that the glowing points and their trails move along. It is not itself drawn, has no independent visual presence, and does not fade in or out — it is geometry data, not a rendered element. This corrects the earlier version of this section, which specified a faint-but-always-visible static line; on reflection that line has no equivalent in the real oscilloscope reference (a real scope never shows an idle outline of the full figure, only the beam's own persistence trail) and is removed.
- **One glowing point per curve (three total)** travels along its curve's fixed track, at an angular speed that varies with distance from the drawing area's center — faster near the center, slower near the periphery:
  ```
  speed = baseSpeed × (1 − k × (r / maxRadius))
  ```
  where `r` is the point's current distance from center. This isn't an arbitrary easing curve — it mirrors the real physical behavior of an orbiting body moving faster at periapsis than at apoapsis (the same qualitative behavior described by Kepler's second law), which fits the "precise simulation of physical phenomena" language already used in the Hero copy (§5.3).
- **Fading trail per point, length tied to speed — not a fixed constant.** Each point keeps a history of its previous positions, rendered with opacity fading from fully opaque at the head to fully transparent at the tail, reproducing the phosphor-persistence trail of a real oscilloscope beam. Because there is no static line to fall back on (per the point above), **the trail is the only thing that makes the curve's shape legible at all** — so its length cannot be a fixed number of samples (the original "~20–25 positions"). It must be long enough, relative to the point's current angular speed, that the accumulated trail visually covers most of the track's circumference before its oldest end fades out — otherwise the figure reads as a few disconnected dots rather than a recognizable Lissajous shape. Concretely: trail duration (in time, not sample count) should stay roughly constant relative to the curve's period, so trail length in samples scales with speed automatically.
- **Expected, not a bug:** on first load, the trail hasn't accumulated yet, so the figure is nearly invisible for a fraction of a second before filling in. No special handling is needed for this — it is the natural consequence of there being no static fallback line, and should not be "fixed" by re-introducing one.

#### 5.2.2 Placement — Confirmed: Lateral, Opposite the Text

> [!IMPORTANT]
> **Resolved** — this was previously an open gap (an earlier draft of this section flagged the first implementation's centered-overlay layout as unconfirmed). It is now decided:

The Hero is no longer a single centered text column with the curve overlaid behind it. It becomes a **two-column layout**: text on one side, the Lissajous curve occupying its own column on the other side — never overlapping. Column assignment follows reading direction and mirrors between locales:

| Locale | Text column | Curve column |
|---|---|---|
| English (LTR) | Left | Right |
| Arabic (RTL) | Right | Left |

This is a locale-driven layout swap, not a fixed left/right assignment — the two columns exchange sides automatically based on `locale`/text direction, the same pattern already used elsewhere in the app for RTL/LTR handling. This fully resolves the legibility problem from the first implementation (§5.2 photos showed curve lines crossing directly through words) by construction: the two elements no longer share the same screen region at all, rather than relying on opacity or z-index tuning to make an overlap tolerable.

#### 5.2.3 Responsive Visibility — Phone Only, Not Tablet

The component is **not rendered at all** below the tablet breakpoint (`md`, ~768px and up remains visible; below it, on phone-sized viewports, it is removed) — not merely hidden via CSS. As established in §11.5, an invisible-but-mounted canvas still runs its animation loop in the background, burning battery/CPU for zero visual benefit; the fix is to skip mounting the component entirely below the breakpoint (a width check gating the `<LissajousCurve />` call in `HeroSection.tsx`), not to hide it with `display: none`.

Below this breakpoint, the two-column layout from §5.2.2 also collapses back to a single centered text column (no curve column to lay out) — the responsive behavior and the placement decision are consistent with each other by construction.

This was a deliberate trade-off, not an oversight: on very small screens the curve competes for the same limited vertical space as the name/bio/CTAs, and previous attempts to shrink it proportionally still couldn't find it a stable home there. Tablets and larger keep the full two-column effect.

#### 5.2.4 Reduced-Motion Behavior — Calm, Not Hidden

> [!WARNING]
> **Corrects a real implementation bug**, not a new preference: an earlier CSS rule applied `display: none !important` to `.lissajous-canvas` under `prefers-reduced-motion: reduce`, which fully defeated the graceful-degradation logic already written into the component's own draw loop (a single static curve, no orbiting points). The CSS override ran first and hid the element before that logic ever mattered. **This is now corrected: `prefers-reduced-motion` must never fully remove the Lissajous curve.**

Binding behavior under `prefers-reduced-motion: reduce`:
- The points keep moving — at a slow, constant angular speed (no Kepler-style speed variation) — rather than freezing in place, since a frozen single point with no trail would show nothing recognizable at all (per §5.2.1, the trail is what makes the curve's shape legible in the first place; there is no static fallback line to lean on here).
- The fading trail is **kept, not dropped** — its length still follows the same speed-proportional rule from §5.2.1 (now easy to satisfy, since the calmed speed is slow and constant). This is the minimum needed for the shape to actually read as a Lissajous curve rather than a bare moving dot.
- This applies specifically to the Lissajous curve and **supersedes** the more general "disable to essential fades" wording in §11.5, which was written before this component's own reduced-motion behavior was worked out in detail.

### 5.3 Copy Strategy — No Identity Nouns

> [!IMPORTANT]
> **Binding content rule, not just for the Hero:** never state a professional identity/title noun — not "Software Engineer" (inaccurate to the goal), not "EECS student" (an unrealized goal, not a current fact), not "AI Systems Orchestrator" (accurate but a label the subject does not want to be reduced to). **Describe verified actions backed by shipped projects instead of claiming a title.** A verb-based, evidence-anchored sentence needs no one to authorize it; a title-claim does.

Structure:
- **Eyebrow line** (small, `JetBrains Mono`): neutral vocabulary shared by both target domains — e.g. `Systems · Signals · Simulation`. "Signals" reads as EECS; "Systems" and "Simulation" read as AI/software; naming neither field directly.
- **Primary sentence** (verb-based, not noun-based): structural template —
  > *"Turns complex ideas into working systems — through AI model orchestration and precise simulation of physical phenomena."*
  >
  > *(Example only — exact final Arabic/English copy is pending sign-off; this shows the required structure: verb + evidence, never a title.)*

### 5.4 Extended "Signal & Node" Motif (site-wide, priority-ordered)

The Lissajous curve alone is a one-time impression on page load; to make the visual hint as persistent as the verbal one, the same visual language recurs at lower intensity elsewhere:

| Priority | Element | Description |
|---|---|---|
| **P0** | Converging tri-curve hero (§5.2) | Carries the "orchestration" meaning directly — do not defer |
| **P1** | Faint node/line texture | Small connected dots + hairline connections (3–5% opacity) behind section headers only, **not** full-page — deliberately ambiguous between "circuit diagram" and "neural-net graph" readings |
| **P2** | `PulseBorder` micro-interaction | See §7 — directional-reveal-then-static hover treatment, repeated as a tactile signature across the site |
| **P2** | Mono-font symbol markers (`Σ`, `Δ`, `∿`) | Only where a section genuinely needs a small identifying mark — **not** a mandated replacement for numbered dividers everywhere; numeric `01/02/03` remains fine for genuinely sequential content |

---

## 6. Project Card Grid (replaces "Card Shuffle")

### 6.1 Removed From v1.3

The stacked **Card Shuffle** pattern (`CardShuffle.tsx`, Framer Motion `AnimatePresence` stack, 5s auto-play, manual prev/next) is fully removed. All of old §3 in `04-MOTION-SPEC.md` (the Card Shuffle technical parameters and the CTO execution warnings about `zIndex` clipping) is retired along with it.

### 6.2 Layout — Uniform Grid

All project cards render at **identical size** in a clean grid. This was an explicit, deliberated choice against two alternatives:

| Considered | Verdict | Reason |
|---|---|---|
| Asymmetric Bento grid (sized by `Project.isFeatured`) | ❌ Rejected | Introduces visual variance without the "precision & luxury" feel the owner wants; uniformity itself is the intended signal, following the same "no unjustified variance" principle applied throughout this document |
| Horizontal scroll gallery | ❌ Rejected | Weaker scannability for a reviewer skimming quickly; also a redundant interaction pattern already used elsewhere (image galleries) |
| Interactive list + live preview | Evaluated in a comparison prototype, not selected for the primary grid | Uniform grid + in-place expand was preferred |

### 6.3 Open Interaction — Shared-Element Expand (not route navigation)

Clicking a card does **not** navigate to a new route. The clicked card expands **in its own grid position** into a full detail panel via Framer Motion `layoutId` shared-element transition.

**Behavior of the other (non-clicked) cards, fully specified:**

| Aspect | Decision |
|---|---|
| Lateral displacement / reflow | ❌ Explicitly rejected — considered and declined twice during planning |
| Exit off-screen in each card's own direction | ❌ Explicitly rejected — multiple simultaneous exit vectors read as visually undisciplined; would also require extra per-position conditional logic for no benefit |
| **Fade in place** (`opacity` + `scale(0.97)`) | ✅ Confirmed final |
| Ripple stagger direction | ✅ **Distance-based**, nearest-to-farthest from the opened card (not simple index order) |
| Dimming of the grid behind the open card | Single shared overlay (`opacity` transition only) — **not** per-card `blur()` |

**Ripple stagger — reused geometry, not a new computation.** Using the grid's existing `row`/`col` coordinates:

```
distance(i) = √((row_i − row_selected)² + (col_i − col_selected)²)
delay(i) = distance(i) × unitDelay      // unitDelay ≈ 50–70ms
```

Computed once, on click, over ≤ ~15 cards — negligible cost regardless of the extra realism it buys.

**Why a single shared overlay, not per-card blur:** `filter: blur()` recalculated per element every frame is expensive on the GPU; animating it across 5–15 cards simultaneously risks visible jank. A single overlay animating only `opacity` achieves the same focal effect at effectively zero cost, since `opacity`/`transform` are the two properties browsers can composite without triggering repaint.

### 6.4 Standalone Responsive Closed Rectangle Modal Geometry & Layering

When a project card expands into detail view (`PortfolioList.tsx` or in-place modal overlay in `Timeline.tsx`), the container geometry is strictly bounded to form a standalone floating rectangle:

| Parameter | Specification | Purpose |
|---|---|---|
| **Layering (`z-index`)** | `z-[100]` | Overlays fixed top navbar (`z-50`), ensuring backdrop blur (`rgba(5,15,10,0.88)`, `backdrop-blur-md`) covers 100% of viewport |
| **Horizontal Width** | Fully fluid responsive `w-full max-w-[92vw] xl:max-w-6xl` | Scales dynamically & fluidly across all screen sizes without fixed pixel restrictions |
| **Vertical Limit** | Relative `max-h-[90vh]` | Bounds the card vertically relative to viewport height, leaving a 5vh margin above and below |
| **Viewport Centering** | `my-auto`, `flex items-center justify-center` | Centers the rectangle vertically and horizontally in the viewport so it never touches or attaches to viewport edges |
| **Outer Padding** | Responsive `p-3 sm:p-5 md:p-8` | Guarantees clear 360° spacing around the floating card on all device sizes |
| **Top Safe Padding** | `pt-10 sm:pt-6` (inside `ProjectDetail.tsx`) | Ensures close button `✕` and `<h1>` title have ample breathing room with zero top clipping |

---

## 7. `PulseBorder` — Shared Micro-Interaction

> [!IMPORTANT]
> **Revision note (v2.0 → this section only):** the original specification for this component (a repeating pulse traveling continuously around the border, count scaling logarithmically with contact duration) was reconsidered after reviewing a reference video and is **replaced** by the simpler mechanic below. The repeating-pulse version is kept in §7.4 as a rejected alternative, for the same reason other rejected approaches are documented elsewhere in this file — so it isn't re-proposed without re-reading why it was dropped.

A reusable component: on contact (mouse or touch) with an element's border, the border becomes lit. It is a **binary state (lit / not lit) with a smooth transition**, not a continuous or repeating animation.

### 7.1 Scope — Where It Applies

> [!IMPORTANT]
> Applying this everywhere would dilute it from a signature interaction into background noise — directly against the precision/luxury mandate. Scope is deliberately narrow.

| Element | Applies? |
|---|---|
| Project cards | ✅ |
| Primary CTA buttons (Contact, View Work) | ✅ |
| Per-project GitHub / live-preview buttons | ✅ |
| Gallery navigation arrows (§8.2) | ✅ |
| Clear form button (§9.6) | ✅ |
| Navbar links | ❌ |
| Skill tags | ❌ |
| Contact form fields | ❌ |
| Journey/Timeline entries | ❌ — see §12.6, structural reason, not an oversight |

### 7.2 Behavior — Directional Reveal, Then Static

1. **On contact (`pointerenter`):** the border does **not** appear uniformly all at once. It reveals in two directions simultaneously, originating from the point of contact and sweeping outward around the perimeter until the full border is lit — a single one-shot transition, roughly 250–400ms, not a loop.
2. **While hovered:** the border stays fully lit, static — no travel, no repetition, no per-frame cost.
3. **On release (`pointerleave`):** a plain `opacity` fade-out, no directional component needed on exit.

This keeps the reference video's core property — **a stable lit state with no continuous animation** — while still tying the entry transition back to the site's "signal propagating from a point of contact" language (§5.4), without reintroducing a repeating/looping effect.

### 7.3 Technical Implementation

- **Reveal direction:** implemented as a `mask-image` (conic or radial gradient, angled per contact point) over a **static**, always-fully-lit border layer — animating only the mask's `--progress` custom property from 0 to 1 on entry. No SVG `offset-path` pulse geometry, no repeating keyframe animation, no per-instance DOM node creation.
- **Steady-state cost:** a lit border is one static `border-color` / `box-shadow` — the cheapest possible representation, active only while `:hover`/`:focus-visible` is true.
- **Color:** `--accent-bright` at the leading edge of the reveal sweep, settling to `--accent` once fully lit. **Not blue** — considered and explicitly rejected earlier as clashing with the green system despite being the conventional "electric" color.
- **No cleanup logic required:** unlike the rejected §7.4 version, there are no dynamically-created pulse elements and therefore no `animationend`-triggered DOM removal to implement — the entry/exit transition runs entirely on CSS custom properties over one static element.

### 7.4 Rejected: Repeating Pulse (original v2.0 design)

| Aspect | Original design | Why reconsidered |
|---|---|---|
| Mechanic | Discrete pulses traveling continuously around the border via `offset-path`, re-triggered while hovered | A reference video of the intended effect showed a much simpler binary lit/unlit state with no travel at all — the repeating pulse was solving a problem (visual busyness, DOM accumulation) that a static state doesn't have in the first place |
| Pulse count | `n(t) = n₀ + ⌊log₂(t/t₀)⌋`, capped at `n_max = 6` | No longer needed — nothing repeats, so there is nothing to count or cap |
| Real-world cost flagged during review | Hovering quickly across a grid of 10–15 cards during normal browsing would fire pulses on every card in rapid succession, reading as a field of flickering flashes — directly against the precision/luxury mandate this whole document is built around |

### 7.5 Primary Action Button Theme & Glass Contrast

To ensure `PulseBorder`'s sweeping directional border reveal is visually distinct on clickable primary action buttons (e.g. Project Transition Button in Journey, Preview/Repo buttons in Project Detail):

- **Element Component:** `PulseBorder as="button"` wrapper.
- **Button Face Background:** Dark emerald glass contrast `background: rgba(74, 222, 128, 0.08)` with a subtle static border `1px solid rgba(74, 222, 128, 0.2)`.
- **Text & Icon Styling:** Vivid `--color-accent-bright` (`#4ade80`) text and SVG icon (`var(--font-jetbrains-mono)`).
- **Contrast Rationale:** Avoids solid green button fills (`var(--color-accent)`) which obscure the green `PulseBorder` sweep. The dark emerald glass fill creates sharp contrast, making the sweeping conic-gradient border reveal immediately visible on hover.

---

## 8. Project Detail Page

### 8.1 Body Content Template

`Project.bodyAr` / `Project.bodyEn` remain single freeform rich-text fields (no schema change here) — but must **never** contain a pasted README. A README targets a developer setting up the repo locally; a portfolio reader (recruiter, admissions reviewer) needs to evaluate engineering judgment in under a minute, and installation steps serve neither.

**Binding internal template, applied uniformly to every project via Markdown headings within the field:**

1. **Problem / Motivation** (2–3 sentences) — the real challenge that prompted the project. Framed as *"I was facing X, so I decided Y,"* not *"I built X."*
2. **The Pivotal Engineering Decision** (one paragraph) — the specific technical choice worth defending (e.g., adopting a more complex simulation method over a simpler alternative, and why). This is the actual differentiator — it demonstrates reasoning, not just output.
3. **Measurable Outcome** (one line) — a concrete number if available (test coverage, build duration, review-cycle count).
4. **Tech stack** — already covered by the separate `skills[]` field; do not repeat it in body text.

### 8.2 Image Gallery — Visual Redesign

> No schema change needed — `Project.images: ProjectImage[]` (with `order`) already supports multi-image browsing; this section only redesigns presentation.

| Current (v1.3) | New |
|---|---|
| Plain black (`bg-black/50`) circular arrow buttons | `PulseBorder`-enabled arrow buttons (§7) — reuses the shared component rather than a bespoke hover style |
| Numeric counter (`2/5`) | Row of small connected node-indicators below the main image (dots joined by a thin line, echoing the §5.4 node/line motif); the active node pulses gently in `--accent-bright` |
| Neutral/black lightbox scrim | Dark-green-tinted scrim, e.g. `rgba(5, 15, 10, 0.92)`, consistent with the palette instead of a generic neutral black |

### 8.3 Repository Link

A second button, visually distinct from the existing live-preview button, is added for the project's source repository (`repoUrl`). Both buttons render conditionally on their respective field being present (no broken/empty-state buttons). Database schema details are specified in `docs/02-SYSTEM-ARCHITECTURE.md §5`.

---

## 9. Contact Page

### 9.1 Framing — General Contact, Not Freelance Intake

> [!IMPORTANT]
> The current implementation (`ContactForm.tsx`) frames the entire section as freelance client intake: heading *"Let's build something amazing,"* submit button *"Start Project 🚀,"* a required `serviceType` field (`MVP | SaaS | AI Integration`), and a required `budget` field (pricing tiers). This predates the redesign and contradicts the no-freelance-tone rule already established for the Hero (§5.3) — this section brings Contact into the same rule.

- Heading and submit-button copy are rewritten to a neutral "get in touch" register — no emoji, no "Project" language, no urgency framing.
- The `budget` field is **removed entirely** — pricing tiers have no place once the page is no longer framed as a freelance-intake form.

### 9.2 Contact Reason — Replaces `serviceType`

The single `serviceType` dropdown (freelance service categories) is replaced by a **contact-reason** selector with four options, deliberately reordered so collaboration/hiring is one option among equals rather than the only path through the form:

1. **General inquiry** — the default, most neutral option
2. **Report an issue in a project** — new; see §9.3
3. **Academic / research inquiry** — reflects the site's actual audience better than a purely commercial framing
4. **Collaboration or hiring opportunity** — retained, but demoted from sole default to one of four equal options

### 9.3 Project Issue Report — Conditional Field

When **"Report an issue in a project"** is selected, a project picker appears:

- Populated with the titles of every published project (`Project.isPublished`), pulled from the Portfolio section — the same list a visitor would see browsing `/portfolio`.
- The final entry in the list is **"Other (not listed)"** — selecting it reveals a plain text input so the sender can type a project name themselves, covering cases where what they mean isn't in the list for any reason (an unpublished/older project, a misremembered name, etc.).
- The existing `body` textarea continues to serve as the issue description — no separate "reason" text field is needed; the reason picker plus the project picker plus the existing message body together cover the report completely.

### 9.4 Visual Treatment — Bring Into the Current System

This section was not touched by the rest of the redesign and still uses the pre-redesign palette (`zinc-900` surfaces, a solid white submit button) rather than the green system defined in §2. While this section is being reworked anyway, its surfaces and submit button are brought in line with the rest of the site:

| Element | Current | New |
|---|---|---|
| Form container | `bg-zinc-900/50`, `border-white/10` | `--card-border` / glass surface tokens from §2.1 |
| Input fields | `bg-white/5`, `border-white/10` | Same glass tokens, consistent with cards elsewhere |
| Submit button | Solid white, black text | `--accent` fill or outline, `PulseBorder`-enabled (already listed as in-scope for "primary CTA buttons" in §7.1 — no new exception needed) |

### 9.5 Debounced Form Input Persistence & Rolling 10-Minute TTL

Client-side draft persistence is implemented in [`ContactForm.tsx`](../src/components/contact/ContactForm.tsx) using `sessionStorage` under the key `contact_form_draft`:

- **Synchronous Lazy Initializer:** Initial `formData` state is read synchronously from `sessionStorage` via `useState(() => ...)` on initial client mount, preventing mount race conditions.
- **500ms Debounced Auto-Save:** Draft saves to `sessionStorage` only after a **500ms typing idle pause**, avoiding unnecessary storage writes during active typing while preserving CPU performance.
- **Rolling 10-Minute TTL (Calculated from Last Edit):** Storage payload stores `{ timestamp: Date.now(), data: formData }`. Every debounced save updates `timestamp` with `Date.now()`. If `Date.now() - timestamp > 10 * 60 * 1000` (10 minutes of typing inactivity), the draft automatically expires and is discarded.
- **Locale Switch & Navigation Stability:** Draft input is preserved 100% reliably across in-app locale switches (`AR` ↔ `EN`) and page refreshes.
- **Post-Submission Cleanup:** Upon successful message POST (`/api/public/messages`), the draft is automatically removed from `sessionStorage`.

### 9.6 Explicit Clear Form Button & `PulseBorder` Micro-Interaction

- **Explicit Reset Affordance:** When draft text exists (`isDirty` evaluates to `true`), an interactive **"Clear form / تفريغ النموذج"** button is revealed.
- **Localized Key Binding:** Copy is externalized to [`src/messages/ar.json`](../src/messages/ar.json) and [`src/messages/en.json`](../src/messages/en.json) under `"clearForm"` (no hardcoded literal strings in component code).
- **Design System Parity:** The button is wrapped in [`PulseBorder`](../src/components/shared/PulseBorder.tsx) (`as="button"`, `borderRadius="0.5rem"`), inheriting the directional reveal sweep (§7.2) and `--color-accent` hover glow, maintaining visual parity with primary CTAs (§7.1).

### 9.7 Hydration Mismatch Safety (`isMounted` Guard Pattern)

- **SSR/Client DOM Parity:** Component manages an `isMounted` state initialized to `false` and set to `true` inside `useEffect` on mount.
- **Guarded Render:** Button rendering is guarded with `{isMounted && isDirty && <PulseBorder ... />}` so Server-rendered HTML matches initial Client Hydration DOM 100%, completely eliminating Next.js SSR hydration errors.

---

## 10. Admin Dashboard

> This page is **not public-facing** (Supabase-authenticated, single-user CMS). Accordingly this section is kept brief rather than reasoned through field-by-field — visual polish here is not worth the same level of scrutiny as the public-facing pages.

### 10.1 Theme Application — Deliberately Restrained

The v1.3 spec already classified Admin as **Tier 1 / 🟢 Low** animation density ("functionality first"), and that classification is kept. Applying the full public-site system (lava-lamp background, Lissajous curves, card-grid ripple/dissolve, directional-reveal `PulseBorder`) here would be actively counterproductive — a CMS is a tool used repeatedly by one person to get data entry done quickly, not a first-impression surface. Motion and visual richness cost attention; on a data-entry screen that attention should go to the form fields, not the chrome around them.

**What carries over from the new system:**

| Element | Applied? | Notes |
|---|---|---|
| Color tokens (`--bg`, `--text`, `--muted`, `--accent`, `--accent-bright`, `--card-border`) | ✅ | Same palette as the public site — this is what makes it feel like *the same product* rather than a bolted-on separate tool |
| Typography (`Space Grotesk` / `IBM Plex Sans Arabic` / `JetBrains Mono`) | ✅ | `JetBrains Mono` is a good fit for form labels and structured data (dates, IDs) here specifically |
| Card/surface tokens (glassmorphism `rgba(255,255,255,0.03–0.045)` panels, `--card-border`) | ✅ | Static only — no hover glow needed on non-interactive containers |
| Lava-lamp background (§4) | ❌ | Would compete with dense forms/tables for attention; a flat `--bg` is correct here |
| `PulseBorder` (§7) | Buttons only, not full scope | See §10.2 |
| Card-grid ripple/dissolve (§6) | ❌ | Not applicable — the admin panel is tables and forms, not a project gallery |
| Lissajous hero (§5.2) | ❌ | No hero section in the admin panel |

### 10.2 `PulseBorder` in Admin — Narrower Than §7.1's Public Scope

Applies only to primary action buttons (**Save**, **Publish**, **Delete confirmation**) — not to table rows, not to every input field. Rationale: §7.1 already restricts this effect to "genuine transition gateways" on the public site; in an admin context, the equivalent is a committed action, not a hover-browsable item. Table rows and form fields do not qualify.

### 10.3 New Field Descriptions

Two fields are implemented in admin forms as a direct consequence of decisions made elsewhere in this document (with data models specified in `docs/02-SYSTEM-ARCHITECTURE.md §5`):

#### `Project` — Repository URL

| Property | Value |
|---|---|
| Label (EN) | `Repository URL` |
| Label (AR) | `رابط المستودع` |
| Field type | Single-line URL input, same styling as the existing `previewUrl` input directly above/below it in the form |
| Placement | Immediately adjacent to the existing **Preview URL** field — they are conceptually paired (live demo vs. source code) and should read as a pair, not be separated by unrelated fields |
| Validation | Optional field. If filled, must be a well-formed URL (same client-side check already used for `previewUrl`) |
| Helper text | *"Optional — shown as a second button on the project's public page alongside the live preview, if provided."* |
| Empty-state behavior | No placeholder/dummy link — an empty field simply means the public-facing GitHub button (§8.3) does not render for that project |

#### `TimelineEntry` — Date Range End (uncertainty support)

| Property | Value |
|---|---|
| Label (EN) | `End of Date Range (optional)` |
| Label (AR) | `نهاية النطاق الزمني (اختياري)` |
| Field type | Same date picker component as the existing required `date` field, but optional |
| Placement | Directly below the existing **Date** field, visually grouped with it (e.g. a bracketed/indented sub-field) so the relationship ("this is a range, not two unrelated dates") is clear at a glance |
| Behavior | Left empty → entry renders on the public Journey page as a precise point (current behavior, unchanged). Filled → entry renders as an uncertainty bracket/arc spanning both dates (§12.5) |
| Validation | If filled, must be chronologically after the primary `date` field; surface a simple inline error otherwise — no need for anything more elaborate than the validation style already used elsewhere in these forms |
| Helper text | *"Leave empty if you know the exact date. Fill in only if this milestone happened sometime between the two dates."* |

### 10.4 Explicitly Not Addressed Here

Per the framing at the top of this section, the following are left to the implementer's judgment and are not specified further: exact spacing/grid of the existing panels (Projects, Timeline, Social Links, Messages), table pagination behavior, and any admin-only convenience features not already present in v1.3.

---

## 11. Global Motion Rules

*(Consolidates and supersedes the general rules formerly spread across `04-MOTION-SPEC.md` §7–8.)*

### 11.1 Canonical Randomness — Composed Sine Waves

Binding default for any future ambient/organic motion on the site (not only the background), for two concrete reasons:

1. **Next.js SSR/hydration safety.** `Math.random()` evaluated once on the server and again on the client produces different values → React hydration-mismatch errors. A pure function of elapsed time is identical on both.
2. **No dependency, negligible runtime cost**, versus Simplex/Perlin noise — visually indistinguishable once any meaningful blur or scale is applied.

Any future component that wants "true" noise-based motion instead must justify the added dependency and runtime cost explicitly — same bar applied to every decision in this document.

### 11.2 Never Correlate Position and Shape Timing

Documented in detail in §4.8 for the background component, but stated here as a **general rule for all future components**: an element's position/path animation must only ever touch `translate*`. Any shape-affecting transform (`scale`, `skew`, `rotate`, `border-radius`) must run on an independently-timed animation. Synchronized timing between the two reads visually as the object tilting/leaning, even with mathematically pure translation values — a real, reproducible perceptual effect, not merely a style preference.

### 11.3 Responsive Sizing Must Derive From Real Viewport Units

Documented in detail in §4.5, generalized here: any generated/animated element's dimensions and off-screen spawn offsets must be computed from real `vw`/`vh`-relative values (or the element's own runtime size via `calc(var(--x) ...)`), never fixed desktop-oriented `px` assumptions — required for correctness down to mobile widths, since the site is fully responsive.

### 11.4 Blur Layering Caveat

Documented in detail in §4.4: never stack two `blur()` filter stages (e.g., an SVG filter's internal blur plus an outer CSS `blur()`) on the same visual layer — causes browser-internal downsampling artifacts at high radii.

### 11.5 Don't Mount Animation Loops for Breakpoint-Hidden Components

A component driven by a persistent loop (`requestAnimationFrame`, or any `setInterval`-style ticker) must not be rendered-but-CSS-hidden below the breakpoint where it's not shown — the loop keeps running invisibly, spending battery/CPU for zero visual benefit. Gate the component out of the render tree entirely (a width check before the component call, not a `display: none` wrapper) below its intended breakpoint. First applied in §5.2.3 (Lissajous curve, phone-only removal); binding for any future component built the same way.

### 11.6 Retained From v1.3 (unchanged)

| Rule | Detail |
|---|---|
| GPU-safe properties | Prefer `transform`/`opacity`; avoid properties that trigger layout reflow |
| `prefers-reduced-motion` | Disable/simplify Tier-3 cinematic motion (background blobs, card ripple/dissolve) to essential fades only. `PulseBorder`'s directional reveal (§7.2) should also collapse to a plain opacity fade under this setting, since the sweep itself is a motion effect even though the steady-state border is static. **The Lissajous curve is the one exception to "disable to fades"** — it has its own specific calmed (not hidden) reduced-motion behavior, see §5.2.4 |
| Frame rate target | 60fps across device resolutions |
| Lazy-load Framer Motion | Dynamic import to protect first-contentful-paint |
| Page transitions | Fade, 300–500ms, `ease-in-out` |

### 11.7 Privacy-First Edge Analytics & Speed Insights Integration

Legacy visitor survey popups have been retired in favor of high-performance, cookieless, GDPR-compliant edge analytics via `@vercel/analytics/next` and real-world Core Web Vitals profiling via `@vercel/speed-insights/next` embedded directly into [`layout.tsx`](../src/app/[locale]/layout.tsx), providing real-time Web Vitals, user experience scoring, and visitor traffic intelligence with zero database write load or runtime interruption.

### 11.8 Path-Preserving i18n Routing & Scroll Restoration Architecture

- **Navigation Helper:** Router navigation uses `createNavigation(routing)` in [`src/i18n/routing.ts`](../src/i18n/routing.ts).
- **Route Preservation:** Both [`Navbar.tsx`](../src/components/shared/Navbar.tsx) and [`FooterClient.tsx`](../src/components/shared/FooterClient.tsx) extract current pathname via `usePathname()` and generate target locale links (`locale={otherLocale}`), preserving the exact active sub-path (e.g. `/ar/portfolio/my-project` ↔ `/en/portfolio/my-project`).
- **Scroll Prop Override:** Language switcher `<Link>` elements specify `scroll={false}` in [`Navbar.tsx`](../src/components/shared/Navbar.tsx) and [`FooterClient.tsx`](../src/components/shared/FooterClient.tsx) to override Next.js Router's default scroll-to-top (`y = 0`) jump behavior on locale toggle.
- **Global Scroll Restoration Component:** Dedicated client component [`ScrollRestoration.tsx`](../src/components/shared/ScrollRestoration.tsx) integrated into the root layout [`layout.tsx`](../src/app/[locale]/layout.tsx):
  - Sets `window.history.scrollRestoration = 'manual'` to prevent erratic browser default jumps.
  - Listens to scroll events (throttled via `requestAnimationFrame` for 60fps performance) and persists `window.scrollY` in `sessionStorage` under `scroll_pos_${pathname}`.
  - On page reload (`Reload`) or locale switch (AR ↔ EN), restores exact scroll coordinates (`window.scrollTo({ top: savedY, behavior: 'instant' })`) immediately after DOM layout paint.
- **Performance & SEO Rationale:** Eliminates unintended redirection to homepage `/ar` or `/en` and scroll jumps on language switch, ensuring pure soft navigation without full page reloads, main-thread rendering lag, or SEO indexability loss.

---

## 12. Journey / Timeline

### 12.1 Removed From v1.3

The alternating left/right zigzag layout (`Timeline.tsx`) is removed. It was identified during planning as a generic, ubiquitous "our story" template with no functional justification for the left/right alternation (a pure `index % 2` toggle carrying no information).

### 12.2 Identity Correction — No Code Metaphors

An earlier planning pass proposed a "Git changelog / commit log" visual metaphor (monospace timestamps, commit-node markers). **This was corrected after clarifying the target professional identity leans EECS-adjacent, not programmer-adjacent** — a commit-log metaphor visually declares "I am a programmer" as strongly as a literal job-title would, which contradicts the no-identity-noun rule in §5.3. Final direction: keep monospace timestamps (numeric precision is still part of the identity) but drop all git/code iconography and terminology — closer to a lab notebook / measurement log register instead.

### 12.3 Layout — Single Rail

One rail, aligned to the reading-direction-leading side (right for Arabic/RTL, left for English/LTR).

> [!IMPORTANT]
> **This choice is conditional, not absolute.** The justification is specifically that the spacing algorithm below (§12.4) encodes real information in the gaps between entries, and the eye must track one continuous axis to read that information — an alternating layout would break that continuity. **If the time-based spacing concept is ever dropped, this single-rail decision must be re-justified rather than assumed to still hold** — "it's simpler than the common zigzag" was explicitly *not* accepted as sufficient justification on its own during planning, and shouldn't be retroactively treated as the reason here.

### 12.4 Spacing Algorithm — Compressed by Real Elapsed Time

The gap between two chronologically adjacent entries is a function of their real date difference, not a decorative constant:

```
gap(Δt) = base + k · ln(1 + Δt_days / τ)
```

- `Δt_days` — actual day difference between the two entries' dates.
- `τ ≈ 30` (days) — calibration constant controlling where logarithmic compression begins.
- `base` — minimum readable spacing floor, prevents adjacent entries from visually touching.

**Why logarithmic, not linear:** near-linear behavior for short gaps (days/weeks) keeps close-together events visually distinct from each other; the log term compresses multi-year gaps so they don't produce absurdly large empty spacing (the original concern that ruled out a naive linear mapping).

### 12.5 Uncertain / Ranged Dates 🧩

Some entries are known only as "sometime after X, before Y," not a precise date. Fabricating a false precise date for the spacing algorithm was rejected — the visual solution:

- Render as a thin translucent **bracket/arc** spanning the estimated interval on the rail, instead of a solid point — an intentionally honest representation of uncertainty, and consistent with the lab-notebook register from §12.2 (error bars / uncertainty ranges are a standard measurement-report convention).
- For the spacing algorithm, an uncertain entry's effective position defaults to the **midpoint** of its range. Supported via `TimelineEntry.dateTo` (documented in `docs/02-SYSTEM-ARCHITECTURE.md §5`).

### 12.6 Per-Entry Expand & Accordion Substitution Rules

Expanding a Journey entry grows it **vertically in place on the rail** (accordion-style). Both entry summaries and full stories support rich Markdown rendering (`MarkdownRenderer`):

- **Normal State:** Displays entry `summary` (formatted via `MarkdownRenderer.tsx`).
- **Expanded State:** The summary disappears (`isExpanded`), and is replaced seamlessly by the entry `fullStory` (formatted via `MarkdownRenderer.tsx`).
- **Conditional Expansion:** If an entry has no `fullStory` content provided by Admin, expansion is disabled (`isExpandable = false`). If linked to a project, the Project Transition button renders directly on the unexpanded card without accordion toggling.

### 12.7 Linked Project Button & In-Place Modal Overlay (`100% Scroll Position Retention`)

When a `TimelineEntry` is linked to a project (`projectSlug`):

1. **Button Interaction:** Clicking the Project Transition button fetches project data and opens `<ProjectDetail project={selectedProject} isInline={true} />` inside a fixed modal overlay (`z-[100]`).
2. **Scroll Position Retention:** The modal opens in-place over the timeline viewport without changing routes or navigating away. Closing the modal returns the visitor to the exact same scroll position in the Journey timeline without displacement.
3. **Button Styling:** Built using `PulseBorder as="button"` with a dark emerald glass background (`rgba(74, 222, 128, 0.08)`), vivid text/icon (`var(--color-accent-bright)`), and a conic-gradient glowing border sweep.

### 12.8 Imagery

`TimelineEntry.imageUrl` (existing field, no schema change) renders as a small non-interactive logo/badge (~24–32px, soft rounded corners) beside the rail's measurement point. Never a full-width hero image, never a lightbox, no hover interaction — it is reinforcement, not a gallery.

---

## 13. Implementation Checklist

A condensed cutover list, cross-referencing the sections above:

- [x] Consolidate UI/UX and motion specifications into `docs/03-UI-UX-SPECIFICATIONS.md`.
- [x] Remove `ParallaxCharacter.tsx`, its character asset, and its usage in `HeroSection.tsx` (§5.1).
- [x] Remove `CardShuffle.tsx` and its usage on the home page (§6.1); build the uniform card grid + shared-element expand (§6.2–6.4).
- [x] Build the `LavaBackground` component per §4, including the off-screen-offset and position/shape-timing rules (§4.7–4.8).
- [x] Build the Lissajous hero component (3-curve converging variant, §5.2) and update Hero copy per the no-identity-noun rule (§5.3).
- [x] Build `PulseBorder` as a shared component (§7) and wire it into the scope list in §7.1 only.
- [x] Rebuild `Timeline.tsx` per §12 (single rail, log-compressed spacing, uncertainty brackets with `dateTo` support).
- [x] Path-preserving locale navigation in `Navbar.tsx` and `FooterClient.tsx` via `createNavigation(routing)` per §11.8.
- [x] Scroll position restoration across page reloads and locale switches via `ScrollRestoration.tsx` and `scroll={false}` on language switchers per §11.8.
- [x] Rework `ContactForm.tsx` per §9 (reason selector, conditional project picker, debounced draft persistence with rolling 10-min TTL, `PulseBorder`-enabled `clearForm` button, and hydration safety).
- [x] Full automated test suite in Vitest verifying math models, draft persistence, media storage lifecycle cleanup, and API routes (82 unit tests passing across all 13 test suites).
