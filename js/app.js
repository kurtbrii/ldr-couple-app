/*
  app.js

  The root of the prototype. Owns:
    - all app state (in React memory only — refresh resets everything)
    - the action functions screens call (submit a photo, add to Our Story, buy…)
    - the navigator (flows, tabs, stacks)
    - the Modern / Vintage style switch (data-theme on the phone element)
    - the phone frame, status bar and global toast

  Screens read state/actions through LDR.useStore() and navigate with
  LDR.useNav(); they never touch setState directly.

  Used by: index.html (last script loaded).
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useMemo, useCallback, useRef, createContext, useContext } = React;

  /*
    useAppStyle — owns the Modern / Vintage prototype-comparison toggle
    (see HANDOFF discussion: comparing the locked palette against a more
    aged, vintage take before committing to either). Stored in memory only,
    same as everything else; defaults to 'modern'.
  */
  function useAppStyle() {
    const [name, setName] = useState('modern');
    return useMemo(() => ({ name, setName }), [name]);
  }

  /*
    StyleSwitch — small "Modern · Vintage" segmented control pinned outside
    the phone frame (desktop only — see .style-switch in theme.css). Lets you
    flip the whole app's look live to compare the two before picking one.
  */
  function StyleSwitch({ style }) {
    const html = LDR.html;
    const opts = [['modern', 'Modern'], ['vintage', 'Vintage']];
    return html`<div className="style-switch">
      <div className="surface grain flex items-center p-1 rounded-full gap-0.5" style=${{ boxShadow: 'var(--shadow-card)' }}>
        ${opts.map(
          ([id, label]) => html`<button
            key=${id}
            onClick=${() => style.setName(id)}
            aria-pressed=${style.name === id}
            className=${'h-8 px-3.5 rounded-full text-[12.5px] font-medium transition-colors ' + (style.name === id ? 'bg-ink text-ivory' : 'text-muted')}
          >${label}</button>`
        )}
      </div>
    </div>`;
  }

  LDR.StoreContext = createContext(null);
  LDR.useStore = () => useContext(LDR.StoreContext);

  /*
    Picks the template for a freshly saved page ("smart default", PRD §30).
    Morning prompts get Sunday Morning, "us"/romantic ones Love Letter,
    evenings Midnight if owned — otherwise Classic. Only owned templates.
  */
  function pickDefaultTemplate(today, owned) {
    const has = (t) => owned.templates.includes(t);
    const p = today.myPrompt.toLowerCase();
    if (/morning/.test(p) && has('sundayMorning')) return 'sundayMorning';
    if (/\b(me|us|miss)\b/.test(p) && has('loveLetter')) return 'loveLetter';
    if (/evening|night/.test(p) && has('midnight')) return 'midnight';
    return 'classic';
  }

  // Weekday for the mock "today" (September 19 in our demo year is a Friday).
  const TODAY_WEEKDAY = 'Friday';

  /*
    useAppStore — builds state + actions. Actions are stable (useMemo with
    functional setState) so screens can safely list them in effect deps.
  */
  function useAppStore() {
    const [state, setState] = useState(LDR.createInitialState);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const actions = useMemo(() => {
      const update = (fn) => setState((s) => ({ ...s, ...fn(s) }));
      const updateToday = (patch) => update((s) => ({ today: { ...s.today, ...patch } }));

      const showToast = (text) => {
        clearTimeout(toastTimer.current);
        setToast({ text, key: Date.now() });
        toastTimer.current = setTimeout(() => setToast(null), 2700);
      };

      return {
        toast: showToast,

        // ---- Today's Hunt lifecycle ------------------------------------
        submitMyPhoto: (photo) =>
          update((s) => ({
            coins: s.coins + 10,
            today: { ...s.today, myPhoto: photo, status: s.today.partnerSubmitted ? 'ready' : 'submitted' },
          })),
        // Prototype control: pretend the partner finished their Hunt.
        simulatePartner: () =>
          update((s) => ({ today: { ...s.today, partnerSubmitted: true, status: s.today.myPhoto ? 'ready' : s.today.status } })),
        markRevealed: () => updateToday({ status: 'revealed' }),
        setReaction: (emoji) => update((s) => ({ today: { ...s.today, myReaction: s.today.myReaction === emoji ? null : emoji } })),
        setComment: (comment) => updateToday({ comment }),

        /*
          addToStory — the deliberate "keep this" action. Builds a finished page
          from today's Hunt with a smart default template and prepends it to
          Our Story. Returns nothing; the new id is today.memoryId.
        */
        addToStory: () =>
          update((s) => {
            if (s.today.memoryId) return {};
            const id = 'm-today';
            const t = s.today;
            const memory = {
              id,
              date: t.date,
              weekday: TODAY_WEEKDAY,
              template: pickDefaultTemplate(t, s.owned),
              frame: 'polaroid',
              isNew: true,
              mine: { prompt: t.myPrompt, photo: t.myPhoto },
              theirs: { prompt: t.theirPrompt, photo: t.theirPhoto },
              reactions: { onMine: t.theirReaction, onTheirs: t.myReaction },
              comments: t.comment ? [{ by: s.user.name, text: t.comment }] : [],
              caption: '',
              stickers: [],
            };
            return {
              memories: [memory, ...s.memories],
              stats: { days: s.stats.days + 1, moments: s.stats.moments + 1, photos: s.stats.photos + 2 },
              streak: s.streak + 1,
              today: { ...t, status: 'added', memoryId: id },
            };
          }),

        // Demo helper: replay today's Hunt from the start.
        replayToday: () =>
          update((s) => ({
            memories: s.memories.filter((m) => m.id !== 'm-today'),
            stats: s.today.memoryId ? { days: s.stats.days - 1, moments: s.stats.moments - 1, photos: s.stats.photos - 2 } : s.stats,
            streak: s.today.memoryId ? s.streak - 1 : s.streak,
            today: { ...LDR.createInitialState().today },
          })),

        // ---- Scrapbook ---------------------------------------------------
        updateMemory: (id, patch) =>
          update((s) => ({ memories: s.memories.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),

        // ---- Coin Shop ---------------------------------------------------
        /*
          buy — spends shared Coins on an item. Never lets the balance go
          negative; themes also unlock everything in their `grants`.
          Returns 'ok' | 'owned' | 'insufficient' (read synchronously from
          the latest state passed in by the caller).
        */
        buy: (item, current) => {
          if (current.owned[item.kind].includes(item.id)) return 'owned';
          if (current.coins < item.price) return 'insufficient';
          update((s) => {
            const owned = { ...s.owned, [item.kind]: [...s.owned[item.kind], item.id] };
            Object.entries(item.grants || {}).forEach(([kind, ids]) => {
              owned[kind] = Array.from(new Set([...owned[kind], ...ids]));
            });
            return { coins: s.coins - item.price, owned };
          });
          return 'ok';
        },

        // ---- Missed Hunts ------------------------------------------------
        completeMissed: (id, photo) =>
          update((s) => ({
            coins: s.coins + 10,
            missed: s.missed.map((m) => (m.id === id ? { ...m, myPhoto: photo, status: 'ready' } : m)),
          })),
        revealMissed: (id) => update((s) => ({ missed: s.missed.map((m) => (m.id === id ? { ...m, status: 'revealed' } : m)) })),

        // ---- Settings ----------------------------------------------------
        setHuntMode: (huntMode) => update(() => ({ huntMode })),
        setVacation: (vacation) => update(() => ({ vacation })),
        setNotification: (key, value) => update((s) => ({ notifications: { ...s.notifications, [key]: value } })),
        setEditingLock: (editingLock) => update(() => ({ editingLock })),
        archive: () => update(() => ({ archived: true })),
        unarchive: () => update(() => ({ archived: false })),
        resetAll: () => setState(LDR.createInitialState()),
      };
    }, []);

    return { state, actions, toast };
  }

  // Decorative status bar so the frame reads as a phone on desktop.
  function StatusBar() {
    return html`<div className="status-bar text-ink" aria-hidden="true">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11"><g fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></g></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor"/><rect x="22.5" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.4"/></svg>
      </span>
    </div>`;
  }

  /*
    App — root component. Wires the store + navigator into context and draws
    the phone frame. Tab badge: a rose dot on TODAY when cards are ready to open.
  */
  function App() {
    const store = useAppStore();
    const style = useAppStyle();
    const [navState, nav] = LDR.useNavigator();
    const badge = navState.tab !== 'today' && store.state.today.status === 'ready' ? 'today' : null;

    return html`<${LDR.StoreContext.Provider} value=${store}>
      <${LDR.NavContext.Provider} value=${nav}>
        <${LDR.StyleContext.Provider} value=${style}>
          <div className="stage">
            <${StyleSwitch} style=${style} />
            <div className="phone" id="phone" data-theme=${style.name}>
              <${StatusBar} />
              <${LDR.NavigatorView} navState=${navState} nav=${nav} tabBadge=${badge} />
              ${store.toast ? html`<${LDR.Toast} key=${store.toast.key}>${store.toast.text}<//>` : null}
            </div>
          </div>
        <//>
      <//>
    <//>`;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
