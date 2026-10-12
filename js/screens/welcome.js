/*
  welcome.js

  Tier 1 · Screen 1 — Welcome / Get Started.
  First thing anyone sees: grainy cream paper, a small still-life of two Hunt
  Cards and a polaroid, the product promise in serif, one terracotta action.

  Routes: Get Started → signup · "I already have an account" → login
  Used by: navigation registry (LDR.SCREENS.welcome), entry flow root.
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { Screen, PrimaryButton, TextLink, HuntCardFront, Polaroid, Star4 } = LDR;

  /*
    WelcomeScreen — the opening screen. Calm and spacious; the hero is a
    hand-placed arrangement (two closed cards + a print) so the very first
    impression is "scrapbook", not "app".
  */
  function WelcomeScreen() {
    const nav = LDR.useNav();

    return html`<${Screen} bodyClass="flex flex-col">
      <div className="safe-top" />
      <div className="flex items-center justify-center gap-2 pt-3 text-muted fade-up">
        <${Star4} size=${11} color="#B9684F" />
        <span className="text-[11px] tracking-[0.3em] uppercase font-semibold">A daily hunt for two</span>
        <${Star4} size=${11} color="#B9684F" />
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[330px]">
        <div className="relative w-[300px] h-[310px] shrink-0">
          <div className="absolute left-[14px] top-[22px] w-[150px] h-[210px] fade-up" style=${{ animationDelay: '80ms' }}>
            <div className="w-full h-full rounded-[16px] overflow-hidden card-breathe" style=${{ '--tilt': '-8deg', boxShadow: 'var(--shadow-card)' }}>
              <${HuntCardFront} prompt="Find something from your morning." tint="morningButter" tag="Your Hunt" />
            </div>
          </div>
          <div className="absolute right-[14px] top-[6px] w-[150px] h-[210px] fade-up" style=${{ animationDelay: '200ms' }}>
            <div className="w-full h-full rounded-[16px] overflow-hidden card-breathe" style=${{ '--tilt': '7deg', boxShadow: 'var(--shadow-card)', animationDelay: '-2.2s' }}>
              <${HuntCardFront} prompt="Find something from your evening." tint="eveningLavender" tag="Their Hunt" />
            </div>
          </div>
          <div className="absolute left-1/2 bottom-0 w-[108px] -ml-[46px] fade-up" style=${{ animationDelay: '360ms' }}>
            <${Polaroid} photo="coffee" caption="us, today" rotate=${-4} tape tapeColor="#B8C2A8" />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-8 pb-6 pt-2">
        <h1 className="font-serif text-[33px] leading-[1.12] tracking-[-0.02em] text-ink fade-up" style=${{ animationDelay: '420ms' }}>
          Turn your separate days into a <em className="italic font-light">shared story.</em>
        </h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-muted fade-up" style=${{ animationDelay: '520ms' }}>
          Every day you each get a little Hunt. Find it, snap it, then flip your cards together.
        </p>
        <div className="mt-8 fade-up" style=${{ animationDelay: '620ms' }}>
          <${PrimaryButton} onClick=${() => nav.push('signup')}>Get Started<//>
          <div className="text-center mt-2">
            <${TextLink} onClick=${() => nav.push('login')}>I already have an account<//>
          </div>
        </div>
      </div>
    <//>`;
  }

  LDR.SCREENS.welcome = WelcomeScreen;
})();
