/*
  components.js

  Shared building blocks used across screens. Everything here obeys the locked
  design system (theme.js / theme.css): cream paper, ivory surfaces, grain on
  every surface, terracotta only for primary actions, rose only for emotion,
  butter only for coins.

  Exposes on LDR:
    Icon, Screen, TopBar, PrimaryButton, SecondaryButton, TextLink, SectionLabel,
    CoinPill, CoinPop, Sparkles, Toast, Toggle, ListRow,
    HuntCardFront, HuntCardBack, FlipCard,
    Polaroid, Sticker, ScrapbookPage, TabBar, Avatar

  Used by: every file in js/screens/ and app.js.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useEffect, useRef, useMemo } = React;

  const cx = (...parts) => parts.filter(Boolean).join(' ');
  LDR.cx = cx;

  /* ------------------------------------------------------------- Icon */

  // Thin, slightly rounded stroke icons — friendly but not cartoonish.
  const ICON_PATHS = {
    back: 'M15 5 L8 12 L15 19',
    chevron: 'M9 5 L16 12 L9 19',
    close: 'M6 6 L18 18 M18 6 L6 18',
    camera: 'M4 8.5 C4 7.7 4.7 7 5.5 7 H8 L9.5 5 H14.5 L16 7 H18.5 C19.3 7 20 7.7 20 8.5 V17.5 C20 18.3 19.3 19 18.5 19 H5.5 C4.7 19 4 18.3 4 17.5 Z M12 16 A3.2 3.2 0 1 0 12 9.6 A3.2 3.2 0 1 0 12 16 Z',
    image: 'M4.5 5 H19.5 V19 H4.5 Z M4.5 15.5 L9 11 L13 15 L15.5 12.5 L19.5 16.5 M15 9.2 A1.2 1.2 0 1 0 15 9.21',
    lock: 'M7 11 V8.5 A5 5 0 0 1 17 8.5 V11 M5.5 11 H18.5 V20 H5.5 Z M12 14.5 V16.5',
    today: 'M7 3.5 H17 A2 2 0 0 1 19 5.5 V18.5 A2 2 0 0 1 17 20.5 H7 A2 2 0 0 1 5 18.5 V5.5 A2 2 0 0 1 7 3.5 Z M12 8.5 L12.9 11.1 L15.5 12 L12.9 12.9 L12 15.5 L11.1 12.9 L8.5 12 L11.1 11.1 Z',
    story: 'M12 6.5 C10 5 7 4.5 3.5 5 V18.5 C7 18 10 18.5 12 20 C14 18.5 17 18 20.5 18.5 V5 C17 4.5 14 5 12 6.5 Z M12 6.5 V20',
    us: 'M9 16.5 A5 5 0 1 0 9 6.5 A5 5 0 1 0 9 16.5 Z M15 17.5 A5 5 0 1 0 15 7.5 A5 5 0 1 0 15 17.5 Z',
    pencil: 'M14.5 5.5 L18.5 9.5 L9 19 H5 V15 Z M12.5 7.5 L16.5 11.5',
    refresh: 'M19 12 A7 7 0 1 1 16.5 6.6 M19 4.5 V8.5 H15',
    check: 'M5 12.5 L10 17 L19 7',
    bell: 'M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18 H4.5 Z M10 20.5 H14',
    plane: 'M3 13 L21 6 L15 20 L11.5 14.5 Z M11.5 14.5 L21 6',
    cards: 'M8 4 H17 A1.5 1.5 0 0 1 18.5 5.5 V17 M5.5 7 H14.5 A1.5 1.5 0 0 1 16 8.5 V19 A1.5 1.5 0 0 1 14.5 20.5 H5.5 A1.5 1.5 0 0 1 4 19 V8.5 A1.5 1.5 0 0 1 5.5 7 Z',
    bag: 'M5 8 H19 L18 20 H6 Z M9 8 V6.5 A3 3 0 0 1 15 6.5 V8',
    heart: 'M12 19.5 C6.5 15.5 4 12.5 4 9.3 C4 6.9 5.9 5 8.2 5 C9.8 5 11.2 5.9 12 7.2 C12.8 5.9 14.2 5 15.8 5 C18.1 5 20 6.9 20 9.3 C20 12.5 17.5 15.5 12 19.5 Z',
    shield: 'M12 3.5 L19 6.5 V11.5 C19 15.5 16 18.8 12 20.5 C8 18.8 5 15.5 5 11.5 V6.5 Z',
    archive: 'M4 5 H20 V9 H4 Z M5.5 9 V19 H18.5 V9 M10 13 H14',
    clock: 'M12 20 A8 8 0 1 0 12 4 A8 8 0 1 0 12 20 Z M12 8 V12 L15 14',
    sparkle: 'M12 3 L13.6 10.4 L21 12 L13.6 13.6 L12 21 L10.4 13.6 L3 12 L10.4 10.4 Z',
    layout: 'M4.5 4.5 H19.5 V19.5 H4.5 Z M4.5 10 H19.5 M11 10 V19.5',
    rotate: 'M5 12 A7 7 0 0 1 17.5 7.5 M18 4 V8 H14 M19 12 A7 7 0 0 1 6.5 16.5 M6 20 V16 H10',
    plus: 'M12 5 V19 M5 12 H19',
    minus: 'M5 12 H19',
    trash: 'M5 7 H19 M9 7 V5 H15 V7 M7 7 L8 20 H16 L17 7',
    download: 'M12 4 V15 M7.5 10.5 L12 15 L16.5 10.5 M5 19.5 H19',
    door: 'M6 20 V4 H15 L18 6 V20 M6 20 H18 M13 12.5 V13',
    mail: 'M4 6 H20 V18 H4 Z M4 6.5 L12 13 L20 6.5',
    apple: 'M15.5 3.5 C14.5 3.6 13.3 4.3 12.7 5.1 C12.1 5.8 11.7 6.9 11.8 7.9 C12.9 8 14 7.3 14.6 6.5 C15.2 5.7 15.6 4.7 15.5 3.5 Z M17.6 12.6 C17.6 10.6 19.2 9.6 19.3 9.6 C18.3 8.2 16.9 8 16.4 8 C15.1 7.9 13.9 8.8 13.3 8.8 C12.6 8.8 11.6 8 10.5 8 C9 8.1 7.7 8.9 7 10.2 C5.5 12.8 6.6 16.6 8 18.7 C8.7 19.7 9.5 20.8 10.6 20.8 C11.6 20.7 12 20.1 13.2 20.1 C14.4 20.1 14.8 20.8 15.8 20.7 C16.9 20.7 17.6 19.7 18.3 18.7 C19.1 17.5 19.4 16.4 19.4 16.3 C19.4 16.3 17.6 15.6 17.6 12.6 Z',
    copy: 'M8 8 H18.5 V19.5 H8 Z M5.5 16 V4.5 H16',
    sun: 'M12 16 A4 4 0 1 0 12 8 A4 4 0 1 0 12 16 Z M12 2.5 V4.5 M12 19.5 V21.5 M2.5 12 H4.5 M19.5 12 H21.5 M5.3 5.3 L6.7 6.7 M17.3 17.3 L18.7 18.7 M5.3 18.7 L6.7 17.3 M17.3 6.7 L18.7 5.3',
  };

  /*
    Icon(name, size, stroke) — renders one of the stroke icons above.
    Filled variants: pass fill to fill the path (used for the heart).
  */
  function Icon({ name, size = 22, stroke = 1.7, fill = 'none', className = '', style }) {
    return html`<svg
      width=${size}
      height=${size}
      viewBox="0 0 24 24"
      fill=${fill}
      stroke="currentColor"
      strokeWidth=${stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className=${className}
      style=${style}
      aria-hidden="true"
    ><path d=${ICON_PATHS[name] || ''} /></svg>`;
  }

  /* ----------------------------------------------------------- Screen */

  /*
    Screen — the paper page every screen sits on.
    Args:
      header:     fixed content above the scroll area (e.g. a TopBar).
      footer:     fixed content below the scroll area (e.g. a CTA button).
      tabs:       true when the root tab bar is visible, to leave room for it.
      background: override class for special screens (e.g. reveal).
      scrollRef:  optional ref to the scroll container.
  */
  function Screen({ header, footer, tabs = false, className = '', bodyClass = '', background, scrollRef, children }) {
    return html`<div className=${cx('absolute inset-0 flex flex-col grain', background || 'paper-bg', className)}>
      ${header ? html`<div className="relative z-20 shrink-0">${header}</div>` : null}
      <div ref=${scrollRef} className=${cx('relative z-10 flex-1 scroll', bodyClass)} style=${{ paddingBottom: tabs ? 104 : 0 }}>
        ${children}
      </div>
      ${footer ? html`<div className="relative z-20 shrink-0">${footer}</div>` : null}
    </div>`;
  }

  /*
    TopBar — status-bar-safe header with an optional Back button and title.
    Back always pops the current stack (wired by the navigator).
  */
  function TopBar({ title, onBack, right, serif = false, subtitle, backIcon = 'back', transparent = false }) {
    return html`<div className=${cx('safe-top px-4 pb-2', transparent ? '' : '')}>
      <div className="flex items-center h-11 gap-2">
        <div className="w-11 shrink-0">
          ${onBack
            ? html`<button onClick=${onBack} aria-label="Back" className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-ink active:bg-ivory/80 transition">
                <${Icon} name=${backIcon} size=${24} stroke=${1.8} />
              </button>`
            : null}
        </div>
        <div className="flex-1 text-center min-w-0">
          ${title
            ? html`<div className=${cx('truncate', serif ? 'font-serif text-[19px] tracking-[-0.01em]' : 'text-[15px] font-semibold')}>${title}</div>`
            : null}
          ${subtitle ? html`<div className="text-[11.5px] text-muted mt-0.5 truncate">${subtitle}</div>` : null}
        </div>
        <div className="min-w-11 shrink-0 flex justify-end">${right}</div>
      </div>
    </div>`;
  }

  /* ---------------------------------------------------------- Buttons */

  function PrimaryButton({ children, onClick, disabled, className = '', icon, ariaLabel }) {
    return html`<button
      onClick=${onClick}
      disabled=${disabled}
      aria-label=${ariaLabel}
      className=${cx('btn-primary w-full h-[54px] px-6 flex items-center justify-center gap-2 text-[16px]', className)}
    >${icon ? html`<${Icon} name=${icon} size=${20} stroke=${1.9} />` : null}${children}</button>`;
  }

  function SecondaryButton({ children, onClick, className = '', icon, disabled }) {
    return html`<button
      onClick=${onClick}
      disabled=${disabled}
      className=${cx('btn-secondary w-full h-[50px] px-5 flex items-center justify-center gap-2 text-[15px]', disabled && 'opacity-50', className)}
    >${icon ? html`<${Icon} name=${icon} size=${19} />` : null}${children}</button>`;
  }

  function TextLink({ children, onClick, className = '' }) {
    return html`<button onClick=${onClick} className=${cx('text-[14.5px] text-muted underline decoration-[rgba(136,121,112,0.4)] underline-offset-4 py-2 active:text-ink', className)}>${children}</button>`;
  }

  // Small letter-spaced label — the stationery "section heading".
  function SectionLabel({ children, className = '' }) {
    const { vintage } = LDR.useStyle();
    return html`<div className=${cx('text-[11px] font-semibold tracking-[0.16em] uppercase text-muted', vintage && 'label-type', className)}>${children}</div>`;
  }

  /* ------------------------------------------------------------ Coins */

  /*
    CoinPill — butter-yellow token showing an amount ("620 🪙").
    Gives a small bump whenever the amount changes.
  */
  function CoinPill({ amount, onClick, className = '' }) {
    const [bump, setBump] = useState(0);
    const prev = useRef(amount);
    useEffect(() => {
      if (prev.current !== amount) setBump((b) => b + 1);
      prev.current = amount;
    }, [amount]);
    const Tag = onClick ? 'button' : 'span';
    return html`<${Tag}
      key=${bump}
      onClick=${onClick}
      aria-label=${`${amount} coins`}
      className=${cx('coin-pill', bump && 'coin-bump', className)}
    ><span aria-hidden="true">🪙</span>${amount}<//>`;
  }

  // "+10 🪙" that rises and fades. Mount it to play it; `top` positions it.
  function CoinPop({ amount = 10, top = '40%' }) {
    return html`<div className="coin-pop" style=${{ top }}>
      <span className="coin-pill text-[17px] px-3.5 py-1.5">+${amount} <span aria-hidden="true">🪙</span></span>
    </div>`;
  }

  /*
    Sparkles — a soft burst of ✦ around a point (never confetti).
    Re-mount (change `key`) to replay.
  */
  function Sparkles({ count = 14, spread = 140, className = '' }) {
    const bits = useMemo(
      () =>
        Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
          const d = spread * (0.5 + Math.random() * 0.6);
          return {
            dx: Math.cos(a) * d,
            dy: Math.sin(a) * d * 0.8,
            delay: Math.random() * 260,
            size: 10 + Math.random() * 10,
            ch: Math.random() > 0.35 ? '✦' : '·',
          };
        }),
      [count, spread]
    );
    return html`<div className=${cx('absolute left-1/2 top-1/2 pointer-events-none', className)} aria-hidden="true">
      ${bits.map(
        (b, i) => html`<span
          key=${i}
          className="sparkle"
          style=${{ '--dx': b.dx + 'px', '--dy': b.dy + 'px', animationDelay: b.delay + 'ms', fontSize: b.size }}
        >${b.ch}</span>`
      )}
    </div>`;
  }

  /* ------------------------------------------------------ Small bits */

  // Paper toast at the top of the phone ("Added to Our Story ✨").
  function Toast({ children }) {
    return html`<div className="toast top-[98px]" role="status">
      <div className="surface grain px-4 py-2.5 text-[14px] font-medium whitespace-nowrap shadow-[var(--shadow-card)]">${children}</div>
    </div>`;
  }

  // Sage toggle switch.
  function Toggle({ on, onChange, label, disabled }) {
    return html`<button
      role="switch"
      aria-checked=${on}
      aria-label=${label}
      disabled=${disabled}
      onClick=${() => onChange(!on)}
      className=${cx('relative w-[50px] h-[30px] rounded-full transition-colors duration-300 shrink-0', on ? 'bg-sage' : 'bg-[#E3D9CB]', disabled && 'opacity-50')}
      style=${{ boxShadow: 'inset 0 1px 2px rgba(61,53,48,0.15)' }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-6 h-6 rounded-full bg-ivory transition-transform duration-300"
        style=${{ transform: on ? 'translateX(20px)' : 'none', boxShadow: '0 1px 3px rgba(61,53,48,0.25)' }}
      />
    </button>`;
  }

  /*
    ListRow — a settings row on an ivory surface.
    Args: icon, label, value (right-hand text), onClick, right (custom node).
  */
  function ListRow({ icon, label, value, onClick, right, danger, sub }) {
    const Tag = onClick ? 'button' : 'div';
    return html`<${Tag}
      onClick=${onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[rgba(247,241,230,0.8)] transition-colors"
    >
      ${icon
        ? html`<span className=${cx('w-8 h-8 rounded-full flex items-center justify-center shrink-0', danger ? 'text-terracotta bg-[#F3E2DA]' : 'text-sage bg-[#ECEEE4]')}>
            <${Icon} name=${icon} size=${18} />
          </span>`
        : null}
      <span className="flex-1 min-w-0">
        <span className=${cx('block text-[15px]', danger ? 'text-terracotta' : 'text-ink')}>${label}</span>
        ${sub ? html`<span className="block text-[12.5px] text-muted mt-0.5">${sub}</span>` : null}
      </span>
      ${value ? html`<span className="text-[14px] text-muted">${value}</span>` : null}
      ${right}
      ${onClick && !right ? html`<${Icon} name="chevron" size=${16} className="text-muted/70" />` : null}
    <//>`;
  }

  // Initial in a soft circle — partners are tinted sage (the user) and rose (their partner).
  function Avatar({ name, tone = 'sage', size = 36 }) {
    const bg = tone === 'rose' ? '#E9CFCB' : '#DCE1D3';
    const fg = tone === 'rose' ? '#8E514C' : '#5F6C57';
    return html`<span
      className="inline-flex items-center justify-center rounded-full font-serif shrink-0"
      style=${{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.44, border: '2px solid var(--ivory)' }}
    >${name[0]}</span>`;
  }

  /* -------------------------------------------------------- Hunt Card */

  // Tiny ✦ ornament used on card corners and motifs (modern style).
  function Star4({ size = 14, color, className = '', style }) {
    return html`<svg width=${size} height=${size} viewBox="0 0 24 24" className=${className} style=${style} aria-hidden="true">
      <path d="M12 1 L13.8 10.2 L23 12 L13.8 13.8 L12 23 L10.2 13.8 L1 12 L10.2 10.2 Z" fill=${color} />
    </svg>`;
  }
  LDR.Star4 = Star4;

  // Small postmark/wax-seal ring — the vintage-style equivalent of Star4.
  function Postmark({ size = 14, color, className = '', style }) {
    return html`<svg width=${size} height=${size} viewBox="0 0 24 24" className=${className} style=${style} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke=${color} strokeWidth="1.4" strokeDasharray="2.2 2" />
      <circle cx="12" cy="12" r="3" fill=${color} />
    </svg>`;
  }
  LDR.Postmark = Postmark;

  // Picks Star4 (modern) or Postmark (vintage) based on the current style.
  function Motif(props) {
    const { vintage } = LDR.useStyle();
    return vintage ? html`<${Postmark} ...${props} />` : html`<${Star4} ...${props} />`;
  }
  LDR.Motif = Motif;

  /*
    HuntCardFront — the prompt side of a Hunt Card. Feels like a printed
    stationery card: tinted cardstock, double rule border, ✦ motif, serif prompt.
    Uses container-query units so it scales cleanly from hero to thumbnail size.

    Args:
      prompt: the Hunt text.  tint: key into CARD_TINTS.
      tag:    small label ("Your Hunt" / "Their Hunt").
      date, category: footer details.
  */
  function HuntCardFront({ prompt, tint = 'morningButter', tag = 'Your Hunt', date, category, owner }) {
    const { vintage, tints } = LDR.useStyle();
    const t = tints[tint];
    return html`<div
      className="relative w-full h-full cardstock grain grain-strong"
      style=${{ backgroundColor: t.face, containerType: 'inline-size', borderRadius: 'inherit' }}
    >
      <div className="absolute inset-[4.5cqw] rounded-[3cqw]" style=${{ border: `1px solid ${t.edge}` }} />
      <div className="absolute inset-[6cqw] rounded-[2cqw]" style=${{ border: `1px solid ${t.edge}`, opacity: 0.6 }} />
      ${[
        ['top-[8.5cqw] left-[8.5cqw]'],
        ['top-[8.5cqw] right-[8.5cqw]'],
        ['bottom-[8.5cqw] left-[8.5cqw]'],
        ['bottom-[8.5cqw] right-[8.5cqw]'],
      ].map(([pos], i) => html`<${Motif} key=${i} size="5cqw" color=${t.ink} className=${cx('absolute opacity-60', pos)} style=${{ width: '4.5cqw', height: '4.5cqw' }} />`)}

      <div className="absolute inset-0 flex flex-col items-center px-[13cqw] pt-[14cqw] pb-[12cqw] text-center">
        <span
          className=${cx('card-tag rounded-full px-[3.6cqw] py-[1.2cqw] font-semibold uppercase', vintage && 'label-type')}
          style=${{ fontSize: '3.6cqw', letterSpacing: '0.16em', background: 'rgba(255,249,240,0.75)', color: t.ink, boxShadow: `0 0 0 1px ${t.edge}` }}
        >${tag}</span>

        <div className="flex-1 flex flex-col items-center justify-center">
          <${Motif} color=${t.ink} style=${{ width: '11cqw', height: '11cqw', marginBottom: '5cqw', opacity: 0.85 }} />
          <div className=${cx('uppercase font-semibold', vintage && 'label-type')} style=${{ fontSize: '3.4cqw', letterSpacing: '0.24em', color: t.ink, marginBottom: '3.5cqw', opacity: 0.85 }}>Today’s Hunt</div>
          <div className="font-serif text-ink" style=${{ fontSize: '9.2cqw', lineHeight: 1.18, letterSpacing: '-0.01em', fontWeight: 400 }}>${prompt}</div>
        </div>

        <div className="flex items-center gap-[2cqw] text-muted" style=${{ fontSize: '3.4cqw', letterSpacing: '0.06em' }}>
          ${date ? html`<span className="font-serif italic" style=${{ fontSize: '4cqw' }}>${date}</span>` : null}
          ${date && (category || owner) ? html`<span style=${{ color: t.ink }}>·</span>` : null}
          ${owner || category ? html`<span className=${cx('uppercase', vintage && 'label-type')}>${owner || category}</span>` : null}
        </div>
      </div>
    </div>`;
  }

  /*
    HuntCardBack — the reverse of a Hunt Card. Cardstock with a faint ✦
    pattern; if a photo is attached it sits on the back as a small print.
    `locked` overlays the 🔒 "Card Locked" stamp. `animatePlace` plays the
    photo-landing animation (used right after Submit).
  */
  function HuntCardBack({ tint = 'morningButter', photo, locked, animatePlace, label, frame }) {
    const { vintage, tints } = LDR.useStyle();
    const t = tints[tint];
    // Vintage uses a sparser postmark-ring pattern instead of a tight ✦ tile.
    const pattern = vintage
      ? `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='46' height='46'><circle cx='23' cy='23' r='15' fill='none' stroke='${t.ink}' stroke-width='1' stroke-dasharray='2.4 2.4' opacity='0.16'/></svg>`
        )}")`
      : `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><path d='M14 9 L14.9 13.1 L19 14 L14.9 14.9 L14 19 L13.1 14.9 L9 14 L13.1 13.1 Z' fill='${t.ink}' opacity='0.16'/></svg>`
        )}")`;
    return html`<div
      className="relative w-full h-full cardstock grain grain-strong"
      style=${{ backgroundColor: t.back, containerType: 'inline-size', borderRadius: 'inherit' }}
    >
      <div className="absolute inset-0" style=${{ backgroundImage: pattern, backgroundSize: vintage ? '46px 46px' : '28px 28px', borderRadius: 'inherit' }} />
      <div className="absolute inset-[4.5cqw] rounded-[3cqw]" style=${{ border: `1px solid ${t.edge}` }} />
      ${photo
        ? html`<div className="absolute inset-0 flex items-center justify-center px-[10cqw] pb-[8cqw]">
            <div className=${cx('w-full', animatePlace && 'place-photo')} style=${{ transform: 'rotate(-1.5deg)' }}>
              <${Polaroid} photo=${photo} caption=${label} frame=${frame} scaleText />
            </div>
          </div>`
        : html`<div className="absolute inset-0 flex items-center justify-center">
            <${Motif} color=${t.ink} style=${{ width: '16cqw', height: '16cqw', opacity: 0.5 }} />
          </div>`}
      ${locked
        ? html`<div className="absolute bottom-[7cqw] left-0 right-0 flex justify-center z-10">
            <span
              className=${cx('inline-flex items-center gap-[1.6cqw] rounded-full font-semibold uppercase', vintage && 'label-type', animatePlace && 'lock-stamp')}
              style=${{
                fontSize: '3.6cqw',
                letterSpacing: '0.14em',
                padding: '1.8cqw 4cqw',
                background: 'var(--ivory)',
                color: 'var(--ink)',
                boxShadow: '0 2px 8px -2px rgba(92,64,44,0.35)',
                transform: 'rotate(-3deg)',
                animationDelay: animatePlace ? '700ms' : undefined,
              }}
            ><span aria-hidden="true">🔒</span> Card locked</span>
          </div>`
        : null}
    </div>`;
  }

  /*
    FlipCard — a real 3D card: front and back faces, rotateY(180deg) when
    flipped. `lift` adds the brief rise-off-the-table during the flip.
  */
  function FlipCard({ flipped, front, back, className = '', style, lift = false, radius = 20 }) {
    return html`<div className=${cx('flip-scene', className)} style=${style}>
      <div className=${cx('w-full h-full', lift && flipped && 'flip-lift')}>
        <div className=${cx('flip-card', flipped && 'is-flipped')} style=${{ borderRadius: radius, boxShadow: 'var(--shadow-card)' }}>
          <div className="flip-face" style=${{ borderRadius: radius }}>${front}</div>
          <div className="flip-face flip-back" style=${{ borderRadius: radius }}>${back}</div>
        </div>
      </div>
    </div>`;
  }

  /* --------------------------------------------------------- Polaroid */

  /*
    Polaroid — renders a photo as a slightly imperfect print.
    Args:
      photo:   photo id (see photos.js).
      caption: handwritten text in the bottom lip.
      frame:   'polaroid' | 'film' | 'deckled' — purchased frame styles.
      rotate:  degrees of tilt.  tape: show a washi strip on top.
      scaleText: size the caption with container units (for use in scaled cards/pages).
  */
  function Polaroid({ photo, caption, frame = 'polaroid', rotate = 0, tape, tapeColor = '#C9B48E', className = '', style, scaleText, children }) {
    const p = LDR.photo(photo);
    const isFilm = frame === 'film';
    const frameStyle = isFilm
      ? { background: '#2E2724', padding: scaleText ? '7% 5% 7%' : '14px 8px 14px' }
      : frame === 'deckled'
      ? {
          background: '#FFFDF8',
          // Solid centre + a ring of dots on the edge = scalloped deckle.
          WebkitMask: 'linear-gradient(#000 0 0) center / calc(100% - 8px) calc(100% - 8px) no-repeat, radial-gradient(circle at 4px 4px, #000 3.2px, transparent 3.6px) 0 0 / 8px 8px',
          filter: 'drop-shadow(0 4px 6px rgba(92,64,44,0.22))',
        }
      : {};
    return html`<div
      className=${cx('print', className)}
      style=${{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...frameStyle, ...(scaleText && !isFilm ? { padding: '5% 5% 20%' } : {}), ...style }}
    >
      ${tape ? html`<div className="washi" style=${{ background: tapeColor, width: '44%', left: '28%', top: -9, transform: 'rotate(-4deg)' }} />` : null}
      ${isFilm
        ? html`<div className="absolute left-[6%] right-[6%] top-[2.2%] h-[3%]" style=${{ backgroundImage: 'repeating-linear-gradient(90deg, #E9DFCF 0 5px, transparent 5px 12px)', opacity: 0.55, borderRadius: 1 }} />
            <div className="absolute left-[6%] right-[6%] bottom-[2.2%] h-[3%]" style=${{ backgroundImage: 'repeating-linear-gradient(90deg, #E9DFCF 0 5px, transparent 5px 12px)', opacity: 0.55, borderRadius: 1 }} />`
        : null}
      <div className="print-photo">
        <img src=${p.src} alt=${p.alt} className="print-img" draggable="false" />
      </div>
      ${caption && !isFilm
        ? html`<div
            className="absolute left-0 right-0 bottom-0 flex items-center justify-center font-hand text-ink/80 leading-none"
            style=${{ height: scaleText ? '20%' : 26, fontSize: scaleText ? 'max(11px, 5.4cqw)' : 17 }}
          >${caption}</div>`
        : null}
      ${children}
    </div>`;
  }

  /* ---------------------------------------------------------- Sticker */

  function Sticker({ id, size = 64, className = '', style }) {
    const s = LDR.STICKERS[id];
    if (!s) return null;
    return html`<img src=${LDR.svgUri(s.svg)} alt=${s.name} width=${size} height=${size} draggable="false" className=${cx('select-none', className)} style=${style} />`;
  }

  /* --------------------------------------------------- Scrapbook page */

  // Faint hand-drawn motif per template (drawn in the template accent).
  function Doodle({ motif, color }) {
    const paths = {
      sprig: 'M10 90 C30 70 50 50 80 30 M24 76 c-8 -6 -10 -14 -6 -20 c6 4 8 12 6 20 Z M40 62 c8 -2 14 2 16 8 c-8 2 -14 -2 -16 -8 Z M52 50 c-6 -8 -6 -16 0 -20 c4 6 4 14 0 20 Z M66 40 c8 0 12 6 12 12 c-8 0 -12 -6 -12 -12 Z',
      hearts: 'M30 40 c-10 -8 -14 -14 -12 -20 c2 -6 10 -6 12 0 c2 -6 10 -6 12 0 c2 6 -2 12 -12 20 Z M70 76 c-7 -5 -9 -10 -8 -14 c1 -4 7 -4 8 0 c1 -4 7 -4 8 0 c1 4 -1 9 -8 14 Z',
      sun: 'M50 50 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M50 20 v10 M50 70 v10 M20 50 h10 M70 50 h10 M29 29 l7 7 M64 64 l7 7 M29 71 l7 -7 M64 36 l7 -7',
      stars: 'M30 20 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3 Z M72 58 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z M50 84 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z',
      leaves: 'M20 80 C40 60 60 40 86 20 M34 66 c-10 0 -16 -6 -16 -14 c10 0 16 6 16 14 Z M52 48 c0 -10 6 -16 14 -16 c0 10 -6 16 -14 16 Z M70 32 c-8 -4 -10 -12 -6 -18 c6 4 8 12 6 18 Z',
    };
    return html`<svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <path d=${paths[motif] || paths.sprig} fill="none" stroke=${color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>`;
  }

  // The date treatment differs per template: rubber stamp, script, or paper label.
  function PageDate({ memory, tpl, compose }) {
    const [month, day] = memory.date.split(' ');
    const anim = compose ? 'stamp-in' : '';
    const delay = compose ? { animationDelay: '1300ms' } : {};
    if (tpl.dateStyle === 'script') {
      return html`<div className=${cx('absolute left-[7%] top-[5%]', anim)} style=${{ ...delay, '--r': '-3deg', transform: 'rotate(-3deg)' }}>
        <div className="font-hand leading-none" style=${{ fontSize: '9.5cqw', color: tpl.accent }}>${memory.date}</div>
        ${memory.weekday ? html`<div className="font-serif italic" style=${{ fontSize: '3.2cqw', color: tpl.dark ? '#C9D3DC' : '#887970', marginTop: '0.6cqw' }}>${memory.weekday}</div>` : null}
      </div>`;
    }
    if (tpl.dateStyle === 'label') {
      return html`<div className=${cx('absolute left-[7%] top-[4.5%]', anim)} style=${{ ...delay, '--r': '-2deg', transform: 'rotate(-2deg)' }}>
        <div
          className="grain"
          style=${{ background: '#FFFBF2', padding: '1.6cqw 3.4cqw 1.6cqw 4.6cqw', boxShadow: '0 1px 3px rgba(92,64,44,0.18)', clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 6% 100%, 0 50%)' }}
        >
          <span className="font-serif" style=${{ fontSize: '4.6cqw', color: tpl.accent, letterSpacing: '0.02em' }}>${memory.date}</span>
        </div>
      </div>`;
    }
    // 'stamp' — serif small caps + a round rubber date stamp.
    const ink = tpl.dark ? '#E9E3D6' : tpl.accent;
    return html`<div className=${cx('absolute left-[7%] top-[4.8%] flex items-center gap-[2.6cqw]', anim)} style=${{ ...delay, '--r': '0deg' }}>
      <div
        className="rounded-full flex flex-col items-center justify-center"
        style=${{ width: '11.5cqw', height: '11.5cqw', border: `1.5px solid ${ink}`, color: ink, opacity: 0.85, transform: 'rotate(-8deg)', boxShadow: `inset 0 0 0 2.5px transparent, inset 0 0 0 3.5px ${ink}33` }}
      >
        <span className="font-serif leading-none" style=${{ fontSize: '5cqw' }}>${day}</span>
        <span className="uppercase font-semibold" style=${{ fontSize: '1.9cqw', letterSpacing: '0.12em', marginTop: '0.3cqw' }}>${month.slice(0, 3)}</span>
      </div>
      <div>
        <div className="font-serif uppercase" style=${{ fontSize: '3.6cqw', letterSpacing: '0.2em', color: tpl.dark ? '#E9E3D6' : 'var(--ink)' }}>${memory.date}</div>
        ${memory.weekday ? html`<div className="font-serif italic" style=${{ fontSize: '3cqw', color: tpl.dark ? '#AEB9C4' : '#887970' }}>${memory.weekday}</div>` : null}
      </div>
    </div>`;
  }

  /*
    tapeFor — where a washi strip goes for photo slot i (in % of the page).
    'top' centres it on the print's top edge; 'corner' crosses the top-left
    corner of the first print and the bottom-right corner of the second.
    The page is 3:4, so 1% of width = 0.75% of height.
  */
  function tapeFor(tpl, i) {
    const s = tpl.slots[i];
    const w = 20;
    const printH = s.w * 1.5 * 0.75; // print height (4:5 photo + border) in % of page height
    if (tpl.tapeStyle === 'corner') {
      return i === 0
        ? { x: s.x - w / 2 + 2, y: s.y + 2, w, r: tpl.tapeRot[i] }
        : { x: s.x + s.w - w / 2 - 2, y: s.y + printH - 8, w, r: tpl.tapeRot[i] };
    }
    return { x: s.x + s.w / 2 - w / 2, y: s.y - 1.6, w, r: tpl.tapeRot[i] };
  }

  /*
    ScrapbookPage — renders one saved memory as a finished, decorated page.
    Layout comes entirely from the template (slots, tape, date, motif), so a
    page always looks intentional even if nobody ever decorates it.

    Args:
      memory:   a memory object (see data.js).
      template: optional override template id (used by template swap/preview).
      compose:  play the auto-compose animation (photos drop in, tape, stamp).
      showStickers: render saved stickers (the editor renders its own).
      showMeta: prompts + reactions under the photos (off for tiny thumbnails).
      names:    { mine, theirs } for captions — defaults to the couple's real
                names from the store, so every caller stays correct for free.
      children: extra absolutely-positioned layers (editor stickers).
  */
  function ScrapbookPage({ memory, template, compose = false, showStickers = true, showMeta = true, names, className = '', style, children, frame }) {
    const { state } = LDR.useStore();
    const resolvedNames = names || { mine: state.user.name, theirs: state.partner.name };
    const tpl = LDR.TEMPLATES[template || memory.template] || LDR.TEMPLATES.classic;
    const frameId = frame || memory.frame || 'polaroid';
    const textColor = tpl.dark ? '#E9E3D6' : 'var(--ink)';
    const subColor = tpl.dark ? '#AEB9C4' : '#887970';
    const prints = [
      { side: 'mine', data: memory.mine, slot: tpl.slots[0], tape: tapeFor(tpl, 0), tapeColor: tpl.tapes[0], from: { fx: '-40cqw', fy: '30cqw', fr: '-14deg' }, react: memory.reactions?.onMine },
      { side: 'theirs', data: memory.theirs, slot: tpl.slots[1], tape: tapeFor(tpl, 1), tapeColor: tpl.tapes[1], from: { fx: '40cqw', fy: '30cqw', fr: '12deg' }, react: memory.reactions?.onTheirs },
    ];

    return html`<div
      className=${cx('page relative w-full overflow-hidden cardstock grain', compose && 'page-settle', className)}
      style=${{ aspectRatio: '3 / 4', backgroundColor: tpl.paper, containerType: 'inline-size', borderRadius: 6, boxShadow: 'var(--shadow-card)', ...style }}
    >
      ${tpl.line && tpl.line !== 'rgba(0,0,0,0)' && !tpl.line.endsWith('0.0)')
        ? html`<div className="absolute inset-0" style=${{ backgroundImage: `repeating-linear-gradient(180deg, transparent 0 calc(6.5cqw - 1px), ${tpl.line} calc(6.5cqw - 1px) 6.5cqw)`, backgroundPosition: '0 3cqw' }} />`
        : null}
      ${tpl.id === 'loveLetter' ? html`<div className="absolute top-0 bottom-0 left-[4.5%] w-px" style=${{ background: 'rgba(201,130,125,0.35)' }} />` : null}
      <div className="absolute inset-0" style=${{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(92,64,44,0.12) 100%)' }} />

      <div className=${cx('absolute right-[5%] top-[3%] w-[16%] aspect-square', compose && 'fade-in')} style=${{ animationDelay: compose ? '1500ms' : undefined }}>
        <${Doodle} motif=${tpl.motif} color=${tpl.secondary} />
      </div>

      <${PageDate} memory=${memory} tpl=${tpl} compose=${compose} />

      ${prints.map(
        (p, i) => html`<div
          key=${p.side}
          className=${cx('absolute', compose && 'drop-in')}
          style=${{
            left: p.slot.x + '%',
            top: p.slot.y + '%',
            width: p.slot.w + '%',
            transform: `rotate(${p.slot.r}deg)`,
            '--r': p.slot.r + 'deg',
            '--fx': p.from.fx,
            '--fy': p.from.fy,
            '--fr': p.from.fr,
            animationDelay: compose ? `${250 + i * 260}ms` : undefined,
            zIndex: 2 + i,
          }}
        >
          <${Polaroid}
            photo=${p.data.photo}
            caption=${p.side === 'mine' ? resolvedNames.mine : resolvedNames.theirs}
            frame=${frameId}
            scaleText
          />
          ${showMeta && p.react
            ? html`<span
                className=${cx('absolute flex items-center justify-center rounded-full', compose && 'stamp-in')}
                style=${{ [p.side === 'mine' ? 'left' : 'right']: '-3cqw', bottom: '5cqw', width: '8cqw', height: '8cqw', fontSize: '4.4cqw', background: 'var(--ivory)', boxShadow: '0 2px 6px -2px rgba(92,64,44,0.4), 0 0 0 1px rgba(201,130,125,0.35)', animationDelay: compose ? '1700ms' : undefined }}
              >${p.react}</span>`
            : null}
        </div>`
      )}

      ${prints.map(
        (p, i) => html`<div
          key=${'tape-' + i}
          className=${cx('washi', compose && 'tape-in')}
          style=${{ left: p.tape.x + '%', top: p.tape.y + '%', width: p.tape.w + '%', height: '4.6cqw', background: p.tapeColor, transform: `rotate(${p.tape.r}deg)`, '--r': p.tape.r + 'deg', animationDelay: compose ? `${900 + i * 160}ms` : undefined }}
        />`
      )}

      ${showMeta
        ? html`<div
            className=${cx('absolute left-[8%] right-[8%] bottom-[5%]', compose && 'fade-up')}
            style=${{ animationDelay: compose ? '1600ms' : undefined }}
          >
            ${memory.caption
              ? html`<div className="font-hand leading-none mb-[2cqw]" style=${{ fontSize: '6.4cqw', color: tpl.accent, transform: 'rotate(-1.5deg)' }}>${memory.caption}</div>`
              : null}
            <div className="space-y-[1.2cqw]">
              ${[['mine', resolvedNames.mine], ['theirs', resolvedNames.theirs]].map(
                ([side, who]) => html`<div key=${side} className="flex gap-[2cqw] items-baseline">
                  <span className="uppercase font-semibold shrink-0" style=${{ fontSize: '2.5cqw', letterSpacing: '0.16em', color: subColor, width: '9cqw' }}>${who}</span>
                  <span className="font-serif italic leading-snug" style=${{ fontSize: '3.5cqw', color: textColor }}>“${memory[side].prompt}”</span>
                </div>`
              )}
            </div>
          </div>`
        : null}

      ${showStickers
        ? (memory.stickers || []).map(
            (s, i) => html`<div
              key=${s.uid}
              className=${cx('absolute pointer-events-none', compose && 'stamp-in')}
              style=${{ left: s.x + '%', top: s.y + '%', width: '17%', transform: `translate(-50%, -50%) rotate(${s.r}deg) scale(${s.s})`, '--r': s.r + 'deg', zIndex: 6, animationDelay: compose ? `${1800 + i * 120}ms` : undefined }}
            ><${Sticker} id=${s.id} size="100%" style=${{ width: '100%', height: 'auto' }} /></div>`
          )
        : null}
      ${children}
    </div>`;
  }

  /* ----------------------------------------------------------- TabBar */

  const TABS = [
    { id: 'today', label: 'Today', icon: 'today' },
    { id: 'story', label: 'Our Story', icon: 'story' },
    { id: 'us', label: 'Us', icon: 'us' },
  ];

  /*
    TabBar — the persistent TODAY · OUR STORY · US bar. A floating ivory paper
    strip; slides away when drilling into a stack (hidden prop).
    `badge` puts a soft rose dot on a tab (e.g. reveal ready on Today).
  */
  function TabBar({ active, onSelect, hidden, badge }) {
    const { vintage } = LDR.useStyle();
    return html`<nav
      className=${cx('tabbar absolute left-3 right-3 bottom-3 z-40', hidden && 'tabbar-hidden')}
      aria-label="Main"
      aria-hidden=${hidden ? 'true' : undefined}
    >
      <div className="surface grain grain-soft flex items-stretch h-[66px] rounded-[24px]" style=${{ boxShadow: '0 10px 30px -12px rgba(92,64,44,0.38), 0 1px 0 rgba(255,255,255,0.6) inset' }}>
        ${TABS.map((t) => {
          const on = active === t.id;
          return html`<button
            key=${t.id}
            onClick=${() => onSelect(t.id)}
            tabIndex=${hidden ? -1 : 0}
            aria-current=${on ? 'page' : undefined}
            className=${cx('relative z-10 flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-300', on ? 'text-ink' : 'text-muted/80')}
          >
            <span className="relative">
              <${Icon} name=${t.icon} size=${23} stroke=${on ? 1.9 : 1.6} />
              ${badge === t.id ? html`<span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-rose soft-pulse" style=${{ border: '2px solid var(--ivory)' }} />` : null}
            </span>
            <span className=${cx('text-[10.5px] tracking-[0.12em] uppercase', vintage && 'label-type', on ? 'font-semibold' : 'font-medium')}>${t.label}</span>
            <span className=${cx('absolute bottom-[7px] w-1 h-1 rounded-full bg-ink transition-opacity duration-300', on ? 'opacity-70' : 'opacity-0')} />
          </button>`;
        })}
      </div>
    </nav>`;
  }

  Object.assign(LDR, {
    Icon,
    Screen,
    TopBar,
    PrimaryButton,
    SecondaryButton,
    TextLink,
    SectionLabel,
    CoinPill,
    CoinPop,
    Sparkles,
    Toast,
    Toggle,
    ListRow,
    Avatar,
    HuntCardFront,
    HuntCardBack,
    FlipCard,
    Polaroid,
    Sticker,
    ScrapbookPage,
    TabBar,
  });
})();
