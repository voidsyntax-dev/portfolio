/* =========================================================
   Anant Mukherjee — portfolio scripts
   ========================================================= */

const GH = 'https://github.com/voidsyntax-dev';
const CHEME = GH + '/Chemical-Engineering-Projects/tree/main/';

/* ---------- Case-study data (drives the dialog) ---------- */
const PROJECTS = {
  'rl-cstr': {
    tag: 'Reinforcement learning · Process control',
    title: 'Reinforcement Learning Control of a Van de Vusse CSTR',
    lede: 'An RL controller that holds product concentration at set-point in a jacketed reactor while keeping it below 130 °C, benchmarked against an industrial PI scheme and a nonlinear MPC.',
    metrics: [
      ['Tracking error', '0.046', 'mol/L on the held-out plant, equal to NMPC'],
      ['Per decision', '0.6 ms', 'vs 10–34 ms for NMPC (20–50× less)'],
      ['vs PI', '2.4×', 'lower tracking error (0.110 for PI)']
    ],
    body: [
      'The Van de Vusse reactions (A → B → C, 2A → D) make B the product, so the controller must balance conversion against over-reaction. It manipulates the dilution rate and jacket cooling duty to track a cB set-point, with a hard limit on reactor temperature.',
      'The two loops interact, the product gain changes sign near the optimum, and the plant has dead time, which is why a classical PI scheme struggles. The final MPC-guided PPO policy matches nonlinear MPC on plants it never saw in training, with no optimiser running online.'
    ],
    steps: [
      '<b>Process model:</b> material, energy and jacket balances with Arrhenius kinetics (Klatt & Engell, 1998), checked against the published steady state, mass-balance closure and SciPy LSODA.',
      '<b>Realistic environment:</b> a Gymnasium env with 20 s dead time, thermocouple lag, 30 s analyzer delay, noise, valve saturation and rate limits, plus feed-temperature drift, fouling and kinetic mismatch.',
      '<b>Baselines:</b> a grid-tuned dual PI controller and an offset-free nonlinear MPC (CasADi + IPOPT, 200 s horizon, disturbance observer).',
      '<b>RL training:</b> PPO from scratch on a Kaggle GPU, then MPC-guided PPO: behaviour cloning, PPO with a decaying imitation loss, and DAgger rounds with the MPC labelling in shadow mode.',
      '<b>Robustness:</b> 5- and 20-min error-memory inputs, ±15% kinetic randomisation, and a held-out "hard" set (15–22% off nominal) never used for training or model selection.'
    ],
    figure: {
      src: 'images/rl-valve-result.png',
      alt: 'Four stacked time plots of concentration, temperature, feed rate and jacket duty for PI, MPC and PPO controllers on the held-out hard plant',
      caption: 'Held-out hard plant: cB tracking, reactor temperature and both manipulated variables for PI, MPC and the PPO variants.'
    },
    table: {
      label: 'Results · mean |cB − set-point| (mol/L), 20 scenarios per set',
      head: ['Test set', 'PI', 'Nonlinear MPC', 'MPC-guided PPO'],
      rows: [
        ['Nominal plant', '0.078', '0.011', '0.013'],
        ['Perturbed plant', '0.093', '0.030', '0.032'],
        ['Hard, held out', '0.110', '0.046', '*0.046'],
        ['Compute per decision', '~0', '10–34 ms', '*0.6 ms']
      ]
    },
    tools: ['Python', 'Gymnasium', 'Stable-Baselines3', 'PyTorch', 'CasADi', 'IPOPT', 'SciPy', 'Kaggle GPU'],
    repo: GH + '/RL-Valve'
  },

  'soft-sensor': {
    tag: 'Soft sensing · Process analytics',
    title: 'Soft Sensor for Ethylbenzene Production',
    lede: 'Real-time estimates of outlet ethylbenzene and diethylbenzene compositions, which cannot be measured directly online, from routine temperature, pressure, flow and level readings.',
    metrics: [
      ['Ethylbenzene', 'R² 0.979', 'RMSE 0.0049 on the held-out period'],
      ['Diethylbenzene', 'R² 0.892', 'trace-level, RMSE 4.2×10⁻⁵'],
      ['Model families', '7', 'baseline, Ridge, PLS, RF, SVR, MLP, GBM']
    ],
    body: [
      'A series alkylation where ethylbenzene reacts further to diethylbenzene, and both compete for ethylene. Online analyzers for these compositions are slow and expensive, so the soft sensor infers them from measurements the plant already has.',
      'Strong autocorrelation between neighbouring samples makes random splits meaningless, so every modelling choice is made on a strictly time-ordered split and lag features never cross a gap in the data.'
    ],
    steps: [
      '<b>Data:</b> dynamic history from an Aspen Dynamics reactor model driven by random step changes in temperature, level and flow set-points and in feed and utility conditions, logged every 0.01 h.',
      '<b>Normal-operation filter:</b> rows outside the normal operating band are removed so the model learns only the range it will be used in.',
      '<b>Lag features:</b> past values of each measurement, computed within continuous segments.',
      '<b>Time-based split:</b> first 70% of time for training, last 30% for testing; the diethylbenzene MLP is tuned with time-ordered cross-validation.',
      '<b>Deployment:</b> each selected model is saved with its scaler, feature list, lag settings, normal-band limits and sampling interval.'
    ],
    figure: {
      src: 'images/soft-sensor-result.webp',
      alt: 'Line chart of true versus predicted outlet ethylbenzene fraction over held-out data',
      caption: 'Held-out data: true outlet ethylbenzene fraction against the MLP soft sensor’s prediction.'
    },
    table: {
      label: 'Results · held-out test period (last 30% of time)',
      head: ['Target', 'Selected model', 'RMSE', 'MAE', 'R²'],
      rows: [
        ['Ethylbenzene', 'MLP (32, 16)', '0.004900', '0.003548', '*0.979'],
        ['Diethylbenzene', 'MLP (16,)', '0.000042', '0.000027', '*0.892']
      ]
    },
    tools: ['Aspen Dynamics', 'Python', 'NumPy', 'Pandas', 'scikit-learn', 'Time-series validation'],
    repo: CHEME + 'Soft%20Sensor%20for%20Ethylbenzene%20Production'
  },

  'tep': {
    tag: 'Fault detection · Process monitoring',
    title: 'Tennessee Eastman Fault Detection & Diagnosis',
    lede: 'Monitors that detect and name 20 process faults from 52 measured and manipulated variables, in a plant where closed-loop control actively hides the faults.',
    metrics: [
      ['Runs detected', '98.0%', 'XGBoost, mean over 20 faults and 5 seeds'],
      ['Diagnosis', '86.5%', 'accuracy across fault classes'],
      ['False alarms', '0.20%', 'of normal samples']
    ],
    body: [
      'The Tennessee Eastman Process is the standard benchmark for process monitoring: a reactor, condenser, separator, stripper and recycle loop under closed-loop control. Three model families are compared under identical, pre-registered rules.',
      'Every model alarms when its score stays above a 99th-percentile limit for three samples in a row, and test data never sets a threshold or picks a model. Results that looked too good went through label-shuffle and train–test hashing checks; none found leakage.'
    ],
    steps: [
      '<b>Data and simulator check:</b> Rieth et al. (2017) dataset with its official split (500 runs per fault); the Downs & Vogel Fortran model was compiled and reproduces the published operating point within 0.24%.',
      '<b>PCA baseline:</b> T² and SPE statistics with limits from held-out normal runs; diagnosis by contribution plots.',
      '<b>Learned models:</b> XGBoost on windowed features, and an LSTM autoencoder trained on normal data with a classifier head (Kaggle GPU).',
      '<b>Evaluation:</b> detection rate, false-alarm rate, delay and diagnosis accuracy per fault with 95% intervals over 5 seeds.',
      '<b>Honest limits:</b> faults 3, 9 and 15 stay hard for every model, as in the published literature.'
    ],
    figure: {
      src: 'images/tep-result.png',
      alt: 'Bar chart of the fraction of post-onset samples in alarm for each of 20 faults, comparing PCA, XGBoost and LSTM autoencoder',
      caption: 'Fraction of post-onset samples in alarm per fault for PCA, XGBoost and the LSTM autoencoder (error bars over 5 seeds).'
    },
    table: {
      label: 'Results · official test split, mean over 20 faults and 5 seeds',
      head: ['Model', 'Samples in alarm', 'Runs detected', 'False alarms', 'Diagnosis'],
      rows: [
        ['PCA (T², SPE)', '62.6%', '89.7%', '0.06%', '64.3%'],
        ['LSTM autoencoder', '74.6%', '95.6%', '0.66%', '81.8%'],
        ['XGBoost', '*82.7%', '*98.0%', '0.20%', '*86.5%']
      ]
    },
    tools: ['Python', 'scikit-learn', 'XGBoost', 'PyTorch', 'Fortran (f2py)', 'pytest', 'Kaggle GPU'],
    repo: GH + '/Tennessee-Eastman'
  },

  'energy': {
    tag: 'Time-series forecasting · Clean energy',
    title: 'Day-Ahead Solar & Wind Power Forecasting',
    lede: '1–24 h ahead forecasts of Belgium’s national solar PV, onshore and offshore wind generation with 10/50/90% prediction intervals, built so that every input was genuinely available at issue time.',
    metrics: [
      ['Solar nRMSE', '5.81%', '−54% vs clear-sky persistence'],
      ['Onshore wind', '3.94%', 'below the grid operator’s 4.08%'],
      ['Offshore wind', '8.57%', 'below the grid operator’s 8.85%']
    ],
    body: [
      'Weather inputs are the ECMWF forecasts actually published by issue time, not the weather that later happened. Training the same model on reanalysis weather would have overstated wind accuracy by 11–14%.',
      'LightGBM beats Elia’s own operational day-ahead forecast for both onshore and offshore wind, and comes within 0.8 points of it for solar.'
    ],
    steps: [
      '<b>Data:</b> Elia open data (15-min generation and capacity, averaged hourly) and archived ECMWF IFS 9 km forecast runs at 7 points over Belgium.',
      '<b>Issue-time enforcement:</b> runs are used only 7 h after initialisation and lagged generation only from ≥1 h before issue; assertions check both rules on every row.',
      '<b>Physics features:</b> irradiance, clear-sky index and sun position (pvlib) for solar; 100 m wind speed and its cube, air density, wind power density, shear and direction for wind.',
      '<b>Leak-free split:</b> test = forecasts issued from 1 March 2025; boosting rounds chosen on the last 60 days of training with the same rule.',
      '<b>Models:</b> per technology one LightGBM point model and three quantile models, compared with persistence, clear-sky persistence and an isotonic power curve.'
    ],
    table: {
      label: 'Results · nRMSE (% of capacity), test period Mar–May 2025',
      head: ['Model', 'Solar (daytime)', 'Onshore wind', 'Offshore wind'],
      rows: [
        ['Persistence (same hour)', '12.55', '12.80', '26.08'],
        ['Strongest simple baseline', '12.60', '4.39', '11.11'],
        ['LightGBM', '*5.81', '*3.94', '*8.57'],
        ['Elia day-ahead (yardstick)', '5.05', '4.08', '8.85']
      ]
    },
    tools: ['Python', 'LightGBM', 'Quantile regression', 'pvlib', 'Pandas', 'Open-Meteo API'],
    repo: GH + '/Clean-energy-prediction'
  },

  'refinery': {
    tag: 'Process simulation · Heat integration',
    title: 'Heat-Integrated Crude & Vacuum Refinery Flowsheet',
    lede: 'A steady-state model of a 100 kbpd crude and vacuum distillation complex in DWSIM, built entirely by Python scripts, with a heat-recovery network that removes most of the fired-heater duty.',
    metrics: [
      ['Heat recovered', '112 MW', 'across 13 exchangers'],
      ['Heater duty', '−81%', '138.5 → 27.0 MW, crude train'],
      ['Balance', '100.000%', 'mass closure; sulphur in = out']
    ],
    body: [
      'Feed is a heavy, sour, salty Arab-Heavy-type crude (27.6 °API, 2.85 wt% sulphur). The flowsheet covers desalting, crude and vacuum distillation, light-ends recovery, amine treating, MEROX sweetening and Claus sulphur recovery with a tail-gas incinerator.',
      'Because every unit is created by script, the whole flowsheet can be rebuilt or changed without redrawing. Products include naphtha, kerosene, diesel, AGO, LVGO, HVGO, vacuum residue, propane, LPG, fuel gas and liquid sulphur.'
    ],
    steps: [
      '<b>Crude basis:</b> 19 real compounds and 11 pseudo-components with the Peng–Robinson property package.',
      '<b>Flash fix:</b> DWSIM’s default flash gave false all-vapour results above ~250 °C; switching to Nested Loops v2 resolved it.',
      '<b>Hybrid model:</b> cut-point splitter chains for the wide-boiling main columns, with rigorous debutanisers, deethaniser and depropaniser that all converge.',
      '<b>Heat integration:</b> 13 exchangers recover heat from product draws, debutaniser bottoms and the pre-fractionator overhead into three preheat trains (minimum approach 13.9 K).',
      '<b>Closing the loops:</b> real Recycle blocks for thermal recycles and the sulphur-unit feed; the firebox burns the plant’s own sweet fuel gas.'
    ],
    table: {
      label: 'Results · steady-state solution',
      head: ['Item', 'Utility-heated', 'Heat-integrated'],
      rows: [
        ['Crude-train heater duty', '138.5 MW', '*27.0 MW (−81%)'],
        ['Incl. 17.2 MW vacuum furnace', '155.7 MW', '*44.2 MW (−72%)'],
        ['Heat recovered', '–', '112.2 MW'],
        ['Minimum approach', '–', '13.9 K']
      ]
    },
    tools: ['DWSIM 10', 'Python', 'Peng–Robinson', 'Crude assay characterisation', 'Heat exchanger networks'],
    repo: CHEME + 'Crude%20and%20Vacuum%20Refinery%20Flowsheet%20with%20Heat%20Integration%20(DWSIM)'
  },

  'hx': {
    tag: 'Equipment design · Software',
    title: 'Shell-and-Tube Heat Exchanger Design Tool',
    lede: 'A Python package for preliminary thermal, hydraulic and mechanical design of shell-and-tube exchangers that rates a fixed geometry or searches for the smallest one meeting every constraint.',
    metrics: [
      ['Tests', '146', 'thermal, Bell–Delaware, CLI, web UI'],
      ['Design search', '240 → 48', 'tubes, every check passing'],
      ['Area', '14.4 m²', 'U = 516 W/m²K, sample case']
    ],
    body: [
      'It runs as a library, a JSON command-line tool, or a local web page with Design and Rate modes, live energy-balance checks and Excel report export. Inputs are strictly validated: inconsistent energy balances are rejected before any calculation.',
      'For the sample case (a process stream cooled 150 → 100 °C by water heated 20 → 80 °C), both outlet temperatures match specification to within 0.0001 K.'
    ],
    steps: [
      '<b>Thermal model:</b> duty, LMTD with F-correction, tube-side coefficients blended across the laminar–turbulent transition with Sieder–Tate correction; rating by effectiveness–NTU.',
      '<b>Shell side:</b> Bell–Delaware (Taborek/Serth) with the five J-factor corrections, window, cross-flow and end-zone pressure drops; Kern kept for comparison.',
      '<b>Hydraulics:</b> tube-side pressure drop with Colebrook–White friction plus return losses.',
      '<b>Design solver:</b> searches tube count, passes, shell diameter and baffle spacing under duty, outlet-temperature, pressure-drop and TEMA spacing limits.',
      '<b>Mechanical screening:</b> tube-sheet thickness, vortex-shedding vibration screen, cost proxy, text and Excel reports.'
    ],
    table: {
      label: 'Results · sample design case (501.6 kW duty)',
      head: ['Item', 'Value'],
      rows: [
        ['Selected geometry', '48 tubes (19.05 mm OD, 5 m), 4 passes, 0.22 m shell'],
        ['LMTD / F-correction', '74.9 K / 0.903'],
        ['h tube / h shell / U', '4,072 / 831 / 516 W/(m²K)'],
        ['Tube ΔP (limit 200 kPa)', '*14.2 kPa'],
        ['Shell ΔP (limit 100 kPa)', '*18.9 kPa']
      ]
    },
    tools: ['Python', 'NumPy', 'SciPy', 'pytest', 'openpyxl', 'Bell–Delaware', 'TEMA'],
    repo: GH + '/Shell-and-Tube-heat-exchanger-design'
  }
};

