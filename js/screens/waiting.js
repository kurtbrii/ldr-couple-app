/*
  waiting.js

  Tier 1 · Screen 4 — Waiting.
  After submitting, my card sits locked next to my partner's (still closed) card.
  Calm, never guilt-inducing: no countdown, no "they're taking a while".

  A clearly-labelled prototype control simulates the partner submitting; the
  screen then turns into "Your cards are ready to open ❤️" → Reveal.

  Used by: navigation registry ('waiting'), reached from Submit or TODAY.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { Screen, TopBar, PrimaryButton, HuntCardBack, HuntCardFront, Sparkles } = LDR;

  /*
    WaitingScreen — two cards side by side: mine (photo, locked) and theirs.
    Theirs shows a soft "still hunting" face until the partner submits, then
    a locked stamp lands on it and the Reveal CTA appears.
  */
  function WaitingScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const t = state.today;
    const ready = t.status === 'ready';

    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} />`} bodyClass="flex flex-col">
      <div className="relative mx-auto mt-4 h-[290px] shrink-0" style=${{ width: 'min(330px, 88%)' }}>
        <div className="absolute left-0 top-6 w-[54%] aspect-[5/7] rounded-[18px] overflow-hidden fade-up" style=${{ transform: 'rotate(-6deg)', boxShadow: 'var(--shadow-card)' }}>
          <${HuntCardBack} tint=${t.myTint} photo=${t.myPhoto} locked label="my find" />
        </div>
        <div
          className=${'absolute right-0 top-0 w-[54%] aspect-[5/7] rounded-[18px] overflow-hidden fade-up transition-all duration-700 ' + (ready ? '' : 'opacity-[0.88]')}
          style=${{ transform: ready ? 'rotate(5deg)' : 'rotate(7deg) translateY(10px)', boxShadow: 'var(--shadow-card)', animationDelay: '120ms' }}
        >
          ${ready
            ? html`<${HuntCardBack} tint=${t.theirTint} locked animatePlace />`
            : html`<${HuntCardFront} prompt="Still out hunting…" tint=${t.theirTint} tag=${state.partner.name + '’s card'} />`}
        </div>
        ${ready ? html`<${Sparkles} key="ready" count=${12} spread=${170} />` : null}
      </div>

      <div className="flex-1 flex flex-col px-7 pt-8 pb-8 text-center">
        ${ready
          ? html`<div key="ready" className="fade-up">
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] uppercase text-rose">
                <span className="w-2 h-2 rounded-full bg-rose soft-pulse" /> ${state.partner.name} found theirs
              </div>
              <h1 className="font-serif text-[27px] leading-tight tracking-[-0.02em] mt-2">Your cards are ready to open <span aria-hidden="true">❤️</span></h1>
              <div className="mt-7"><${PrimaryButton} onClick=${() => nav.replace('reveal', {}, 'fade')}>Go to the reveal<//></div>
            </div>`
          : html`<div key="wait" className="fade-up" style=${{ animationDelay: '200ms' }}>
              <h1 className="font-serif text-[27px] leading-tight tracking-[-0.02em]">Your card is locked.</h1>
              <p className="font-serif text-[19px] text-muted mt-1">Waiting for your person…</p>
              <p className="font-hand text-[27px] text-ink/80 mt-5" style=${{ transform: 'rotate(-2deg)' }}>Don’t peek <span className="peek" aria-hidden="true">👀</span></p>
              <p className="text-[13.5px] text-muted leading-relaxed mt-5 max-w-[270px] mx-auto">We’ll let you know the moment both cards are in. Go enjoy your day.</p>
            </div>`}

        <div className="flex-1" />
        ${!ready
          ? html`<button
              onClick=${actions.simulatePartner}
              className="mx-auto mt-8 px-4 py-2.5 rounded-full text-[12.5px] text-muted active:text-ink"
              style=${{ border: '1px dashed rgba(136,121,112,0.55)' }}
            >Prototype · simulate ${state.partner.name} submitting</button>`
          : null}
      </div>
    <//>`;
  }

  LDR.SCREENS.waiting = WaitingScreen;
})();
