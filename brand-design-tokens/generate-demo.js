#!/usr/bin/env node
/**
 * generate-demo.js — multi-brand comparison HTML generator
 *
 * Usage:
 *   node scripts/generate-demo.js <brand1> <brand2> [brand3] [options]
 *
 * Options:
 *   --title  "..."      Hero headline
 *   --sub    "..."      Hero subtitle
 *   --cta    "..."      CTA button text
 *   --feat   "a,b,c"   Comma-separated feature card titles (3 items)
 *
 * Output: .brand-demos/compare-<brand1>-<brand2>[-<brand3>].html
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const BRANDS_JSON = path.join(__dirname, 'brands.json');

// ── CLI ────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {
    brands: [],
    title: 'Design Skill Pack',
    sub:   '73 real brand token libraries for AI-assisted front-end generation.',
    cta:   'Get Started',
    feat:  ['Brand-Accurate Tokens', 'Multi-Brand Compare', 'Any Stack'],
    desc:  [
      'CSS custom properties sourced directly from 73 real design systems.',
      'Generate side-by-side demos to find the right visual style, fast.',
      'Works with HTML, React, Vue, Tailwind — output in any format.',
    ],
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if      (args[i] === '--title' && args[i+1]) opts.title = args[++i];
    else if (args[i] === '--sub'   && args[i+1]) opts.sub   = args[++i];
    else if (args[i] === '--cta'   && args[i+1]) opts.cta   = args[++i];
    else if (args[i] === '--feat'  && args[i+1]) opts.feat  = args[++i].split(',').map(s => s.trim());
    else if (args[i] === '--root'  && args[i+1]) opts.root  = args[++i];
    else if (!args[i].startsWith('--'))          opts.brands.push(args[i]);
  }
  return opts;
}

// ── YAML frontmatter parser ────────────────────────────────────────────────────
function parseFrontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? parseSimpleYaml(m[1]) : {};
}

function parseSimpleYaml(text) {
  const out  = {};
  const lines = text.split(/\r?\n/);
  let sec = null, sub = null;

  for (const raw of lines) {
    if (!raw.trim()) continue;

    const m0 = raw.match(/^([\w][\w-]*):(.*)$/);
    if (m0) {
      const [, k, rest] = m0;
      const v = rest.trim().replace(/^["']|["']$/g, '');
      if (v) { out[k] = v; sec = null; sub = null; }
      else   { out[k] = {}; sec = k; sub = null; }
      continue;
    }
    if (sec) {
      const m1 = raw.match(/^  ([\w][\w-]*):(.*)$/);
      if (m1) {
        const [, k, rest] = m1;
        const v = rest.trim().replace(/^["']|["']$/g, '');
        if (v) { out[sec][k] = v; sub = null; }
        else   { out[sec][k] = {}; sub = k; }
        continue;
      }
    }
    if (sec && sub) {
      const m2 = raw.match(/^    ([\w][\w-]*):(.*)$/);
      if (m2) {
        const [, k, rest] = m2;
        out[sec][sub][k] = rest.trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return out;
}

// Resolve {section.key} references in component values
function resolveRef(val, fm) {
  if (typeof val !== 'string') return val;
  const m = val.match(/^\{(\w+)\.(.+)\}$/);
  if (!m) return val;
  return fm[m[1]]?.[m[2]] ?? val;
}

// ── Font mapping: proprietary → Google Fonts ───────────────────────────────────
const FONT_MAP = [
  [/futura|bebas|condensed/i,   'Bebas+Neue',                          'Bebas Neue'],
  [/barlow/i,                   'Barlow:wght@400;500;700',             'Barlow'],
  [/garamond|cormorant|tiempos|copernicus/i, 'Cormorant+Garamond:wght@400;600;700', 'Cormorant Garamond'],
  [/playfair/i,                 'Playfair+Display:wght@400;700',       'Playfair Display'],
  [/georgia|palatino|lora/i,   'Lora:wght@400;700',                   'Lora'],
  [/dm.serif/i,                 'DM+Serif+Display',                    'DM Serif Display'],
  [/mono|code|jetbrains|fira/i,'JetBrains+Mono:wght@400;500;700',     'JetBrains Mono'],
  [/space.grotesk/i,            'Space+Grotesk:wght@400;500;700',      'Space Grotesk'],
  [/manrope/i,                  'Manrope:wght@400;500;700',            'Manrope'],
  [/poppins/i,                  'Poppins:wght@400;500;700',            'Poppins'],
  [/outfit/i,                   'Outfit:wght@400;500;700',             'Outfit'],
  [/raleway/i,                  'Raleway:wght@400;500;700',            'Raleway'],
  [/sf.pro|system.ui/i,         null,                                   'system-ui'],
];

function resolveFont(name) {
  for (const [re, link, friendly] of FONT_MAP) {
    if (re.test(name)) return { link, name: friendly };
  }
  return { link: 'Inter:wght@400;500;700', name: 'Inter' };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function pick(obj, ...keys) {
  for (const k of keys) if (obj[k]) return obj[k];
  return null;
}

function lum(hex) {
  const c = (hex || '').replace('#', '');
  if (c.length !== 6) return 0.5;
  const r = parseInt(c.slice(0,2),16)/255;
  const g = parseInt(c.slice(2,4),16)/255;
  const b = parseInt(c.slice(4,6),16)/255;
  return 0.2126*r + 0.7152*g + 0.0722*b;
}

// ── Token extraction ───────────────────────────────────────────────────────────
function extractTokens(brand) {
  const mdPath = path.join(__dirname, brand.design_md);
  const content = fs.readFileSync(mdPath, 'utf8');
  const fm = parseFrontmatter(content);

  const C  = fm.colors     || {};
  const T  = fm.typography || {};
  const R  = fm.rounded    || {};
  const S  = fm.spacing    || {};
  const CO = fm.components || {};

  const res = v => resolveRef(v, fm);
  const isDark = brand.theme === 'dark';

  // ── Colors ───────────────────────────────────────────────────────────────────
  const canvas   = pick(C, 'canvas','background','bg')                                || (isDark ? '#0f0f0f' : '#ffffff');
  const ink      = pick(C, 'ink','foreground','text-primary','on-background','black') || (isDark ? '#f0f0f0' : '#111111');
  const inkBody  = pick(C, 'body','text','body-color','secondary-text','ink-secondary') || ink;
  const primary  = pick(C, 'primary','accent','brand','highlight','teal','blue','coral','violet') || ink;
  const onPri    = pick(C, 'on-primary','on-brand','on-accent','inverse')             || (lum(primary) < 0.35 ? '#ffffff' : '#111111');
  const surface  = pick(C, 'surface-soft','soft-cloud','surface','surface-1','elevated','bg-secondary','neutral-50','gray-50') || canvas;
  const cardBg   = pick(C, 'surface-card','card','card-bg','surface-elevated','neutral-100','gray-100') || surface;
  const muted    = pick(C, 'muted','mute','text-muted','text-secondary','stone','ash','gray-400','neutral-400') || (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)');
  const border   = pick(C, 'hairline-soft','hairline','border','border-default','divider','gray-200','neutral-200') || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

  // ── Typography ───────────────────────────────────────────────────────────────
  const entries = Object.entries(T);

  // Display: largest headline (hero title)
  const dispE = entries.find(([k]) => /display.xl|display.lg|display.campaign|hero.xl/i.test(k))
             || entries.find(([k]) => /display|campaign|hero/i.test(k))
             || entries[0];
  const dispObj = dispE?.[1] || {};

  // Title / UI heading: for card headers and sub-sections
  const titleE = entries.find(([k]) => /title.lg|title.md|heading.xl|heading.lg|h1|h2/i.test(k))
              || entries.find(([k]) => /title|heading/i.test(k))
              || entries[Math.floor(entries.length / 3)];
  const titleObj = titleE?.[1] || {};

  // Body: paragraph text
  const bodyE = entries.find(([k]) => /^body.md$|^body$|base.md/i.test(k))
             || entries.find(([k]) => /body.md|body(?!.strong|.sm)/i.test(k))
             || entries[Math.floor(entries.length / 2)];
  const bodyObj = bodyE?.[1] || {};

  // Caption / eyebrow label above hero title
  const capE = entries.find(([k]) => /caption.upper|eyebrow|overline|label.upper|utility/i.test(k))
            || entries.find(([k]) => /caption|label/i.test(k))
            || entries[entries.length - 2];
  const capObj = capE?.[1] || {};

  const dispFontRaw = dispObj.fontFamily || 'Inter';
  const bodyFontRaw = bodyObj.fontFamily || dispFontRaw;
  const dispR = resolveFont(dispFontRaw);
  const bodyR = resolveFont(bodyFontRaw);

  const gLinks = [...new Set([dispR.link, bodyR.link, 'Inter:wght@400;500;700'].filter(Boolean))];

  // ── Button component ──────────────────────────────────────────────────────────
  const btnC   = CO['button-primary'] || CO['btn-primary'] || CO['button'] || {};
  const btnPad = btnC.padding || '11px 24px';
  const btnH   = btnC.height  || 'auto';
  const btnR   = btnC.rounded ? (res(btnC.rounded) || pick(R,'lg','full','md') || '8px') : (pick(R,'lg','full','md') || '8px');

  // ── Feature card component ────────────────────────────────────────────────────
  const fCardC    = CO['feature-card'] || CO['card'] || {};
  const fCardBg   = fCardC.backgroundColor ? (res(fCardC.backgroundColor) || cardBg) : cardBg;
  const fCardRaw  = fCardC.rounded;
  const fCardR    = fCardRaw
    ? (res(fCardRaw) || pick(R,'lg','xl','md') || '8px')
    : (R.none !== undefined && R.none !== '' ? R.none : (pick(R,'lg','xl','md') || '8px'));

  // ── Spacing ───────────────────────────────────────────────────────────────────
  const spSection = pick(S, 'section','xxl') || '48px';
  const spElem    = pick(S, 'xl','lg','xxl') || '24px';
  const spInner   = pick(S, 'md','sm')       || '16px';

  const prefix = brand.id.replace(/[^a-z0-9]/gi, '').slice(0, 4);

  return {
    // Colors
    canvas, ink, inkBody, primary, onPri, surface, cardBg: fCardBg, muted, border,
    // Display typography
    dispFont:   dispR.name,
    dispSize:   dispObj.fontSize     || '72px',
    dispWeight: dispObj.fontWeight   || '700',
    dispLH:     dispObj.lineHeight   || '1',
    dispTrans:  dispObj.textTransform || 'none',
    dispLS:     dispObj.letterSpacing || '0',
    // Title typography (card headers)
    bodyFont:    bodyR.name,
    titleSize:   titleObj.fontSize   || '20px',
    titleWeight: titleObj.fontWeight || '600',
    titleLH:     titleObj.lineHeight || '1.3',
    titleFont:   resolveFont(titleObj.fontFamily || bodyFontRaw).name,
    // Body typography
    bodySize:   bodyObj.fontSize   || '16px',
    bodyLH:     bodyObj.lineHeight || '1.6',
    bodyWeight: bodyObj.fontWeight || '400',
    // Caption / eyebrow
    capSize:   capObj.fontSize     || '12px',
    capWeight: capObj.fontWeight   || '500',
    capLS:     capObj.letterSpacing || '0.8px',
    // Button
    btnPad, btnH, btnRadius: btnR,
    // Card
    cardRadius: fCardR,
    // Spacing
    spSection, spElem, spInner,
    // Fonts
    gLinks, prefix,
  };
}

// ── CSS per brand ─────────────────────────────────────────────────────────────
function brandCSS(tok) {
  const p = `--${tok.prefix}`;
  return `
    #slide-${tok.prefix} {
      /* colors */
      ${p}-c:        ${tok.canvas};
      ${p}-ink:      ${tok.ink};
      ${p}-ink-b:    ${tok.inkBody};
      ${p}-pri:      ${tok.primary};
      ${p}-on-pri:   ${tok.onPri};
      ${p}-surf:     ${tok.surface};
      ${p}-card:     ${tok.cardBg};
      ${p}-muted:    ${tok.muted};
      ${p}-brd:      ${tok.border};
      /* fonts */
      ${p}-fd:       '${tok.dispFont}', serif;
      ${p}-ft:       '${tok.titleFont}', Inter, sans-serif;
      ${p}-fb:       '${tok.bodyFont}', Inter, sans-serif;
      /* display scale */
      ${p}-d-sz:     ${tok.dispSize};
      ${p}-d-w:      ${tok.dispWeight};
      ${p}-d-lh:     ${tok.dispLH};
      ${p}-d-tx:     ${tok.dispTrans};
      ${p}-d-ls:     ${tok.dispLS};
      /* title scale */
      ${p}-t-sz:     ${tok.titleSize};
      ${p}-t-w:      ${tok.titleWeight};
      ${p}-t-lh:     ${tok.titleLH};
      /* body scale */
      ${p}-b-sz:     ${tok.bodySize};
      ${p}-b-lh:     ${tok.bodyLH};
      /* caption scale */
      ${p}-cap-sz:   ${tok.capSize};
      ${p}-cap-w:    ${tok.capWeight};
      ${p}-cap-ls:   ${tok.capLS};
      /* components */
      ${p}-btn-pad:  ${tok.btnPad};
      ${p}-btn-h:    ${tok.btnH};
      ${p}-r-btn:    ${tok.btnRadius};
      ${p}-r-card:   ${tok.cardRadius};
      /* spacing */
      ${p}-sp-e:     ${tok.spElem};
      ${p}-sp-i:     ${tok.spInner};

      background:  var(${p}-c);
      color:       var(${p}-ink);
      font-family: var(${p}-fb);
    }

    #slide-${tok.prefix} .eyebrow {
      display:        inline-flex;
      align-items:    center;
      background:     var(${p}-surf);
      color:          var(${p}-pri);
      font-family:    var(${p}-fb);
      font-size:      var(${p}-cap-sz);
      font-weight:    var(${p}-cap-w);
      letter-spacing: var(${p}-cap-ls);
      text-transform: uppercase;
      padding:        5px 12px;
      border-radius:  var(${p}-r-card);
      border:         1px solid var(${p}-brd);
    }

    #slide-${tok.prefix} .hero-title {
      font-family:    var(${p}-fd);
      font-size:      min(var(${p}-d-sz), 9vw);
      font-weight:    var(${p}-d-w);
      line-height:    var(${p}-d-lh);
      letter-spacing: var(${p}-d-ls);
      text-transform: var(${p}-d-tx);
      color:          var(${p}-ink);
    }

    #slide-${tok.prefix} .hero-sub {
      font-family: var(${p}-fb);
      font-size:   var(${p}-b-sz);
      line-height: var(${p}-b-lh);
      color:       var(${p}-ink-b);
      max-width:   540px;
    }

    #slide-${tok.prefix} .cta-btn {
      background:     var(${p}-pri);
      color:          var(${p}-on-pri);
      border-radius:  var(${p}-r-btn);
      font-family:    var(${p}-fb);
      font-size:      var(${p}-cap-sz);
      font-weight:    600;
      letter-spacing: var(${p}-cap-ls);
      text-transform: uppercase;
      padding:        var(${p}-btn-pad);
      height:         var(${p}-btn-h);
      border:         none;
      cursor:         pointer;
      display:        inline-flex;
      align-items:    center;
    }

    #slide-${tok.prefix} .feat-card {
      background:    var(${p}-card);
      border:        1px solid var(${p}-brd);
      border-radius: var(${p}-r-card);
      padding:       var(${p}-sp-e);
      flex:          1;
      display:       flex;
      flex-direction: column;
      gap:           var(${p}-sp-i);
    }

    #slide-${tok.prefix} .feat-icon {
      width:         28px;
      height:        28px;
      border-radius: var(${p}-r-btn);
      background:    var(${p}-pri);
      opacity:       0.2;
      flex-shrink:   0;
    }

    #slide-${tok.prefix} .feat-name {
      font-family:  var(${p}-ft);
      font-size:    var(${p}-t-sz);
      font-weight:  var(${p}-t-w);
      line-height:  var(${p}-t-lh);
      color:        var(${p}-ink);
    }

    #slide-${tok.prefix} .feat-desc {
      font-family: var(${p}-fb);
      font-size:   var(${p}-b-sz);
      line-height: var(${p}-b-lh);
      color:       var(${p}-muted);
    }`;
}

// ── Slide HTML ────────────────────────────────────────────────────────────────
function slideHTML(brand, tok, opts) {
  const cards = opts.feat.map((f, i) => `
          <div class="feat-card">
            <div class="feat-icon"></div>
            <div class="feat-name">${f}</div>
            <div class="feat-desc">${opts.desc[i] || ''}</div>
          </div>`).join('');

  return `
    <section class="slide" id="slide-${tok.prefix}">
      <span class="brand-label">${brand.name.toUpperCase()}</span>
      <div class="slide-inner">
        <div class="hero">
          <div><span class="eyebrow">Open Source</span></div>
          <h1 class="hero-title">${opts.title}</h1>
          <p class="hero-sub">${opts.sub}</p>
          <button class="cta-btn">${opts.cta}</button>
        </div>
        <div class="feat-row">
          ${cards}
        </div>
      </div>
    </section>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv);
  if (!opts.root) {
    console.error('Error: --root <project-dir> is required.\n');
    console.error('  node generate-demo.js <brand1> <brand2> --root /path/to/project\n');
    process.exit(1);
  }
  const ROOT      = path.resolve(opts.root);
  const DEMOS_DIR = path.join(ROOT, '.brand-demos');

  if (opts.brands.length < 2) {
    console.error('Usage: node scripts/generate-demo.js <brand1> <brand2> [...]\n');
    process.exit(1);
  }

  const allBrands = JSON.parse(fs.readFileSync(BRANDS_JSON, 'utf8'));

  const selected = opts.brands.map(id => {
    const b = allBrands.find(x => x.id === id || x.name.toLowerCase() === id.toLowerCase());
    if (!b) { console.error(`Brand not found: "${id}"\n`); process.exit(1); }
    return b;
  });

  const slides = selected.map(brand => ({ brand, tok: extractTokens(brand) }));

  const gLinks  = [...new Set(slides.flatMap(s => s.tok.gLinks))];
  const fontTags = gLinks.map(f =>
    `  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${f}&display=swap">`
  ).join('\n');

  const allCSS    = slides.map(s => brandCSS(s.tok)).join('\n');
  const allSlides = slides.map(s => slideHTML(s.brand, s.tok, opts)).join('\n');

  const dots = selected.map((b, i) => `
    <div class="dot${i === 0 ? ' active' : ''}" data-i="${i}">
      <span class="dot-label">${b.name.toUpperCase()}</span>
    </div>`).join('');

  const outName = `compare-${selected.map(b => b.id).join('-')}.html`;
  const outPath = path.join(DEMOS_DIR, outName);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Compare · ${selected.map(b => b.name).join(' vs ')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontTags}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { background: #0c0c0c; overflow: hidden; height: 100vh; }

    .stage { position: fixed; inset: 0; overflow: hidden; }

    .track {
      display: flex;
      flex-direction: column;
      transform: translateY(0);
      transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1);
      will-change: transform;
    }

    .slide {
      height: calc(100vh - 16px);
      margin-top: 16px;
      flex-shrink: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px 40px;
      overflow: hidden;
    }
    .slide:first-child { margin-top: 0; height: 100vh; }

    .brand-label {
      position: absolute;
      top: 18px; left: 28px;
      font-size: 11px;
      letter-spacing: 1.5px;
      color: rgba(128,128,128,0.6);
      font-family: system-ui, sans-serif;
      font-weight: 500;
    }

    .slide-inner {
      width: 100%;
      max-width: 760px;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .hero {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .feat-row { display: flex; gap: 14px; }

    /* ── Navigation ── */
    .nav-arrows {
      position: fixed;
      bottom: 28px; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 10px;
      z-index: 100;
    }
    .nav-arrows button {
      width: 44px; height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(20,20,20,0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #fff; font-size: 17px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s;
    }
    .nav-arrows button:disabled { opacity: 0.25; cursor: default; }

    .dot-nav {
      position: fixed;
      right: 24px; top: 50%;
      transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 10px;
      z-index: 100;
    }
    .dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      transition: transform 0.2s, background 0.2s;
      position: relative;
    }
    .dot.active { transform: scale(1.35); background: #fff; }
    .dot-label {
      position: absolute;
      right: 14px; top: 50%;
      transform: translateY(-50%);
      font-size: 11px;
      color: rgba(255,255,255,0.7);
      white-space: nowrap;
      font-family: system-ui, sans-serif;
      letter-spacing: 1.2px;
      opacity: 0;
      transition: opacity 0.15s;
      pointer-events: none;
    }
    .dot:hover .dot-label, .dot.active .dot-label { opacity: 1; }

    /* ── Brand tokens ── */
${allCSS}
  </style>
</head>
<body>
  <div class="stage">
    <div class="track" id="track">
${allSlides}
    </div>
  </div>

  <nav class="nav-arrows">
    <button id="btn-prev" disabled title="Previous (↑)">↑</button>
    <button id="btn-next" title="Next (↓)">↓</button>
  </nav>

  <nav class="dot-nav" id="dot-nav">
    ${dots}
  </nav>

  <script>
    const TOTAL = ${selected.length};
    let current = 0, animating = false;
    const track   = document.getElementById('track');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const dots    = document.querySelectorAll('#dot-nav .dot');

    function goTo(i) {
      if (animating) return;
      i = Math.max(0, Math.min(TOTAL - 1, i));
      if (i === current) return;
      animating = true;
      current = i;
      track.style.transform = \`translateY(calc(\${-i} * 100vh))\`;
      btnPrev.disabled = i === 0;
      btnNext.disabled = i === TOTAL - 1;
      dots.forEach((d, j) => d.classList.toggle('active', j === i));
      track.addEventListener('transitionend', () => { animating = false; }, { once: true });
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    });
    document.addEventListener('wheel',     e => e.preventDefault(), { passive: false });
    document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  </script>
</body>
</html>`;

  if (!fs.existsSync(DEMOS_DIR)) fs.mkdirSync(DEMOS_DIR, { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`✓  ${path.relative(ROOT, outPath)}`);
  console.log(`   ${selected.map(b => b.name).join(' · ')}`);
}

main();
