const overlay = document.getElementById('createOverlay');
const closeCreate = document.getElementById('closeCreate');
const steps = [...document.querySelectorAll('.wizard-step')];
const progressSteps = [...document.querySelectorAll('.progress-step')];
let currentStep = 1;
let activeObjectButton = null;
let starterMode = false;

const t = (key) => window.tr ? window.tr(key) : key;
const objectSymbols = {
  'Bearing':'◉','Robot Arm':'⌁','AI Token':'◫','Laptop':'▰','Research Paper':'▤',
  'Battery':'▥','GPU':'▦','Machine Tool':'⌗','Digital Twin':'◎','Python':'⌘','Sensor':'◌',
  'Protein':'⬡','DNA':'⌇','Microscope':'⌕','Data':'▦','Model':'◇'
};

function objectLabel(key) { return t(key); }
function roleLabel(key) { return t(key); }

function openCreate() {
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showStep(1);
}
function closeWizard() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function showStep(step) {
  currentStep = step;
  steps.forEach(el => el.classList.toggle('active', String(el.dataset.step) === String(step)));
  if (typeof step === 'number') {
    progressSteps.forEach((el, idx) => {
      const n = idx + 1;
      el.classList.toggle('active', n === step);
      el.classList.toggle('done', n < step);
    });
  }
  document.querySelector('.wizard-body').scrollTop = 0;
}

document.querySelectorAll('[data-open-create]').forEach(btn => btn.addEventListener('click', openCreate));
closeCreate.addEventListener('click', closeWizard);
overlay.addEventListener('click', e => { if (e.target === overlay) closeWizard(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeWizard(); closeReplace(); } });

document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', () => {
  const next = Number(btn.dataset.next);
  if (next === 2) {
    const first = document.getElementById('firstName');
    const last = document.getElementById('lastName');
    if (!first.value.trim() || !last.value.trim()) { first.focus(); return; }
  }
  if (next === 4) syncPreview();
  showStep(next);
}));
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showStep(Number(btn.dataset.back))));

const browseButton = document.getElementById('browseButton');
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const addedSources = document.getElementById('addedSources');
const sourceState = [];

browseButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  [...fileInput.files].forEach(file => addSource('PDF', file.name));
  fileInput.value = '';
});
['dragenter','dragover'].forEach(eventName => uploadBox.addEventListener(eventName, e => { e.preventDefault(); uploadBox.style.borderColor = '#111617'; }));
['dragleave','drop'].forEach(eventName => uploadBox.addEventListener(eventName, e => { e.preventDefault(); uploadBox.style.borderColor = ''; }));
uploadBox.addEventListener('drop', e => [...e.dataTransfer.files].forEach(file => addSource('PDF', file.name)));

function addSource(type, label) {
  if (sourceState.some(s => s.label === label)) return;
  sourceState.push({ type, label });
  renderSources();
}
function renderSources() {
  addedSources.innerHTML = sourceState.map(s => `<div class="added-source"><span>${s.type}</span><b>${escapeHTML(s.label)}</b><small>✓</small></div>`).join('');
}
function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

document.getElementById('loadDemo').addEventListener('click', () => {
  [
    ['CV','Maya_Chen_CV.pdf'],
    ['PDF','Demo_Project.pdf'],
    ['PDF','Predictive_Maintenance_Study.pdf'],
    ['GH','github.com/demo/research-project']
  ].forEach(([type,label]) => addSource(type,label));
  document.getElementById('scholarInput').value = 'https://scholar.google.com/demo';
  document.getElementById('githubInput').value = 'https://github.com/demo';
});

document.getElementById('skipSources').addEventListener('click', () => runAnalysis(true));

document.getElementById('analyzeButton').addEventListener('click', () => runAnalysis(false));

function collectLinks() {
  const links = [
    ['GS', document.getElementById('scholarInput').value],
    ['GH', document.getElementById('githubInput').value],
    ['WEB', document.getElementById('websiteInput').value]
  ];
  links.forEach(([type, value]) => { if (value.trim()) addSource(type, value.trim()); });
}