/* ---------- Theme ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
if (!localStorage_get('theme') && window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  localStorage_set('theme', next);
});
function localStorage_get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function localStorage_set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

/* ---------- Hero: type "Artificial Intelligence", hold, delete, repeat ---------- */
(() => {
  const t = document.getElementById('typedText');
  if (!t || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const full = t.textContent;
  const wrap = t.parentElement;
  const HOLD = 2300, GAP = 500;             // ms the full text stays, ms of empty pause before retyping
  const ERASE = 780;                       // ms to delete the whole phrase
  let i = 0;
  // reserve the full phrase's width (mono font, so 1ch per letter) so the line never
  // re-wraps mid-animation on narrow screens
  wrap.style.minWidth = `calc(${full.length}ch + .62em)`;
  t.textContent = '';

  // caret is solid while it moves and blinks while it waits
  const moving = on => wrap.classList.toggle('typing', on);

  function type() {
    moving(true);
    t.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(type, 45 + Math.random() * 55);
    else { moving(false); setTimeout(erase, HOLD); }
  }
  // deletion is paced against the clock, so timer lag can't stretch it past ERASE
  function erase() {
    moving(true);
    const start = performance.now(), from = i;
    (function tick() {
      const done = Math.min(1, (performance.now() - start) / ERASE);
      i = Math.round(from * (1 - done));
      t.textContent = full.slice(0, i);
      if (i > 0) requestAnimationFrame(tick);
      else { moving(false); setTimeout(type, GAP); }
    })();
  }
  setTimeout(type, 900);
})();

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  // siblings in the same grid cascade in instead of landing together
  const idx = [...el.parentElement.children].indexOf(el);
  el.style.transitionDelay = Math.min(idx, 4) * 60 + 'ms';
  revealObserver.observe(el);
});

