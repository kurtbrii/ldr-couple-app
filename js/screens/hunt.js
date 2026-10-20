/*
  hunt.js

  Tier 1 · Screen 3 — Start Hunt → Photo Preview → Submit.

    startHunt:     "Go find it 📸" with a simulated viewfinder. The shutter
                   "takes" a sample photo; "Choose from library" opens a
                   sheet of sample photos.
    photoPreview:  "Happy with your find?" → Submit / Retake. Submit plays the
                   placement moment: the photo lands on the card back, the card
                   gets its 🔒 stamp and "+10 🪙" pops — then on to Waiting.

  The same two screens are reused by Missed Hunts (params.missedId) so a missed
  card can be completed with the exact same feel.

  Used by: navigation registry ('startHunt', 'photoPreview').
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useEffect, useRef } = React;
  const { Screen, TopBar, PrimaryButton, SecondaryButton, Polaroid, HuntCardBack, CoinPop, Icon, Sparkles, SectionLabel } = LDR;

  // Photos offered in the simulated camera roll.
  const LIBRARY = ['coffee', 'window', 'bread', 'plant', 'book', 'flowers'];

  /*
    useHuntContext — which Hunt are we capturing for? Today's by default,
    or a Missed Hunt when opened with params.missedId.
  */
  function useHuntContext(params) {
    const { state } = LDR.useStore();
    if (params && params.missedId) {
      const m = state.missed.find((x) => x.id === params.missedId);
      return { prompt: m.myPrompt, tint: m.myTint, cameraPhoto: 'plant', missed: m };
    }
    return { prompt: state.today.myPrompt, tint: state.today.myTint, cameraPhoto: 'coffee', missed: null };
  }

  /*
    LibrarySheet — a bottom sheet of sample photos (the simulated camera roll).
    Slides up over the camera screen; tapping a photo picks it.
  */
  function LibrarySheet({ onPick, onClose }) {
    return html`<div className="absolute inset-0 z-40">
      <button className="absolute inset-0 bg-[rgba(61,53,48,0.35)] fade-in" aria-label="Close library" onClick=${onClose} />
      <div className="absolute left-0 right-0 bottom-0 paper-bg grain rounded-t-[28px] px-5 pt-3 pb-8 anim-sheet-in" style=${{ boxShadow: '0 -10px 30px -10px rgba(61,40,28,0.4)' }}>
        <div className="mx-auto w-10 h-1.5 rounded-full bg-[rgba(136,121,112,0.35)] mb-4" />
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="font-serif text-[20px]">Recents</div>
          <button onClick=${onClose} className="text-[14px] text-muted">Cancel</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          ${LIBRARY.map(
            (id) => html`<button key=${id} onClick=${() => onPick(id)} className="relative aspect-square overflow-hidden rounded-[10px] active:scale-[0.97] transition" aria-label=${LDR.photo(id).alt}>
              <img src=${LDR.photo(id).src} alt="" className="w-full h-full object-cover" />
            </button>`
          )}
        </div>
        <p className="text-center text-[11.5px] text-muted/80 mt-4 italic">Prototype — sample photos stand in for your camera roll.</p>
      </div>
    </div>`;
  }

  /*
    StartHuntScreen — "Go find it 📸". The viewfinder slowly drifts over a
    sample scene so it feels alive; the shutter flashes, then opens Preview.
  */
  function StartHuntScreen({ params }) {
    const nav = LDR.useNav();
    const ctx = useHuntContext(params);
    const [library, setLibrary] = useState(false);
    const [flash, setFlash] = useState(false);

    const shoot = () => {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        nav.push('photoPreview', { photo: ctx.cameraPhoto, missedId: params.missedId });
      }, 260);
    };
    const pick = (photo) => {
      setLibrary(false);
      setTimeout(() => nav.push('photoPreview', { photo, missedId: params.missedId }), 200);
    };

    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} backIcon="close" />`}>
      <div className="px-6">
        <h1 className="font-serif text-[30px] tracking-[-0.02em] fade-up">Go find it <span aria-hidden="true">📸</span></h1>
        <p className="font-serif italic text-[17px] text-muted mt-1 fade-up" style=${{ animationDelay: '60ms' }}>“${ctx.prompt}”</p>

        <div className="relative mt-5 rounded-[26px] overflow-hidden fade-up" style=${{ aspectRatio: '4 / 5', background: '#2E2724', animationDelay: '120ms', boxShadow: 'var(--shadow-card)' }}>
          <img
            src=${LDR.photo(ctx.cameraPhoto).src}
            alt="Camera viewfinder"
            className="absolute inset-0 w-full h-full object-cover"
            style=${{ transform: 'scale(1.18)', animation: 'viewfinder-drift 9s ease-in-out infinite alternate', filter: 'saturate(0.9)' }}
          />
          <div className="absolute inset-0" style=${{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.35))' }} />
          ${['top-5 left-5 border-t-2 border-l-2', 'top-5 right-5 border-t-2 border-r-2', 'bottom-5 left-5 border-b-2 border-l-2', 'bottom-5 right-5 border-b-2 border-r-2'].map(
            (c) => html`<span key=${c} className=${'absolute w-6 h-6 rounded-[3px] ' + c} style=${{ borderColor: 'rgba(255,249,240,0.85)' }} />`
          )}
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <span className="px-3 py-1 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold" style=${{ background: 'rgba(46,39,36,0.45)', color: 'var(--ivory)' }}>Photo</span>
          </div>
          <div className=${'absolute inset-0 bg-[#FFF9F0] pointer-events-none transition-opacity ' + (flash ? 'opacity-90 duration-75' : 'opacity-0 duration-300')} />
        </div>

        <div className="flex items-center justify-between mt-6 px-2 fade-up" style=${{ animationDelay: '180ms' }}>
          <button onClick=${() => setLibrary(true)} className="w-14 h-14 rounded-[14px] overflow-hidden active:scale-95 transition" style=${{ boxShadow: '0 0 0 2px #FFF9F0, 0 4px 10px -4px rgba(61,40,28,0.5)' }} aria-label="Choose from library">
            <img src=${LDR.photo('window').src} alt="" className="w-full h-full object-cover" />
          </button>
          <button onClick=${shoot} aria-label="Take photo" className="w-[78px] h-[78px] rounded-full flex items-center justify-center active:scale-95 transition" style=${{ background: 'var(--ivory)', boxShadow: '0 0 0 4px rgba(185,104,79,0.9), 0 10px 22px -8px rgba(185,104,79,0.7)' }}>
            <span className="w-[62px] h-[62px] rounded-full grain" style=${{ background: '#B9684F' }} />
          </button>
          <div className="w-14" />
        </div>
        <div className="text-center mt-3">
          <button onClick=${() => setLibrary(true)} className="inline-flex items-center gap-1.5 text-[14px] text-muted py-2 active:text-ink"><${Icon} name="image" size=${17} /> Choose from library</button>
        </div>
      </div>
      ${library ? html`<${LibrarySheet} onPick=${pick} onClose=${() => setLibrary(false)} />` : null}
    <//>`;
  }

  /*
    PhotoPreviewScreen — review → Submit / Retake.

    phase 'review'  → big print of the find + the two buttons
    phase 'placing' → the find lands on the back of the Hunt Card, the card
                      gets locked, +10 🪙 pops; then we move on automatically.
  */
  function PhotoPreviewScreen({ params }) {
    const nav = LDR.useNav();
    const { actions } = LDR.useStore();
    const ctx = useHuntContext(params);
    const [phase, setPhase] = useState('review');
    const [showCoin, setShowCoin] = useState(false); // "+10 🪙" appears once the card locks
    const timers = useRef([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const submit = () => {
      setPhase('placing');
      if (ctx.missed) actions.completeMissed(ctx.missed.id, params.photo);
      else actions.submitMyPhoto(params.photo);
      timers.current.push(setTimeout(() => setShowCoin(true), 950));
      timers.current.push(
        setTimeout(() => {
          if (ctx.missed) nav.resetTo([['missed', { justCompleted: ctx.missed.id }]]);
          else nav.resetTo([['waiting', { fresh: true }]]);
        }, 2600)
      );
    };

    if (phase === 'placing') {
      return html`<${Screen} bodyClass="flex flex-col items-center justify-center">
        <div className="relative" style=${{ width: 'min(250px, 66%)', aspectRatio: '5 / 7' }}>
          <div className="absolute inset-0 rounded-[22px] overflow-hidden card-shape fade-up" style=${{ boxShadow: 'var(--shadow-card)', transform: 'rotate(-1.2deg)' }}>
            <${HuntCardBack} tint=${ctx.tint} photo=${params.photo} locked animatePlace label="my find" />
          </div>
          <${Sparkles} key="s" count=${10} spread=${150} />
          ${showCoin ? html`<${CoinPop} amount=${10} top="-14px" />` : null}
        </div>
        <p className="font-serif text-[21px] mt-9 text-center fade-up" style=${{ animationDelay: '1000ms' }}>Placed on your card.</p>
        <p className="text-[14px] text-muted mt-1 fade-up" style=${{ animationDelay: '1150ms' }}>It stays hidden until you both open.</p>
      <//>`;
    }

    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.pop} />`}
      footer=${html`<div className="px-6 pb-8 pt-3 space-y-2.5 fade-up" style=${{ animationDelay: '160ms' }}>
        <${PrimaryButton} onClick=${submit}>Submit<//>
        <${SecondaryButton} icon="refresh" onClick=${nav.pop}>Retake<//>
      </div>`}
    >
      <div className="px-6 text-center">
        <h1 className="font-serif text-[28px] tracking-[-0.02em] fade-up">Happy with your find?</h1>
        <p className="font-serif italic text-[16px] text-muted mt-1 fade-up" style=${{ animationDelay: '60ms' }}>“${ctx.prompt}”</p>
        <div className="mx-auto mt-6 fade-up" style=${{ width: 'min(270px, 74%)', animationDelay: '100ms' }}>
          <${Polaroid} photo=${params.photo} caption="my find" rotate=${-2} tape tapeColor="#C9B48E" />
        </div>
      </div>
    <//>`;
  }

  Object.assign(LDR.SCREENS, { startHunt: StartHuntScreen, photoPreview: PhotoPreviewScreen });
})();