function runAnalysis(forceStarter=false) {
  if (!forceStarter) collectLinks();
  starterMode = forceStarter || sourceState.length === 0;
  showStep('loading');

  const statuses = starterMode ? [
    ['Using your research identity...', 18, 'Creating a starter profile from role and field.'],
    ['Mapping research themes...', 38, 'Grouping recurring topics and research problems.'],
    ['Connecting methods and objects...', 60, 'Linking methods to physical systems and projects.'],
    ['Ranking signature elements...', 80, 'Scoring relevance, uniqueness and visual meaning.'],
    ['Building your Research DNA...', 96, 'Preparing a profile you can review and edit.']
  ] : [
    ['Reading publications...', 18, 'Extracting research topics, methods and recurring objects.'],
    ['Mapping research themes...', 38, 'Grouping recurring topics and research problems.'],
    ['Connecting methods and objects...', 60, 'Linking methods to physical systems and projects.'],
    ['Ranking signature elements...', 80, 'Scoring relevance, uniqueness and visual meaning.'],
    ['Building your Research DNA...', 96, 'Preparing a profile you can review and edit.']
  ];

  let i = 0;
  const statusEl = document.getElementById('analysisStatus');
  const subEl = document.getElementById('analysisSubstatus');
  const bar = document.getElementById('analysisBar');
  bar.style.width = '5%';
  const timer = setInterval(() => {
    const [title, pct, sub] = statuses[i];
    statusEl.textContent = t(title);
    subEl.textContent = t(sub);
    bar.style.width = pct + '%';
    i += 1;
    if (i >= statuses.length) {
      clearInterval(timer);
      setTimeout(() => {
        syncResearchDNA();
        showStep(3);
      }, 360);
    }
  }, 420);
}

function getStarterProfile(fieldRaw) {
  const field = fieldRaw.toLowerCase();
  if (/robot|autonom|control/.test(field)) {
    return {
      identity: 'Robotics Researcher',
      focus: 'Robotics · Motion Planning', methods: 'Control · Learning',
      objectsText: 'Robot Arm · Sensor · Controller', flagship: 'Robot System',
      objects: ['Robot Arm','Sensor','AI Token','Laptop','Research Paper']
    };
  }
  if (/bio|life science|protein|genom|cell/.test(field)) {
    return {
      identity: 'Life Science Researcher',
      focus: 'Molecular & Cellular Research', methods: 'Experimental Analysis · Modeling',
      objectsText: 'Protein · DNA · Microscope', flagship: 'Molecular System',
      objects: ['Research Paper','Laptop','Sensor','AI Token','Python']
    };
  }
  if (/industrial|phm|predict|maintenance|rul|prognostic/.test(field)) {
    return {
      identity: 'Industrial AI Researcher',
      focus: 'Predictive Maintenance · Remaining Useful Life', methods: 'Transformer · Representation Learning',
      objectsText: 'Bearing · Robot · Battery', flagship: starterMode ? 'Starter Concept' : 'Demo Project',
      objects: ['Bearing','Robot Arm','AI Token','Laptop','Research Paper']
    };
  }
  if (/ai|machine learning|computer science|data|deep learning/.test(field)) {
    return {
      identity: 'AI Systems',
      focus: 'Machine Learning · Representation Learning', methods: 'Transformer · Deep Learning',
      objectsText: 'Model · Data · Compute', flagship: 'Starter Concept',
      objects: ['AI Token','GPU','Laptop','Python','Research Paper']
    };
  }
  return {
    identity: 'Researcher', focus: 'Research Problems · Methods', methods: 'Analysis · Experimentation',
    objectsText: 'Data · Model · Paper', flagship: 'Research Project',
    objects: ['Laptop','Research Paper','AI Token','Sensor','Python']
  };
}

function setSignatureObjects(objects) {
  const buttons = [...document.querySelectorAll('#selectableObjects button')];
  buttons.forEach((btn, idx) => {
    const obj = objects[idx] || objects[0];
    btn.dataset.object = obj;
    btn.querySelector('b').textContent = objectLabel(obj);
    btn.querySelector('small').textContent = starterMode ? t('Inferred · AI suggested') : (idx === 0 ? t('Verified · 8 sources') : idx === 1 ? t('Verified · 3 sources') : idx === 4 ? t('Verified · 24 sources') : t('Inferred · AI suggested'));
    const art = btn.querySelector('.select-art');
    art.className = 'select-art text-art';
    art.textContent = objectSymbols[obj] || '◆';
  });
}