/* ---------- Nav: background once scrolled, active section ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    let id = e.target.id === 'more' ? 'work' : e.target.id;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['work', 'more', 'experience', 'skills', 'about', 'contact'].forEach(id => {
  const s = document.getElementById(id); if (s) sectionObserver.observe(s);
});

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const setMenu = (open) => {
  navLinks.classList.toggle('open', open);
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
};
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navAnchors.forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (!nav.contains(e.target)) setMenu(false); });

/* ---------- Case-study dialog ---------- */
const modal = document.getElementById('modal');
const $ = id => document.getElementById(id);
let lastFocused = null;

function el(tag, html, cls) {
  const n = document.createElement(tag);
  if (html != null) n.innerHTML = html;
  if (cls) n.className = cls;
  return n;
}

function openProject(id) {
  const p = PROJECTS[id];
  if (!p) return;
  $('modalTag').textContent = p.tag;
  $('modalTitle').textContent = p.title;
  $('modalLede').textContent = p.lede;

  const m = $('modalMetrics'); m.innerHTML = '';
  p.metrics.forEach(([dt, dd, note]) => {
    const d = el('div');
    d.append(el('dt', dt), el('dd', dd), el('span', note));
    m.appendChild(d);
  });

  const c = $('modalContent'); c.innerHTML = '';
  p.body.forEach(par => { const n = el('p'); n.textContent = par; c.appendChild(n); });

  const s = $('modalSteps'); s.innerHTML = '';
  p.steps.forEach(step => s.appendChild(el('li', step)));

  const fig = $('modalFigure');
  if (p.figure) {
    $('modalFigImg').src = p.figure.src;
    $('modalFigImg').alt = p.figure.alt;
    $('modalFigCap').textContent = p.figure.caption;
    fig.hidden = false;
  } else {
    fig.hidden = true;
    $('modalFigImg').removeAttribute('src');
  }

  // table cells prefixed with * are highlighted as the headline result
  const t = $('modalTable'); t.innerHTML = '';
  $('modalTableLabel').textContent = p.table.label;
  const thead = el('thead'), hr = el('tr');
  p.table.head.forEach(h => { const th = el('th'); th.textContent = h; hr.appendChild(th); });
  thead.appendChild(hr);
  const tbody = el('tbody');
  p.table.rows.forEach(r => {
    const tr = el('tr');
    r.forEach(v => {
      const td = el('td');
      if (v.startsWith('*')) { td.className = 'hl'; v = v.slice(1); }
      td.textContent = v;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.append(thead, tbody);

  const tools = $('modalTools'); tools.innerHTML = '';
  p.tools.forEach(x => { const li = el('li'); li.textContent = x; tools.appendChild(li); });

  $('modalRepo').href = p.repo;

  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-panel').scrollTop = 0;
  modal.querySelector('.modal-close').focus();
}

function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (PROJECTS[location.hash.slice(1)]) history.replaceState(null, '', location.pathname + location.search);
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.proj').forEach(card => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.project); }
  });
});
modal.querySelectorAll('[data-close]').forEach(n => n.addEventListener('click', closeProject));
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeProject();
  if (e.key === 'Tab') {
    const f = [...modal.querySelectorAll('button, a[href]')];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
const openFromHash = () => { if (PROJECTS[location.hash.slice(1)]) openProject(location.hash.slice(1)); };
window.addEventListener('hashchange', openFromHash);
openFromHash();

/* ---------- Contact form (Web3Forms) ---------- */
const form = $('contactForm');
const formStatus = $('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('cfSubmit');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  formStatus.className = 'form-status';
  formStatus.textContent = '';
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Request failed');
    formStatus.textContent = 'Message sent. I usually reply within a day.';
    formStatus.classList.add('ok');
    form.reset();
  } catch (err) {
    formStatus.textContent = 'Something went wrong. Please email me directly at anantmukherjee.che@gmail.com.';
    formStatus.classList.add('err');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
});

