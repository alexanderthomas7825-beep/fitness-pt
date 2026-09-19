// Einfache schematische Illustrationen (Strichmännchen + Gerät-Silhouette)
// Ziel: Übung + Geräte-Form auf einen Blick erkennen, keine Kunst.

const ICON_STYLE = `
  <style>
    .fig { stroke: var(--accent, #22c55e); stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    .fig-head { fill: var(--accent, #22c55e); stroke: none; }
    .gear { stroke: var(--gear, #9aa0a6); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    .gear-fill { fill: var(--gear-fill, #e5e7eb); stroke: var(--gear, #9aa0a6); stroke-width: 4; }
    .arrow { stroke: var(--arrow, #f59e0b); stroke-width: 5; stroke-linecap: round; fill: none; marker-end: url(#arrowhead); }
  </style>
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="var(--arrow, #f59e0b)" />
    </marker>
  </defs>
`;

function svg(inner) {
  return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">${ICON_STYLE}${inner}</svg>`;
}

const ICONS = {
  "bench-press": () => svg(`
    <rect class="gear-fill" x="90" y="120" width="120" height="18" rx="6"/>
    <rect class="gear" x="90" y="120" width="120" height="18" rx="6"/>
    <line class="gear" x1="100" y1="138" x2="100" y2="160"/>
    <line class="gear" x1="200" y1="138" x2="200" y2="160"/>
    <circle class="fig-head" cx="95" cy="118" r="14"/>
    <line class="fig" x1="108" y1="120" x2="185" y2="120"/>
    <line class="fig" x1="150" y1="120" x2="140" y2="80"/>
    <line class="fig" x1="140" y1="80" x2="140" y2="55"/>
    <line class="fig" x1="150" y1="120" x2="160" y2="80"/>
    <line class="fig" x1="160" y1="80" x2="160" y2="55"/>
    <circle class="gear-fill" cx="140" cy="50" r="12"/>
    <circle class="gear-fill" cx="160" cy="50" r="12"/>
    <line class="arrow" x1="150" y1="95" x2="150" y2="60"/>
  `),

  "machine-press": () => svg(`
    <rect class="gear" x="60" y="60" width="14" height="110" rx="4"/>
    <rect class="gear-fill" x="70" y="95" width="26" height="70" rx="6"/>
    <circle class="fig-head" cx="105" cy="95" r="14"/>
    <line class="fig" x1="105" y1="109" x2="103" y2="160"/>
    <line class="fig" x1="103" y1="160" x2="95" y2="185"/>
    <line class="fig" x1="103" y1="160" x2="118" y2="185"/>
    <line class="fig" x1="108" y1="120" x2="160" y2="115"/>
    <line class="fig" x1="108" y1="140" x2="160" y2="145"/>
    <circle class="gear-fill" cx="170" cy="115" r="10"/>
    <circle class="gear-fill" cx="170" cy="145" r="10"/>
    <line class="gear" x1="170" y1="115" x2="200" y2="115"/>
    <line class="gear" x1="170" y1="145" x2="200" y2="145"/>
    <line class="arrow" x1="130" y1="130" x2="185" y2="130"/>
  `),

  "cable-pull-down": () => svg(`
    <line class="gear" x1="230" y1="20" x2="230" y2="180"/>
    <circle class="gear-fill" cx="230" cy="25" r="10"/>
    <line class="gear" x1="222" y1="30" x2="150" y2="65"/>
    <rect class="gear-fill" x="75" y="140" width="60" height="14" rx="4"/>
    <circle class="fig-head" cx="105" cy="90" r="14"/>
    <line class="fig" x1="105" y1="104" x2="105" y2="148"/>
    <line class="fig" x1="105" y1="148" x2="90" y2="150"/>
    <line class="fig" x1="105" y1="148" x2="120" y2="150"/>
    <line class="fig" x1="105" y1="115" x2="145" y2="70"/>
    <line class="fig" x1="105" y1="115" x2="70" y2="70"/>
    <line class="gear" x1="70" y1="66" x2="150" y2="66"/>
    <line class="arrow" x1="108" y1="75" x2="108" y2="105"/>
  `),

  "cable-row": () => svg(`
    <line class="gear" x1="20" y1="150" x2="20" y2="60"/>
    <circle class="gear-fill" cx="20" cy="55" r="10"/>
    <rect class="gear-fill" x="60" y="150" width="18" height="16" rx="3"/>
    <circle class="fig-head" cx="150" cy="100" r="14"/>
    <line class="fig" x1="150" y1="114" x2="130" y2="150"/>
    <line class="fig" x1="130" y1="150" x2="100" y2="160"/>
    <line class="fig" x1="100" y1="160" x2="70" y2="158"/>
    <line class="fig" x1="130" y1="150" x2="150" y2="165"/>
    <line class="fig" x1="150" y1="120" x2="60" y2="118"/>
    <line class="gear" x1="20" y1="60" x2="60" y2="118"/>
    <line class="arrow" x1="120" y1="128" x2="160" y2="122"/>
  `),

  "cable-pushdown": () => svg(`
    <line class="gear" x1="150" y1="15" x2="150" y2="60"/>
    <circle class="gear-fill" cx="150" cy="18" r="10"/>
    <line class="gear" x1="150" y1="55" x2="150" y2="115"/>
    <rect class="gear-fill" x="130" y="112" width="40" height="12" rx="4"/>
    <circle class="fig-head" cx="150" cy="80" r="14"/>
    <line class="fig" x1="150" y1="94" x2="150" y2="150"/>
    <line class="fig" x1="150" y1="150" x2="135" y2="185"/>
    <line class="fig" x1="150" y1="150" x2="165" y2="185"/>
    <line class="fig" x1="150" y1="105" x2="130" y2="118"/>
    <line class="fig" x1="150" y1="105" x2="170" y2="118"/>
    <line class="arrow" x1="150" y1="95" x2="150" y2="125"/>
  `),

  "cable-curl": () => svg(`
    <line class="gear" x1="150" y1="185" x2="150" y2="150"/>
    <circle class="gear-fill" cx="150" cy="188" r="10"/>
    <rect class="gear-fill" x="130" y="130" width="40" height="12" rx="4"/>
    <circle class="fig-head" cx="150" cy="70" r="14"/>
    <line class="fig" x1="150" y1="84" x2="150" y2="140"/>
    <line class="fig" x1="150" y1="140" x2="135" y2="175"/>
    <line class="fig" x1="150" y1="140" x2="165" y2="175"/>
    <line class="fig" x1="150" y1="100" x2="130" y2="115"/>
    <line class="fig" x1="130" y1="115" x2="145" y2="130"/>
    <line class="fig" x1="150" y1="100" x2="170" y2="115"/>
    <line class="fig" x1="170" y1="115" x2="155" y2="130"/>
    <line class="arrow" x1="140" y1="150" x2="145" y2="105"/>
  `),

  "leg-press": () => svg(`
    <line class="gear" x1="60" y1="180" x2="230" y2="60"/>
    <line class="gear" x1="60" y1="180" x2="220" y2="180"/>
    <rect class="gear-fill" x="205" y="35" width="14" height="55" rx="4" transform="rotate(30 212 62)"/>
    <circle class="fig-head" cx="90" cy="140" r="14"/>
    <line class="fig" x1="95" y1="152" x2="140" y2="165"/>
    <line class="fig" x1="140" y1="165" x2="175" y2="140"/>
    <line class="fig" x1="175" y1="140" x2="205" y2="90"/>
    <line class="fig" x1="95" y1="152" x2="130" y2="175"/>
    <line class="fig" x1="130" y1="175" x2="170" y2="150"/>
    <line class="fig" x1="170" y1="150" x2="205" y2="95"/>
    <line class="arrow" x1="150" y1="130" x2="195" y2="95"/>
  `),

  "leg-extension": () => svg(`
    <rect class="gear-fill" x="90" y="150" width="70" height="16" rx="6"/>
    <line class="gear" x1="100" y1="166" x2="100" y2="185"/>
    <line class="gear" x1="150" y1="166" x2="150" y2="185"/>
    <rect class="gear-fill" x="196" y="90" width="14" height="30" rx="4"/>
    <circle class="fig-head" cx="115" cy="100" r="14"/>
    <line class="fig" x1="115" y1="114" x2="118" y2="150"/>
    <line class="fig" x1="118" y1="150" x2="150" y2="150"/>
    <line class="fig" x1="150" y1="150" x2="203" y2="105"/>
    <line class="fig" x1="120" y1="120" x2="150" y2="115"/>
    <line class="arrow" x1="155" y1="140" x2="195" y2="112"/>
  `),

  "leg-curl": () => svg(`
    <rect class="gear-fill" x="60" y="150" width="150" height="16" rx="6"/>
    <rect class="gear-fill" x="196" y="120" width="14" height="30" rx="4"/>
    <circle class="fig-head" cx="90" cy="130" r="14"/>
    <line class="fig" x1="95" y1="142" x2="150" y2="150"/>
    <line class="fig" x1="150" y1="150" x2="180" y2="150"/>
    <line class="fig" x1="180" y1="150" x2="203" y2="125"/>
    <line class="fig" x1="100" y1="120" x2="140" y2="105"/>
    <line class="arrow" x1="190" y1="145" x2="180" y2="115"/>
  `),

  "goblet-squat": () => svg(`
    <line class="gear" x1="60" y1="185" x2="240" y2="185"/>
    <circle class="fig-head" cx="150" cy="95" r="14"/>
    <line class="fig" x1="150" y1="109" x2="150" y2="145"/>
    <line class="fig" x1="150" y1="145" x2="125" y2="185"/>
    <line class="fig" x1="150" y1="145" x2="175" y2="185"/>
    <line class="fig" x1="150" y1="125" x2="130" y2="150"/>
    <line class="fig" x1="150" y1="125" x2="170" y2="150"/>
    <circle class="gear-fill" cx="150" cy="155" r="14"/>
    <path class="fig" d="M110 60 Q150 45 190 60" stroke-dasharray="4 6"/>
    <line class="arrow" x1="150" y1="140" x2="150" y2="105"/>
  `),

  "lateral-raise": () => svg(`
    <line class="gear" x1="60" y1="185" x2="240" y2="185"/>
    <circle class="fig-head" cx="150" cy="70" r="14"/>
    <line class="fig" x1="150" y1="84" x2="150" y2="140"/>
    <line class="fig" x1="150" y1="140" x2="130" y2="185"/>
    <line class="fig" x1="150" y1="140" x2="170" y2="185"/>
    <line class="fig" x1="150" y1="100" x2="100" y2="90"/>
    <line class="fig" x1="150" y1="100" x2="200" y2="90"/>
    <circle class="gear-fill" cx="95" cy="90" r="12"/>
    <circle class="gear-fill" cx="205" cy="90" r="12"/>
    <line class="arrow" x1="100" y1="130" x2="95" y2="95"/>
    <line class="arrow" x1="200" y1="130" x2="205" y2="95"/>
  `),

  "plank-core": () => svg(`
    <line class="gear" x1="30" y1="175" x2="270" y2="175"/>
    <circle class="fig-head" cx="220" cy="130" r="14"/>
    <line class="fig" x1="207" y1="135" x2="90" y2="150"/>
    <line class="fig" x1="90" y1="150" x2="60" y2="175"/>
    <line class="fig" x1="207" y1="140" x2="200" y2="175"/>
    <line class="fig" x1="150" y1="145" x2="145" y2="175"/>
    <line class="arrow" x1="150" y1="115" x2="150" y2="140"/>
  `),

  "back-extension": () => svg(`
    <line class="gear" x1="130" y1="100" x2="200" y2="150"/>
    <rect class="gear-fill" x="180" y="140" width="40" height="16" rx="6" transform="rotate(35 200 148)"/>
    <line class="gear" x1="205" y1="160" x2="205" y2="185"/>
    <circle class="fig-head" cx="105" cy="90" r="14"/>
    <line class="fig" x1="113" y1="100" x2="150" y2="118"/>
    <line class="fig" x1="150" y1="118" x2="185" y2="140"/>
    <line class="fig" x1="185" y1="140" x2="185" y2="175"/>
    <line class="fig" x1="185" y1="140" x2="215" y2="175"/>
    <path class="fig" d="M150 60 Q170 90 150 118" stroke-dasharray="4 6"/>
    <line class="arrow" x1="130" y1="70" x2="118" y2="100"/>
  `),

  cardio: () => svg(`
    <circle class="gear-fill" cx="230" cy="160" r="22"/>
    <circle class="gear-fill" cx="130" cy="160" r="22"/>
    <line class="gear" x1="130" y1="160" x2="180" y2="120"/>
    <line class="gear" x1="180" y1="120" x2="230" y2="160"/>
    <line class="gear" x1="180" y1="120" x2="180" y2="90"/>
    <circle class="fig-head" cx="150" cy="70" r="14"/>
    <line class="fig" x1="155" y1="84" x2="180" y2="115"/>
    <line class="fig" x1="150" y1="100" x2="190" y2="95"/>
    <line class="fig" x1="150" y1="100" x2="120" y2="130"/>
    <line class="fig" x1="180" y1="115" x2="150" y2="140"/>
    <line class="fig" x1="180" y1="115" x2="210" y2="140"/>
    <path class="arrow" d="M50 40 q10 -15 20 0" />
    <path class="arrow" d="M65 55 q10 -15 20 0" />
    <text x="40" y="35" font-size="14" fill="var(--arrow, #f59e0b)" font-family="sans-serif">30s</text>
  `),
};

function iconFor(key) {
  return (ICONS[key] || ICONS["cardio"])();
}
