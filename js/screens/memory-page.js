/*
  memory-page.js

  Tier 1 · Screen 9 — a single scrapbook page.
  One full decorated memory: the page itself (date, both prints, prompts,
  tape, stickers), then the small reactions/notes beneath, and a "Decorate"
  affordance into the editor. Read-only when the story is archived.

  Used by: navigation registry ('memory'), from OUR STORY or after Add to Our Story.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { Screen, TopBar, ScrapbookPage, SecondaryButton, Icon, Avatar, SectionLabel } = LDR;

  /*
    MemoryPageScreen — params.id picks the memory. Reactions are shown as
    "who → on whose find", comments as handwritten notes on little paper slips.
  */
  function MemoryPageScreen({ params }) {
    const nav = LDR.useNav();
    const { state } = LDR.useStore();
    const m = state.memories.find((x) => x.id === params.id);
    if (!m) return null;
    const me = state.user.name;
    const them = state.partner.name;
    const canEdit = !state.archived;

    const decorate = html`<button
      onClick=${() => nav.push('editor', { id: m.id }, 'sheet')}
      className="h-9 px-3.5 rounded-full flex items-center gap-1.5 text-[13.5px] font-medium bg-ivory active:scale-95 transition"
      style=${{ boxShadow: 'inset 0 0 0 1px rgba(136,121,112,0.3)' }}
    ><${Icon} name="pencil" size=${15} /> Decorate</button>`;

    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.pop} title=${m.date} serif subtitle=${m.weekday} right=${canEdit ? decorate : null} />`}
    >
      <div className="px-5 pt-3">
        <div className="page-settle" style=${{ transform: 'rotate(-0.4deg)' }}>
          <${ScrapbookPage} memory=${m} />
        </div>
      </div>

      <div className="px-6 mt-8 space-y-4">
        <${SectionLabel}>Reactions<//>
        <div className="surface grain divide-y divide-[rgba(136,121,112,0.14)]">
          ${[
            { who: them, tone: 'rose', emoji: m.reactions.onMine, on: `${me}’s find` },
            { who: me, tone: 'sage', emoji: m.reactions.onTheirs, on: `${them}’s find` },
          ]
            .filter((r) => r.emoji)
            .map(
              (r) => html`<div key=${r.who} className="flex items-center gap-3 px-4 py-3">
                <${Avatar} name=${r.who} tone=${r.tone} size=${32} />
                <span className="flex-1 text-[14px] text-muted"><span className="text-ink font-medium">${r.who}</span> on ${r.on}</span>
                <span className="text-[22px]">${r.emoji}</span>
              </div>`
            )}
        </div>

        ${m.comments.length
          ? html`<div className="pt-2">
              <${SectionLabel} className="mb-3">Notes<//>
              <div className="space-y-3">
                ${m.comments.map(
                  (c, i) => html`<div key=${i} className="relative surface grain px-5 pt-4 pb-3" style=${{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                    <div className="washi" style=${{ background: '#D9C9A8', width: 64, left: 'calc(50% - 32px)', top: -9, transform: 'rotate(-3deg)' }} />
                    <div className="font-hand text-[23px] leading-tight">${c.text}</div>
                    <div className="text-[12px] text-muted mt-1">— ${c.by}</div>
                  </div>`
                )}
              </div>
            </div>`
          : null}

        ${canEdit
          ? html`<div className="pt-3 pb-8"><${SecondaryButton} icon="pencil" onClick=${() => nav.push('editor', { id: m.id }, 'sheet')}>Decorate this page<//></div>`
          : html`<p className="text-center text-[13px] text-muted pt-3 pb-8">Archived pages are read-only.</p>`}
      </div>
    <//>`;
  }

  LDR.SCREENS.memory = MemoryPageScreen;
})();
