/*
  our-story.js

  Tier 1 · Screen 8 — OUR STORY, the shared scrapbook feed (root of the
  'story' tab). The emotional centre of the app: NOT a photo grid — a stack of
  dated, decorated pages, each a little crooked, like flipping a handmade book.

  Header stats ("47 days · 83 moments · 214 photos") make the growth visible.
  Tapping a page opens it (memory-page.js).

  Used by: navigation registry ('ourStory').
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { CoinPill, ScrapbookPage, Icon, Star4, Screen, cx } = LDR;

  // Alternating tilt + offset so the pages feel hand-stacked, not gridded.
  const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1];
  const SHIFTS = [-6, 8, -2, 6, -8];

  /*
    StoryHeader — title, the couple, the growing stats and the coin wallet.
    The stats sit on a little paper label (stationery, not a dashboard).
  */
  function StoryHeader({ state, onCoins }) {
    const { vintage } = LDR.useStyle();
    const { days, moments, photos } = state.stats;
    return html`<div className="safe-top px-6 pb-2">
      <div className="flex items-start justify-between pt-2">
        <div className="fade-up">
          <div className=${cx('text-[12px] font-semibold tracking-[0.16em] uppercase text-muted', vintage && 'label-type')}>${state.partner.name} + ${state.user.name}</div>
          <h1 className="font-serif text-[34px] leading-none tracking-[-0.025em] mt-1.5">Our Story</h1>
        </div>
        <div className="pt-1"><${CoinPill} amount=${state.coins} onClick=${onCoins} /></div>
      </div>
      <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] surface grain fade-up" style=${{ animationDelay: '80ms', transform: 'rotate(-0.6deg)' }}>
        <${Star4} size=${11} color="#8D9B83" />
        <span className="font-serif text-[15px] tracking-[-0.005em]"><b className="font-medium">${days}</b> days · <b className="font-medium">${moments}</b> moments · <b className="font-medium">${photos}</b> photos</span>
      </div>
    </div>`;
  }

  /*
    OurStoryScreen — the feed. Pages are grouped under a month heading and
    drawn full-size with ScrapbookPage, tilted and offset alternately.
  */
  function OurStoryScreen() {
    const nav = LDR.useNav();
    const { state } = LDR.useStore();
    const older = state.stats.moments - state.memories.length;

    return html`<${Screen} tabs header=${html`<${StoryHeader} state=${state} onCoins=${() => nav.push('shop')} />`}>
      ${state.archived
        ? html`<div className="mx-6 mt-3 surface grain px-4 py-3 flex items-center gap-3 fade-up">
            <span className="text-sage"><${Icon} name="archive" size=${19} /></span>
            <span className="text-[13.5px] text-muted leading-snug">This story is archived and read-only. Every page is kept safe.</span>
          </div>`
        : null}

      <div className="px-6 mt-6 flex items-center gap-3 fade-up" style=${{ animationDelay: '120ms' }}>
        <span className="font-serif italic text-[19px]">September</span>
        <span className="flex-1 rule-dotted" />
      </div>

      <div className="px-7 pt-5 space-y-9">
        ${state.memories.map(
          (m, i) => html`<button
            key=${m.id}
            onClick=${() => nav.push('memory', { id: m.id })}
            aria-label=${'Open page from ' + m.date}
            className="block w-full text-left fade-up active:scale-[0.99] transition-transform"
            style=${{ animationDelay: 160 + Math.min(i, 3) * 90 + 'ms' }}
          >
            <div style=${{ transform: `rotate(${TILTS[i % TILTS.length]}deg) translateX(${SHIFTS[i % SHIFTS.length]}px)` }}>
              <${ScrapbookPage} memory=${m} />
            </div>
            ${m.isNew
              ? html`<div className="flex justify-center -mt-3 relative z-10">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase bg-ivory text-rose" style=${{ boxShadow: '0 2px 6px -2px rgba(92,64,44,0.35)' }}>Today’s page</span>
                </div>`
              : null}
          </button>`
        )}
      </div>

      <div className="px-8 pt-12 pb-6 text-center fade-up">
        <div className="relative mx-auto w-[180px] h-[46px]">
          ${[0, 1, 2].map(
            (k) => html`<div key=${k} className="absolute inset-x-0 h-[34px] rounded-[4px] cardstock grain" style=${{ top: k * 5, background: ['#EFE4CF', '#F1E1DB', '#F5EBCF'][k], transform: `rotate(${[-2, 1.5, -0.5][k]}deg)`, boxShadow: 'var(--shadow-soft)' }} />`
          )}
        </div>
        <p className="font-serif italic text-[16px] text-muted mt-4">…and ${older} more pages, back to ${state.coupleSince}.</p>
      </div>
    <//>`;
  }

  LDR.SCREENS.ourStory = OurStoryScreen;
})();
