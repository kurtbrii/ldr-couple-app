/*
  missed.js

  Tier 2 · Screen 12 — Missed Hunts.
  A gentle, dedicated page. The same Hunt is framed differently per partner:
    - I submitted, they didn't → "Waiting for Kurt to complete this Hunt."
    - They submitted, I didn't → "You missed!" + "Complete now"
  No deadlines, no guilt. Completing one reuses the normal capture flow
  (hunt.js with params.missedId); once both cards are in, it can be opened
  right here with a small simultaneous flip.

  This is an isolated lightweight demo — it doesn't feed into Our Story.
  Used by: navigation registry ('missed'), from TODAY and US.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState } = React;
  const { Screen, TopBar, PrimaryButton, HuntCardFront, HuntCardBack, FlipCard, Sparkles, Polaroid } = LDR;

  /*
    MissedCard — one missed Hunt: date, the two little cards, framed copy and
    the single action that applies to me (if any).
  */
  function MissedCard({ m, partner, onComplete, onReveal, justCompleted }) {
    const [flipped, setFlipped] = useState(m.status === 'revealed');
    const open = () => {
      setFlipped(true);
      setTimeout(onReveal, 1150);
    };

    const mineFront = html`<${HuntCardFront} prompt=${m.myPrompt} tint=${m.myTint} tag="Your card" />`;
    const theirsFront = html`<${HuntCardFront} prompt=${m.whoMissed === 'them' ? 'Still out hunting…' : m.theirPrompt} tint=${m.theirTint} tag=${partner + '’s card'} />`;

    let mine;
    let theirs;
    if (m.status === 'ready' || m.status === 'revealed') {
      // Both in: the closed fronts, ready to flip to the photos.
      mine = html`<${FlipCard} className="w-full aspect-[5/7]" radius=${14} flipped=${flipped} lift front=${mineFront} back=${html`<${HuntCardBack} tint=${m.myTint} photo=${m.myPhoto} label="mine" />`} />`;
      theirs = html`<${FlipCard} className="w-full aspect-[5/7]" radius=${14} flipped=${flipped} lift front=${html`<${HuntCardFront} prompt=${m.theirPrompt} tint=${m.theirTint} tag=${partner + '’s card'} />`} back=${html`<${HuntCardBack} tint=${m.theirTint} photo=${m.theirPhoto || 'sunset'} label=${partner} />`} />`;
    } else {
      // One side in: the submitted side shows locked, the other its prompt.
      const lockedBack = (tint, photo, label) => html`<div className="w-full aspect-[5/7] rounded-[14px] overflow-hidden" style=${{ boxShadow: 'var(--shadow-card)' }}><${HuntCardBack} tint=${tint} photo=${photo} locked label=${label} /></div>`;
      const front = (node) => html`<div className="w-full aspect-[5/7] rounded-[14px] overflow-hidden" style=${{ boxShadow: 'var(--shadow-card)' }}>${node}</div>`;
      mine = m.myPhoto ? lockedBack(m.myTint, m.myPhoto, 'mine') : front(mineFront);
      // Their submitted photo stays hidden from me: show their card back with no photo.
      theirs = m.theirPhoto ? lockedBack(m.theirTint, null) : front(theirsFront);
    }

    let copy;
    if (m.status === 'revealed') {
      copy = html`<p className="font-serif text-[18px]">Opened together <span aria-hidden="true">✨</span></p>`;
    } else if (m.status === 'ready') {
      copy = html`<div>
        <p className="font-serif text-[18px]">Both cards are in.</p>
        <div className="mt-3"><${PrimaryButton} onClick=${open} className="!h-[46px]">Open together<//></div>
      </div>`;
    } else if (m.whoMissed === 'me') {
      copy = html`<div>
        <p className="font-serif text-[20px]">You missed!</p>
        <p className="text-[13.5px] text-muted mt-1 leading-relaxed">${partner}’s card is in. Finish yours whenever it suits you — there’s no rush.</p>
        <div className="mt-3"><${PrimaryButton} onClick=${onComplete} icon="camera" className="!h-[46px]">Complete now<//></div>
      </div>`;
    } else {
      copy = html`<div>
        <p className="font-serif text-[18px] leading-snug">Waiting for ${partner} to complete this Hunt.</p>
        <p className="text-[13.5px] text-muted mt-1">Your card is safe and locked.</p>
      </div>`;
    }

    return html`<div className=${'surface grain px-5 pt-4 pb-5 fade-up ' + (justCompleted ? 'page-settle' : '')}>
      <div className="flex items-baseline justify-between">
        <div className="font-serif text-[19px]">${m.date}</div>
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted">${m.status === 'revealed' ? 'Opened' : m.status === 'ready' ? 'Ready' : m.whoMissed === 'me' ? 'Your turn' : partner + '’s turn'}</div>
      </div>
      <div className="relative flex gap-4 mt-4 px-3">
        <div className="w-1/2" style=${{ transform: 'rotate(-2.5deg)' }}>${mine}</div>
        <div className="w-1/2" style=${{ transform: 'rotate(2.5deg)' }}>${theirs}</div>
        ${flipped && m.status !== 'revealed' ? html`<${Sparkles} count=${10} spread=${130} />` : null}
      </div>
      <div className="mt-5 text-center">${copy}</div>
    </div>`;
  }

  /*
    MissedHuntsScreen — the list. Copy is warm and pressure-free; partner-side
    framing comes from each item's `whoMissed`.
  */
  function MissedHuntsScreen({ params }) {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} title="Missed Hunts" serif />`}>
      <div className="px-6 pt-1 pb-10">
        <p className="text-[14.5px] text-muted leading-relaxed">No deadlines here. These cards wait for you both, whenever it feels right.</p>
        <div className="space-y-5 mt-6">
          ${state.missed.map(
            (m) => html`<${MissedCard}
              key=${m.id}
              m=${m}
              partner=${state.partner.name}
              justCompleted=${params.justCompleted === m.id}
              onComplete=${() => nav.push('startHunt', { missedId: m.id })}
              onReveal=${() => actions.revealMissed(m.id)}
            />`
          )}
        </div>
        <p className="text-center text-[12px] text-muted mt-6">If you both miss a day, it simply slips away — nothing to catch up on.</p>
      </div>
    <//>`;
  }

  LDR.SCREENS.missed = MissedHuntsScreen;
})();
