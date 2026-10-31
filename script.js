/* =========================================================
   Anant Mukherjee — portfolio scripts
   ========================================================= */

/* ---------- Project data (drives the modal) ---------- */
const PROJECTS = {
  "soft-sensor": {
    title: "Soft Sensor for Ethylbenzene Production",
    tag: "Chemical Engineering · Machine Learning",
    tagClass: "tag-cheme",
    img: "images/soft-sensor.webp",
    imgAlt: "Continuous stirred-tank reactor diagram",
    figure: {
      src: "images/soft-sensor-result.webp",
      alt: "Line chart of true versus predicted outlet ethylbenzene fraction over 60 hours of held-out data",
      caption: "Held-out data, hours 140–200: true outlet ethylbenzene fraction (blue) against the MLP soft sensor’s prediction (orange)."
    },
    repo: "https://github.com/voidsyntax-dev/Chemical-Engineering-Projects/tree/main/Soft%20Sensor%20for%20Ethylbenzene%20Production",
    body: [
      "The outlet composition of an ethylbenzene CSTR is difficult to measure online with analyzers — slow, expensive and high-maintenance. This project builds a soft sensor that infers it in real time from readily available measurements: temperatures, pressures, flows and controller setpoints.",
      "Training data was generated from a first-principles Aspen Dynamics model, driving it with randomized setpoint and feed changes to cover realistic operating regimes. Lag features were engineered within continuous data segments, and a time-ordered 70/30 split was used so correlated samples could never leak across the train/test boundary.",
      "Seven model families were compared — baseline, Ridge, PLS, random forest, SVR, MLP and gradient boosting — and the selected MLP models were packaged with their scalers, feature lists and lag settings, ready for deployment against a live simulator."
    ],
    tools: ["Aspen Dynamics", "Python", "NumPy", "Pandas", "scikit-learn", "Time-series validation"],
    results: [
      "R² of 0.979 for ETBENZ on held-out data",
      "R² of 0.892 for D-ETBENZ on held-out data",
      "Leakage-free, time-ordered 70/30 validation across 7 model families",
      "Deployment-ready models saved with scalers, features and lag settings"
    ]
  },
  "predictive": {
    title: "Predictive Maintenance of Milling Machine",
    tag: "Machine Learning · Classification",
    tagClass: "tag-ml",
    img: "images/predictive-maintenance.webp",
    imgAlt: "Industrial CNC milling machine",
    figure: {
      src: "images/predictive-maintenance-result.webp",
      alt: "ROC curve and precision-recall curve for the gradient boosting failure classifier",
      caption: "ROC and precision–recall curves of the gradient boosting classifier on the chronological hold-out set."
    },
    repo: "https://github.com/voidsyntax-dev/Chemical-Engineering-Projects/tree/main/Predictive%20Maintenance%20of%20Milling%20Machine",
    body: [
      "Unplanned machine failures are expensive, but so are false alarms. This project frames milling-machine maintenance as a binary failure classification problem over 10,000 industrial machine records with a heavily imbalanced target (3.4% failure rate).",
      "Physics-informed features were engineered — temperature difference, mechanical power and torque-to-speed ratio — and a gradient boosting classifier was trained inside a leakage-free pipeline, evaluated on a chronological hold-out set to mimic real deployment.",
      "The operating point was chosen by expected-cost minimisation, treating a missed failure as ten times costlier than a false alarm, and seven resampling strategies were benchmarked to handle the class imbalance."
    ],
    tools: ["Python", "scikit-learn", "Gradient boosting", "Feature engineering", "Imbalanced learning"],
    results: [
      "PR-AUC 0.905 and ROC-AUC 0.973 on a chronological hold-out set",
      "Catches 84% of failures at 95% precision",
      "Decision threshold set by expected-cost minimisation (missed failure = 10× false alarm)",
      "Seven resampling strategies compared for the 3.4% failure rate"
    ]
  },
  "lunar": {
    title: "Lunar Lander: Centred Landings with PPO",
    tag: "Reinforcement Learning · PPO",
    tagClass: "tag-rl",
    img: "images/lunar-lander.webp",
    imgAlt: "Lunar lander on the surface of the Moon",
    repo: "https://github.com/voidsyntax-dev/CSE-Projects/tree/main/Lunar%20Lander",
    body: [
      "A standard Lunar Lander agent learns to land anywhere on the pad. This project trains a Proximal Policy Optimization (PPO) agent with a modified objective: land gently, upright, and at the centre of the pad — the behaviour you'd actually want on a real mission.",
      "Training was run with Stable-Baselines3 on the Gymnasium environment, with reward shaping that penalises horizontal drift from the pad centre so the policy learns precision, not just survival. Checkpoints were evaluated over 200 fixed seeds, with and without wind."
    ],
    tools: ["Python", "Stable-Baselines3", "Gymnasium", "PPO", "Reward shaping"],
    results: [
      "Best checkpoint solves 84% of 200 evaluation seeds",
      "Lands on the pad centre in 18 of 200 runs without wind",
      "Stable performance evaluated across fixed seed sets"
    ]
  },
  "skillsetu": {
    title: "SkillSetu",
    tag: "Full-Stack Web · AI",
    tagClass: "tag-web",
    img: "images/skillsetu.webp",
    imgAlt: "SkillSetu learning dashboard",
    repo: "https://github.com/voidsyntax-dev/CSE-Projects/tree/main/SkillSetu",
    body: [
      "SkillSetu (literally 'bridge of skills') is a full-stack AI career-learning platform that maps careers to the skills, resources and assessments needed to reach them — closing the gap between 'what should I learn' and 'how do I get there'.",
      "The platform ships 15+ production-ready modules built on a modern Next.js 15 + React 19 stack with Prisma and PostgreSQL. Adaptive algorithms estimate skill mastery, model forgetting with Ebbinghaus-based skill decay, and score career readiness over time.",
      "A RAG-based AI tutor, grounded in curated study material via Gemini 1.5 Flash, answers learner questions in context, and D3.js visualisations render learning paths and progress."
    ],
    tools: ["Next.js 15", "React 19", "Prisma", "PostgreSQL", "Gemini 1.5 Flash", "D3.js", "RAG"],
    results: [
      "15+ production-ready modules on a single platform",
      "Adaptive mastery estimation with Ebbinghaus-based skill decay",
      "Career-readiness scoring across mapped skill paths",
      "RAG-based AI tutor grounded in curated study material"
    ]
  },
  "cdu": {
    title: "Crude Distillation Unit Simulation",
    tag: "Chemical Engineering · Process Design",
    tagClass: "tag-cheme",
    img: "images/cdu.svg",
    imgAlt: "Schematic of the crude distillation unit: preheat train, furnace, atmospheric column with kerosene, diesel and AGO side draws",
    repo: "https://github.com/voidsyntax-dev/Chemical-Engineering-Projects/tree/main/Crude%20Distillation%20Unit",
    body: [
      "Front-end separation sets the energy budget of an entire refinery, so this project simulates a complete 4.5 MMTPA atmospheric crude distillation unit in Aspen HYSYS — from tankage to atmospheric gas oil.",
      "The flowsheet spans a crude preheat train, a fired furnace, a preflash column, two debutanisers stripping light gases from naphtha, and an atmospheric column with three side draws producing kerosene, diesel and AGO.",
      "The crude was characterised with a 61-cut assay, and mass balances were closed across all separation sections to 0.0001%. The simulation quantified 165.6 MW of heat input and identified roughly 56 MW of recoverable heat by integrating hot atmospheric product streams against the cold crude preheat train."
    ],
    tools: ["Aspen HYSYS V15", "Crude assay (61-cut)", "Heat integration analysis", "Refinery process design"],
    results: [
      "Full 4.5 MMTPA atmospheric unit simulated end-to-end",
      "Mass balances closed to 0.0001% across all separation sections",
      "165.6 MW of fired heat input quantified",
      "≈56 MW of heat integration potential identified in the preheat train"
    ]
  },
  "biodiesel": {
    title: "Biodiesel Production Plant Simulation",
    tag: "Chemical Engineering · Process Design",
    tagClass: "tag-cheme",
    img: "images/biodiesel.webp",
    imgAlt: "Biodiesel production plant flow diagram",
    repo: "https://github.com/voidsyntax-dev/Chemical-Engineering-Projects/tree/main/Biodiesel%20production%20Unit",
    body: [
      "A continuous, alkali-catalysed (KOH) transesterification plant was designed and simulated in Aspen Plus to convert 1,050 kg/h of vegetable oil into biodiesel (FAME) meeting fuel-quality standards.",
      "The flowsheet couples reaction, methanol recovery through recycle loops, and product purification. Vacuum columns carry about 75% of the separation duty, keeping thermal exposure of the ester product low, while recycled methanol is recovered at high rates to cut fresh make-up.",
      "The final FAME product was verified against EN 14214 limits, confirming the process design delivers on-spec fuel, not just conversion."
    ],
    tools: ["Aspen Plus V15", "Transesterification kinetics", "Recycle convergence", "EN 14214 specification"],
    results: [
      "96.4% one-pass ester conversion at 1,050 kg/h oil feed",
      "94.0% methanol recovery through recycle loops",
      "FAME product verified at 99.7 wt% ester content (EN 14214)",
      "Net heating duty of ≈125 kW with vacuum columns at 75% of separation duty"
    ]
  }
};

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Nav border once scrolled ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- Project modal ---------- */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalTools = document.getElementById('modalTools');
const modalResults = document.getElementById('modalResults');
const modalRepo = document.getElementById('modalRepo');
const modalFigure = document.getElementById('modalFigure');
const modalFigImg = document.getElementById('modalFigImg');
const modalFigCap = document.getElementById('modalFigCap');
let lastFocused = null;

