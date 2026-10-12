/*
  us.js

  The US tab: the couple's profile and every calm setting.
    Tier 2: US / profile & settings · Hunt mode picker (1/3/5) · Vacation Mode
            · Trial conversion ("Your first 14 days ❤️")
    Tier 3: Notification settings · End relationship / archived view

  Everything is memory-only. Subscription and notifications are clearly
  labelled simulations.

  Used by: navigation registry ('us' root + 'huntMode', 'vacation', 'trial',
           'notifications', 'endRelationship').
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { Screen, TopBar, PrimaryButton, SecondaryButton, TextLink, SectionLabel, ListRow, Toggle, Avatar, CoinPill, Icon, Star4 } = LDR;

  const MODES = [
    { n: 1, name: 'Easy', body: 'One card a day. A small, steady ritual.' },
    { n: 3, name: 'Regular', body: 'Three cards to find through the day.' },
    { n: 5, name: 'Challenge', body: 'Five cards — for days you feel curious.' },
  ];

  // Ivory group of rows, like a page of stationery.
  function Group({ label, children }) {
    return html`<section>
      ${label ? html`<${SectionLabel} className="mb-2 ml-1">${label}<//>` : null}
      <div className="surface grain overflow-hidden divide-y divide-[rgba(136,121,112,0.13)]">${children}</div>
    </section>`;
  }

  /*
    UsScreen — root of the US tab. The couple card up top (names, since,
    streak keepsake, shared coins), then grouped settings.
  */
  function UsScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const mode = MODES.find((m) => m.n === state.huntMode);
    const trialLeft = state.trial.length - state.trial.day;

    return html`<${Screen} tabs>
      <div className="safe-top" />
      <div className="px-6 pt-3">
        <div className="relative surface grain px-6 pt-6 pb-5 text-center fade-up overflow-hidden">
          <div className="washi" style=${{ background: '#C9B48E', width: 70, left: 'calc(50% - 35px)', top: -6, transform: 'rotate(-3deg)' }} />
          <div className="flex justify-center items-center -space-x-2">
            <${Avatar} name=${state.partner.name} tone="rose" size=${54} />
            <${Avatar} name=${state.user.name} tone="sage" size=${54} />
          </div>
          <h1 className="font-serif text-[28px] tracking-[-0.02em] mt-3">${state.partner.name} + ${state.user.name}</h1>
          <p className="text-[13.5px] text-muted mt-0.5">Hunting together since ${state.coupleSince}</p>
          <div className="flex justify-center items-center gap-4 mt-4 text-[13px] text-muted">
            <span title="Days in a row you've both hunted">🔥 ${state.streak} days <span className="text-muted/70">· best ${state.bestStreak}</span></span>
            <${CoinPill} amount=${state.coins} onClick=${() => nav.push('shop')} />
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6 pb-6">
        <${Group} label="Subscription">
          <${ListRow}
            icon="sparkle"
            label="Free trial"
            sub=${`Day ${state.trial.day} of ${state.trial.length} · ${trialLeft} days left`}
            onClick=${() => nav.push('trial', {}, 'sheet')}
          />
        <//>

        <${Group} label="Hunts">
          <${ListRow} icon="cards" label="Hunt mode" value=${`${mode.n} · ${mode.name}`} onClick=${() => nav.push('huntMode')} />
          <${ListRow} icon="plane" label="Vacation Mode" value=${state.vacation ? 'On' : 'Off'} onClick=${() => nav.push('vacation')} />
          <${ListRow} icon="clock" label="Missed Hunts" value=${String(state.missed.filter((m) => m.status !== 'revealed').length)} onClick=${() => nav.push('missed')} />
          <${ListRow} icon="bell" label="Notifications" onClick=${() => nav.push('notifications')} />
        <//>

        <${Group} label="Scrapbook">
          <${ListRow} icon="bag" label="Coin Shop" onClick=${() => nav.push('shop')} />
        <//>

        <${Group} label="Relationship">
          ${state.archived
            ? html`<${ListRow} icon="archive" label="Our Story is archived" sub="Read-only · every page is kept" right=${html`<button onClick=${() => { actions.unarchive(); actions.toast('Restored (prototype)'); }} className="text-[13px] font-medium underline underline-offset-4">Restore</button>`} />`
            : html`<${ListRow} icon="door" label="End relationship" danger onClick=${() => nav.push('endRelationship')} />`}
        <//>

        <${Group}>
          <${ListRow} icon="shield" label="Privacy" sub="Private to the two of you. No public profiles, ever." />
          <${ListRow} label="Sign out" onClick=${() => nav.setFlow('entry')} />
        <//>

        <div className="text-center">
          <${TextLink} onClick=${() => { actions.resetAll(); nav.setFlow('entry'); }}>Reset prototype<//>
        </div>
      </div>
    <//>`;
  }

  /*
    HuntModeScreen — Tier 2 picker: 1 Easy / 3 Regular / 5 Challenge.
    Default 1. Saved immediately; the copy explains it starts tomorrow.
  */
  function HuntModeScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} title="Hunt mode" serif />`}>
      <div className="px-6 pt-1 pb-10">
        <p className="text-[14.5px] text-muted leading-relaxed">How many cards would you like each day? You can change this any time.</p>
        <div className="mt-6 space-y-3" role="radiogroup" aria-label="Hunt mode">
          ${MODES.map((m) => {
            const on = state.huntMode === m.n;
            return html`<button
              key=${m.n}
              role="radio"
              aria-checked=${on}
              onClick=${() => actions.setHuntMode(m.n)}
              className="w-full surface grain flex items-center gap-4 px-4 py-4 text-left transition-shadow"
              style=${{ boxShadow: on ? '0 0 0 2px #3D3530, var(--shadow-soft)' : undefined }}
            >
              <span className="relative w-[54px] h-[54px] shrink-0">
                ${Array.from({ length: Math.min(m.n, 3) }, (_, i) => html`<span
                  key=${i}
                  className="absolute top-1 w-[34px] h-[46px] rounded-[6px] cardstock grain flex items-center justify-center"
                  style=${{ left: 4 + i * 7, background: ['#F3E6C4', '#E2E6D6', '#EDD8D2'][i], transform: `rotate(${(i - 1) * 8}deg)`, boxShadow: 'var(--shadow-soft)' }}
                >${i === Math.min(m.n, 3) - 1 ? html`<span className="font-serif text-[17px]">${m.n}</span>` : null}</span>`)}
              </span>
              <span className="flex-1">
                <span className="block font-serif text-[19px]">${m.n} · ${m.name}${m.n === 1 ? html` <span className="text-[12px] font-sans text-muted">(default)</span>` : null}</span>
                <span className="block text-[13.5px] text-muted mt-0.5">${m.body}</span>
              </span>
              <span className=${'w-6 h-6 rounded-full flex items-center justify-center ' + (on ? 'bg-ink text-ivory' : '')} style=${{ boxShadow: on ? 'none' : 'inset 0 0 0 1.5px rgba(136,121,112,0.45)' }}>
                ${on ? html`<${Icon} name="check" size=${14} stroke=${2.4} />` : null}
              </span>
            </button>`;
          })}
        </div>
        <p className="text-center text-[12.5px] text-muted mt-6">Changes start with tomorrow’s Hunt. ${state.partner.name} gets the same number of cards.</p>
      </div>
    <//>`;
  }

  /*
    VacationScreen — Tier 2 toggle. "Pause new Hunts while you're away."
    Turning it on also shows a calm state on TODAY.
  */
  function VacationScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} title="Vacation Mode" serif />`}>
      <div className="px-6 pt-4 pb-10">
        <div className="text-center">
          <div className="text-[40px]" aria-hidden="true">🌿</div>
          <h1 className="font-serif text-[24px] mt-2 leading-snug">Pause new Hunts while you’re away.</h1>
          <p className="text-[14.5px] text-muted leading-relaxed mt-2">Travelling, busy, or just need a breather? No new cards will arrive, and your streak waits for you.</p>
        </div>
        <div className="surface grain mt-7 px-5 py-4 flex items-center gap-4">
          <span className="flex-1">
            <span className="block text-[15.5px]">Vacation Mode</span>
            <span className="block text-[12.5px] text-muted mt-0.5">${state.vacation ? 'On — Hunts are paused for you both' : 'Off'}</span>
          </span>
          <${Toggle} on=${state.vacation} label="Vacation Mode" onChange=${(v) => { actions.setVacation(v); actions.toast(v ? 'Hunts paused 🌿' : 'Welcome back ❤️'); }} />
        </div>
        <p className="text-center text-[12.5px] text-muted mt-5">Your story stays exactly as it is. Turn it off any time.</p>
      </div>
    <//>`;
  }

  /*
    TrialScreen — Tier 2 trial conversion. Shows accumulated value first
    (days, moments, photos, coins) and then a soft "Continue Together".
    Never a harsh paywall: declining keeps every memory safe.
  */
  function TrialScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const r = state.trialRecap;
    const stats = [
      [r.days, 'days together'],
      [r.moments, 'moments created'],
      [r.photos, 'photos shared'],
      [r.coinsEarned, 'Coins earned', true],
    ];
    return html`<${Screen}
      header=${html`<${TopBar} onBack=${nav.pop} backIcon="close" />`}
      footer=${html`<div className="px-6 pb-7 pt-3">
        <${PrimaryButton} onClick=${() => { actions.toast('Subscribed — simulated ❤️'); nav.pop(); }}>Continue Together<//>
        <div className="text-center"><${TextLink} onClick=${nav.pop}>Not now — our story stays safe<//></div>
      </div>`}
    >
      <div className="px-7 text-center">
        <${Star4} size=${16} color="#C9827D" className="block mx-auto" />
        <h1 className="font-serif text-[31px] leading-tight tracking-[-0.02em] mt-3 fade-up">Your first 14 days <span aria-hidden="true">❤️</span></h1>
        <p className="text-[13px] text-muted mt-1">Preview · shown on day 14 of the trial</p>
      </div>
      <div className="px-6 mt-7 grid grid-cols-2 gap-3">
        ${stats.map(
          ([n, label, coin], i) => html`<div
            key=${label}
            className="surface grain px-4 py-5 text-center fade-up"
            style=${{ transform: `rotate(${[-1.2, 1, 0.8, -0.8][i]}deg)`, animationDelay: 120 + i * 90 + 'ms' }}
          >
            ${coin
              ? html`<div className="flex justify-center"><span className="coin-pill text-[20px] px-3 py-1"><span aria-hidden="true">🪙</span>${n}</span></div>`
              : html`<div className="font-serif text-[36px] leading-none">${n}</div>`}
            <div className="text-[13px] text-muted mt-2">${label}</div>
          </div>`
        )}
      </div>
      <div className="px-7 mt-8 text-center fade-up" style=${{ animationDelay: '520ms' }}>
        <p className="font-serif text-[22px]">Keep building your story.</p>
        <p className="text-[14px] text-muted leading-relaxed mt-2">One subscription covers you both — <span className="text-ink">$5.99/month</span> or <span className="text-ink">$49.99/year</span>.</p>
        <p className="text-[12px] text-muted mt-3">Prototype — no payment is taken.</p>
      </div>
    <//>`;
  }

  /*
    NotificationsScreen — Tier 3 stub: the four PRD notifications with their
    actual copy, each with a sage toggle (state only).
  */
  function NotificationsScreen() {
    const nav = LDR.useNav();
    const { state, actions } = LDR.useStore();
    const rows = [
      ['newHunt', 'New Hunt', 'Your Hunt is waiting 👀'],
      ['partnerSubmitted', 'Partner submitted', 'Your person finished their Hunt.'],
      ['revealReady', 'Ready to reveal', 'Your cards are ready to open. ❤️'],
      ['streak', 'Streak', 'A gentle note, never a warning.'],
    ];
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} title="Notifications" serif />`}>
      <div className="px-6 pt-1 pb-10">
        <div className="surface grain overflow-hidden divide-y divide-[rgba(136,121,112,0.13)]">
          ${rows.map(
            ([key, label, example]) => html`<div key=${key} className="flex items-center gap-4 px-4 py-3.5">
              <span className="flex-1">
                <span className="block text-[15px]">${label}</span>
                <span className="block text-[12.5px] text-muted mt-0.5 italic">“${example}”</span>
              </span>
              <${Toggle} on=${state.notifications[key]} label=${label} onChange=${(v) => actions.setNotification(key, v)} />
            </div>`
          )}
        </div>
        <p className="text-center text-[12.5px] text-muted mt-5">Sent in your own time zone. Prototype — nothing is actually sent.</p>
      </div>
    <//>`;
  }

  /*
    EndRelationshipScreen — Tier 3. Calm, non-sentimental. Archive makes Our
    Story read-only (and stops new Hunts / shared spending); the other options
    are concept-only.
  */
  function EndRelationshipScreen() {
    const nav = LDR.useNav();
    const { actions } = LDR.useStore();
    const options = [
      { icon: 'archive', label: 'Archive Our Story', sub: 'Becomes read-only. Nothing is deleted.', onClick: () => { actions.archive(); actions.toast('Our Story is archived'); nav.popToRoot(); } },
      { icon: 'download', label: 'Export my memories', sub: 'Save your pages and photos.', onClick: () => actions.toast('Export — simulated') },
      { icon: 'refresh', label: 'Start fresh', sub: 'Leave this couple. Concept only.' },
      { icon: 'trash', label: 'Delete my copy', sub: 'Per the final privacy policy. Concept only.' },
    ];
    return html`<${Screen} header=${html`<${TopBar} onBack=${nav.pop} />`}>
      <div className="px-6 pt-2 pb-10">
        <h1 className="font-serif text-[26px] leading-snug tracking-[-0.01em]">Are you sure you want to end your shared story?</h1>
        <p className="text-[14.5px] text-muted leading-relaxed mt-3">Your memories won’t be deleted. Either of you can do this — it doesn’t need the other’s approval.</p>
        <div className="mt-7 surface grain overflow-hidden divide-y divide-[rgba(136,121,112,0.13)]">
          ${options.map((o) => html`<${ListRow} key=${o.label} icon=${o.icon} label=${o.label} sub=${o.sub} onClick=${o.onClick} />`)}
        </div>
        <div className="mt-6"><${SecondaryButton} onClick=${nav.pop}>Keep our story going<//></div>
      </div>
    <//>`;
  }

  Object.assign(LDR.SCREENS, {
    us: UsScreen,
    huntMode: HuntModeScreen,
    vacation: VacationScreen,
    trial: TrialScreen,
    notifications: NotificationsScreen,
    endRelationship: EndRelationshipScreen,
  });
})();
