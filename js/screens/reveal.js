/*
  reveal.js

  Tier 1 · Screens 5 & 6 — the Reveal (the soul of the app) + React / comment.

  Sequence (PRD §27):
    1. Both closed cards shown together — YOUR CARD + THEIR CARD.
    2. "Are you ready to open?" → big terracotta OPEN.
    3. Both cards flip at the same moment (real 3D rotateY, with a lift).
    4. Photos revealed; a gentle ✦ sparkle (never confetti).
    5. Labels become YOUR FIND / THEIR FIND, joined by a small thread.
    6. Reaction row on their photo + an optional one-line comment.
    7. Deliberate "Add to Our Story" (never automatic).

  Used by: navigation registry ('reveal'), reached from Waiting or TODAY.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useEffect, useRef } = React;
  const { Screen, TopBar, PrimaryButton, TextLink, FlipCard, HuntCardFront, Sparkles, Icon } = LDR;

  /*
    PhotoBack — the photo side of a card in the Reveal. The photo is the hero,
    so it fills the card, framed by a thin band of tinted cardstock.
  */
  function PhotoBack({ tint, photo, reaction, reactionBy }) {
    const t = LDR.CARD_TINTS[tint];
    const p = LDR.photo(photo);
    return html`<div className="relative w-full h-full cardstock grain" style=${{ backgroundColor: t.back, containerType: 'inline-size', borderRadius: 'inherit' }}>
      <div className="absolute inset-[5cqw] bottom-[14cqw] rounded-[5cqw] overflow-hidden print-photo" style=${{ boxShadow: 'inset 0 0 0 1px rgba(61,53,48,0.08)' }}>
        <img src=${p.src} alt=${p.alt} className="w-full h-full object-cover" style=${{ filter: 'saturate(0.9) sepia(0.06)' }} />
      </div>
      <div className="absolute inset-x-0 bottom-[3.5cqw] text-center font-hand" style=${{ fontSize: '8cqw', color: t.ink }}>${t.label.toLowerCase()} find</div>
      ${reaction
        ? html`<span
            className="absolute flex items-center justify-center rounded-full react-pop"
            style=${{ right: '2cqw', top: '2cqw', width: '17cqw', height: '17cqw', fontSize: '9cqw', background: '#FFF9F0', boxShadow: '0 3px 8px -3px rgba(92,64,44,0.45), 0 0 0 1.5px rgba(201,130,125,0.45)' }}
            title=${reactionBy ? reactionBy + ' reacted' : undefined}
          >${reaction}</span>`
        : null}
    </div>`;
  }

  /*
    ReactionRow — ❤️ 😍 😂 🥹 👀 on the partner's photo. Dusty rose marks the
    selected one (rose = emotion). Tapping again clears it.
  */
  function ReactionRow({ value, onPick, partner }) {
    return html`<div className="surface grain px-4 pt-3 pb-3.5">
      <div className="text-[12.5px] text-muted mb-2.5">React to ${partner}’s find</div>
      <div className="flex justify-between">
        ${LDR.REACTIONS.map((r) => {
          const on = value === r;
          return html`<button
            key=${r}
            onClick=${() => onPick(r)}
            aria-pressed=${on}
            aria-label=${'React ' + r}
            className="w-[52px] h-[48px] rounded-[16px] flex items-center justify-center text-[24px] transition-colors duration-200"
            style=${{ background: on ? 'rgba(201,130,125,0.18)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.5px #C9827D' : 'none' }}
          ><span key=${on ? 'on' : 'off'} className=${on ? 'react-pop' : ''}>${r}</span></button>`;
        })}
      </div>
    </div>`;
  }

  /*
    CommentBox — one optional line, not a chat. Once sent it becomes a small
    handwritten note (tap to edit).
  */
  function CommentBox({ value, onSave }) {
    const [draft, setDraft] = useState(value);
    const [editing, setEditing] = useState(!value);
    if (!editing && value) {
      return html`<button onClick=${() => setEditing(true)} className="w-full text-left surface grain px-4 py-3 fade-up">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted">Your note</div>
        <div className="font-hand text-[22px] leading-tight mt-0.5">${value}</div>
      </button>`;
    }
    const send = () => {
      onSave(draft.trim());
      if (draft.trim()) setEditing(false);
    };
    return html`<form
      onSubmit=${(e) => { e.preventDefault(); send(); }}
      className="flex items-center gap-2 surface grain pl-4 pr-1.5 py-1.5"
    >
      <input
        value=${draft}
        onChange=${(e) => setDraft(e.target.value)}
        maxLength=${80}
        placeholder="Add a little note (optional)"
        aria-label="Comment"
        className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted/70 h-10"
      />
      <button type="submit" disabled=${!draft.trim()} className="h-10 px-3.5 rounded-[12px] text-[14px] font-medium text-ink disabled:text-muted/50" style=${{ background: draft.trim() ? 'rgba(141,155,131,0.2)' : 'transparent' }}>Send</button>
    </form>`;
  }

  /*
    RevealScreen — orchestrates the open → flip → reveal → react sequence.
    phase: 'closed' → 'flipping' → 'revealed'
  */
  function RevealScreen({ params }) {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const t = state.today;
    const already = params.revealed || t.status === 'revealed' || t.status === 'added';
    const [phase, setPhase] = useState(already ? 'revealed' : 'closed');
    const [theirReactionShown, setTheirReactionShown] = useState(already);
    const timers = useRef([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const open = () => {
      setPhase('flipping');
      timers.current.push(setTimeout(() => { setPhase('revealed'); actions.markRevealed(); }, 1250));
      // The partner's (simulated) reaction arrives a beat later.
      timers.current.push(setTimeout(() => setTheirReactionShown(true), 2600));
    };

    const flipped = phase !== 'closed';
    const revealed = phase === 'revealed';
    const label = (mine) => (flipped ? (mine ? 'Your find' : 'Their find') : mine ? 'Your card' : 'Their card');

    return html`<${Screen}
      background="paper-bg"
      header=${html`<${TopBar} onBack=${nav.pop} backIcon="close" subtitle=${t.date} />`}
      footer=${revealed
        ? html`<div className="px-6 pb-7 pt-3 fade-up" style=${{ animationDelay: '500ms' }}>
            <${PrimaryButton} onClick=${() => nav.replace('addToStory', {}, 'fade')}>Add to Our Story<//>
            <div className="text-center"><${TextLink} onClick=${nav.pop}>Not now<//></div>
          </div>`
        : null}
    >
      <div className="px-6 text-center min-h-[64px]">
        ${revealed
          ? html`<h1 key="r" className="font-serif text-[25px] leading-tight tracking-[-0.02em] fade-up">That’s what you saw today.</h1>`
          : html`<h1 key="c" className=${'font-serif text-[27px] leading-tight tracking-[-0.02em] transition-opacity duration-300 ' + (flipped ? 'opacity-0' : '')}>Are you ready to open?</h1>`}
      </div>

      <div className="relative px-5 mt-3">
        <div className="flex justify-between gap-3">
          ${[true, false].map(
            (mine) => html`<div key=${mine ? 'me' : 'them'} className="w-1/2 flex flex-col items-center">
              <div key=${label(mine)} className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-2.5 fade-in">${label(mine)}</div>
              <div className="w-full" style=${{ transform: `rotate(${mine ? -2 : 2}deg)` }}>
                <${FlipCard}
                  className="w-full aspect-[5/7]"
                  flipped=${flipped}
                  lift
                  radius=${18}
                  front=${html`<${HuntCardFront}
                    prompt=${mine ? t.myPrompt : t.theirPrompt}
                    tint=${mine ? t.myTint : t.theirTint}
                    tag=${mine ? 'Your card' : 'Their card'}
                    owner=${mine ? state.user.name : state.partner.name}
                  />`}
                  back=${html`<${PhotoBack}
                    tint=${mine ? t.myTint : t.theirTint}
                    photo=${mine ? t.myPhoto : t.theirPhoto}
                    reaction=${mine ? (theirReactionShown ? t.theirReaction : null) : t.myReaction}
                    reactionBy=${mine ? state.partner.name : state.user.name}
                  />`}
                />
              </div>
              ${revealed
                ? html`<p className="font-serif italic text-[13px] leading-snug text-muted mt-3 px-1 text-center fade-up">“${mine ? t.myPrompt : t.theirPrompt}”</p>`
                : null}
            </div>`
          )}
        </div>

        ${revealed
          ? html`<div className="absolute left-1/2 top-[46%] -translate-x-1/2 z-10 fade-in" aria-hidden="true">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ivory text-rose" style=${{ boxShadow: '0 3px 10px -3px rgba(92,64,44,0.4)' }}>
                <${Icon} name="heart" size=${16} fill="#C9827D" stroke=${0} />
              </span>
            </div>`
          : null}
        ${phase === 'flipping' ? html`<div className="absolute inset-0" style=${{ top: '40%' }}><${Sparkles} count=${18} spread=${190} /></div>` : null}
      </div>

      ${phase === 'closed'
        ? html`<div className="px-6 mt-9">
            <${PrimaryButton} onClick=${open} className="h-[60px] text-[18px] tracking-[0.2em]">OPEN<//>
            <p className="text-center text-[13px] text-muted mt-3">Both cards turn over together.</p>
          </div>`
        : null}

      ${revealed
        ? html`<div className="px-5 mt-7 space-y-3 pb-4 fade-up" style=${{ animationDelay: '250ms' }}>
            <${ReactionRow} value=${t.myReaction} onPick=${actions.setReaction} partner=${state.partner.name} />
            <${CommentBox} value=${t.comment} onSave=${actions.setComment} />
          </div>`
        : null}
    <//>`;
  }

  LDR.SCREENS.reveal = RevealScreen;
})();
