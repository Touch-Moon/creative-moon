# Work Singles — Text Module Drafts (6 sections × 6 works)

> Copy-paste friendly. Each work has **six** text sections. Keep current
> Sanity structure (textBlock with Heading + Body); only the words change.
> Voice: first-person, Design Engineer, grounded. No agency plural.

---

## 1. langill-farm — Langill Farm

### Section 1 · Rooted in place, built for screen
A 73-acre master-planned community needs a site that feels grounded — not a brochure. I built the identity and voice around a calm palette of black, cream, taupe, and gold, then paired it with editorial typography so the page holds its tone before a single image loads.

### Section 2 · Motion as language
Page transitions were shaped like quiet sentences — not flourishes. I built a custom system on the Web Animations API: SVG logo reveals, masked image swaps, gesture-aware easing. Reduced-motion preferences short-circuit every animation, no exceptions.

### Section 3 · Architecture that serves the content
Next.js 15, TypeScript, Tailwind v4, and Sanity with a 60-second ISR cycle. I shaped the schema around how the editor actually works — flexible modules, predictable previews, zero dead fields — so the site stays easy to maintain long after I hand it over.

### Section 4 · The design system
Fluid typography, a 40-step spacing scale, and responsive grid rules that shift by intent, not breakpoint alone. Every component inherits the same tokens, so the visual language stays coherent from hero to footnote without me policing it.

### Section 5 · Performance as a design choice
Images ship via Sanity CDN with per-component `sizes` and AVIF/WebP fallbacks through `next/image`. Fonts are self-hosted and preloaded. The result: a first contentful paint that holds up on rural 3G, which is exactly the audience the site is built for.

### Section 6 · What I took away
Designing a real-estate site in 2026 meant resisting the standard template — the hero video, the glossy floor plan carousel, the marketing speak. The version that actually represents the place is slower, quieter, and more confident. That restraint is the project.

---

## 2. prarie-cricket-farm — Prairie Cricket Farm

### Section 1 · Trust is the product
Cricket protein lives or dies on trust. I framed the product flow around three things a first-time visitor needs in order: clear nutritional proof, honest sourcing, and a checkout that matches the quality of the product. Every page answers a specific objection before the next one can form.

### Section 2 · A storefront that reads like a brief
Long-form copy sits directly inside the shop flow — not banished to a separate blog. Science, farming, and taste share the same scroll, so the reader never has to leave the buying context to get convinced. The conversion path and the education path are the same path.

### Section 3 · The interface
I built the front end on Next.js with Shopify powering commerce. GSAP handles pace: gentle reveals on scroll, not performance set-pieces. The type system is editorial; the UI chrome is almost invisible. The product photography does the heavy lifting and the layout gets out of the way.

### Section 4 · Checkout without friction
Shopify's hosted checkout does the payments; everything leading to it is tuned for trust. Clear unit economics per pack, transparent shipping ranges, and an FAQ that refuses to dodge the obvious questions. Cart abandonment drops when the product page has already finished the argument.

### Section 5 · Content under a single CMS model
Product pages, the story section, and the FAQ all share one content model so the client can update any of them without a developer. The schema mirrors how the farm actually talks about its own product — pack size, feed ratio, protein density — rather than a generic e-commerce template.

### Section 6 · What I took away
A niche food category forces you to design around skepticism. The best tool isn't clever copy — it's information architecture that never lets the reader wonder what's next, and never hides what matters.

---

## 3. seawater-portal — Seawater Portal

### Section 1 · Ten sites, one frontend
The legacy stack was a Rails monolith serving ten community news sites. I rebuilt the front end on Next.js 15 with Supabase as the data layer, keeping the multi-site routing intact but collapsing ten stylesheets into one configurable design system. Every site now ships from the same codebase, configured per town at the edge.

### Section 2 · Local news still needs a home page
Community news has a specific rhythm — obituaries, council meetings, a lost dog. The home page had to honor that without looking like a template. I designed an editorial grid that lets a single big story breathe while still surfacing the short notices underneath, without either pattern overwhelming the other.

### Section 3 · Feeds, weather, radio, events
Each site pulls live RSS, regional weather, a radio stream, and an events calendar from the same pipeline. I shaped the data model so a new site can be onboarded by editing a config file — no new code, no new schema. Ten sites was the proof; the architecture supports more.

### Section 4 · Search that respects the reader
Instead of an algorithmic feed, search stays close to how a local reader actually browses: by neighborhood, by section, by date. I built the UI around immediate filters instead of a single fuzzy input, because for community news the user usually knows exactly what they're looking for.

### Section 5 · Maps without the weight
Each story with a location renders on a lightweight Leaflet map — no third-party tracker, no hosted tiles from a paid provider. The map loads lazily and only when it's actually in view, which keeps article pages fast on older phones.

