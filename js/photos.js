/*
  photos.js

  Warm, soft-focus "photographs" drawn as SVG and exposed as data URIs.
  These stand in for the couple's real photos so the prototype works offline with
  no external image hosts (HANDOFF §10 allows placeholders; the polaroid framing is
  what matters). Each scene gets the same film treatment: soft blur, warm grade,
  vignette and grain, so they read as prints rather than clip-art.

  Exposes: LDR.PHOTOS — { [id]: { src, alt } }

  Used by: data.js (memories & today's Hunt), hunt.js (camera/library picker).
*/
(function () {
  const LDR = window.LDR;

  /*
    Wraps a scene body in the shared "film" treatment.
    Args:
      body:  SVG markup for the scene, drawn in a 400×500 (4:5) viewBox.
      grade: colour laid over everything in soft-light to warm the image.
  */
  function film(body, grade = '#E9B98A') {
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='xMidYMid slice'>
      <defs>
        <filter id='b1' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='1.6'/></filter>
        <filter id='b4' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='5'/></filter>
        <filter id='b12' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='14'/></filter>
        <filter id='b30' x='-80%' y='-80%' width='260%' height='260%'><feGaussianBlur stdDeviation='30'/></filter>
        <filter id='gr'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0.3 0 0 0 0 0.24 0 0 0 0 0.2 0 0 0 0.55 0'/></filter>
        <radialGradient id='vig' cx='50%' cy='48%' r='72%'>
          <stop offset='55%' stop-color='#2B1D14' stop-opacity='0'/>
          <stop offset='100%' stop-color='#2B1D14' stop-opacity='0.42'/>
        </radialGradient>
      </defs>
      <g>${body}</g>
      <rect width='400' height='500' fill='${grade}' opacity='0.16' style='mix-blend-mode:soft-light'/>
      <rect width='400' height='500' fill='url(#vig)'/>
      <rect width='400' height='500' filter='url(#gr)' opacity='0.35'/>
    </svg>`;
  }

  // Scenes ------------------------------------------------------------------

  const coffee = film(`
    <rect width='400' height='500' fill='#C9A27E'/>
    <rect width='400' height='500' fill='#8C6447' opacity='0.35'/>
    <path d='M0 0 L170 0 L400 260 L400 420 Z' fill='#F3D9B5' opacity='0.55' filter='url(#b30)'/>
    <ellipse cx='214' cy='296' rx='150' ry='142' fill='#4A3226' opacity='0.45' filter='url(#b12)'/>
    <circle cx='200' cy='270' r='138' fill='#EFE6DA'/>
    <circle cx='200' cy='270' r='138' fill='none' stroke='#D8CBBB' stroke-width='3'/>
    <circle cx='200' cy='270' r='96' fill='#F7F0E6'/>
    <circle cx='200' cy='270' r='80' fill='#7A4A2C'/>
    <circle cx='200' cy='270' r='74' fill='#9A6440'/>
    <path d='M200 230 C176 226 166 252 182 270 C190 280 200 292 200 308 C200 292 210 280 218 270 C234 252 224 226 200 230 Z' fill='#F1DFC7' filter='url(#b1)'/>
    <path d='M200 250 C190 248 186 262 194 270 C197 274 200 280 200 288 C200 280 203 274 206 270 C214 262 210 248 200 250 Z' fill='#9A6440' filter='url(#b1)'/>
    <path d='M330 210 C372 210 376 280 330 284' stroke='#EFE6DA' stroke-width='20' fill='none' stroke-linecap='round'/>
    <path d='M-20 440 C40 400 110 420 150 460 L150 520 L-20 520 Z' fill='#E2B36F' filter='url(#b4)'/>
    <path d='M-10 446 C40 418 100 430 136 462' stroke='#B97D3B' stroke-width='6' fill='none' opacity='0.6' filter='url(#b1)'/>
    <path d='M250 0 L400 0 L400 120 Z' fill='#FFF0D6' opacity='0.35' filter='url(#b12)'/>
  `, '#F0B27A');

  const morningWindow = film(`
    <rect width='400' height='500' fill='#EBD9BF'/>
    <rect x='70' y='40' width='260' height='330' fill='#FFF3DE'/>
    <rect x='70' y='40' width='260' height='330' fill='#F8D9A8' opacity='0.5' filter='url(#b30)'/>
    <path d='M70 40 H330 V370 H70 Z M196 40 V370 M70 200 H330' stroke='#B79A78' stroke-width='9' fill='none'/>
    <path d='M60 30 C110 120 90 260 130 400 L60 400 Z' fill='#FBF3E6' opacity='0.85' filter='url(#b4)'/>
    <path d='M345 30 C300 150 330 260 300 400 L345 400 Z' fill='#FBF3E6' opacity='0.8' filter='url(#b4)'/>
    <path d='M80 360 L380 500 L200 500 L40 380 Z' fill='#FFE9C2' opacity='0.45' filter='url(#b12)'/>
    <rect y='380' width='400' height='120' fill='#C29E78'/>
    <rect y='376' width='400' height='10' fill='#A88462'/>
    <path d='M250 380 C246 350 254 330 262 316 C270 330 278 350 274 380 Z' fill='#B36A4A'/>
    <rect x='244' y='372' width='36' height='40' rx='4' fill='#B9684F'/>
    <path d='M262 318 C240 290 226 270 232 246 M262 318 C276 286 296 274 304 250 M262 318 C262 292 258 270 266 244' stroke='#6F7A5F' stroke-width='4' fill='none'/>
    <ellipse cx='232' cy='246' rx='14' ry='8' fill='#8D9B83' transform='rotate(-30 232 246)'/>
    <ellipse cx='304' cy='250' rx='14' ry='8' fill='#7F8D73' transform='rotate(30 304 250)'/>
    <ellipse cx='266' cy='244' rx='8' ry='14' fill='#8D9B83'/>
    <ellipse cx='246' cy='282' rx='12' ry='7' fill='#7F8D73' transform='rotate(-20 246 282)'/>
    <ellipse cx='286' cy='280' rx='12' ry='7' fill='#8D9B83' transform='rotate(25 286 280)'/>
    <path d='M120 420 L240 420 L232 440 L128 440 Z' fill='#EFE4D2' opacity='0.9'/>
  `, '#F5C27E');

  const sunset = film(`
    <defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#6E7A92'/><stop offset='0.35' stop-color='#C99A98'/>
      <stop offset='0.62' stop-color='#F0B98A'/><stop offset='0.72' stop-color='#F6D29E'/>
    </linearGradient>
    <linearGradient id='sea' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#C99A86'/><stop offset='1' stop-color='#5E5868'/></linearGradient></defs>
    <rect width='400' height='500' fill='url(#sky)'/>
    <circle cx='200' cy='318' r='38' fill='#FFE7B8' filter='url(#b4)'/>
    <circle cx='200' cy='318' r='90' fill='#FFD49A' opacity='0.5' filter='url(#b30)'/>
    <path d='M0 120 C80 110 140 130 230 116 C300 106 350 120 400 112 L400 150 C320 150 260 140 180 152 C100 162 50 148 0 156 Z' fill='#E2B4AA' opacity='0.5' filter='url(#b12)'/>
    <path d='M0 330 L0 300 L30 300 L30 284 L52 284 L52 306 L80 306 L80 270 L96 262 L112 270 L112 312 L140 312 L140 296 L160 296 L160 330 Z' fill='#5B4B52' opacity='0.85' filter='url(#b1)'/>
    <path d='M260 330 L260 298 L284 298 L284 276 L300 276 L300 290 L330 290 L330 250 L344 244 L358 250 L358 300 L400 300 L400 330 Z' fill='#5B4B52' opacity='0.85' filter='url(#b1)'/>
    <rect y='330' width='400' height='170' fill='url(#sea)'/>
    <path d='M170 340 H230 M160 360 H240 M176 382 H224 M184 404 H216 M190 428 H210' stroke='#FFE2B0' stroke-width='5' stroke-linecap='round' opacity='0.75' filter='url(#b1)'/>
    <path d='M0 470 C80 440 160 450 220 470 C280 490 340 470 400 460 L400 500 L0 500 Z' fill='#3E3540' opacity='0.8' filter='url(#b4)'/>
  `, '#F2A57E');

  const plant = film(`
    <rect width='400' height='500' fill='#E6DCCB'/>
    <path d='M0 0 L400 0 L400 500 L0 500 Z' fill='#F3E3C4' opacity='0.4' filter='url(#b30)'/>
    <g opacity='0.22' filter='url(#b12)' transform='translate(60 30)'>
      <path d='M200 300 C120 260 110 160 160 100 C200 140 230 220 200 300 Z' fill='#3D3530'/>
      <path d='M200 300 C260 240 330 240 360 280 C320 320 250 320 200 300 Z' fill='#3D3530'/>
    </g>
    <path d='M150 500 L162 360 L250 360 L262 500 Z' fill='#C98A6A'/>
    <path d='M146 360 H266 V382 H146 Z' fill='#B9684F'/>
    <path d='M206 360 C200 300 190 250 160 200 M206 360 C214 300 240 250 290 222 M206 360 C206 300 210 240 214 170 M206 360 C190 320 140 300 100 300' stroke='#5E6B52' stroke-width='5' fill='none'/>
    <path d='M160 200 C100 190 80 130 110 80 C150 100 180 150 160 200 Z' fill='#7F8D73'/>
    <path d='M160 200 C140 160 130 120 110 80' stroke='#A8B49A' stroke-width='2' fill='none'/>
    <path d='M290 222 C330 170 370 160 390 190 C370 230 330 240 290 222 Z' fill='#8D9B83'/>
    <path d='M214 170 C190 120 200 70 236 40 C258 80 250 130 214 170 Z' fill='#6F7C64'/>
    <path d='M100 300 C60 300 30 270 30 240 C70 236 96 262 100 300 Z' fill='#8D9B83'/>
    <path d='M214 170 C222 120 230 80 236 40' stroke='#A8B49A' stroke-width='2' fill='none'/>
    <path d='M250 500 L400 380 L400 500 Z' fill='#FFF1D8' opacity='0.4' filter='url(#b12)'/>
  `, '#E9C08A');

  const pasta = film(`
    <rect width='400' height='500' fill='#D9C7AE'/>
    <path d='M0 0 H400 V500 H0 Z' fill='none' stroke='#C4AE8F' stroke-width='0'/>
    ${Array.from({ length: 9 }, (_, i) => `<path d='M0 ${40 + i * 56} H400' stroke='#C9B497' stroke-width='14' opacity='0.45'/>`).join('')}
    <ellipse cx='212' cy='268' rx='166' ry='160' fill='#5C412F' opacity='0.4' filter='url(#b12)'/>
    <circle cx='200' cy='256' r='160' fill='#F2EADF'/>
    <circle cx='200' cy='256' r='120' fill='#EDE2D2'/>
    ${Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const x = 200 + Math.cos(a) * 40;
      const y = 256 + Math.sin(a) * 36;
      return `<path d='M${x - 60} ${y} C${x - 30} ${y - 30} ${x + 10} ${y + 30} ${x + 50} ${y - 6}' stroke='#E8C27A' stroke-width='7' fill='none' stroke-linecap='round'/>`;
    }).join('')}
    <circle cx='200' cy='252' r='58' fill='#E8C27A' opacity='0.35' filter='url(#b4)'/>
    <circle cx='170' cy='236' r='14' fill='#B9684F'/><circle cx='226' cy='270' r='12' fill='#B9684F'/><circle cx='214' cy='224' r='10' fill='#A85A43'/>
    <ellipse cx='196' cy='262' rx='16' ry='9' fill='#6F8A5A' transform='rotate(-30 196 262)'/>
    <ellipse cx='214' cy='248' rx='14' ry='8' fill='#7F9A68' transform='rotate(40 214 248)'/>
    <path d='M340 60 L360 460' stroke='#CFC6BA' stroke-width='12' stroke-linecap='round'/>
    <path d='M0 0 L200 0 L0 220 Z' fill='#FFF0D6' opacity='0.4' filter='url(#b30)'/>
  `, '#EFB27A');

  const cityNight = film(`
    <defs><linearGradient id='dusk' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3A4258'/><stop offset='0.7' stop-color='#6B6274'/><stop offset='1' stop-color='#8E7268'/></linearGradient></defs>
    <rect width='400' height='500' fill='url(#dusk)'/>
    ${[[60, 120, 34, '#F3C98A'], [150, 90, 22, '#F7DDA8'], [320, 140, 40, '#E9A779'], [250, 210, 26, '#F3C98A'], [90, 260, 46, '#E7B07E'], [340, 300, 30, '#F7DDA8'], [190, 330, 54, '#E9A779'], [40, 400, 30, '#F3C98A'], [300, 420, 44, '#F7DDA8'], [160, 450, 24, '#E7C96B']]
      .map(([x, y, r, c]) => `<circle cx='${x}' cy='${y}' r='${r}' fill='${c}' opacity='0.55' filter='url(#b4)'/><circle cx='${x}' cy='${y}' r='${r * 0.92}' fill='none' stroke='${c}' stroke-width='2' opacity='0.5' filter='url(#b1)'/>`)
      .join('')}
    <path d='M0 500 L0 380 L50 380 L50 340 L100 340 L100 400 L130 400 L130 500 Z M290 500 L290 360 L340 360 L340 330 L400 330 L400 500 Z' fill='#262330' opacity='0.85'/>
    <rect x='60' y='352' width='8' height='10' fill='#F3C98A'/><rect x='80' y='370' width='8' height='10' fill='#F3C98A'/><rect x='352' y='350' width='8' height='10' fill='#F3C98A'/><rect x='310' y='380' width='8' height='10' fill='#F7DDA8'/>
  `, '#C9827D');

  const flowers = film(`
    <rect width='400' height='500' fill='#E7DDCF'/>
    <rect width='400' height='500' fill='#F6E7CF' opacity='0.4' filter='url(#b30)'/>
    <ellipse cx='200' cy='460' rx='140' ry='26' fill='#6B5240' opacity='0.3' filter='url(#b12)'/>
    <path d='M150 470 C140 410 150 360 176 330 L224 330 C250 360 260 410 250 470 Z' fill='#D9D2C4' opacity='0.85'/>
    <path d='M176 330 L224 330' stroke='#BFB4A2' stroke-width='4'/>
    <path d='M200 330 C190 260 150 200 120 150 M200 330 C206 250 230 180 270 120 M200 330 C200 250 196 180 204 100 M200 330 C180 280 120 260 80 240 M200 330 C230 290 290 260 330 250' stroke='#8C8460' stroke-width='3' fill='none'/>
    ${[[120, 150], [270, 120], [204, 100], [80, 240], [330, 250], [160, 200], [244, 180]].map(([x, y], i) => {
      const c = ['#E3C7B8', '#D9A9A2', '#EADBC0', '#C9827D', '#E7D3A6', '#D6B7A6', '#EFE2CF'][i];
      return `<g transform='translate(${x} ${y})'>${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse rx='9' ry='15' cy='-11' fill='${c}' transform='rotate(${a})'/>`).join('')}<circle r='7' fill='#C9A25E'/></g>`;
    }).join('')}
    ${[[140, 120], [300, 200], [100, 190], [236, 80]].map(([x, y]) => `<path d='M${x} ${y} l-6 -26 M${x} ${y} l4 -28 M${x} ${y} l12 -22' stroke='#C8B48E' stroke-width='3' stroke-linecap='round'/>`).join('')}
  `, '#E9B59A');

  const book = film(`
    <rect width='400' height='500' fill='#A9825E'/>
    <rect width='400' height='500' fill='#6E4C34' opacity='0.3'/>
    <path d='M30 120 C110 100 170 110 200 132 L200 440 C170 420 110 410 30 430 Z' fill='#F3E9D6'/>
    <path d='M370 120 C290 100 230 110 200 132 L200 440 C230 420 290 410 370 430 Z' fill='#EFE4CF'/>
    <path d='M200 132 L200 440' stroke='#CDBFA6' stroke-width='3'/>
    <path d='M190 140 C196 300 196 380 190 436' stroke='#B7A88D' stroke-width='10' opacity='0.4' filter='url(#b4)'/>
    ${Array.from({ length: 12 }, (_, i) => `<path d='M56 ${170 + i * 20} H${170 - (i % 3) * 14}' stroke='#9E9180' stroke-width='3' stroke-linecap='round' opacity='0.7'/><path d='M228 ${170 + i * 20} H${346 - ((i + 1) % 4) * 12}' stroke='#9E9180' stroke-width='3' stroke-linecap='round' opacity='0.7'/>`).join('')}
    <path d='M250 200 C270 240 300 250 330 240' stroke='#8D9B83' stroke-width='3' fill='none'/>
    <ellipse cx='300' cy='224' rx='10' ry='5' fill='#8D9B83' transform='rotate(-20 300 224)'/>
    <ellipse cx='318' cy='236' rx='10' ry='5' fill='#8D9B83' transform='rotate(10 318 236)'/>
    <path d='M0 0 L400 0 L400 140 C300 100 200 60 0 120 Z' fill='#FFE8C2' opacity='0.25' filter='url(#b30)'/>
    <circle cx='360' cy='470' r='70' fill='#3E2A1E' opacity='0.4' filter='url(#b12)'/>
  `, '#F0B07A');

  const beach = film(`
    <defs><linearGradient id='bsky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#AFC3C9'/><stop offset='1' stop-color='#EADFCB'/></linearGradient></defs>
    <rect width='400' height='240' fill='url(#bsky)'/>
    <path d='M0 70 C60 60 120 74 200 64 C280 54 340 70 400 62 L400 90 C320 96 260 84 190 94 C110 104 60 90 0 96 Z' fill='#FBF3E6' opacity='0.6' filter='url(#b12)'/>
    <rect y='236' width='400' height='70' fill='#8FA6AA'/>
    <path d='M0 236 H400' stroke='#C9D3D2' stroke-width='3' opacity='0.8'/>
    <rect y='300' width='400' height='200' fill='#E3CFAE'/>
    <path d='M0 300 C80 290 160 314 240 300 C300 290 360 306 400 298 L400 318 C340 324 280 312 220 322 C150 334 70 312 0 322 Z' fill='#F7F1E6' opacity='0.9' filter='url(#b1)'/>
    <ellipse cx='120' cy='430' rx='70' ry='14' fill='#C7AE88' opacity='0.6' filter='url(#b4)'/>
    <path d='M280 470 C282 420 284 380 286 340' stroke='#887970' stroke-width='4'/>
    <path d='M220 360 C250 320 320 320 352 360 Z' fill='#C9827D'/>
    <path d='M220 360 C250 340 320 340 352 360' stroke='#B9684F' stroke-width='3' fill='none'/>
  `, '#EDB98C');

  const bread = film(`
    <rect width='400' height='500' fill='#C2A07E'/>
    <rect x='0' y='300' width='400' height='200' fill='#9C7A58'/>
    <ellipse cx='210' cy='330' rx='170' ry='60' fill='#4A3226' opacity='0.45' filter='url(#b12)'/>
    <path d='M50 300 C50 210 120 170 200 170 C290 170 350 210 350 300 C350 326 300 340 200 340 C100 340 50 326 50 300 Z' fill='#C98A52'/>
    <path d='M50 300 C50 210 120 170 200 170 C290 170 350 210 350 300' fill='#B87540' opacity='0.5' filter='url(#b4)'/>
    <path d='M110 220 C130 250 150 260 170 262 M180 196 C200 226 220 240 244 244 M254 202 C270 228 290 240 310 244' stroke='#F2D6A4' stroke-width='9' fill='none' stroke-linecap='round'/>
    <path d='M0 0 L260 0 L0 260 Z' fill='#FFF0D6' opacity='0.4' filter='url(#b30)'/>
    ${Array.from({ length: 40 }, (_, i) => `<circle cx='${(i * 73) % 400}' cy='${360 + ((i * 37) % 130)}' r='1.6' fill='#F3E3C4' opacity='0.6'/>`).join('')}
  `, '#F0B07A');

  const candle = film(`
    <rect width='400' height='500' fill='#3A2C26'/>
    <circle cx='200' cy='200' r='170' fill='#B9684F' opacity='0.35' filter='url(#b30)'/>
    <circle cx='200' cy='190' r='70' fill='#F3C98A' opacity='0.5' filter='url(#b30)'/>
    ${[[70, 110, 26], [330, 90, 34], [320, 300, 22], [60, 330, 30]].map(([x, y, r]) => `<circle cx='${x}' cy='${y}' r='${r}' fill='#E9A779' opacity='0.35' filter='url(#b4)'/>`).join('')}
    <rect x='150' y='240' width='100' height='200' rx='8' fill='#EFE2C8'/>
    <rect x='150' y='240' width='100' height='200' rx='8' fill='#F7D8A4' opacity='0.5' filter='url(#b4)'/>
    <ellipse cx='200' cy='242' rx='50' ry='10' fill='#F6EAD2'/>
    <path d='M200 242 L200 226' stroke='#3D3530' stroke-width='3'/>
    <path d='M200 170 C186 196 188 218 200 226 C212 218 214 196 200 170 Z' fill='#FFE9B5'/>
    <path d='M200 190 C194 204 196 216 200 222 C204 216 206 204 200 190 Z' fill='#FFF8E4'/>
    <rect y='440' width='400' height='60' fill='#5A4334'/>
  `, '#E9A779');

  const tram = film(`
    <defs><linearGradient id='tsky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#9DAAB8'/><stop offset='1' stop-color='#E8C8A6'/></linearGradient></defs>
    <rect width='400' height='500' fill='#4E4440'/>
    <rect x='40' y='60' width='320' height='260' rx='26' fill='url(#tsky)'/>
    <path d='M40 250 C120 230 200 260 360 240 L360 320 L40 320 Z' fill='#8D9B83' opacity='0.8' filter='url(#b12)'/>
    <path d='M60 230 L80 180 L96 230 Z M120 236 L140 170 L160 236 Z M300 236 L322 190 L342 236 Z' fill='#6F7A5F' filter='url(#b4)'/>
    <circle cx='270' cy='130' r='26' fill='#FCE6BE' filter='url(#b4)'/>
    <rect x='40' y='60' width='320' height='260' rx='26' fill='none' stroke='#2F2622' stroke-width='14'/>
    <rect y='340' width='400' height='160' fill='#6A5148'/>
    <path d='M30 360 C140 340 260 340 370 360 L370 380 L30 380 Z' fill='#7E625A'/>
    <path d='M220 400 L320 400 L326 470 L214 470 Z' fill='#EFE4D2' opacity='0.85'/>
    <path d='M238 420 H300 M238 436 H290 M238 452 H306' stroke='#A99A88' stroke-width='3'/>
  `, '#E9B59A');

  LDR.PHOTOS = {
    coffee: { src: LDR.svgUri(coffee), alt: 'Morning coffee with latte art in warm window light' },
    window: { src: LDR.svgUri(morningWindow), alt: 'Sunlit window with a small plant on the sill' },
    sunset: { src: LDR.svgUri(sunset), alt: 'Peach sunset over the water and city rooftops' },
    plant: { src: LDR.svgUri(plant), alt: 'A leafy houseplant against a cream wall' },
    pasta: { src: LDR.svgUri(pasta), alt: 'A plate of pasta with tomatoes and basil' },
    cityNight: { src: LDR.svgUri(cityNight), alt: 'Soft city lights at dusk' },
    flowers: { src: LDR.svgUri(flowers), alt: 'Dried flowers in a ceramic vase' },
    book: { src: LDR.svgUri(book), alt: 'An open book with a pressed sprig' },
    beach: { src: LDR.svgUri(beach), alt: 'A quiet beach with a rose umbrella' },
    bread: { src: LDR.svgUri(bread), alt: 'A fresh sourdough loaf on the counter' },
    candle: { src: LDR.svgUri(candle), alt: 'A candle glowing in the evening' },
    tram: { src: LDR.svgUri(tram), alt: 'View from a train window on the way home' },
  };
})();
