/*
  today.js

  Tier 1 · Screen 2 — TODAY, the home tab.
  The hero is today's Hunt Card. What sits around it depends on where the Hunt is:

    open      → closed card showing my prompt + "Start Hunt"
    submitted → card turned over: my photo on the back, 🔒 locked, calm waiting line
    ready     → both cards in, "Your cards are ready to open ❤️" → Reveal
    revealed  → both finds shown small, deliberate "Add to Our Story"
    added     → today's finished page, "See it in Our Story"

  Also handles the quiet states: Vacation Mode (Hunts paused) and archived.
  Used by: navigation registry (root of the 'today' tab).
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { Screen, PrimaryButton, SecondaryButton, TextLink, CoinPill, HuntCardFront, HuntCardBack, FlipCard, Polaroid, ScrapbookPage, Icon, SectionLabel, cx } = LDR;

  // Morning/afternoon/evening greeting from the local clock.
  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  /*
    TodayHeader — greeting, date line, decorative streak and the coin wallet.
    The streak is shown, never used to pressure (no warnings anywhere).
  */
  function TodayHeader({ state, onCoins }) {
    const { vintage } = LDR.useStyle();
    return html`<div className="safe-top px-6 pb-1">
      <div className="flex items-start justify-between pt-2">
        <div className="fade-up">
          <div className=${cx('text-[12px] font-semibold tracking-[0.16em] uppercase text-muted', vintage && 'label-type')}>${state.today.date}</div>
          <h1 className="font-serif text-[27px] leading-tight tracking-[-0.02em] mt-1">
            ${greeting()}, ${state.user.name} <span className="text-[22px] align-[2px]" aria-hidden="true">❤️</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1.5 pt-1">
          <${CoinPill} amount=${state.coins} onClick=${onCoins} />
          <span className="text-[12.5px] text-muted font-medium" title="Days you’ve both hunted in a row">🔥 ${state.streak}</span>
        </div>
      </div>
    </div>`;
  }

  /*
    HeroCard — the big collectible card. Flipped (photo side up) once
    submitted; gently breathing while it waits to be started.
  */
  function HeroCard({ today, flipped }) {
    return html`<div className="relative mx-auto" style=${{ width: 'min(266px, 70%)', aspectRatio: '5 / 7' }}>
      <div className=${'absolute inset-0 ' + (flipped ? '' : 'card-breathe')} style=${{ '--tilt': '-1.2deg' }}>
        <${FlipCard}
          className="w-full h-full"
          flipped=${flipped}
          radius=${22}
          front=${html`<${HuntCardFront} prompt=${today.myPrompt} tint=${today.myTint} tag="Your Hunt" date=${today.date} category=${today.category} />`}
          back=${html`<${HuntCardBack} tint=${today.myTint} photo=${today.myPhoto} locked label="my morning" />`}
        />
      </div>
    </div>`;
  }

  // A small "notice" card used for paused / archived states.
  function QuietCard({ emoji, title, body, action }) {
    return html`<div className="mx-6 mt-8 surface grain px-6 py-9 text-center fade-up">
      <div className="text-[30px]" aria-hidden="true">${emoji}</div>
      <div className="font-serif text-[22px] leading-snug mt-3">${title}</div>
      <p className="text-[14.5px] text-muted leading-relaxed mt-2">${body}</p>
      ${action ? html`<div className="mt-5">${action}</div>` : null}
    </div>`;
  }

  /*
    TodayScreen — the TODAY tab root. Reads today's Hunt from the store and
    renders the matching state; all actions push into the Hunt flow stack.
  */
  function TodayScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const t = state.today;
    const missedCount = state.missed.filter((m) => m.status !== 'revealed').length;
    const goShop = () => nav.goTo('story', [['shop', {}]]);

    let body;
    if (state.archived) {
      body = html`<${QuietCard}
        emoji="🗂️"
        title="Our Story is archived"
        body="New Hunts have stopped. Every page you made together is safe and still yours to look through."
        action=${html`<${SecondaryButton} onClick=${() => nav.switchTab('story')} icon="story">Open Our Story<//>`}
      />`;
    } else if (state.vacation) {
      body = html`<${QuietCard}
        emoji="🌿"
        title="Hunts are paused"
        body="Vacation Mode is on, so no new cards will arrive while you’re away. Your story will be right here."
        action=${html`<${SecondaryButton} onClick=${() => nav.goTo('us', [['vacation', {}]])}>Vacation Mode settings<//>`}
      />`;
    } else if (t.status === 'open' || t.status === 'submitted') {
      const submitted = t.status === 'submitted';
      body = html`<div className="pt-5">
        <div className="fade-up" style=${{ animationDelay: '80ms' }}><${HeroCard} today=${t} flipped=${submitted} /></div>
        <div className="px-6 mt-7 fade-up" style=${{ animationDelay: '180ms' }}>
          ${submitted
            ? html`<div className="text-center">
                <p className="font-serif text-[19px] leading-snug">Your card is locked.<br /><span className="text-muted">Waiting for your person…</span></p>
                <div className="mt-5"><${SecondaryButton} onClick=${() => nav.push('waiting')}>Don’t peek <span className="peek" aria-hidden="true">👀</span><//></div>
              </div>`
            : html`<${PrimaryButton} icon="camera" onClick=${() => nav.push('startHunt')}>Start Hunt<//>
                <p className="text-center text-[13px] text-muted mt-3">${state.partner.name} got a different card today — you’ll see it at the reveal.</p>`}
        </div>
      </div>`;
    } else if (t.status === 'ready') {
      body = html`<div className="pt-6">
        <div className="relative mx-auto h-[300px]" style=${{ width: 'min(320px, 86%)' }}>
          <div className="absolute left-[2%] top-[18px] w-[52%] aspect-[5/7] rounded-[18px] overflow-hidden card-shape fade-up" style=${{ transform: 'rotate(-7deg)', boxShadow: 'var(--shadow-card)' }}>
            <${HuntCardFront} prompt=${t.myPrompt} tint=${t.myTint} tag="Your card" />
          </div>
          <div className="absolute right-[2%] top-0 w-[52%] aspect-[5/7] rounded-[18px] overflow-hidden card-shape fade-up" style=${{ transform: 'rotate(6deg)', boxShadow: 'var(--shadow-card)', animationDelay: '120ms' }}>
            <${HuntCardFront} prompt=${t.theirPrompt} tint=${t.theirTint} tag="Their card" />
          </div>
        </div>
        <div className="px-6 mt-6 text-center fade-up" style=${{ animationDelay: '220ms' }}>
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] uppercase text-rose">
            <span className="w-2 h-2 rounded-full bg-rose soft-pulse" /> Both cards are in
          </div>
          <p className="font-serif text-[22px] mt-2">Your cards are ready to open <span aria-hidden="true">❤️</span></p>
          <div className="mt-5"><${PrimaryButton} onClick=${() => nav.push('reveal', {}, 'fade')}>Go to the reveal<//></div>
        </div>
      </div>`;
    } else if (t.status === 'revealed') {
      body = html`<div className="pt-6 px-6">
        <div className="flex justify-center gap-3 fade-up">
          <div className="w-[44%]"><${Polaroid} photo=${t.myPhoto} caption="your find" rotate=${-3} /></div>
          <div className="w-[44%] mt-4"><${Polaroid} photo=${t.theirPhoto} caption="their find" rotate=${3} /></div>
        </div>
        <p className="font-serif text-[20px] text-center mt-7 fade-up" style=${{ animationDelay: '120ms' }}>Want to keep this one?</p>
        <div className="mt-4 fade-up" style=${{ animationDelay: '180ms' }}>
          <${PrimaryButton} onClick=${() => nav.push('addToStory', {}, 'fade')}>Add to Our Story<//>
          <div className="text-center mt-1"><${TextLink} onClick=${() => nav.push('reveal', { revealed: true }, 'fade')}>Back to the reveal<//></div>
        </div>
      </div>`;
    } else {
      const memory = state.memories.find((m) => m.id === t.memoryId);
      body = html`<div className="pt-5 px-6">
        <div className="mx-auto fade-up" style=${{ width: 'min(250px, 72%)', transform: 'rotate(-1.5deg)' }}>
          ${memory ? html`<${ScrapbookPage} memory=${memory} showMeta=${false} />` : null}
        </div>
        <p className="font-serif text-[21px] text-center mt-6 fade-up" style=${{ animationDelay: '100ms' }}>Today’s page is in Our Story <span aria-hidden="true">✨</span></p>
        <p className="text-center text-[14px] text-muted mt-1.5 fade-up" style=${{ animationDelay: '140ms' }}>A new Hunt arrives tomorrow morning.</p>
        <div className="mt-5 fade-up" style=${{ animationDelay: '200ms' }}>
          <${SecondaryButton} icon="story" onClick=${() => nav.goTo('story', [['memory', { id: t.memoryId }]])}>See it in Our Story<//>
          <div className="text-center mt-1"><${TextLink} onClick=${actions.replayToday}>Replay today’s Hunt (demo)<//></div>
        </div>
      </div>`;
    }

    return html`<${Screen} tabs header=${html`<${TodayHeader} state=${state} onCoins=${goShop} />`}>
      ${body}
      ${!state.archived && missedCount
        ? html`<div className="px-6 mt-8">
            <button
              onClick=${() => nav.push('missed')}
              className="w-full surface grain flex items-center gap-3 px-4 py-3.5 text-left active:scale-[0.99] transition"
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#ECEEE4] text-sage"><${Icon} name="cards" size=${18} /></span>
              <span className="flex-1">
                <span className="block text-[14.5px]">Missed Hunts</span>
                <span className="block text-[12.5px] text-muted">${missedCount} waiting whenever you’re ready</span>
              </span>
              <${Icon} name="chevron" size=${16} className="text-muted" />
            </button>
          </div>`
        : null}
      ${state.huntMode > 1 && !state.archived && !state.vacation
        ? html`<p className="text-center text-[12px] text-muted mt-4 px-8">${state.huntMode}-Hunt mode is on · this prototype plays one card pair.</p>`
        : null}
      <div className="h-6" />
    <//>`;
  }

  LDR.SCREENS.today = TodayScreen;
})();
