# Work Posts — Content Drafts (2026-04-13)

Reference URLs:
- Langill Farm — https://langill-farm.vercel.app/
- Prairie Cricket Farms — https://prairie-cricket-farms.vercel.app/
- Seawater Portal — https://seawater-portal.vercel.app/
- Podcastville — https://podcast-ville.vercel.app/
- Homefield Marketing — https://homefield-marketing.vercel.app/
- Earth Strong Canada — https://earthstrong-canada.vercel.app/

Tone: first-person solo designer/developer. UX-focused. Plastic.design restraint.

---

## 1. Langill Farm. (slug: langill-farm) — 2026

### Registered fields (to update via API)

**subtitle** (one line under title):
> A residential community platform where brand identity, motion design, and modern architecture meet on screen.

**overview** (project overview):
> Langill Farm is a 73-acre master-planned community in Steinbach, Manitoba, with 127 residential lots. The brief was to translate a slow, grounded sense of place into a digital experience — not a brochure site. I led the work end-to-end: brand identity refinement, UX architecture, motion system, and a fully typed Next.js build on Sanity CMS. Every page was designed to feel considered on first load and hold up across devices, with ISR keeping content fresh without sacrificing speed.

**listDescription** (shown under thumbnail on list page):
> Brand identity, motion system, and a fully-typed Next.js platform for a 127-lot residential community in Steinbach, Manitoba.

**services**:
- Design & Development
- Interface & Interaction
- Content Systems
- Engineering & Performance

### Refined textBlocks (update existing content)

**Block 1 — heading:** `Rooted in Place, Built for Screen`
**body:**
> A restrained palette of black, cream, taupe, and gold anchors the brand in warmth and weight. The wordmark was tuned for long-form reading and small-screen clarity, then paired with editorial typography that sets the tone before a single image loads.

