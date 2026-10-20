# LDR Couples App — Clickable Web Prototype

A clickable design reference for the long-distance couples app described in `HANDOFF.md`.
It's for seeing and feeling the design: the Hunt Card, the simultaneous card-flip reveal,
the scrapbook and the navigation. It is **not** the production codebase (the real app will be React Native).

## Open it

Double-click `index.html` (or drag it into Chrome or Safari). No install, build step or server is needed.
You do need an internet connection, because React, Tailwind, htm and the web fonts load from CDNs.
Every photo is generated locally as SVG.

All state lives in React memory, so **refreshing resets the demo**. There's also a *Reset prototype* link at the bottom of the US tab.

## Comparing Modern vs. Vintage (temporary)

This branch adds a **Modern / Vintage** switch, pinned top-right on desktop widths (it hides
on real phone widths, where there's no room for it and no second style to compare against).
It recolours and re-textures the whole app live — card tints, paper texture, corner
radius, button shape, coin styling and the small structural labels (card tags, section
headings, tab names) swap to a typewriter face — without touching any screen's logic.

This is for side-by-side comparison only. Once one direction is picked, the losing style
and the switch itself should come out and the chosen palette should become the only one.

## A good route through it

1. **Welcome** → Get Started → Continue with email → Create our space → Invite your person → *Simulate join* → **Onboarding** → Open Your First Card.
   (Or use "I already have an account" → Log in to skip straight to TODAY.)
2. **TODAY** → Start Hunt → tap the shutter (or *Choose from library*) → **Happy with your find?** → Submit. Watch the photo land on the card, the 🔒 stamp, and **+10 🪙**.
3. **Waiting** → tap *Prototype · simulate Kurt submitting* → Go to the reveal.
4. **Reveal** → OPEN. Both cards flip together → react (❤️ 😍 😂 🥹 👀) → leave a note → **Add to Our Story**.
5. The page **auto-composes** itself. Try swapping the template, then *See it in Our Story*.
6. **OUR STORY** → open any page → **Decorate**: drag a sticker, use ↻ to rotate and ⤡ to resize, add stickers, swap templates and frames, and *Preview as Kurt* to see the editing lock → Save.
7. Tap the coin pill → **Coin Shop**: buy something, then try an item you can't afford.
8. **TODAY → Missed Hunts**: one Hunt is waiting on Kurt, and the other is "You missed!" → Complete now → Open together.
9. **US**: Hunt mode (1/3/5), Vacation Mode (look at TODAY afterwards), the trial preview, notifications, and End relationship → Archive. Our Story then becomes read-only; use *Restore* to undo.

## Source layout

```
index.html              entry point: CDN scripts, then local scripts in dependency order
css/theme.css           palette tokens, phone frame, paper grain/texture, all motion keyframes
js/theme.js             LDR namespace + html tag, palette, Hunt Card tints, scrapbook templates, sticker art
js/photos.js            warm soft-focus SVG "photographs" with a film treatment
js/data.js              mock couple, today's Hunt, memories, missed Hunts, shop catalogue
js/components.js        shared UI: Screen, TopBar, buttons, CoinPill, HuntCard faces, FlipCard,
                        Polaroid, Sticker, ScrapbookPage (template renderer), TabBar…
js/navigation.js        memory-only flows, tabs and stacks with push / pop / sheet / fade transitions
js/app.js               root: app state + actions, phone frame, toast
js/screens/*.js         one file per screen area (welcome, entry, today, hunt, waiting, reveal,
                        add-to-story, our-story, memory-page, editor, shop, missed, us)
```

Every script attaches what it exports to `window.LDR`. Screens register themselves in
`LDR.SCREENS`, read state with `LDR.useStore()` and navigate with `LDR.useNav()`.

**Why htm instead of JSX + Babel:** when a page is opened from `file://`, Chrome blocks
Babel-standalone from fetching separate `.jsx` files. htm gives JSX-like templates
(`` html`<div>${x}</div>` ``) with no compile step, so double-click-to-open works.

## Prototype limits

- No backend, API calls, auth, payments, persistent storage or real notifications. Sign-in, pairing, the partner's actions, subscription and export are all labelled simulations.
- Hunt mode saves the 1/3/5 preference, but the demo always plays one card pair.
- Missed Hunts is a self-contained demo and doesn't add pages to Our Story.
- The editing lock ("Jubi is decorating this page 🎨") is shown as a concept via *Preview as Kurt*.