function syncResearchDNA(resetObjects=true) {
  const role = document.getElementById('role').value;
  const field = document.getElementById('field').value.trim() || 'Research';
  const profile = getStarterProfile(field);
  const identity = starterMode ? t(profile.identity) : (role === 'PhD Researcher' ? `${field} ${t('Researcher')}` : `${roleLabel(role)} · ${field}`);

  document.getElementById('resultIdentity').textContent = identity;
  document.getElementById('resultField').textContent = field;
  document.getElementById('resultFocus').textContent = t(profile.focus);
  document.getElementById('resultMethods').textContent = t(profile.methods);
  document.getElementById('resultObjects').textContent = t(profile.objectsText);
  document.getElementById('resultFlagship').textContent = t(profile.flagship);
  document.getElementById('resultGrounding').textContent = t(starterMode ? 'starter profile · not source-verified' : 'grounded in provided sources');
  document.getElementById('successIdentity').textContent = identity;

  document.getElementById('statPublications').textContent = starterMode ? '0' : '24';
  document.getElementById('statThemes').textContent = starterMode ? '3' : '6';
  document.getElementById('statMethods').textContent = starterMode ? '4' : '11';
  document.getElementById('statObjects').textContent = starterMode ? '5' : '8';
  if (resetObjects) setSignatureObjects(profile.objects);
}

const replacePopover = document.getElementById('replacePopover');
document.querySelectorAll('#selectableObjects button').forEach(btn => btn.addEventListener('click', () => {
  activeObjectButton = btn;
  replacePopover.classList.add('open');
  replacePopover.setAttribute('aria-hidden', 'false');
}));
document.getElementById('closeReplace').addEventListener('click', closeReplace);
replacePopover.addEventListener('click', e => { if (e.target === replacePopover) closeReplace(); });
function closeReplace() { replacePopover.classList.remove('open'); replacePopover.setAttribute('aria-hidden','true'); }

document.querySelectorAll('[data-replacement]').forEach(btn => btn.addEventListener('click', () => {
  if (!activeObjectButton) return;
  const replacement = btn.dataset.replacement;
  activeObjectButton.dataset.object = replacement;
  activeObjectButton.querySelector('b').textContent = objectLabel(replacement);
  activeObjectButton.querySelector('small').textContent = t('User selected · editable');
  const art = activeObjectButton.querySelector('.select-art');
  art.className = 'select-art text-art';
  art.textContent = objectSymbols[replacement] || '◆';
  closeReplace();
}));

function syncPreview() {
  const first = document.getElementById('firstName').value.trim() || t('Researcher');
  const last = document.getElementById('lastName').value.trim();
  const role = document.getElementById('role').value;
  const field = document.getElementById('field').value.trim() || 'Research';
  document.getElementById('previewName').textContent = `${first} ${last}`.trim().toUpperCase();
  document.getElementById('previewRole').textContent = `${roleLabel(role)} · ${field}`.toUpperCase();
  document.getElementById('previewField').textContent = field;
  const objects = [...document.querySelectorAll('#selectableObjects button')].map(b => b.dataset.object);
  document.getElementById('previewObjects').innerHTML = objects.slice(0,4).map(o => `<span>${objectSymbols[o] || '◆'}<small>${escapeHTML(objectLabel(o).replace(' Arm',''))}</small></span>`).join('');
}

function refreshDynamicLanguage() {
  if (currentStep === 3 || currentStep === 4 || currentStep === 'success') {
    const buttons = [...document.querySelectorAll('#selectableObjects button')];
    buttons.forEach(btn => {
      btn.querySelector('b').textContent = objectLabel(btn.dataset.object);
      if (btn.querySelector('small').textContent.includes('User selected') || btn.querySelector('small').textContent.includes('用户选择') || btn.querySelector('small').textContent.includes('Choisi')) {
        btn.querySelector('small').textContent = t('User selected · editable');
      }
    });
    syncResearchDNA(false);
    if (currentStep === 4) syncPreview();
  }
}
window.addEventListener('researchdna:language', refreshDynamicLanguage);

document.getElementById('orderButton').addEventListener('click', () => showStep('success'));
document.getElementById('restartButton').addEventListener('click', () => showStep(1));
document.getElementById('closeSuccess').addEventListener('click', closeWizard);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