### Section 6 · What I took away
A redesign that touches ten sites is really a systems project dressed up as a design project. The biggest wins came from consolidating the invisible parts — the data layer, the config, the rendering pipeline — not from the things a visitor sees. The visible design only works because the architecture underneath finally does.

---

## 4. podcastville — Podcastville

### Section 1 · Browse, not search
Most podcast directories assume you already know what you want. Podcastville is built for the opposite moment — when you don't. I designed the home around mood, genre, and what's showing up next, not a search bar and a grid of thumbnails. Discovery comes first; retrieval is secondary.

### Section 2 · Editorial feels different
Category pages read like small magazines. A short editor's note, a featured show, a curated row — then the full list. That hierarchy changes how a visitor sits with the page. Instead of scanning, they read, which is exactly the shift the product needed.

### Section 3 · Motion that signals, not decorates
GSAP drives every transition, but nothing moves for its own sake. A row of cards eases in as context. A cover swap confirms a selection. Reduced-motion users see the same layout with the motion stripped, not a second-class experience.

### Section 4 · Interface density
Podcast metadata is dense by nature — host, guest, duration, episode count, release cadence. I spent most of the type system on hierarchy: the same card needs to work as a teaser, a detail page header, and a row in a grid. Every level of weight, size, and color does a specific job.

### Section 5 · The episode surface
An episode page is where listeners actually convert into subscribers. I made it opinionated: the play button sits exactly where the thumb expects it on mobile, the description is scannable, and the next-up recommendation is one decision away. Everything else — transcripts, chapters, social — loads in underneath.

### Section 6 · What I took away
Discovery UX is mostly a content problem, not a layout problem. A category page only works when someone has already decided what belongs in it. The design gives that editorial judgment a stage; it doesn't replace it.

---

## 5. homefield — Homefield Marketing

### Section 1 · An agency site that leads with the work
Generic agency sites sell the pitch first. Homefield's clients are prairie businesses that can smell that from a mile away. I built a site where the work shows up first — case studies, video, photography — and the services page is one scroll away, not the landing screen.

### Section 2 · The homegrown voice
The agency's pitch is that it actually lives where its clients live. The design had to reflect that without tipping into kitsch. I leaned on editorial typography, full-bleed photography, and copy rhythm that sounds like a person — not a deck. No stock imagery. No "solutions."

### Section 3 · Case studies that read
Each case study is long-form: brief, approach, outcome, credits. I wrote the template to favor specifics over superlatives — a real number, a real quote, the problem named out loud. The pages are deliberately slow to reach the metric; the story has to land first.

### Section 4 · Services, spelled out
Services live on one dense, scannable page. No carousels, no fly-out menus — just a list that tells you exactly what the agency does and who it's for. Clients reported that the phone call started with "I want this one" instead of "what do you actually do?" That's the whole KPI.

### Section 5 · Built with local speed in mind
The audience is on mixed connections across rural Manitoba. GSAP runs only where it adds to comprehension; everything else is vanilla. Images are optimized, lazy-loaded, and sit above the fold only when they need to. The site opens in under a second on a mid-tier phone, which is the actual baseline.

### Section 6 · What I took away
The best agency sites aren't louder — they're more specific. Specificity reads as confidence, and confidence is what a small-town client actually buys. The design system just has to stay out of the way of that.

---

## 6. earth-strong-canada — Earth Strong Canada

### Section 1 · For growers, not marketers
Earthstrong Canada's audience is farmers, dealers, and agronomists — people who can smell a marketing site in three seconds. I built the design language around proof: published research, patented soil-analysis methods, and three decades of field data presented without corporate polish.

### Section 2 · Turning agronomy into interface
Crop nutrition data is dense and technical. I designed the interface to respect that — clear tables, comparison views, unit-correct data. A dealer and an end-grower get the same underlying content in two different reading modes, not a single "simplified" version.

### Section 3 · A brand that carries its weight
The brand refresh pulled from agricultural reality: soil tones, precision greens, earned whitespace. No lifestyle photography, no hero video. The wordmark was spaced to read from a tractor dashboard and a desktop monitor at the same size — which sounds like a joke until you watch the actual user test.

### Section 4 · The architecture
Next.js 15 with a modular content schema sized to how Floratine actually publishes — by crop, by region, by product line. Each page is built from the same primitive blocks, so new product launches don't need a new template. The CMS experience is closer to a spreadsheet than a page builder, which is exactly what the client asked for.

### Section 5 · Performance in rural conditions
The audience lives on rural connections. I treated performance as a design constraint from day one: AVIF images, system fonts for body copy, JavaScript only where interaction requires it. Pages open instantly on 3G because they were designed to — not because a plugin tried to patch them.

### Section 6 · What I took away
Designing for a technical audience means earning each pixel. Nothing is there to decorate; everything is there to inform. That discipline carried the project — and it's the bar I now set for any product where the reader knows more about the subject than I do.
