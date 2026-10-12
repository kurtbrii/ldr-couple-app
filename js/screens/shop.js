/*
  shop.js

  Tier 2 · Screen 11 — Coin Shop.
  A scrapbook customisation store: TEMPLATES · STICKERS · FRAMES · THEMES with
  butter-yellow coin prices, the shared balance top-right, a free starter set,
  and a few Premium items. Buying asks once, then unlocks with a coin bump.

  Coins are shared by the couple and can never go negative. When the story is
  archived, shared spending is paused.

  Used by: navigation registry ('shop') — from OUR STORY, TODAY's coin pill,
  the editor tray, US settings.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useRef } = React;
  const { Screen, TopBar, CoinPill, PrimaryButton, SecondaryButton, Sticker, Polaroid, SectionLabel, Icon } = LDR;

  const SECTIONS = [
    ['templates', 'Templates'],
    ['stickers', 'Stickers'],
    ['frames', 'Frames'],
    ['themes', 'Themes'],
  ];

  /*
    PriceTag — the state of an item: Owned ✓ / Free / "150 🪙" coin token.
    Premium items carry a small sage tag next to the price.
  */
  function PriceTag({ item, owned }) {
    if (owned) {
      return html`<span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-sage"><${Icon} name="check" size=${14} stroke=${2.2} /> Owned</span>`;
    }
    return html`<span className="coin-pill !text-[12.5px] !py-[3px]"><span aria-hidden="true">🪙</span>${item.price}</span>`;
  }

  // A tiny page preview for a template card.
  function TemplatePreview({ id }) {
    const tpl = LDR.TEMPLATES[id];
    return html`<div className="relative w-full aspect-[3/4] rounded-[5px] overflow-hidden cardstock grain" style=${{ background: tpl.paper, boxShadow: 'var(--shadow-soft)' }}>
      <div className="absolute left-[10%] top-[8%] h-[5%] w-[38%] rounded-[1px]" style=${{ background: tpl.dark ? '#E9E3D6' : tpl.accent, opacity: 0.55 }} />
      ${tpl.slots.map(
        (s, i) => html`<div
          key=${i}
          className="absolute bg-[#FFFDF8]"
          style=${{ left: s.x + '%', top: s.y + '%', width: s.w + '%', aspectRatio: '4 / 5.6', transform: `rotate(${s.r}deg)`, boxShadow: '0 2px 4px -1px rgba(61,40,28,0.3)', padding: '5% 5% 18%' }}
        ><img src=${LDR.photo(i ? 'sunset' : 'coffee').src} alt="" className="w-full h-full object-cover" /></div>`
      )}
      <div className="absolute h-[5%] w-[22%]" style=${{ left: tpl.slots[0].x + 10 + '%', top: tpl.slots[0].y - 2 + '%', background: tpl.tapes[0], opacity: 0.85, transform: 'rotate(-6deg)' }} />
    </div>`;
  }

  /*
    ConfirmSheet — "Unlock X for 150 🪙?" or, if the balance is short, a
    gentle note about earning more (never a hard paywall).
  */
  function ConfirmSheet({ item, coins, archived, onConfirm, onClose }) {
    const short = item.price - coins;
    return html`<div className="absolute inset-0 z-50">
      <button className="absolute inset-0 bg-[rgba(61,53,48,0.35)] fade-in" aria-label="Close" onClick=${onClose} />
      <div className="absolute left-0 right-0 bottom-0 paper-bg grain rounded-t-[28px] px-6 pt-3 pb-8 anim-sheet-in" style=${{ boxShadow: '0 -10px 30px -10px rgba(61,40,28,0.4)' }} role="dialog" aria-label=${'Unlock ' + item.name}>
        <div className="mx-auto w-10 h-1.5 rounded-full bg-[rgba(136,121,112,0.35)] mb-5" />
        <div className="text-center">
          <div className="font-serif text-[23px]">${item.name}</div>
          ${item.note ? html`<div className="text-[13.5px] text-muted mt-1">${item.note}</div>` : null}
          <div className="mt-4"><span className="coin-pill text-[16px] px-3.5 py-1.5"><span aria-hidden="true">🪙</span>${item.price}</span></div>
        </div>
        ${archived
          ? html`<p className="text-center text-[14px] text-muted mt-5">Shared coin spending is paused while Our Story is archived.</p>
              <div className="mt-5"><${SecondaryButton} onClick=${onClose}>Okay<//></div>`
          : short > 0
          ? html`<p className="text-center text-[14px] text-muted leading-relaxed mt-5">You’re ${short} coins away. Every Hunt you finish adds <b className="font-semibold text-ink">10 🪙</b> to your shared jar.</p>
              <div className="mt-5"><${SecondaryButton} onClick=${onClose}>Maybe later<//></div>`
          : html`<p className="text-center text-[13.5px] text-muted mt-5">Paid from your shared coins · ${coins} → ${coins - item.price}</p>
              <div className="mt-5 space-y-2.5">
                <${PrimaryButton} onClick=${onConfirm}>Unlock<//>
                <${SecondaryButton} onClick=${onClose}>Not now<//>
              </div>`}
      </div>
    </div>`;
  }

  /*
    ShopScreen — sections stacked vertically, with jump chips at the top.
    Tapping an unowned item opens the ConfirmSheet; buying goes through
    actions.buy, which guards against double purchases and negative balances.
  */
  function ShopScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const [pending, setPending] = useState(null);
    const scrollRef = useRef(null);
    const isOwned = (item) => state.owned[item.kind].includes(item.id);

    const tap = (item) => {
      if (isOwned(item)) return actions.toast(`${item.name} is already yours`);
      setPending(item);
    };
    const confirm = () => {
      const result = actions.buy(pending, state);
      if (result === 'ok') actions.toast(`Unlocked ${pending.name} ✨`);
      setPending(null);
    };
    const jump = (id) => {
      const el = scrollRef.current.querySelector(`[data-section="${id}"]`);
      if (el) scrollRef.current.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
    };

    const card = (item, preview, wide = false) => html`<button
      key=${item.id}
      onClick=${() => tap(item)}
      className=${'relative surface grain text-left p-3 flex active:scale-[0.98] transition ' + (wide ? 'items-center gap-4' : 'flex-col')}
      aria-label=${item.name + (isOwned(item) ? ', owned' : `, ${item.price} coins`)}
    >
      ${item.premium && !isOwned(item)
        ? html`<span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-[0.12em] uppercase" style=${{ background: '#E6EADF', color: '#5F6C57' }}>Premium</span>`
        : null}
      <div className=${wide ? 'w-[86px] shrink-0' : 'w-full'}>${preview}</div>
      <div className=${wide ? 'flex-1 min-w-0' : 'mt-2.5'}>
        <div className="text-[14.5px] font-medium leading-tight">${item.name}</div>
        ${item.note && wide ? html`<div className="text-[12.5px] text-muted mt-0.5 leading-snug">${item.note}</div>` : null}
        <div className="mt-2"><${PriceTag} item=${item} owned=${isOwned(item)} /></div>
      </div>
    </button>`;

    return html`<${Screen}
      scrollRef=${scrollRef}
      header=${html`<${TopBar} onBack=${nav.pop} title="Coin Shop" serif right=${html`<${CoinPill} amount=${state.coins} />`} />`}
    >
      <div className="px-6 pt-1">
        <p className="font-serif italic text-[18px] leading-snug">Make your story yours.</p>
        <p className="text-[13px] text-muted mt-1">Coins are shared — you and ${state.partner.name} both earn and spend them. The starter set is free.</p>
      </div>

      <div className="sticky top-0 z-10 hscroll px-6 py-3 mt-1" style=${{ background: 'linear-gradient(#F4EDE1 70%, rgba(244,237,225,0))' }}>
        <div className="flex gap-2 w-max">
          ${SECTIONS.map(([id, label]) => html`<button key=${id} onClick=${() => jump(id)} className="h-8 px-3.5 rounded-full text-[13px] bg-ivory" style=${{ boxShadow: 'inset 0 0 0 1px rgba(136,121,112,0.25)' }}>${label}</button>`)}
        </div>
      </div>

      <div className="px-6 pb-10 space-y-8">
        <section data-section="templates">
          <${SectionLabel} className="mb-3">Templates<//>
          <div className="grid grid-cols-2 gap-3">${LDR.SHOP.templates.map((it) => card(it, html`<${TemplatePreview} id=${it.id} />`))}</div>
        </section>

        <section data-section="stickers">
          <${SectionLabel} className="mb-3">Stickers<//>
          <div className="grid grid-cols-3 gap-2.5">
            ${LDR.SHOP.stickers.map((it) =>
              card(it, html`<div className="flex items-center justify-center h-[70px]"><${Sticker} id=${it.id} size=${58} /></div>`)
            )}
          </div>
        </section>

        <section data-section="frames">
          <${SectionLabel} className="mb-3">Frames<//>
          <div className="grid grid-cols-3 gap-2.5">
            ${LDR.SHOP.frames.map((it) =>
              card(it, html`<div className="px-3 pt-1"><${Polaroid} photo="flowers" frame=${it.id} rotate=${-2} scaleText /></div>`)
            )}
          </div>
        </section>

        <section data-section="themes">
          <${SectionLabel} className="mb-1">Themes<//>
          <p className="text-[12.5px] text-muted mb-3">Bundles — a template with matching frames and stickers.</p>
          <div className="space-y-3">
            ${LDR.SHOP.themes.map((it) => {
              const g = it.grants;
              const tplId = (g.templates || [])[0];
              const preview = html`<div className="relative h-[92px]">
                ${tplId
                  ? html`<div className="absolute left-0 top-0 w-[62px]"><${TemplatePreview} id=${tplId} /></div>`
                  : html`<div className="absolute left-0 top-1 w-[56px]"><${Polaroid} photo="book" frame=${(g.frames || ['polaroid'])[0]} rotate=${-4} scaleText /></div>`}
                ${(g.stickers || []).slice(0, 2).map(
                  (sid, i) => html`<div key=${sid} className="absolute" style=${{ left: 40 + i * 18, top: 44 - i * 30 }}><${Sticker} id=${sid} size=${40} /></div>`
                )}
              </div>`;
              return card(it, preview, true);
            })}
          </div>
        </section>

        <p className="text-center text-[12px] text-muted leading-relaxed">Premium items come with the subscription and can be unlocked during your free trial. Prototype — no real purchases.</p>
      </div>

      ${pending
        ? html`<${ConfirmSheet} item=${pending} coins=${state.coins} archived=${state.archived} onConfirm=${confirm} onClose=${() => setPending(null)} />`
        : null}
    <//>`;
  }

  LDR.SCREENS.shop = ShopScreen;
})();
