# GeminiPulse: Cinematic Landing Page Blueprint

## Role
Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You build high-fidelity, cinematic "1:1 Pixel Perfect" landing pages. Every site you produce should feel like a digital instrument — every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.

## Project Context
**Brand:** GeminiPulse
**One-Line Purpose:** The premier intelligence dashboard and community hub for tracking Google's Gemini models, updates, and agentic workflows.
**Primary CTA:** "Join the Community Forum" or "View the Pulse"

---

## The "Cosmic Intelligence" Aesthetic (Fixed Direction)
This site must feature a high-end, dark, space-tech aesthetic that feels "alive" but subtle.

- **Identity:** The beating heart or central nervous system of artificial intelligence. It should feel like a sophisticated, live telemetry dashboard, not a static blog.
- **Palette:** 
  - Background: Deep Void `#07080A`
  - Surface/Glass: Obsidian Navy `#121620`
  - Text: Starlight `#F8F9FA` / Moon Dust `#A1A1AA`
  - Accent/Pulse: Gemini Plasma Gradients (Deep blues, vibrant purples `#7B61FF`, soft pinks `#D96570`)
- **Typography:** 
  - Headings: "Inter" or "Outfit" (tight tracking, geometric sans).
  - Data/Tech elements: `"JetBrains Mono"` or `"Fira Code"`.
- **The "Pulse" Mechanism:** There must be a very slow, subtle, unobtrusive glowing radial gradient located in the bottom corner (or dynamically behind cards) that breathes/pulses. It should be classy and not distract readers.

---

## Fixed Design System (NEVER CHANGE)

### Visual Texture
- Implement a global CSS noise overlay using an inline SVG `<feTurbulence>` filter at **0.03 opacity** to eliminate flat digital gradients and add a premium film-grain feel.
- Utilize modern "Glassmorphism" for cards: `bg-opacity`, `backdrop-blur-xl`, and razor-thin `border-white/10` edges.
- Use a `rounded-2xl` to `rounded-[2rem]` radius system.

### Micro-Interactions
- All interactive elements must have a **"magnetic" feel**: subtle `scale(1.02)` on hover.
- Links and interactive elements get a `translateY(-1px)` lift + a subtle glow on hover.

### Animation Lifecycle
- Use `gsap.context()` within `useEffect` for ALL animations. Return `ctx.revert()` in the cleanup function.
- Default easing: `power3.out` for entrances, `power2.inOut` for morphs.

---

## Component Architecture

### A. NAVBAR — "The Floating Dashboard Console"
A `fixed` pill-shaped container, horizontally centered.
- Morphing Logic: Transparent at hero top. Transitions to `bg-[#121620]/70 backdrop-blur-xl` with thin borders when scrolled.
- Contains: Logo ("GeminiPulse" with text gradient), Links (Pulse Feed, Forums, Video Hub, Resources).

### B. HERO SECTION — "The Heartbeat"
- `100dvh` height. Deep dark background with the subtle, slow, animated "Pulse" gradient behind the text.
- **Typography:** Massive, bold typography. "Tracking the Heartbeat of Google AI."
- **Animation:** GSAP staggered `fade-up` for text parts. 
- Include a simulated "Live Status" terminal or a glowing node network graphic.

### C. FEATURES — "Interactive AI Telemetry"
Three cards acting as functional micro-UIs:
1. **The Live Feed Radar:** A scrolling/shuffling card concept demonstrating the real-time API updates and news tracking capabilities.
2. **The Autonomous Moderator:** A live-text feed (typewriter effect) showing an AI moderator scanning string inputs for spam/safety.
3. **The Agentic Workflow:** An animated SVG diagram showing agents passing data between each other to accomplish complex tasks.

### D. THE FEED — "The Intelligence Stream" 
- A masonry or grid-based layout for news articles and forum threads.
- Cards must use the Glassmorphism system. Upon hover, the "Pulse" color gently illuminates the border.

### E. MONETIZATION / RESOURCES 
- A high-end grid displaying "Affiliate Hardware & AI Tools" and "Curated YouTube Videos".
- Uses large, rich imagery with moody shadows.

---

## Technical Requirements

- **Stack:** Vite, React 19, Tailwind CSS v3.4, GSAP 3 (with ScrollTrigger), Lucide React.
- **Fonts:** Load via Google Fonts.
- **Execution Directive:** "Do not build a website; build a digital instrument. Every scroll should feel intentional, every animation should feel weighted and professional. Eradicate all generic AI patterns."
