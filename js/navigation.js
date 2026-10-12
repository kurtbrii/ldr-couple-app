/*
  navigation.js

  Client-side, memory-only navigation that behaves like a native app:
    - two "flows": 'entry' (welcome / sign up / pairing) and 'main' (tabs)
    - three root tabs (today · story · us), each with its own stack
    - push slides in from the right, pop slides back, sheets slide up, fades
    - every screen in a stack stays mounted, so Back restores scroll & state

  Exposes on LDR:
    SCREENS            — registry { name: Component }; screen files add to it.
    NavContext/useNav  — the nav API for screens (push, pop, switchTab, …).
    useNavigator()     — creates nav state + API (called once, in App).
    NavigatorView      — renders the active flow, tab stacks and transitions.

  Used by: app.js (owner), every screen (via useNav()).
*/
(function () {
  const LDR = window.LDR;
  const html = LDR.html;
  const { useState, useEffect, useMemo, useRef, createContext, useContext } = React;

  LDR.SCREENS = LDR.SCREENS || {};
  LDR.NavContext = createContext(null);
  LDR.useNav = () => useContext(LDR.NavContext);

  const ANIM_MS = 470; // a touch longer than the longest CSS transition
  let entryCounter = 0;
  const makeEntry = (name, params = {}, transition = 'push') => ({ id: `e${++entryCounter}`, name, params, transition });

  /*
    useNavigator — owns all navigation state.

    Returns: [navState, nav]
      navState: { flow, tab, stacks: { entry, today, story, us }, anim, tabAnim }
      nav:      action functions (stable across renders).

    `anim` describes the stack transition currently playing:
      { stack, kind: 'push'|'pop'|'replace', transition, ghost }  (ghost = the
      entry that is leaving after a pop/replace, kept on screen until it finishes)
  */
  function useNavigator() {
    const [navState, setNavState] = useState(() => ({
      flow: 'entry',
      tab: 'today',
      stacks: {
        entry: [makeEntry('welcome', {}, 'fade')],
        today: [makeEntry('today')],
        story: [makeEntry('ourStory')],
        us: [makeEntry('us')],
      },
      anim: null,
      flowAnim: 0,
      tabAnim: 0,
    }));

    // Clear the transition flag once the CSS animation is done.
    const timer = useRef(null);
    useEffect(() => {
      if (!navState.anim) return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setNavState((s) => ({ ...s, anim: null })), ANIM_MS);
      return () => clearTimeout(timer.current);
    }, [navState.anim]);

    const nav = useMemo(() => {
      // The stack key currently on screen ('entry' or the active tab).
      const activeKey = (s) => (s.flow === 'entry' ? 'entry' : s.tab);

      const push = (name, params = {}, transition = 'push') =>
        setNavState((s) => {
          const key = activeKey(s);
          return {
            ...s,
            stacks: { ...s.stacks, [key]: [...s.stacks[key], makeEntry(name, params, transition)] },
            anim: { stack: key, kind: 'push', transition },
          };
        });

      const pop = () =>
        setNavState((s) => {
          const key = activeKey(s);
          const stack = s.stacks[key];
          if (stack.length < 2) return s;
          const ghost = stack[stack.length - 1];
          return {
            ...s,
            stacks: { ...s.stacks, [key]: stack.slice(0, -1) },
            anim: { stack: key, kind: 'pop', transition: ghost.transition, ghost },
          };
        });

      // Pops back to the root of the current stack (with a single pop animation).
      const popToRoot = () =>
        setNavState((s) => {
          const key = activeKey(s);
          const stack = s.stacks[key];
          if (stack.length < 2) return s;
          const ghost = stack[stack.length - 1];
          return {
            ...s,
            stacks: { ...s.stacks, [key]: stack.slice(0, 1) },
            anim: { stack: key, kind: 'pop', transition: ghost.transition, ghost },
          };
        });

      // Swaps the top screen for another (used to move forward in a flow
      // without growing the stack, e.g. Preview → Waiting).
      const replace = (name, params = {}, transition = 'fade') =>
        setNavState((s) => {
          const key = activeKey(s);
          const stack = s.stacks[key];
          const ghost = stack[stack.length - 1];
          const next = makeEntry(name, params, transition);
          return {
            ...s,
            stacks: { ...s.stacks, [key]: [...stack.slice(0, -1), next] },
            anim: { stack: key, kind: 'replace', transition, ghost },
          };
        });

      // Replaces everything above the root with `names` (e.g. Today → Reveal).
      const resetTo = (entries, transition = 'push') =>
        setNavState((s) => {
          const key = activeKey(s);
          const stack = s.stacks[key];
          const ghost = stack.length > 1 ? stack[stack.length - 1] : null;
          const next = entries.map(([n, p]) => makeEntry(n, p, transition));
          return {
            ...s,
            stacks: { ...s.stacks, [key]: [stack[0], ...next] },
            anim: next.length ? { stack: key, kind: ghost ? 'replace' : 'push', transition: ghost ? 'fade' : transition, ghost } : null,
          };
        });

      // Tapping the active tab again pops it back to its root (iOS behaviour).
      const switchTab = (tab) =>
        setNavState((s) => {
          if (s.tab === tab) {
            const stack = s.stacks[tab];
            if (stack.length < 2) return s;
            const ghost = stack[stack.length - 1];
            return { ...s, stacks: { ...s.stacks, [tab]: stack.slice(0, 1) }, anim: { stack: tab, kind: 'pop', transition: ghost.transition, ghost } };
          }
          return { ...s, tab, anim: null, tabAnim: s.tabAnim + 1 };
        });

      /*
        goTo — jump to a tab and set its stack in one move, e.g. after
        "Add to Our Story": switch to OUR STORY and open the new page.
        The tab we're leaving is popped back to its root, so finished flows
        (like the Hunt) don't linger behind.
      */
      const goTo = (tab, entries = []) =>
        setNavState((s) => ({
          ...s,
          tab,
          stacks: {
            ...s.stacks,
            [s.tab]: s.stacks[s.tab].slice(0, 1),
            [tab]: [s.stacks[tab][0], ...entries.map(([n, p]) => makeEntry(n, p, 'push'))],
          },
          anim: null,
          tabAnim: s.tabAnim + 1,
        }));

      // Moves between the entry flow and the main app, resetting stacks.
      const setFlow = (flow, entryScreen = 'welcome') =>
        setNavState((s) => ({
          ...s,
          flow,
          tab: 'today',
          stacks: {
            entry: [makeEntry(entryScreen, {}, 'fade')],
            today: [makeEntry('today')],
            story: [makeEntry('ourStory')],
            us: [makeEntry('us')],
          },
          anim: null,
          flowAnim: s.flowAnim + 1,
        }));

      return { push, pop, popToRoot, replace, resetTo, switchTab, goTo, setFlow };
    }, []);

    return [navState, nav];
  }

  /*
    Classes for one entry in a stack, given the current transition.
    Every entry stays mounted; only the top (and anything animating) is visible.
  */
  function classesFor(entry, index, stack, anim, isAnimStack) {
    const top = index === stack.length - 1;
    const under = index === stack.length - 2;
    if (!isAnimStack || !anim) return top ? 'anim-still' : 'screen-hidden';

    const t = anim.transition;
    if (anim.kind === 'push') {
      if (top) return t === 'sheet' ? 'anim-sheet-in' : t === 'fade' ? 'anim-fade-in' : 'anim-push-in';
      if (under) return t === 'push' ? 'anim-push-out' : 'anim-still';
      return 'screen-hidden';
    }
    if (anim.kind === 'pop') {
      if (top) return t === 'push' ? 'anim-pop-in' : 'anim-still';
      return 'screen-hidden';
    }
    // replace: new top fades in over the leaving ghost.
    if (top) return 'anim-fade-in';
    return 'screen-hidden';
  }

  function ghostClass(anim) {
    if (anim.kind === 'replace') return 'anim-fade-out';
    return anim.transition === 'sheet' ? 'anim-sheet-out' : anim.transition === 'fade' ? 'anim-fade-out' : 'anim-pop-out';
  }

  /*
    StackView — renders one stack (all entries mounted) plus the ghost of a
    screen that's leaving. Each screen gets `params` and `isTop`.
  */
  function StackView({ stackKey, stack, anim, active }) {
    const isAnimStack = anim && anim.stack === stackKey;
    const ghost = isAnimStack && anim.ghost ? anim.ghost : null;
    const render = (entry, cls, isTop) => {
      const Comp = LDR.SCREENS[entry.name];
      return html`<div key=${entry.id} className=${'screen ' + cls} data-screen=${entry.name} aria-hidden=${!isTop || undefined}>
        ${Comp
          ? html`<${Comp} params=${entry.params} isTop=${isTop && active} />`
          : html`<div className="p-10 text-muted">Missing screen: ${entry.name}</div>`}
      </div>`;
    };
    return html`${stack.map((e, i) => render(e, classesFor(e, i, stack, anim, isAnimStack), i === stack.length - 1))}${ghost
      ? render(ghost, ghostClass(anim), false)
      : null}`;
  }

  /*
    TabLayer — wraps one tab's stack and plays a soft cross-fade when that tab
    becomes active. Uses the Web Animations API instead of a key change so the
    tab's screens are never remounted (their state and scroll survive).
  */
  function TabLayer({ active, tick, children }) {
    const ref = useRef(null);
    useEffect(() => {
      if (active && tick && ref.current && ref.current.animate) {
        ref.current.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' });
      }
    }, [tick, active]);
    return html`<div ref=${ref} className="absolute inset-0">${children}</div>`;
  }

  /*
    NavigatorView — draws the active flow. In 'main' it keeps all three tab
    stacks mounted (hidden when inactive) and lays the TabBar on top, which
    hides itself whenever the active stack is deeper than its root.
  */
  function NavigatorView({ navState, nav, tabBadge }) {
    const { flow, tab, stacks, anim } = navState;

    if (flow === 'entry') {
      return html`<div key=${'flow' + navState.flowAnim} className="absolute inset-0 fade-in">
        <${StackView} stackKey="entry" stack=${stacks.entry} anim=${anim} active=${true} />
      </div>`;
    }

    const atRoot = stacks[tab].length === 1 && !(anim && anim.stack === tab && anim.kind !== 'pop' && stacks[tab].length > 1);
    return html`<div key=${'flow' + navState.flowAnim} className="absolute inset-0 fade-in">
      ${['today', 'story', 'us'].map(
        (k) => html`<div
          key=${k}
          className=${'absolute inset-0 ' + (k === tab ? '' : 'screen-hidden')}
          aria-hidden=${k !== tab || undefined}
        >
          <${TabLayer} active=${k === tab} tick=${navState.tabAnim}>
            <${StackView} stackKey=${k} stack=${stacks[k]} anim=${anim} active=${k === tab} />
          <//>
        </div>`
      )}
      <${LDR.TabBar} active=${tab} onSelect=${nav.switchTab} hidden=${!atRoot} badge=${tabBadge} />
    </div>`;
  }

  Object.assign(LDR, { useNavigator, NavigatorView });
})();
