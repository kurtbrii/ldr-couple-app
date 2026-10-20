# HANDOFF BRIEF — LDR Couples App (Clickable Web Prototype)

## 0. Read this first — what this is and isn't

Build a **clickable visual prototype** of a mobile app, as a **web app** (runs in a browser, framed as a phone). The goal is to feel the design, the card-flip reveal, the scrapbook, and the navigation — before the real native app is built.

**Build target:**
- **Plain web: React + Tailwind loaded via CDN. No build step, no Node, no bundler.** Someone opens the files in a browser and it runs.
- **Multi-file**, organized for clarity: an `index.html` that loads React/Tailwind/Babel from CDN, and screens/components split across multiple `.js` files (one screen per file, a shared theme/tokens file, a shared components file, a mock-data file).
- **Phone-framed:** render inside a centered mobile-width frame (≈390–430px wide) so it reads as an app on desktop and fills the screen on a phone browser.
- **Real in-app navigation:** a persistent bottom tab bar (TODAY · OUR STORY · US) and stack-style navigation for drilling into flows, with working Back and app-like transitions (slide in on push, slide back on pop, fade where appropriate). Navigation is managed in React state/simple client-side routing — smooth, no full page reloads.

**Do NOT build:**
- No backend, no database, no API calls, no auth, no real storage (no localStorage — keep all state in React memory; refresh resets, that's fine).
- Don't invent features beyond this brief.

**This is a design reference you can click — not the real codebase.** The real app will be React Native; code here does not transfer directly. Build it to *feel* and *look* right, not to be production architecture.

**The quality bar:** it must **not look vibe-coded.** Three things enforce that: (1) obey the locked design system on every screen, (2) apply the grain/texture requirement in §3 everywhere, (3) finish Tier-1 screens to high polish before touching Tier 2/3. Breadth at the cost of consistency is the failure mode.

## 1. The product in two sentences

A private app for long-distance couples. Each day both partners get a complementary photo "Hunt" ("find something from your morning" / "…your evening"), each photographs their find, and when both are in, they flip their cards to reveal both photos side by side — then optionally save the pair as a page in a shared digital scrapbook they build over time.

Emotional targets: warm, nostalgic, intimate, playful, collectible, lightweight. **Never** pink-and-purple "couples app." It must feel like *a vintage scrapbook redesigned by a modern app designer* — not a modern app with scrapbook stickers glued on.

## 2. Design system — LOCKED (obey on every screen)

**Palette (use exactly these hex values):**
- Paper Cream `#F7F1E6` — main background (the foundation; NOT white)
- Warm Ivory `#FFF9F0` — cards / surfaces
- Dusty Rose `#C9827D` — emotion only: hearts, reactions, favorites, romantic accents
- Terracotta `#B9684F` — primary actions only: OPEN, SUBMIT, Add to Our Story
- Sage `#8D9B83` — secondary / calm accents
- Butter Yellow `#E7C96B` — coins/rewards ONLY (collectible-token feel)
- Ink Brown `#3D3530` — primary text
- Muted Brown `#887970` — secondary text

> Note: an attached reference image shows a *lighter* palette with different hexes — **ignore those hex values.** That image is for **texture/grain mood only.** The hexes above are authoritative.

**Color discipline (70/20/10):** ~70% warm neutrals (creams/ivory), ~20% muted accents (sage/rose), ~10% stronger accents (terracotta/yellow). Rose = emotion, terracotta = action, yellow = coins, sage = calm. Do not let the app drift pink.

**Typography:**
- UI text: clean friendly modern sans (Inter or system sans).
- Scrapbook & card elements: a warm serif / elegant display (Fraunces or Playfair Display via Google Fonts) for prompts, dates, and "Our Story" headings. Selective — never the whole UI.
- A handwritten-style font for scrapbook captions/doodles only, sparingly.

**Surfaces & shape:**
- Warm ivory cards on cream — subtle, warm contrast, never stark white-on-gray.
- Paper-like surfaces; gentle warm-toned shadows, never harsh gray drop shadows.
- Moderately rounded corners — collectible-card feel, not bubble.

## 3. Grain & texture — HARD REQUIREMENT

Flat color fills are the #1 thing that makes this look cheap/vibe-coded. The reference images (attached design PDF + palette image) show the target: color with a **grainy, filmic paper texture** over it, not plain fills.

Implement texture globally:
- A subtle **grain/noise overlay** on the app background and on card surfaces — e.g. an SVG `feTurbulence` noise layer at low opacity, or a tiling noise PNG, laid over the color at ~3–8% opacity.
- Backgrounds should read as **vintage paper**, not digital flat color. Faint grain + very subtle warm vignette where appropriate.
- Card backs and scrapbook pages especially should feel like **textured paper/cardstock**.
- Keep it subtle — texture you feel more than see. It should never fight the photos or text.

This applies on every screen. A screen with flat fills and no grain is not done.

## 4. Art direction

- **Photos are the heroes.** Decoration frames them, never overpowers. Render user photos as slightly-imperfect prints/polaroids — small rotations (−3° to +3°), white borders, soft shadow, an occasional piece of washi tape or a paper corner.
- **Intentional imperfection** — slight rotations, layered paper, tape, hand-placed feel. Avoid rigid grids for scrapbook content.
- **Hunt Cards feel like physical collectible cards** — tactile, a front (prompt) and a back (photo). Categories can carry subtly different *muted* paper tints (morning: cream/butter/sage; evening: dusty rose/muted lavender/warm blue) — muted like real stationery, never candy pastel.
- **Coins look like little tokens** — butter-yellow, e.g. `+10 🪙`, `620 🪙`.
- **Motion is tactile and satisfying**, never techy/gimmicky: card open, flip, photo reveal, card→scrapbook transition, coin pop, sticker placement.

## 5. Navigation architecture

- **Three root tabs**, persistent bottom bar: **TODAY · OUR STORY · US.** Bar visible on root screens; it may hide during the immersive reveal if that feels better.
- **Stack navigation** (client-side, in React state) for drilling in, with working Back:
  - TODAY → Hunt Card → Start Hunt → Photo Preview → Submit → Waiting → Reveal → React → Add to Our Story → lands on the new scrapbook page
  - OUR STORY → Scrapbook feed → a single scrapbook page → Editor → Coin Shop
  - US → settings sub-screens
- App-like transitions: push slides in from the right, back slides out; modals/sheets slide up; reveal can be its own full-screen flow.

## 6. Screen map — build in this order (tiering is mandatory)

**TIER 1 — Core (high finish FIRST):**
1. Welcome / Get Started
2. TODAY — Hunt Card (closed)
3. Start Hunt → Photo preview → Submit
4. Waiting state
5. Reveal (two closed cards → flip → two photos) — the hero moment
6. React / comment
7. Add to Our Story (template auto-compose)
8. Our Story — scrapbook feed
9. Single scrapbook page (decorated)

**TIER 2 — Secondary (after Tier 1 is polished):**
10. Scrapbook editor (drag/rotate/scale a sticker, swap template)
11. Coin Shop
12. Missed Hunts
13. Onboarding (post-pairing)
14. US — profile / settings
15. Hunt mode picker (1 / 3 / 5)
16. Vacation Mode toggle
17. Trial-conversion screen ("Your first 14 days ❤️")

**TIER 3 — Thin stubs (minimal, on-brand):**
18. Sign up / login
19. Create couple / invite partner
20. End relationship / archived view
21. Notification settings

## 7. Tier-1 screen specs

**1. Welcome.** Cream, grainy paper background, serif headline: "Turn your separate days into a shared story." Terracotta "Get Started"; text link "I already have an account." Calm, spacious.

**2. TODAY (card closed).** Header "Good morning, Olivia ❤️". Hero: today's Hunt Card, closed, collectible-feeling, showing the user's own prompt in serif ("Find something from your morning.") with a small "Your Hunt" tag and a ✦ motif. Terracotta "Start Hunt." Bottom tabs visible. Default shows 1 card.

**3. Start Hunt → preview → submit.** Tap Start Hunt → "Go find it 📸" with camera / choose-from-library (simulated — tapping loads a sample photo). Preview: "Happy with your find?" with Submit (terracotta) / Retake. On submit, the photo "places" onto the card back with a satisfying motion; card shows 🔒 locked; a "+10 🪙" pops.

**4. Waiting.** Calm, never guilt-inducing: "Your card is locked. Waiting for your person…" + playful "Don't peek 👀". No countdown, no pressure.

**5. Reveal (hero).** Two closed cards shown together — YOUR CARD (your prompt) + THEIR CARD (their prompt). "Are you ready to open?" → big terracotta OPEN. On tap, **both cards flip simultaneously** like physical cards turning over (real 3D transform, not a fade), revealing both photos at ~the same moment. Gentle sparkle ✨ (not confetti). Then two photos side by side, visually connected: "YOUR FIND" / "THEIR FIND." This must feel great — it's the soul of the app.

**6. React / comment.** Reaction row on the partner's photo: ❤️ 😍 😂 🥹 👀 (dusty rose). Optional lightweight comment ("I knew you'd take a picture of that 😂"). Minimal — not a chat app.

**7. Add to Our Story.** Deliberate terracotta "Add to Our Story" (not automatic). On tap, the magic: cards → photos → a **finished, auto-composed scrapbook page** assembles itself from a template (photos drop into slots; frame, washi, date appear). Confirmation: "Added to Our Story ✨". The user did nothing but tap, yet a beautiful page appeared.

**8. Our Story (feed).** The emotional center — a shared *scrapbook*, NOT a photo grid. Stacked dated pages ("September 18"), each showing both finds as polaroids with tape/decoration, slightly imperfect. Header stats: "47 days · 83 moments · 214 photos." Feels like flipping a handmade book.

**9. Single scrapbook page.** One full decorated memory: date in serif, both photos as layered polaroids, the two prompts, small reactions/comments beneath, decorative elements placed with intentional imperfection, textured-paper background. A "Decorate" affordance → editor.

## 8. Tier-2 specs (lighter detail)

- **Editor:** the page with draggable stickers (simulate drag + rotate + scale on one or two), a template-swap row, a sticker tray. Show the "Olivia is decorating this page 🎨" lock state as a concept.
- **Coin Shop:** sections TEMPLATES / STICKERS / FRAMES / THEMES with butter-yellow coin prices, balance "620 🪙" top-right, some items locked/premium, a free starter set. Classic template Free; Love Letter 150; Sunday Morning 200; etc.
- **Missed Hunts:** gentle, dedicated page, per-partner framing — if *you* missed → "You missed!" + "Complete now"; if *they* missed → "Waiting for Julian to complete this Hunt." Warm, no guilt.
- **Onboarding:** "You're officially hunting together." brief explainer of daily card + reveal, terracotta "Open Your First Card."
- **US / settings:** couple profile ("Julian + Olivia"), subscription status, notifications, Hunt mode, Vacation Mode, relationship controls. Calm and simple.
- **Hunt mode picker:** 1 (Easy) / 3 (Regular) / 5 (Challenge), default 1.
- **Vacation Mode:** gentle toggle, "Pause new Hunts while you're away."
- **Trial conversion:** "Your first 14 days ❤️ — 14 days together · 26 moments created · 52 photos shared · 620 Coins earned." Then "Keep building your story." terracotta "Continue Together." Show accumulated value, never a harsh paywall.

## 9. Tier-3 (stubs only)

Sign up/login; create couple/invite (show an invite code + "Invite your person ❤️"); end relationship ("Your memories won't be deleted" — archived read-only concept); notification settings. Minimal, on-brand, can be non-interactive.

## 10. Mock data to hardcode (one shared file)

- Couple **Julian + Olivia**; current user = Olivia. Coins **620**. Streak **🔥 12** (decorative only — no pressure messaging anywhere).
- Today's pair: Olivia "Find something from your morning." / Julian "Find something from your evening."
- A few past memories for Our Story (Sept 18, 17, 15…), each with two finds and varied templates (Classic, Love Letter, Sunday Morning).
- One Missed Hunt example (Julian hasn't submitted) to show the framing.
- Shop items with prices as in §8.
- **Images:** warm lifestyle placeholder photos (coffee, a window, a sunset, a plant, food). If reliable external images aren't available, use warm gradient/paper placeholders with the polaroid treatment — the *framing* matters more than the image content.

## 11. Key interactions (get these feeling good)

1. **Card flip** — real 3D flip (front prompt → back photo); both cards flip together on reveal. Signature moment.
2. **Template auto-compose** — on Add to Our Story, photos animate into a finished page. Like a little gift assembling itself.
3. **Coin reward** — "+10 🪙" with a small satisfying pop on submit.
4. **Sticker placement** (editor) — draggable, slight bounce on drop.
All motion warm and tactile; nothing fast, harsh, or techy.

## 12. References attached

Two documents are attached: the **PRD** (product flows/screens) and the **design PDF** (the Warm Vintage Scrapbook mood board + palette). **Match the mood board's vibe** — vintage paper, dried-floral muted tones, pressed-flower journals, polaroids with tape, handmade spreads — and especially its **grainy, textured** quality (see §3). Where the mood images and the §2 hexes differ, the images carry the *feel and texture*, the §2 hexes carry the *exact color values* — honor both.

## Implementation Checklist

Current authorization: implement continuously without approval pauses (confirmed by user). All state stays in memory.

- [x] ~~**Step 0:** Define the documented `App()` skeleton with TODOs~~
- [x] ~~**Step 1:** Add the buildless `index.html` entry point with React, Tailwind, and Babel from CDN~~
- [x] ~~**Step 2:** Define shared theme tokens, typography, paper grain, and responsive phone-frame styling~~
- [x] ~~**Step 3:** Add shared mock couple, Hunt, scrapbook, and shop data~~
- [x] ~~**Step 4:** Connect memory-only app state and tab/stack navigation, starting with caller skeletons~~
- [x] ~~**Step 5:** Build shared paper, card, photo, button, and navigation components one at a time~~
- [x] ~~**Step 6:** Build the Tier-1 Welcome screen~~
- [x] ~~**Step 7:** Build TODAY with the closed Hunt Card~~
- [x] ~~**Step 8:** Build Start Hunt and simulated photo selection~~
- [x] ~~**Step 9:** Build Photo Preview, Retake, and Submit with card placement and coin reward~~
- [x] ~~**Step 10:** Build the locked-card Waiting state and simulated partner completion~~
- [x] ~~**Step 11:** Build the simultaneous 3D two-card Reveal~~
- [x] ~~**Step 12:** Add reactions and an optional lightweight comment~~
- [x] ~~**Step 13:** Build deliberate Add to Our Story and animated template auto-composition~~
- [x] ~~**Step 14:** Build the Our Story scrapbook feed~~
- [x] ~~**Step 15:** Build the decorated single scrapbook page~~
- [x] ~~**Step 16:** Review and polish all Tier-1 screens, navigation, texture, and motion~~
- [x] ~~**Step 17:** Build the scrapbook editor with sticker drag, rotation, scaling, and template swapping~~
- [x] ~~**Step 18:** Build the Coin Shop~~
- [x] ~~**Step 19:** Build Missed Hunts~~
- [x] ~~**Step 20:** Build post-pairing Onboarding~~
- [x] ~~**Step 21:** Build US, profile, and settings~~
- [x] ~~**Step 22:** Build the Hunt mode picker and Vacation Mode toggle~~
- [x] ~~**Step 23:** Build the trial-conversion screen~~
- [x] ~~**Step 24:** Add on-brand Tier-3 sign-up/login and couple/invite stubs~~
- [x] ~~**Step 25:** Add on-brand Tier-3 relationship/archive and notification settings stubs~~
- [x] ~~**Step 26:** Verify the complete clickable flow and responsive presentation~~

## Verification and prototype limits

Verified in Google Chrome (headless, via puppeteer-core run from a scratch folder outside the project) by opening `index.html` directly over `file://`:

- **Tier-1 flow:** Welcome → sign up → create couple → invite → simulated join → onboarding → TODAY → Start Hunt → shutter → preview → Submit (photo lands on the card, 🔒 stamp, +10 🪙, balance 620 → 630) → Waiting → simulated partner → Reveal → OPEN (both cards flip together) → reaction + comment → Add to Our Story (auto-compose, template swap) → new page in Our Story (stats 84 moments · 216 photos) → page detail → Back → feed. No console errors or warnings.
- **Tier-2/3 flow:** login shortcut → page detail → editor (sticker dragged, rotated and resized with pointer events, sticker added, template and frame swapped, "Preview as Julian" lock view) → Save persists in memory → Coin Shop (confirm and buy, balance deducted, owned state shown, a theme bundle unlocks its items, insufficient-balance message) → Missed Hunts (complete via library → ready → open together) → Hunt mode → Vacation Mode (TODAY shows the paused state) → trial preview → notifications → End relationship → Archive (Our Story read-only, TODAY paused, Decorate hidden). No console errors.
- **Responsive:** 320×640 and 390×844 render full-bleed with the tab bar pinned 12px from the bottom. At 1400×900 the phone frame is 400px wide and centred. A mid-transition screenshot confirmed the push slide.
- **Not verified:** real touch devices, Safari/Firefox, `prefers-reduced-motion`.
- **Prototype limits:** see README.md. No backend, API calls, auth, payments, persistent storage or deployment. Hunt mode stores the preference but always plays one pair. Missed Hunts is a self-contained demo.
