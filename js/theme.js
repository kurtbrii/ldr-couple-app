/*
  theme.js

  Shared design tokens for every screen:
    - COLORS:      the locked palette (HANDOFF §2). Use these, never ad-hoc hexes.
    - CARD_TINTS:  muted stationery paper tints for Hunt Cards (morning vs evening).
    - TEMPLATES:   scrapbook page templates (Classic, Love Letter, Sunday Morning, …).
                   A template decides paper colour, photo-slot layout, tape and accents.
    - STICKERS:    hand-drawn SVG sticker art, exposed as data URIs for <img>.

  Also creates the global `window.LDR` namespace and the `html` template tag
  (htm bound to React.createElement) that every other file uses instead of JSX.

  Used by: every other script.
*/
(function () {
  const LDR = (window.LDR = window.LDR || {});

  // htm gives us JSX-like templates with no build step: html`<div>${x}</div>`.
  LDR.html = htm.bind(React.createElement);

  LDR.COLORS = {
    cream: '#F7F1E6',
    ivory: '#FFF9F0',
    rose: '#C9827D',
    terracotta: '#B9684F',
    sage: '#8D9B83',
    butter: '#E7C96B',
    ink: '#3D3530',
    muted: '#887970',
  };

  /*
    Hunt Card paper tints. Each has a face colour, a deeper "ink" for the motif,
    and a back colour for the cardstock reverse. All deliberately desaturated —
    real stationery, never candy pastel.
  */
  LDR.CARD_TINTS = {
    morningButter: { face: '#F3E6C4', edge: '#E4D1A0', ink: '#9A7A35', back: '#EFE3C6', label: 'Morning' },
    morningSage: { face: '#E2E6D6', edge: '#C9D0BA', ink: '#6E7C66', back: '#DEE3D2', label: 'Morning' },
    morningCream: { face: '#F6EDDC', edge: '#E6D8BF', ink: '#9B7F62', back: '#F1E6D2', label: 'Morning' },
    eveningRose: { face: '#EDD8D2', edge: '#DDBDB4', ink: '#9E625C', back: '#E9D3CC', label: 'Evening' },
    eveningLavender: { face: '#E2DCE3', edge: '#CCC2CF', ink: '#7A6A80', back: '#DED7E0', label: 'Evening' },
    eveningBlue: { face: '#D9E0E2', edge: '#BFCACD', ink: '#5F7479', back: '#D5DDDF', label: 'Evening' },
  };

  /*
    Scrapbook templates. `slots` are the two photo positions in % of page width/height:
      x, y = top-left, w = width (% of page width), r = rotation in degrees.
    `tapes` place washi strips (same units). `accent` drives date stamps & doodles.
  */
  LDR.TEMPLATES = {
    classic: {
      id: 'classic',
      name: 'Classic',
      paper: '#F4ECDD',
      line: 'rgba(141,155,131,0.0)',
      accent: '#B9684F',
      secondary: '#8D9B83',
      tapes: ['#C9B48E', '#A9B59E'],
      slots: [
        { x: 7, y: 15, w: 42, r: -3 },
        { x: 50, y: 27, w: 42, r: 2.6 },
      ],
      tapeRot: [-7, 6],
      tapeStyle: 'top', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'stamp',
      motif: 'sprig',
    },
    loveLetter: {
      id: 'loveLetter',
      name: 'Love Letter',
      paper: '#F1E1DB',
      line: 'rgba(201,130,125,0.18)',
      accent: '#A8524B',
      secondary: '#C9827D',
      tapes: ['#D9A9A2', '#E8CFC4'],
      slots: [
        { x: 6, y: 21, w: 42, r: -2 },
        { x: 51, y: 22, w: 42, r: 2.2 },
      ],
      tapeRot: [-4, 5],
      tapeStyle: 'top', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'script',
      motif: 'hearts',
    },
    sundayMorning: {
      id: 'sundayMorning',
      name: 'Sunday Morning',
      paper: '#F5EBCF',
      line: 'rgba(141,155,131,0.22)',
      accent: '#8A7432',
      secondary: '#8D9B83',
      tapes: ['#E7C96B', '#B8C2A8'],
      slots: [
        { x: 9, y: 16, w: 42, r: 2 },
        { x: 48, y: 29, w: 42, r: -3 },
      ],
      tapeRot: [-38, -36],
      tapeStyle: 'corner', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'label',
      motif: 'sun',
    },
    midnight: {
      id: 'midnight',
      name: 'Midnight',
      paper: '#2F3644',
      dark: true,
      line: 'rgba(160,178,196,0.0)',
      accent: '#C9D3DC',
      secondary: '#8FA3B5',
      tapes: ['#8FA3B5', '#C2B49A'],
      slots: [
        { x: 8, y: 18, w: 42, r: -2.5 },
        { x: 50, y: 26, w: 42, r: 3 },
      ],
      tapeRot: [-6, 7],
      tapeStyle: 'top', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'stamp',
      motif: 'stars',
    },
    summer: {
      id: 'summer',
      name: 'Summer',
      paper: '#F6E3CF',
      line: 'rgba(160,190,205,0.0)',
      accent: '#B97A4F',
      secondary: '#9DB6C2',
      tapes: ['#E7C96B', '#A9C1CB'],
      slots: [
        { x: 7, y: 15, w: 43, r: -4 },
        { x: 49, y: 28, w: 43, r: 3 },
      ],
      tapeRot: [-10, 4],
      tapeStyle: 'top', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'label',
      motif: 'sun',
    },
    autumn: {
      id: 'autumn',
      name: 'Autumn',
      paper: '#EFDFC8',
      line: 'rgba(0,0,0,0)',
      accent: '#9B5A3F',
      secondary: '#7F7D52',
      tapes: ['#B9684F', '#9C9A6B'],
      slots: [
        { x: 6, y: 17, w: 42, r: 2.5 },
        { x: 51, y: 25, w: 42, r: -2.5 },
      ],
      tapeRot: [4, -5],
      tapeStyle: 'top', // 'top' = centred on the top edge, 'corner' = diagonal corners
      dateStyle: 'stamp',
      motif: 'leaves',
    },
  };

  // Turns raw SVG markup into something an <img src> can use.
  LDR.svgUri = (svg) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

  /*
    Sticker art. Hand-drawn feel: slightly wobbly paths, flat muted fills,
    an ivory "die-cut" outline so they read as physical stickers on paper.
  */
  const cut = (inner, vb = '0 0 100 100') =>
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${vb}'>
      <defs><filter id='d' x='-20%' y='-20%' width='140%' height='140%'>
        <feMorphology operator='dilate' radius='4' in='SourceAlpha' result='o'/>
        <feFlood flood-color='#FFFDF8'/><feComposite in2='o' operator='in' result='w'/>
        <feGaussianBlur in='SourceAlpha' stdDeviation='2.5' result='b'/>
        <feOffset in='b' dy='2' result='sb'/>
        <feFlood flood-color='#5C402C' flood-opacity='0.28'/><feComposite in2='sb' operator='in' result='s'/>
        <feMerge><feMergeNode in='s'/><feMergeNode in='w'/><feMergeNode in='SourceGraphic'/></feMerge>
      </filter></defs>
      <g filter='url(#d)'>${inner}</g></svg>`;

  LDR.STICKERS = {
    heart: {
      name: 'Heart',
      svg: cut(`<path d='M50 84 C22 64 12 48 15 33 C18 19 34 14 44 24 C47 27 49 30 50 33 C52 28 56 22 63 19 C76 15 88 25 85 40 C82 55 68 69 50 84 Z' fill='#C9827D'/>
        <path d='M30 32 C32 27 36 25 40 26' stroke='#F1D6D2' stroke-width='4' fill='none' stroke-linecap='round'/>`),
    },
    daisy: {
      name: 'Pressed daisy',
      svg: cut(`<g transform='translate(50 46)'>${[0, 45, 90, 135, 180, 225, 270, 315]
        .map((a) => `<ellipse rx='9' ry='20' cy='-19' fill='#FBF5EA' stroke='#D9CBB3' stroke-width='1.2' transform='rotate(${a})'/>`)
        .join('')}<circle r='10' fill='#E7C96B'/><circle r='10' fill='none' stroke='#C9A94E' stroke-width='1.5' stroke-dasharray='2 2'/></g>
        <path d='M50 66 C50 78 48 86 46 96' stroke='#8D9B83' stroke-width='3' fill='none' stroke-linecap='round'/>`),
    },
    star: {
      name: 'Star',
      svg: cut(`<path d='M50 12 L59 38 L87 39 L65 56 L73 84 L50 68 L27 84 L35 56 L13 39 L41 38 Z' fill='#E7C96B' stroke='#C9A94E' stroke-width='2' stroke-linejoin='round'/>`),
    },
    sprig: {
      name: 'Olive sprig',
      svg: cut(`<path d='M20 88 C40 64 58 40 82 14' stroke='#6F7A5F' stroke-width='3' fill='none' stroke-linecap='round'/>
        ${[[30, 74, -30], [42, 60, 30], [50, 50, -35], [60, 38, 28], [68, 30, -40], [76, 20, 25]]
          .map(([x, y, r]) => `<ellipse cx='${x}' cy='${y}' rx='5' ry='12' fill='#8D9B83' transform='rotate(${r} ${x} ${y})'/>`)
          .join('')}`),
    },
    coffee: {
      name: 'Coffee',
      svg: cut(`<path d='M24 40 H70 L66 80 C65 86 60 88 55 88 H39 C34 88 29 86 28 80 Z' fill='#E9DCC6' stroke='#887970' stroke-width='2.5'/>
        <path d='M70 48 C82 48 82 66 68 66' fill='none' stroke='#887970' stroke-width='3'/>
        <path d='M28 46 H66' stroke='#B9684F' stroke-width='5'/>
        <path d='M40 30 C36 24 44 20 40 12 M52 30 C48 24 56 20 52 12' stroke='#B6A89A' stroke-width='2.5' fill='none' stroke-linecap='round'/>`),
    },
    moon: {
      name: 'Moon',
      svg: cut(`<path d='M62 14 C42 18 30 36 32 54 C34 74 52 88 72 84 C60 80 50 68 50 52 C50 36 56 22 62 14 Z' fill='#E7D7A8' stroke='#B9A26A' stroke-width='2'/>
        <circle cx='74' cy='30' r='2.5' fill='#E7C96B'/><circle cx='82' cy='48' r='1.8' fill='#E7C96B'/>`),
    },
    envelope: {
      name: 'Love note',
      svg: cut(`<rect x='14' y='28' width='72' height='48' rx='3' fill='#F3E6D3' stroke='#B6A08A' stroke-width='2'/>
        <path d='M14 30 L50 56 L86 30' fill='none' stroke='#B6A08A' stroke-width='2'/>
        <circle cx='50' cy='56' r='8' fill='#B9684F'/><path d='M46 55 C46 52 50 52 50 55 C50 52 54 52 54 55 C54 58 50 60 50 61 C50 60 46 58 46 55 Z' fill='#F1D6D2'/>`),
    },
    stamp: {
      name: 'Postage',
      svg: cut(`<rect x='18' y='14' width='64' height='74' fill='#FBF5EA' stroke='#C9B79F' stroke-width='2' stroke-dasharray='4 3'/>
        <rect x='26' y='22' width='48' height='50' fill='#D8C6A0'/>
        <path d='M26 62 C36 50 46 56 54 46 C62 38 68 44 74 40 V72 H26 Z' fill='#8D9B83'/>
        <circle cx='62' cy='34' r='6' fill='#E7C96B'/>
        <text x='50' y='84' font-family='Georgia' font-size='8' text-anchor='middle' fill='#887970'>US · 01</text>`),
    },
    xo: {
      name: 'xo',
      svg: cut(`<text x='50' y='66' font-family='Georgia, serif' font-style='italic' font-size='44' text-anchor='middle' fill='#C9827D'>xo</text>`),
    },
    cat: {
      name: 'Sleepy cat',
      svg: cut(`<path d='M18 74 C18 54 32 44 50 44 C68 44 82 54 82 74 C82 80 76 82 50 82 C24 82 18 80 18 74 Z' fill='#D8B48E'/>
        <path d='M26 52 L24 34 L38 46 Z M74 52 L76 34 L62 46 Z' fill='#D8B48E'/>
        <path d='M36 60 Q40 63 44 60 M56 60 Q60 63 64 60' stroke='#5C4A3F' stroke-width='2' fill='none' stroke-linecap='round'/>
        <path d='M48 66 L50 68 L52 66' stroke='#B9684F' stroke-width='2' fill='none'/>`),
    },
    sun: {
      name: 'Sun',
      svg: cut(`<g transform='translate(50 50)'>${Array.from({ length: 12 }, (_, i) => `<path d='M0 -40 L4 -28 L-4 -28 Z' fill='#E7C96B' transform='rotate(${i * 30})'/>`).join('')}
        <circle r='22' fill='#EFD48A'/><path d='M-8 -2 Q-6 2 -4 -2 M4 -2 Q6 2 8 -2' stroke='#9A7A35' stroke-width='2' fill='none'/><path d='M-6 8 Q0 12 6 8' stroke='#9A7A35' stroke-width='2' fill='none'/></g>`),
    },
    ticket: {
      name: 'Ticket stub',
      svg: cut(`<path d='M10 32 H90 V44 C84 44 84 56 90 56 V68 H10 V56 C16 56 16 44 10 44 Z' fill='#E5CFC0' stroke='#B9684F' stroke-width='1.5'/>
        <path d='M34 32 V68' stroke='#B9684F' stroke-width='1.5' stroke-dasharray='3 3'/>
        <text x='62' y='54' font-family='Georgia' font-size='10' text-anchor='middle' fill='#8A4A38' letter-spacing='1'>ADMIT 2</text>`),
    },
  };
})();