**Block 2 — heading:** `Motion as Language.`
**body:** (leave empty — it's a section intro pair)

**Block 3 — heading:** `` (none — body only)
**body:**
> A custom page-transition system built on the Web Animations API. SVG logo reveals, masked image swaps, and gesture-aware easing curves keep navigation feeling intentional — not decorative. Reduced-motion preferences are fully respected.

**Block 4 — heading:** `Architecture That Serves the Content`
**body:**
> Next.js 15, TypeScript, Tailwind CSS v4, and Sanity CMS with a 60-second ISR cycle. The schema was shaped around how editors actually work — flexible modules, predictable previews, and zero unused fields — so the site stays easy to maintain long after launch.

**Block 5 — heading:** `The Design System.`
**body:** (leave empty)

**Block 6 — heading:** `` (none — body only)
**body:**
> Fluid typography, a 40-step spacing scale, and responsive grid rules that shift by intent — not breakpoint alone. Every component inherits from the same tokens, which keeps the visual language coherent from the hero down to the footnote.

### New textBlocks to add manually in Sanity (optional)

**New Block — heading:** `Designed around decisions, not features.`
**body:**
> Buying into a community is a slow decision. The information architecture mirrors that pace — lots, amenities, vision, contact — with a clear path to the next step at every scroll position. No dead ends, no noise.

---

## 2. Prarie Cricket Farm. (slug: prarie-cricket-farm) — 2025

### Registered fields (to update via API)

**subtitle:**
> An e-commerce experience for sustainable cricket protein — built around trust, science, and taste.

**overview:**
> Prairie Cricket Farms makes premium cricket-based protein in Manitoba — a category that lives or dies on trust. The site had to do three things at once: educate, earn confidence, and convert. I shaped the product flow around clear nutritional proof, honest sourcing, and a checkout that matches the quality of the product. The result is a Shopify-powered storefront where science, sustainability, and everyday usability sit in the same frame.

**listDescription:**
> An e-commerce experience for premium cricket protein — where science, sustainability, and conversion share the same page.

**services**:
- Design & Development
- Commerce & Shopify
- Interface & Interaction
- Engineering & Performance

### New textBlocks to add manually in Sanity

**Block A — heading:** `Selling a category, not just a product.`
**body:**
> Cricket protein is still a first-time purchase for most people. The homepage leads with proof — complete amino acid profiles, independent research, and real customer results — before it ever talks price. Every scroll reduces one more objection.

**Block B — heading:** `Commerce tuned for conversion.`
**body:**
> Built on Shopify with a custom theme. Product pages are structured around the questions buyers actually ask: How does it taste? How much protein? Where does it come from? Cart and checkout stay fast on mobile, where most traffic lives.

**Block C — heading:** `A voice that matches the work.`
**body:**
> The brand speaks plainly — "Pure Protein, Sustainably Raised." Type, color, and photography carry the same honesty. No lifestyle filler, no overclaiming. Just the product, the people behind it, and the numbers that back it up.

---

## 3. Seawater Portal. (slug: seawater-portal) — 2026

### Registered fields (to update via API)

**subtitle:**
> A modern redesign of a 10-site Canadian local news network — one codebase, one shared experience.

**overview:**
> Seawater Portal is a ground-up redesign of a network of ten Canadian community news sites — Steinbach, Cochrane, Moose Jaw, and more — originally built on a shared Rails monolith. I rebuilt the frontend on Next.js 15, Supabase, and SCSS, keeping the multi-site architecture intact while delivering a cleaner, faster, and more accessible experience. Live RSS feeds, weather, radio streaming, and events all run from a single codebase, configured per site at the edge.

**listDescription:**
> A modern redesign of a 10-site Canadian local news network — one codebase, one shared experience.

**services**:
- Design & Development
- Content Systems
- Interface & Interaction
- Engineering & Performance

### New textBlocks to add manually in Sanity

**Block A — heading:** `One codebase. Ten communities.`
**body:**
> Each site — Steinbach, Cochrane, High River, Moose Jaw, Humboldt, Westman, Okotoks, Central Alberta, Classic 107, CHVN — runs on the same Next.js deployment. Brand colors, logos, RSS feeds, weather, and radio streams swap at request time based on hostname. Adding a new community site means inserting one row in Supabase and pointing a domain in Vercel.

**Block B — heading:** `Live data, without the cost.`
**body:**
> News feeds pull directly from each site's RSS endpoint with 60-second ISR. Weather uses WeatherAPI plus Environment Canada radar via Leaflet. Radio streams CORS-proxy through a Next.js API route. Nothing is faked — every widget on the page runs on real data.

**Block C — heading:** `Accessibility as a baseline.`
**body:**
> Audited and remediated for WCAG 2.1 AA across three phases. Focus traps in overlays, arrow-key navigation in menus, `prefers-reduced-motion` respected in both CSS and JS, and a light-mode contrast ratio of 4.5:1 across every text block. Lighthouse scores land at 97 for accessibility and 100 for SEO.

---

## 4. Podcastville. (slug: podcastville) — 2026

### Registered fields (to update via API)

**subtitle:**
> A podcast discovery platform designed around how people actually browse — not how archives are organized.

**overview:**
> Podcastville brings thousands of podcasts under one interface designed for discovery, not just search. I led UX, visual design, and front-end build — shaping category pages, trending views, and episode surfaces around the way listeners actually move through content: by mood, by genre, by who's showing up next. The result is a fast, editorial-feeling experience where finding something new is genuinely easy.

**listDescription:**
> A podcast discovery platform designed around how people actually browse — not how archives are organized.

**services**:
- Design & Development
- Content Systems
- Interface & Interaction
- Engineering & Performance

### New textBlocks to add manually in Sanity

**Block A — heading:** `Discovery built around the listener.`
**body:**
> Most podcast apps organize content for the catalog. Podcastville organizes it for the listener — by mood (True Crime, Comedy, Self-Improvement), by moment (New Seasons, Top Episodes This Week), and by voice. Every surface answers the same question: what should I listen to next?

**Block B — heading:** `Editorial, not algorithmic.`
**body:**
> Curated collections sit alongside trending data. Hand-picked categories — Mental Health, Nature, Society & Culture — live in the navigation as first-class rows, not buried behind search. The interface feels closer to a magazine rack than a database.

**Block C — heading:** `Interaction details that carry the weight.`
**body:**
> Hover states, card transitions, and scroll-linked motion are tuned to feel responsive without stealing attention. Category grids reflow gracefully from desktop down to mobile, and episode artwork loads progressively so nothing ever flashes into place.

---

## 5. Homefield. (slug: homefield) — 2024

### Registered fields (to update via API)

**subtitle:**
> A home-grown marketing agency site built for prairie businesses that want a message that hits home.

**overview:**
> Homefield Marketing helps local prairie businesses grow through brand, web, video, and media strategy. The site needed to feel as rooted as the work — not another generic agency page. I designed and built a fast, editorial portfolio site that leads with the work, not the pitch. Case studies, services, and contact all sit one scroll away, with copy and photography that reflect the agency's home-grown voice.

**listDescription:**
> A home-grown marketing agency site built for prairie businesses that want a message that hits home.

**services**:
- Design & Development
- Interface & Interaction
- Content Systems
- Engineering & Performance

### New textBlocks to add manually in Sanity

**Block A — heading:** `A message that hits home.`
**body:**
> The brand's core promise — local expertise for local businesses — had to live on the page, not just in the copy. Type, color, and photography all lean warm, grounded, and unpolished in the right places. The effect is a site that looks like it belongs to the prairies, because it does.

**Block B — heading:** `Work first, pitch second.`
**body:**
> The homepage leads with case studies — Caribou Falls Lodge, 55 North Community Centre, ACCEL Women in Leadership — before it ever explains services. Visitors see what the team does before they read what the team says.

**Block C — heading:** `Services structured around the buyer's next question.`
**body:**
> Brand strategy, website design, video, SEO, social — ten service lines, organized so a prospect can land, scan, and know which door to knock on. No long menus, no stacked drop-downs. Just a clear path from interest to inquiry.

---

## 6. Earth Strong Canada. (slug: earth-strong-canada) — 2026

### Registered fields (to update via API)

**subtitle:**
> A brand and product platform for a Canadian agricultural nutrition company — built for growers, not marketers.

**overview:**
> Earthstrong Canada brings science-based crop nutrition and patented soil-analysis technology to Western Canadian farmers. A subsidiary of Floratine Products Group and rooted in three decades of research, the brand needed a digital home that matched its weight — precise, grounded, and trustworthy. I led visual design, interaction design, and front-end build on Next.js — translating dense agronomic information into something a farmer, a dealer, or a partner could read, compare, and act on.

**listDescription:**
> A brand and product platform for a Canadian agricultural nutrition company — built for growers, not marketers.

**services**:
- Design & Development
- Interface & Interaction
- Content Systems
- Engineering & Performance

### New textBlocks to add manually in Sanity

**Block A — heading:** `Rooted in Efficiency.`
**body:**
> The brand idea — maximizing yields and profits through precise nutrition — drives every design choice. Hero sequences rotate through three truths of the business: science, soil, efficiency. Motion is slow and weighted, the way the land it serves asks for.

**Block B — heading:** `Products that need to be understood, not just shown.`
**body:**
> Solumetrix, Harbor Brands, Collect-N-Go, Cove, Fjord — each product line has a different buyer and a different question to answer. Product pages are structured around use case first, spec sheet second, so dealers and growers find what they need without scrolling through marketing.

**Block C — heading:** `Built to load on a combine-cab phone.`
**body:**
> A large share of the audience visits from a tractor, a truck, or a field office — not a design studio. Every page is optimized for slow-network, small-screen, one-handed reading. Image sizes, font scales, and tap targets are all tuned for the real conditions of the work.

---

## Summary of changes per post

| Post | Fields updated via API | Manual textBlocks to add |
|---|---|---|
| Langill Farm | subtitle, overview, listDescription, services, 6 existing textBlocks | 1 optional |
| Prairie Cricket | subtitle, overview, listDescription, services | 3 (A/B/C) |
| Seawater Portal | subtitle, overview, listDescription, services | 3 (A/B/C) |
| Podcastville | subtitle, overview, listDescription, services | 3 (A/B/C) |
| Homefield | subtitle, overview, listDescription, services | 3 (A/B/C) |
| Earth Strong Canada | subtitle, overview, listDescription, services | 3 (A/B/C) |