/* ---------- GitHub contribution heatmap ---------- */
const GH_USER = 'voidsyntax-dev';

async function loadHeatmap() {
  const box = $('ghHeatmap');
  const totalEl = $('ghTotal');
  try {
    // data/contributions.json is refreshed nightly by .github/workflows/contributions.yml;
    // fall back to a public mirror of the GitHub calendar if it is missing
    let data = null;
    try {
      const local = await fetch('data/contributions.json', { cache: 'no-cache' });
      if (local.ok) data = await local.json();
    } catch (e) { /* not generated yet */ }
    if (!data || !data.contributions) {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`);
      if (!res.ok) throw new Error('Request failed');
      data = await res.json();
    }
    const days = data.contributions || [];
    if (!days.length) throw new Error('No data');

    const lead = new Date(days[0].date + 'T00:00:00').getDay();
    const cells = Array(lead).fill(null).concat(days);
    const weeks = Math.ceil(cells.length / 7);

    const months = el('div', null, 'heatmap-months');
    months.style.gridTemplateColumns = `repeat(${weeks}, var(--cell))`;
    let lastMonth = -1, lastLabelled = -3;
    for (let w = 0; w < weeks; w++) {
      const first = cells.slice(w * 7, w * 7 + 7).find(Boolean);
      const d = new Date(first.date + 'T00:00:00');
      const label = el('span');
      if (d.getMonth() !== lastMonth && w - lastLabelled >= 3 && w < weeks - 2) {
        label.textContent = d.toLocaleDateString('en-US', { month: 'short' });
        lastLabelled = w;
      }
      lastMonth = d.getMonth();
      months.appendChild(label);
    }

    const grid = el('div', null, 'heatmap-grid');
    grid.style.gridTemplateColumns = `repeat(${weeks}, var(--cell))`;
    cells.forEach(d => {
      const c = el('i');
      if (d) {
        c.className = 'l' + d.level;
        const when = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        c.title = `${d.count} contribution${d.count === 1 ? '' : 's'} on ${when}`;
      } else c.className = 'empty';
      grid.appendChild(c);
    });

    box.innerHTML = '';
    box.append(months, grid);
    const total = data.total && data.total.lastYear;
    if (total != null) totalEl.textContent = `${total} contribution${total === 1 ? '' : 's'} in the last year`;
    box.parentElement.scrollLeft = box.parentElement.scrollWidth;
  } catch (err) {
    box.innerHTML = '<p class="heatmap-status">Could not load contributions right now.</p>';
  }
}
loadHeatmap();
