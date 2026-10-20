/*
  add-to-story.js

  Tier 1 · Screen 7 — Add to Our Story (template auto-compose).
  The decision is deliberate (the user tapped "Add to Our Story"); the result is
  effortless: the two finds drop into a template, tape and a date stamp appear,
  and a finished page assembles itself like a little gift.

  After it lands: "Added to Our Story ✨", a one-tap template swap row, and a
  way to see the page in OUR STORY.

  Used by: navigation registry ('addToStory'), reached from Reveal or TODAY.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useEffect, useRef } = React;
  const { Screen, TopBar, PrimaryButton, TextLink, ScrapbookPage, Sparkles, Polaroid } = LDR;

  /*
    TemplateSwapRow — owned templates as small paper swatches. One tap swaps
    the page's template; anything not owned points to the Coin Shop.
  */
  function TemplateSwapRow({ current, owned, onPick, onShop }) {
    return html`<div className="hscroll -mx-6 px-6">
      <div className="flex gap-2.5 w-max pb-1">
        ${owned.map((id) => {
          const tpl = LDR.TEMPLATES[id];
          const on = id === current;
          return html`<button
            key=${id}
            onClick=${() => onPick(id)}
            aria-pressed=${on}
            className="flex items-center gap-2 h-10 pl-1.5 pr-3.5 rounded-full text-[13.5px] transition-all"
            style=${{ background: on ? 'var(--ivory)' : 'rgba(255,249,240,0.5)', boxShadow: on ? 'inset 0 0 0 1.5px var(--ink)' : 'inset 0 0 0 1px rgba(136,121,112,0.25)' }}
          >
            <span className="w-7 h-7 rounded-full cardstock grain" style=${{ background: tpl.paper, boxShadow: `inset 0 0 0 3px ${tpl.tapes[0]}` }} />
            ${tpl.name}
          </button>`;
        })}
        <button onClick=${onShop} className="h-10 px-3.5 rounded-full text-[13.5px] text-muted" style=${{ border: '1px dashed rgba(136,121,112,0.45)' }}>More in the shop</button>
      </div>
    </div>`;
  }

  /*
    AddToStoryScreen — creates the memory on mount, then plays:
      'gather'  → the two finds float in the middle (from the reveal)
      'compose' → the scrapbook page assembles itself
      'done'    → confirmation + template swap + next actions
  */
  function AddToStoryScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const t = state.today;
    const [phase, setPhase] = useState('gather');
    const [settleKey, setSettleKey] = useState(0);
    const timers = useRef([]);

    useEffect(() => {
      actions.addToStory();
      timers.current.push(setTimeout(() => setPhase('compose'), 900));
      timers.current.push(setTimeout(() => setPhase('done'), 3300));
      return () => timers.current.forEach(clearTimeout);
    }, []);

    const memory = state.memories.find((m) => m.id === t.memoryId);

    const swap = (template) => {
      actions.updateMemory(memory.id, { template });
      setSettleKey((k) => k + 1);
    };

    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.popToRoot} backIcon="close" />`}
      footer=${phase === 'done'
        ? html`<div className="px-6 pb-7 pt-3 fade-up">
            <${PrimaryButton} onClick=${() => nav.goTo('story', [['memory', { id: memory.id }]])}>See it in Our Story<//>
            <div className="text-center"><${TextLink} onClick=${nav.popToRoot}>Done<//></div>
          </div>`
        : null}
    >
      <div className="px-6 text-center min-h-[58px]">
        ${phase === 'done'
          ? html`<div className="fade-up">
              <h1 className="font-serif text-[25px] tracking-[-0.02em]">Added to Our Story <span aria-hidden="true">✨</span></h1>
              <p className="text-[13.5px] text-muted mt-1">${t.date} · page ${state.stats.moments}</p>
            </div>`
          : html`<p className="font-serif italic text-[18px] text-muted pt-2 fade-in">Making your page…</p>`}
      </div>

      <div className="relative px-9 mt-3">
        ${phase === 'gather'
          ? html`<div className="relative flex justify-center gap-3 pt-16 pb-24">
              <div className="w-[46%] fade-up"><${Polaroid} photo=${t.myPhoto} rotate=${-4} caption="your find" /></div>
              <div className="w-[46%] fade-up mt-6" style=${{ animationDelay: '120ms' }}><${Polaroid} photo=${t.theirPhoto} rotate=${4} caption="their find" /></div>
            </div>`
          : memory
          ? html`<div key=${'p' + settleKey} className=${settleKey ? 'page-settle' : ''}>
              <${ScrapbookPage} memory=${memory} compose=${phase === 'compose' && !settleKey} />
            </div>`
          : null}
        ${phase === 'done' && !settleKey ? html`<div className="absolute inset-0 pointer-events-none"><${Sparkles} count=${12} spread=${180} /></div>` : null}
      </div>

      ${phase === 'done' && memory
        ? html`<div className="px-6 mt-6 fade-up" style=${{ animationDelay: '120ms' }}>
            <div className="text-[12.5px] text-muted mb-2.5">Template</div>
            <${TemplateSwapRow}
              current=${memory.template}
              owned=${state.owned.templates}
              onPick=${swap}
              onShop=${() => nav.goTo('story', [['shop', {}]])}
            />
          </div>`
        : null}
      <div className="h-4" />
    <//>`;
  }

  LDR.SCREENS.addToStory = AddToStoryScreen;
})();
