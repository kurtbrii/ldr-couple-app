/*
  entry.js

  The account & pairing flow that sits between Welcome and the main app.
    Tier 3 stubs:  Sign up · Log in · Create couple · Invite partner
    Tier 2:        Onboarding ("You're officially hunting together.")

  Nothing here talks to a server — every button is a labelled simulation that
  simply moves the flow forward.

  Flow: welcome → signup → createCouple → invite → onboarding → (main app)
        welcome → login → (main app)
  Used by: navigation registry (entry stack).
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState } = React;
  const { Screen, TopBar, PrimaryButton, SecondaryButton, TextLink, SectionLabel, Icon, HuntCardFront, Star4, Avatar } = LDR;

  // Shared ivory text field with a small label above it.
  function Field({ label, value, onChange, placeholder, type = 'text', hint }) {
    return html`<label className="block">
      <span className="block text-[12.5px] font-medium text-muted mb-1.5 ml-1">${label}</span>
      <input
        type=${type}
        value=${value}
        placeholder=${placeholder}
        onChange=${(e) => onChange(e.target.value)}
        className="w-full h-[50px] px-4 rounded-[14px] bg-ivory text-[15.5px] outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-[rgba(141,155,131,0.5)]"
        style=${{ border: '1px solid rgba(136,121,112,0.22)', boxShadow: 'inset 0 1px 2px rgba(61,53,48,0.05)' }}
      />
      ${hint ? html`<span className="block text-[12px] text-muted mt-1.5 ml-1">${hint}</span>` : null}
    </label>`;
  }

  // Small "prototype" note so nobody mistakes a simulation for a real feature.
  function SimNote({ children }) {
    return html`<p className="text-center text-[11.5px] text-muted/80 mt-4 italic">${children}</p>`;
  }

  /*
    SignUpScreen — Tier 3 stub. Three provider buttons; any of them
    "creates" the account and continues to couple creation.
  */
  function SignUpScreen() {
    const nav = LDR.useNav();
    const go = () => nav.push('createCouple');
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} />`}>
      <div className="px-7 pt-4">
        <h1 className="font-serif text-[30px] leading-tight tracking-[-0.02em] fade-up">Make your account</h1>
        <p className="text-muted text-[15px] mt-2 fade-up" style=${{ animationDelay: '60ms' }}>Just for you. Your person will make their own.</p>
        <div className="mt-8 space-y-3 fade-up" style=${{ animationDelay: '120ms' }}>
          <button onClick=${go} className="w-full h-[52px] rounded-[16px] bg-ink text-ivory flex items-center justify-center gap-2.5 text-[15.5px] font-medium active:scale-[0.985] transition">
            <${Icon} name="apple" size=${19} fill="currentColor" stroke=${0} /> Continue with Apple
          </button>
          <${SecondaryButton} onClick=${go}>
            <span className="font-semibold text-[16px]" style=${{ color: '#8D9B83' }}>G</span> Continue with Google
          <//>
          <${SecondaryButton} onClick=${go} icon="mail">Continue with email<//>
        </div>
        <${SimNote}>Prototype — sign-in is simulated.<//>
      </div>
    <//>`;
  }

  /*
    LoginScreen — Tier 3 stub for "I already have an account".
    Pre-filled so the demo is one tap; Log in drops straight into TODAY.
  */
  function LoginScreen() {
    const nav = LDR.useNav();
    const [email, setEmail] = useState('jubi@example.com');
    const [pw, setPw] = useState('••••••••');
    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.pop} />`}
      footer=${html`<div className="px-7 pb-8 pt-3"><${PrimaryButton} onClick=${() => nav.setFlow('main')}>Log in<//></div>`}
    >
      <div className="px-7 pt-4">
        <h1 className="font-serif text-[30px] leading-tight tracking-[-0.02em] fade-up">Welcome back</h1>
        <p className="text-muted text-[15px] mt-2 fade-up" style=${{ animationDelay: '60ms' }}>Your story is right where you left it.</p>
        <div className="mt-8 space-y-4 fade-up" style=${{ animationDelay: '120ms' }}>
          <${Field} label="Email" value=${email} onChange=${setEmail} type="email" />
          <${Field} label="Password" value=${pw} onChange=${setPw} type="password" />
        </div>
        <${SimNote}>Prototype — any details work.<//>
      </div>
    <//>`;
  }

  /*
    CreateCoupleScreen — Tier 3 stub: your name, partner's name, optional
    nickname. Shows a live "Kurt + Jubi" preview to make it feel personal.
  */
  function CreateCoupleScreen() {
    const nav = LDR.useNav();
    const [me, setMe] = useState('Jubi');
    const [them, setThem] = useState('Kurt');
    const [nick, setNick] = useState('');
    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.pop} />`}
      footer=${html`<div className="px-7 pb-8 pt-3"><${PrimaryButton} onClick=${() => nav.push('invite')} disabled=${!me || !them}>Create our space<//></div>`}
    >
      <div className="px-7 pt-2">
        <h1 className="font-serif text-[30px] leading-tight tracking-[-0.02em] fade-up">Who’s this story about?</h1>
        <div className="my-7 flex items-center justify-center gap-3 fade-up" style=${{ animationDelay: '60ms' }}>
          <${Avatar} name=${me || '?'} tone="sage" size=${48} />
          <span className="font-hand text-[26px] text-rose">+</span>
          <${Avatar} name=${them || '?'} tone="rose" size=${48} />
        </div>
        <div className="text-center font-serif text-[22px] -mt-3 mb-7 fade-up" style=${{ animationDelay: '100ms' }}>${them || '…'} + ${me || '…'}</div>
        <div className="space-y-4 fade-up" style=${{ animationDelay: '140ms' }}>
          <${Field} label="Your name" value=${me} onChange=${setMe} />
          <${Field} label="Your person’s name" value=${them} onChange=${setThem} />
          <${Field} label="A nickname for you two (optional)" value=${nick} onChange=${setNick} placeholder="e.g. The Long Way Round" />
        </div>
      </div>
    <//>`;
  }

  /*
    InviteScreen — Tier 3 stub: shows the private invite code and the
    "Invite your person ❤️" action. A clearly-labelled control simulates
    Kurt accepting, which unlocks onboarding.
  */
  function InviteScreen() {
    const nav = LDR.useNav();
    const { actions } = LDR.useStore();
    const [sent, setSent] = useState(false);
    const code = 'JUBI · K7Q2';
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} />`}>
      <div className="px-7 pt-2 pb-10">
        <h1 className="font-serif text-[30px] leading-tight tracking-[-0.02em] fade-up">Now, bring them in</h1>
        <p className="text-muted text-[15px] mt-2 fade-up" style=${{ animationDelay: '60ms' }}>Your space is private. Only the person with this code can join.</p>

        <div className="surface grain mt-8 px-6 py-7 text-center fade-up" style=${{ animationDelay: '120ms' }}>
          <${SectionLabel}>Your invite code<//>
          <div className="font-serif text-[34px] tracking-[0.08em] mt-3">${code}</div>
          <button
            onClick=${() => actions.toast('Invite code copied')}
            className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] text-muted active:text-ink"
          ><${Icon} name="copy" size=${15} /> Copy code</button>
        </div>

        <div className="mt-6 space-y-3 fade-up" style=${{ animationDelay: '180ms' }}>
          <${PrimaryButton} onClick=${() => { setSent(true); actions.toast('Invite sent to Kurt ❤️'); }}>
            Invite your person <span className="text-rose-100" aria-hidden="true">❤️</span>
          <//>
          ${sent
            ? html`<div className="surface grain px-4 py-3.5 flex items-center gap-3 fade-up">
                <span className="w-2 h-2 rounded-full bg-sage soft-pulse" />
                <span className="flex-1 text-[14px] text-muted">Waiting for Kurt to join…</span>
                <button onClick=${() => nav.push('onboarding', {}, 'fade')} className="text-[13.5px] font-semibold text-ink underline underline-offset-4 decoration-[rgba(61,53,48,0.3)]">Simulate join</button>
              </div>`
            : null}
        </div>
        <${SimNote}>Prototype — pairing is simulated.<//>
      </div>
    <//>`;
  }

  /*
    OnboardingScreen — Tier 2. Post-pairing moment: the celebratory line,
    a two-step explainer (daily card → reveal), and one CTA into TODAY.
    Deliberately short — no long tutorial (PRD §8).
  */
  function OnboardingScreen() {
    const nav = LDR.useNav();
    return html`<${Screen}
      footer=${html`<div className="px-7 pb-9 pt-3 fade-up" style=${{ animationDelay: '700ms' }}>
        <${PrimaryButton} onClick=${() => nav.setFlow('main')}>Open Your First Card<//>
      </div>`}
    >
      <div className="safe-top" />
      <div className="px-7 pt-6 text-center">
        <div className="flex justify-center items-center gap-2 fade-up">
          <${Avatar} name="Jubi" tone="sage" size=${40} />
          <span className="text-rose text-[18px]" aria-hidden="true">❤️</span>
          <${Avatar} name="Kurt" tone="rose" size=${40} />
        </div>
        <h1 className="font-serif text-[31px] leading-[1.15] tracking-[-0.02em] mt-6 fade-up" style=${{ animationDelay: '120ms' }}>
          You’re officially <em className="italic font-light">hunting together.</em>
        </h1>
      </div>

      <div className="px-7 mt-9 space-y-4">
        ${[
          {
            n: '01',
            title: 'Every day, you each get a Hunt Card.',
            body: 'Your cards are connected — but you won’t see each other’s until it’s time to reveal.',
            art: html`<div className="w-[58px] h-[80px] rounded-[9px] overflow-hidden card-shape shrink-0" style=${{ transform: 'rotate(-5deg)', boxShadow: 'var(--shadow-soft)' }}>
              <${HuntCardFront} prompt="Find something from your morning." tint="morningSage" tag="Yours" />
            </div>`,
          },
          {
            n: '02',
            title: 'Find it. Snap it. Flip together.',
            body: 'When you’ve both found yours, open your cards at the same time — then keep the best ones in Our Story.',
            art: html`<div className="relative w-[58px] h-[80px] shrink-0">
              <div className="absolute inset-0 rounded-[9px] cardstock grain" style=${{ background: '#E2DCE3', transform: 'rotate(6deg)', boxShadow: 'var(--shadow-soft)' }} />
              <div className="absolute inset-0 rounded-[9px] cardstock grain flex items-center justify-center" style=${{ background: '#F3E6C4', transform: 'rotate(-4deg)', boxShadow: 'var(--shadow-soft)' }}>
                <${Star4} size=${18} color="#9A7A35" />
              </div>
            </div>`,
          },
        ].map(
          (s, i) => html`<div key=${s.n} className="surface grain flex items-center gap-4 px-4 py-4 fade-up" style=${{ animationDelay: 280 + i * 160 + 'ms' }}>
            ${s.art}
            <div>
              <div className="text-[11px] font-semibold tracking-[0.18em] text-muted">${s.n}</div>
              <div className="font-serif text-[17px] leading-snug mt-0.5">${s.title}</div>
              <div className="text-[13.5px] text-muted leading-relaxed mt-1">${s.body}</div>
            </div>
          </div>`
        )}
      </div>
    <//>`;
  }

  Object.assign(LDR.SCREENS, {
    signup: SignUpScreen,
    login: LoginScreen,
    createCouple: CreateCoupleScreen,
    invite: InviteScreen,
    onboarding: OnboardingScreen,
  });
})();
