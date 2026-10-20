/*
  editor.js

  Tier 2 · Screen 10 — Scrapbook editor.
  The saved page with real sticker editing:
    - drag a sticker anywhere on the page (pointer events, works with touch)
    - rotate with the ↻ handle, scale with the ⤡ handle, remove with ×
    - a slight bounce when a sticker is dropped
    - tray tabs: Stickers · Templates · Frames (owned items; locked ones link to the shop)
    - the single-editor lock concept: "Jubi is decorating this page 🎨",
      previewable from Kurt's side with a toggle

  Edits live in a local draft until Save; Cancel throws them away.
  Used by: navigation registry ('editor'), opened as a sheet from a memory page.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useRef, useEffect } = React;
  const { Screen, ScrapbookPage, Sticker, Icon, Polaroid } = LDR;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const STICKER_W = 17; // sticker width in % of page width (matches ScrapbookPage)

  /*
    EditableSticker — one sticker on the canvas. Handles three gestures with
    pointer capture:
      body   → move (x/y in % of the page)
      ↻      → rotate (angle from the sticker centre to the pointer)
      ⤡      → scale (distance from the centre vs. where the drag started)
  */
  function EditableSticker({ s, selected, onSelect, onChange, onRemove, pageRef }) {
    const [dropKey, setDropKey] = useState(0);
    const drag = useRef(null);

    const begin = (mode) => (e) => {
      e.stopPropagation();
      e.preventDefault();
      onSelect(s.uid);
      const rect = pageRef.current.getBoundingClientRect();
      const cxPx = rect.left + (s.x / 100) * rect.width;
      const cyPx = rect.top + (s.y / 100) * rect.height;
      drag.current = {
        mode,
        rect,
        startX: e.clientX,
        startY: e.clientY,
        orig: { ...s },
        cx: cxPx,
        cy: cyPx,
        startAngle: Math.atan2(e.clientY - cyPx, e.clientX - cxPx),
        startDist: Math.hypot(e.clientX - cxPx, e.clientY - cyPx) || 1,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const move = (e) => {
      const d = drag.current;
      if (!d) return;
      if (d.mode === 'move') {
        const dx = ((e.clientX - d.startX) / d.rect.width) * 100;
        const dy = ((e.clientY - d.startY) / d.rect.height) * 100;
        onChange({ x: clamp(d.orig.x + dx, 4, 96), y: clamp(d.orig.y + dy, 3, 97) });
      } else if (d.mode === 'rotate') {
        const a = Math.atan2(e.clientY - d.cy, e.clientX - d.cx);
        onChange({ r: Math.round(d.orig.r + ((a - d.startAngle) * 180) / Math.PI) });
      } else if (d.mode === 'scale') {
        const dist = Math.hypot(e.clientX - d.cx, e.clientY - d.cy);
        onChange({ s: clamp(+(d.orig.s * (dist / d.startDist)).toFixed(2), 0.45, 2.2) });
      }
    };

    const end = () => {
      if (drag.current && drag.current.mode === 'move') setDropKey((k) => k + 1);
      drag.current = null;
    };

    const handle = 'absolute w-7 h-7 rounded-full bg-ivory flex items-center justify-center text-ink touch-none';
    const handleShadow = { boxShadow: '0 2px 6px -1px rgba(61,40,28,0.45), 0 0 0 1px rgba(136,121,112,0.25)' };

    return html`<div
      className="absolute"
      style=${{ left: s.x + '%', top: s.y + '%', width: STICKER_W + '%', transform: `translate(-50%, -50%) rotate(${s.r}deg) scale(${s.s})`, zIndex: selected ? 20 : 10 }}
    >
      <div
        key=${dropKey}
        className=${'relative touch-none cursor-grab active:cursor-grabbing ' + (dropKey ? 'sticker-drop' : '')}
        onPointerDown=${begin('move')}
        onPointerMove=${move}
        onPointerUp=${end}
        onPointerCancel=${end}
        role="button"
        tabIndex="0"
        aria-label=${(LDR.STICKERS[s.id] || {}).name + ' sticker'}
        onKeyDown=${(e) => {
          const step = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
          if (step) { e.preventDefault(); onChange({ x: clamp(s.x + step[0], 4, 96), y: clamp(s.y + step[1], 3, 97) }); }
          if (e.key === 'Delete' || e.key === 'Backspace') onRemove();
        }}
      >
        <${Sticker} id=${s.id} size="100%" style=${{ width: '100%', height: 'auto', pointerEvents: 'none' }} />
        ${selected
          ? html`<div className="absolute -inset-2 rounded-[10px] pointer-events-none" style=${{ border: '1.5px dashed rgba(61,53,48,0.55)' }} />`
          : null}
      </div>
      ${selected
        ? html`
            <button className=${handle + ' -left-5 -top-5'} style=${{ ...handleShadow, transform: `scale(${1 / s.s})` }} onPointerDown=${(e) => e.stopPropagation()} onClick=${onRemove} aria-label="Remove sticker">
              <${Icon} name="close" size=${14} stroke=${2} />
            </button>
            <span
              className=${handle + ' -right-5 -top-5 cursor-alias'}
              style=${{ ...handleShadow, transform: `scale(${1 / s.s})` }}
              onPointerDown=${begin('rotate')}
              onPointerMove=${move}
              onPointerUp=${end}
              aria-label="Rotate"
              title="Drag to rotate"
            ><${Icon} name="rotate" size=${14} stroke=${2} /></span>
            <span
              className=${handle + ' -right-5 -bottom-5 cursor-nwse-resize'}
              style=${{ ...handleShadow, transform: `scale(${1 / s.s})` }}
              onPointerDown=${begin('scale')}
              onPointerMove=${move}
              onPointerUp=${end}
              aria-label="Resize"
              title="Drag to resize"
            ><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 4 H20 V10 M10 20 H4 V14 M20 4 L4 20" /></svg></span>`
        : null}
    </div>`;
  }

  /*
    Tray — the bottom panel. Owned items are tappable; locked ones show a coin
    price and open the Coin Shop.
  */
  function Tray({ tab, setTab, state, draft, onAddSticker, onTemplate, onFrame, onShop }) {
    const tabs = [['stickers', 'Stickers'], ['templates', 'Templates'], ['frames', 'Frames']];
    const owned = state.owned;
    return html`<div className="paper-bg grain rounded-t-[26px] pt-3 pb-6" style=${{ boxShadow: '0 -8px 24px -12px rgba(61,40,28,0.35)' }}>
      <div className="flex justify-center gap-1 px-5 mb-3" role="tablist">
        ${tabs.map(
          ([id, label]) => html`<button
            key=${id}
            role="tab"
            aria-selected=${tab === id}
            onClick=${() => setTab(id)}
            className=${'h-8 px-3.5 rounded-full text-[13px] transition-colors ' + (tab === id ? 'bg-ink text-ivory font-medium' : 'text-muted')}
          >${label}</button>`
        )}
      </div>

      <div className="hscroll px-5">
        <div className="flex gap-2.5 w-max pr-5">
          ${tab === 'stickers' &&
          LDR.SHOP.stickers.map((item) => {
            const has = owned.stickers.includes(item.id);
            return html`<button
              key=${item.id}
              onClick=${() => (has ? onAddSticker(item.id) : onShop())}
              aria-label=${has ? 'Add ' + item.name : item.name + ' — ' + item.price + ' coins'}
              className="relative w-[66px] h-[74px] rounded-[16px] flex flex-col items-center justify-center surface active:scale-95 transition"
            >
              <${Sticker} id=${item.id} size=${42} style=${{ opacity: has ? 1 : 0.38, filter: has ? 'none' : 'grayscale(0.6)' }} />
              ${has ? null : html`<span className="absolute bottom-1.5 text-[10.5px] font-semibold px-1.5 rounded-full" style=${{ background: '#E7C96B', color: '#5C4A1E' }}>${item.price} 🪙</span>`}
            </button>`;
          })}
          ${tab === 'templates' &&
          LDR.SHOP.templates.map((item) => {
            const has = owned.templates.includes(item.id);
            const tpl = LDR.TEMPLATES[item.id];
            const on = draft.template === item.id;
            return html`<button
              key=${item.id}
              onClick=${() => (has ? onTemplate(item.id) : onShop())}
              aria-pressed=${on}
              className="relative w-[78px] flex flex-col items-center gap-1.5 active:scale-95 transition"
            >
              <span
                className="block w-[64px] h-[84px] rounded-[6px] cardstock grain relative overflow-hidden"
                style=${{ background: tpl.paper, boxShadow: on ? '0 0 0 2px var(--ink), var(--shadow-soft)' : 'var(--shadow-soft)', opacity: has ? 1 : 0.5 }}
              >
                <span className="absolute left-[10%] top-[22%] w-[40%] h-[42%] bg-[#FFFDF8]" style=${{ transform: `rotate(${tpl.slots[0].r}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                <span className="absolute right-[10%] top-[34%] w-[40%] h-[42%] bg-[#FFFDF8]" style=${{ transform: `rotate(${tpl.slots[1].r}deg)`, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                <span className="absolute left-[22%] top-[19%] w-[22%] h-[6%]" style=${{ background: tpl.tapes[0], opacity: 0.85 }} />
              </span>
              <span className="text-[11.5px] leading-tight text-center">${has ? item.name : `${item.price} 🪙`}</span>
            </button>`;
          })}
          ${tab === 'frames' &&
          LDR.SHOP.frames.map((item) => {
            const has = owned.frames.includes(item.id);
            const on = (draft.frame || 'polaroid') === item.id;
            return html`<button
              key=${item.id}
              onClick=${() => (has ? onFrame(item.id) : onShop())}
              aria-pressed=${on}
              className="w-[86px] flex flex-col items-center gap-1.5 active:scale-95 transition"
            >
              <span className="block w-[62px] rounded-[4px] p-1" style=${{ boxShadow: on ? '0 0 0 2px var(--ink)' : 'none', opacity: has ? 1 : 0.5 }}>
                <${Polaroid} photo="plant" frame=${item.id} scaleText />
              </span>
              <span className="text-[11.5px] leading-tight text-center">${has ? item.name : `${item.price} 🪙`}</span>
            </button>`;
          })}
        </div>
      </div>
    </div>`;
  }

  /*
    EditorScreen — params.id is the memory being decorated. Holds a draft of
    { stickers, template, frame } and writes it back on Save.
  */
  function EditorScreen({ params }) {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const memory = state.memories.find((m) => m.id === params.id);
    const [draft, setDraft] = useState(() => ({
      stickers: (memory?.stickers || []).map((s) => ({ ...s })),
      template: memory?.template,
      frame: memory?.frame || 'polaroid',
    }));
    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('stickers');
    const [asPartner, setAsPartner] = useState(false); // preview the lock from Kurt's side
    const pageRef = useRef(null);

    // Take the single-editor lock while this screen is open.
    useEffect(() => {
      actions.setEditingLock({ memoryId: params.id, by: state.user.name });
      return () => actions.setEditingLock(null);
    }, []);

    if (!memory) return null;

    const patchSticker = (uid, patch) =>
      setDraft((d) => ({ ...d, stickers: d.stickers.map((s) => (s.uid === uid ? { ...s, ...patch } : s)) }));
    const removeSticker = (uid) => {
      setDraft((d) => ({ ...d, stickers: d.stickers.filter((s) => s.uid !== uid) }));
      setSelected(null);
    };
    const addSticker = (id) => {
      const uid = LDR.uid('st');
      const n = draft.stickers.length;
      setDraft((d) => ({ ...d, stickers: [...d.stickers, { uid, id, x: 50 + ((n * 7) % 21) - 10, y: 46 + ((n * 11) % 17) - 8, r: ((n * 13) % 24) - 12, s: 1 }] }));
      setSelected(uid);
    };
    const save = () => {
      actions.updateMemory(memory.id, draft);
      actions.toast('Page saved ✨');
      nav.pop();
    };
    const goShop = () => nav.push('shop', { from: 'editor' });

    return html`<${Screen}
      background="paper-bg"
      header=${html`<div className="safe-top px-4 pb-1">
        <div className="flex items-center justify-between h-11">
          <button onClick=${nav.pop} className="h-9 px-2 text-[15px] text-muted active:text-ink">Cancel</button>
          <div className="text-center">
            <div className="font-serif text-[18px]">Decorate</div>
            <div className="text-[11.5px] text-muted">${memory.date}</div>
          </div>
          <button onClick=${save} disabled=${asPartner} className="h-9 px-3 rounded-full text-[15px] font-semibold text-ink active:scale-95 transition disabled:opacity-40">Save</button>
        </div>
      </div>`}
      footer=${asPartner
        ? html`<div className="px-6 pb-8 pt-4 text-center paper-bg grain rounded-t-[26px]" style=${{ boxShadow: '0 -8px 24px -12px rgba(61,40,28,0.35)' }}>
            <p className="text-[14px] text-muted leading-relaxed">${state.partner.name} can look, but the page is locked until ${state.user.name} is done — so nothing gets overwritten.</p>
          </div>`
        : html`<${Tray}
            tab=${tab}
            setTab=${setTab}
            state=${state}
            draft=${draft}
            onAddSticker=${addSticker}
            onTemplate=${(template) => setDraft((d) => ({ ...d, template }))}
            onFrame=${(frame) => setDraft((d) => ({ ...d, frame }))}
            onShop=${goShop}
          />`}
    >
      <div className="px-5 pt-1 pb-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[12.5px] text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          ${asPartner ? `Viewing as ${state.partner.name}` : `You’re decorating — ${state.partner.name} sees it locked`}
        </span>
        <button onClick=${() => { setAsPartner((v) => !v); setSelected(null); }} className="text-[12.5px] font-medium underline underline-offset-4 decoration-[rgba(61,53,48,0.3)]">
          ${asPartner ? 'Back to editing' : `Preview as ${state.partner.name}`}
        </button>
      </div>

      <div className="px-6 pb-4" onPointerDown=${() => setSelected(null)}>
        <div ref=${pageRef} className="relative">
          <${ScrapbookPage}
            memory=${{ ...memory, stickers: draft.stickers }}
            template=${draft.template}
            frame=${draft.frame}
            showStickers=${asPartner}
          >
            ${!asPartner
              ? draft.stickers.map(
                  (s) => html`<${EditableSticker}
                    key=${s.uid}
                    s=${s}
                    selected=${selected === s.uid}
                    onSelect=${setSelected}
                    onChange=${(patch) => patchSticker(s.uid, patch)}
                    onRemove=${() => removeSticker(s.uid)}
                    pageRef=${pageRef}
                  />`
                )
              : null}
          <//>
          ${asPartner
            ? html`<div className="absolute inset-0 rounded-[6px] flex items-center justify-center fade-in" style=${{ background: 'rgba(247,241,230,0.55)', backdropFilter: 'blur(1.5px)' }}>
                <span className="surface grain px-4 py-2.5 text-[14px] font-medium" style=${{ boxShadow: 'var(--shadow-card)' }}>${state.user.name} is decorating this page <span aria-hidden="true">🎨</span></span>
              </div>`
            : null}
        </div>
        ${!asPartner
          ? html`<p className="text-center text-[12px] text-muted mt-3">${selected ? 'Drag to move · ↻ rotate · ⤡ resize' : 'Tap a sticker to adjust it, or add one below'}</p>`
          : null}
      </div>
    <//>`;
  }

  LDR.SCREENS.editor = EditorScreen;
})();
