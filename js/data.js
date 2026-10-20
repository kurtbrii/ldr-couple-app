/*
  data.js

  All hardcoded mock data for the prototype (HANDOFF §10). Nothing here is
  persisted — `createInitialState()` builds a fresh copy, so a page refresh
  always resets the demo.

  Exposes:
    LDR.SHOP                 — the Coin Shop catalogue (static).
    LDR.REACTIONS            — the five reaction emoji.
    LDR.createInitialState() — the app's starting in-memory state.
    LDR.photo(id)            — resolves a photo id to { src, alt }.

  Used by: app.js (initial state) and screens that read the catalogue.
*/
(function () {
  const LDR = window.LDR;

  LDR.REACTIONS = ['❤️', '😍', '😂', '🥹', '👀'];

  LDR.photo = (id) => LDR.PHOTOS[id] || LDR.PHOTOS.coffee;

  /*
    Coin Shop catalogue. `kind` matches the owned-items bucket in state.owned.
    price 0 = part of the free starter set. `premium` items are a subscription perk
    (unlocked during the trial) that can also be bought with Coins.
    Themes are bundles: buying one unlocks everything listed in `grants`.
  */
  LDR.SHOP = {
    templates: [
      { id: 'classic', kind: 'templates', name: 'Classic', price: 0, note: 'Cream · terracotta · sage' },
      { id: 'loveLetter', kind: 'templates', name: 'Love Letter', price: 150, note: 'Dusty rose · cream' },
      { id: 'sundayMorning', kind: 'templates', name: 'Sunday Morning', price: 200, note: 'Butter · cream · sage' },
      { id: 'midnight', kind: 'templates', name: 'Midnight', price: 250, note: 'Navy · cream · dusty blue' },
      { id: 'summer', kind: 'templates', name: 'Summer', price: 200, note: 'Peach · butter · sky' },
      { id: 'autumn', kind: 'templates', name: 'Autumn', price: 300, note: 'Terracotta · olive', premium: true },
    ],
    stickers: [
      { id: 'heart', kind: 'stickers', name: 'Heart', price: 0 },
      { id: 'star', kind: 'stickers', name: 'Star', price: 0 },
      { id: 'daisy', kind: 'stickers', name: 'Pressed daisy', price: 0 },
      { id: 'sprig', kind: 'stickers', name: 'Olive sprig', price: 0 },
      { id: 'coffee', kind: 'stickers', name: 'Coffee', price: 30 },
      { id: 'xo', kind: 'stickers', name: 'xo', price: 30 },
      { id: 'sun', kind: 'stickers', name: 'Sun', price: 40 },
      { id: 'moon', kind: 'stickers', name: 'Moon', price: 40 },
      { id: 'envelope', kind: 'stickers', name: 'Love note', price: 50 },
      { id: 'stamp', kind: 'stickers', name: 'Postage', price: 50 },
      { id: 'ticket', kind: 'stickers', name: 'Ticket stub', price: 60 },
      { id: 'cat', kind: 'stickers', name: 'Sleepy cat', price: 60, premium: true },
    ],
    frames: [
      { id: 'polaroid', kind: 'frames', name: 'Polaroid', price: 0, note: 'The classic white border' },
      { id: 'film', kind: 'frames', name: 'Vintage Film', price: 100, note: 'Dark border, sprocket holes' },
      { id: 'deckled', kind: 'frames', name: 'Deckled Edge', price: 75, note: 'Scalloped like old prints', premium: true },
    ],
    themes: [
      { id: 'vintagePaper', kind: 'themes', name: 'Vintage Paper', price: 150, note: 'Film frame + postage & ticket', grants: { frames: ['film'], stickers: ['stamp', 'ticket'] } },
      { id: 'dateNight', kind: 'themes', name: 'Date Night', price: 200, note: 'Midnight + moon, xo & love note', grants: { templates: ['midnight'], stickers: ['moon', 'xo', 'envelope'] } },
      { id: 'cozyAutumn', kind: 'themes', name: 'Cozy Autumn', price: 300, note: 'Autumn + coffee & sleepy cat', grants: { templates: ['autumn'], stickers: ['coffee', 'cat'] }, premium: true },
    ],
  };

  let uidCounter = 100;
  LDR.uid = (prefix = 'id') => `${prefix}-${++uidCounter}`;

  /*
    Builds the full starting state. Kept as a function (not a constant) so every
    "reset" gets brand-new objects and nothing leaks between sessions.

    Returns: the object App() stores in React state. Shape notes inline.
  */
  LDR.createInitialState = () => ({
    user: { name: 'Olivia', email: 'olivia@example.com' },
    partner: { name: 'Julian' },
    coupleSince: 'March 2024',

    coins: 620,          // shared couple wallet
    streak: 12,          // decorative only — never used for pressure
    bestStreak: 40,      // kept as a keepsake ("your best: 40 days")
    stats: { days: 47, moments: 83, photos: 214 }, // Our Story header counters

    trial: { day: 9, length: 14 },            // 14-day full-access trial
    trialRecap: { days: 14, moments: 26, photos: 52, completed: 13, coinsEarned: 620 },

    huntMode: 1,          // 1 Easy · 3 Regular · 5 Challenge
    vacation: false,      // Vacation Mode pauses new Hunts
    archived: false,      // true after "End relationship → Archive Our Story"
    notifications: { newHunt: true, partnerSubmitted: true, revealReady: true, streak: false },

    /*
      Today's Hunt for this couple.
      status: 'open' → 'submitted' (my card locked, waiting) → 'ready' (both in)
              → 'revealed' → 'added' (saved to Our Story).
      theirPhoto is pre-chosen: it's what the partner "will" submit when simulated.
    */
    today: {
      date: 'September 19',
      category: 'Everyday',
      myPrompt: 'Find something from your morning.',
      theirPrompt: 'Find something from your evening.',
      myTint: 'morningButter',
      theirTint: 'eveningLavender',
      status: 'open',
      myPhoto: null,
      theirPhoto: 'sunset',
      partnerSubmitted: false,
      myReaction: null,          // my reaction on the partner's photo
      theirReaction: '🥹',       // the partner's (simulated) reaction on my photo
      comment: '',               // my optional short comment
      memoryId: null,            // set once added to Our Story
    },

    /*
      Saved scrapbook pages, newest first. Each page holds both finds,
      the prompts, reactions/comments and the decoration layout.
      stickers: positions are % of page width/height; r = degrees; s = scale.
    */
    memories: [
      {
        id: 'm-0918',
        date: 'September 18',
        weekday: 'Thursday',
        template: 'classic',
        frame: 'polaroid',
        mine: { prompt: 'Find something that made you smile today.', photo: 'flowers' },
        theirs: { prompt: 'Find something you wish I could have seen.', photo: 'beach' },
        reactions: { onMine: '❤️', onTheirs: '😍' },
        comments: [{ by: 'Julian', text: 'these are going on our table one day' }],
        caption: 'quiet little thursday',
        stickers: [
          { uid: 's1', id: 'daisy', x: 76, y: 12, r: 14, s: 1 },
          { uid: 's2', id: 'heart', x: 14, y: 66, r: -12, s: 0.8 },
        ],
      },
      {
        id: 'm-0917',
        date: 'September 17',
        weekday: 'Wednesday',
        template: 'loveLetter',
        frame: 'polaroid',
        mine: { prompt: 'Find something you ate today.', photo: 'pasta' },
        theirs: { prompt: 'Find something you wish you could have shared with me.', photo: 'bread' },
        reactions: { onMine: '🥹', onTheirs: '😂' },
        comments: [{ by: 'Olivia', text: "I knew you'd take a picture of that 😂" }],
        caption: 'dinner, 6,000 miles apart',
        stickers: [
          { uid: 's3', id: 'envelope', x: 70, y: 66, r: 8, s: 0.95 },
          { uid: 's4', id: 'xo', x: 12, y: 70, r: -10, s: 0.8 },
        ],
      },
      {
        id: 'm-0915',
        date: 'September 15',
        weekday: 'Monday',
        template: 'sundayMorning',
        frame: 'polaroid',
        mine: { prompt: 'Find something from your morning.', photo: 'window' },
        theirs: { prompt: 'Find something from your evening.', photo: 'cityNight' },
        reactions: { onMine: '❤️', onTheirs: '❤️' },
        comments: [],
        caption: 'your morning, my night',
        stickers: [
          { uid: 's5', id: 'sun', x: 70, y: 9, r: 0, s: 0.85 },
          { uid: 's6', id: 'moon', x: 12, y: 72, r: -8, s: 0.8 },
        ],
      },
      {
        id: 'm-0913',
        date: 'September 13',
        weekday: 'Saturday',
        template: 'classic',
        frame: 'polaroid',
        mine: { prompt: 'Find something beautiful.', photo: 'plant' },
        theirs: { prompt: 'Find something ordinary that you enjoyed.', photo: 'book' },
        reactions: { onMine: '😍', onTheirs: '🥹' },
        comments: [{ by: 'Julian', text: 'you and that plant 🌿' }],
        caption: '',
        stickers: [{ uid: 's7', id: 'sprig', x: 74, y: 70, r: 10, s: 1 }],
      },
      {
        id: 'm-0911',
        date: 'September 11',
        weekday: 'Thursday',
        template: 'loveLetter',
        frame: 'polaroid',
        mine: { prompt: 'Find something that reminded you of me.', photo: 'candle' },
        theirs: { prompt: 'Find something you think I’d like.', photo: 'tram' },
        reactions: { onMine: '❤️', onTheirs: '👀' },
        comments: [],
        caption: 'the long way home',
        stickers: [{ uid: 's8', id: 'star', x: 78, y: 10, r: 12, s: 0.75 }],
      },
    ],

    /*
      Missed Hunts. `whoMissed` drives the per-partner framing:
        'them' → "Waiting for [partner] to complete this Hunt." (my photo is in)
        'me'   → "You missed!" + Complete now (the partner's photo is in, hidden)
    */
    missed: [
      {
        id: 'x-0916',
        date: 'September 16',
        whoMissed: 'them',
        myPrompt: 'Find something that made you smile today.',
        theirPrompt: 'Find something you wish I could have seen.',
        myPhoto: 'bread',
        theirPhoto: null,
        myTint: 'morningSage',
        theirTint: 'eveningBlue',
        status: 'waiting',
      },
      {
        id: 'x-0912',
        date: 'September 12',
        whoMissed: 'me',
        myPrompt: 'Find something ordinary that you enjoyed.',
        theirPrompt: 'Find something beautiful.',
        myPhoto: null,
        theirPhoto: 'sunset',
        myTint: 'morningCream',
        theirTint: 'eveningRose',
        status: 'open', // 'open' → 'ready' → 'revealed'
      },
    ],

    // What the couple already owns. Starter set + two earlier purchases.
    owned: {
      templates: ['classic', 'loveLetter', 'sundayMorning'],
      stickers: ['heart', 'star', 'daisy', 'sprig', 'envelope', 'xo', 'sun', 'moon'],
      frames: ['polaroid'],
      themes: [],
    },

    // Concept: who is currently editing a given page (single-editor lock).
    editingLock: null,
  });
})();