function openProject(id) {
  const p = PROJECTS[id];
  if (!p) return;
  modalImg.src = p.img;
  modalImg.alt = p.imgAlt;
  modalTag.textContent = p.tag;
  modalTag.className = 'proj-tag ' + p.tagClass;
  modalTitle.textContent = p.title;
  modalContent.innerHTML = '';
  p.body.forEach(par => {
    const el = document.createElement('p');
    el.textContent = par;
    modalContent.appendChild(el);
  });
  modalTools.innerHTML = '';
  p.tools.forEach(t => {
    const chip = document.createElement('span');
    chip.textContent = t;
    modalTools.appendChild(chip);
  });
  modalResults.innerHTML = '';
  p.results.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    modalResults.appendChild(li);
  });
  if (p.figure) {
    modalFigImg.src = p.figure.src;
    modalFigImg.alt = p.figure.alt;
    modalFigCap.textContent = p.figure.caption;
    modalFigure.hidden = false;
  } else {
    modalFigure.hidden = true;
    modalFigImg.removeAttribute('src');
  }
  modalRepo.href = p.repo;
  // Each project gets a shareable URL, e.g. …/portfolio/#lunar
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  lastFocused = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();
}

function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (PROJECTS[location.hash.slice(1)]) history.replaceState(null, '', location.pathname + location.search);
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => openProject(card.dataset.project));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.project); }
  });
});
modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeProject));
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeProject();
  // Keep Tab cycling inside the open dialog
  if (e.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button, a[href]')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// Open a project straight from a shared link
const openFromHash = () => { if (PROJECTS[location.hash.slice(1)]) openProject(location.hash.slice(1)); };
window.addEventListener('hashchange', openFromHash);
openFromHash();

/* ---------- Contact form (Web3Forms) ---------- */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('cfSubmit');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  formStatus.className = 'form-status';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      formStatus.textContent = 'Message sent — I usually reply within a day.';
      formStatus.classList.add('ok');
      form.reset();
    } else {
      throw new Error('Request failed');
    }
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
  const el = document.getElementById('ghHeatmap');
  const totalEl = document.getElementById('ghTotal');
  try {
    // data/contributions.json is refreshed nightly by .github/workflows/contributions.yml;
    // until that has run, fall back to a public mirror of the GitHub calendar
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

    // Pad the first week so each column runs Sunday → Saturday
    const lead = new Date(days[0].date + 'T00:00:00').getDay();
    const cells = Array(lead).fill(null).concat(days);
    const weeks = Math.ceil(cells.length / 7);

    const months = document.createElement('div');
    months.className = 'heatmap-months';
    months.style.gridTemplateColumns = `repeat(${weeks}, var(--cell))`;
    let lastMonth = -1;
    let lastLabelled = -3;
    for (let w = 0; w < weeks; w++) {
      const first = cells.slice(w * 7, w * 7 + 7).find(Boolean);
      const m = new Date(first.date + 'T00:00:00').getMonth();
      const label = document.createElement('span');
      // A label needs ~3 columns of room, so skip one that would collide with the previous
      if (m !== lastMonth && w - lastLabelled >= 3 && w < weeks - 2) {
        label.textContent = new Date(first.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
        lastLabelled = w;
      }
      lastMonth = m;
      months.appendChild(label);
    }

    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.gridTemplateColumns = `repeat(${weeks}, var(--cell))`;
    cells.forEach(d => {
      const c = document.createElement('i');
      if (d) {
        c.className = 'l' + d.level;
        const when = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        c.title = `${d.count} contribution${d.count === 1 ? '' : 's'} on ${when}`;
      } else {
        c.className = 'empty';
      }
      grid.appendChild(c);
    });

    el.innerHTML = '';
    el.append(months, grid);
    const total = data.total && data.total.lastYear;
    if (total != null) totalEl.textContent = `${total} contribution${total === 1 ? '' : 's'} in the last year`;
    el.parentElement.scrollLeft = el.parentElement.scrollWidth;
  } catch (err) {
    el.innerHTML = '<p class="heatmap-status">Could not load contributions right now.</p>';
  }
}
loadHeatmap();
