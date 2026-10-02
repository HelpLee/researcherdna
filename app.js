const overlay = document.getElementById('createOverlay');
const closeCreate = document.getElementById('closeCreate');
const steps = [...document.querySelectorAll('.wizard-step')];
const progressSteps = [...document.querySelectorAll('.progress-step')];
const sourceState = [];
let currentStep = 1;
let starterMode = false;
let currentProfile = null;
let selectedObjects = new Set();
let toastTimer = null;

const t = (key) => window.tr ? window.tr(key) : key;
const objectSymbols = {
  'Robot Arm':'⌁','Large Language Model':'LLM','Digital Twin':'◎','Vision System':'◉','Sensor Network':'◌',
  'GPU':'▦','Dataset':'▥','Research Paper':'▤','Neural Network':'◇','Simulation World':'◈',
  'Protein Structure':'⬡','DNA':'⌇','Microscope':'⌕','Cell Model':'◍','Genome':'≋','Imaging System':'▣',
  'AI Agent':'A·I','GitHub Repository':'GH','Controller':'⌘','Research Instrument':'⌗','Experiment':'✦','Lab Notebook':'▧','Telescope':'◉','Satellite':'✧'
};

const profiles = {
  robotics: {
    identity:'AI & Robotics Researcher',
    focus:'Robotics · Intelligent Systems · Digital Twins',
    methods:'Transformers · Representation Learning · Control',
    systems:'Robot · Large Language Model · Digital Twin',
    flagship:'AI-enabled autonomous systems',
    words:['Robotics','Large Language Models','Digital Twin','Multimodal AI','Representation Learning','Vision','Planning','Foundation Models','Simulation','Control'],
    candidates:[
      ['Robot Arm','Verified · papers + projects'],['Large Language Model','Verified · papers + GitHub'],['Digital Twin','Verified · projects + CV'],['Vision System','Inferred · papers + code'],['Sensor Network','Verified · project evidence'],['GPU','Inferred · GitHub workflow'],['Dataset','Verified · papers + repositories'],['Research Paper','Verified · publication record'],['Neural Network','Inferred · methods across sources'],['Simulation World','Verified · projects + code']
    ]
  },
  life: {
    identity:'Life Science Researcher',
    focus:'Molecular Systems · Computational Biology',
    methods:'Experimental Analysis · Modeling · Machine Learning',
    systems:'Protein · DNA · Imaging System',
    flagship:'Computational life-science system',
    words:['Protein','Genomics','Cell Biology','Microscopy','Machine Learning','Molecular Systems','Imaging','DNA','Computational Biology','Experiment'],
    candidates:[
      ['Protein Structure','Verified · papers + figures'],['DNA','Verified · research topics'],['Microscope','Verified · methods + projects'],['Cell Model','Verified · papers'],['Genome','Verified · publication evidence'],['Imaging System','Verified · methods'],['Dataset','Verified · data sources'],['Research Paper','Verified · publication record'],['Neural Network','Inferred · computational methods'],['Lab Notebook','Inferred · research workflow']
    ]
  },
  ai: {
    identity:'AI Systems Researcher',
    focus:'Foundation Models · Multimodal AI · Intelligent Systems',
    methods:'Transformers · Representation Learning · Deep Learning',
    systems:'Large Language Model · AI Agent · Compute',
    flagship:'Foundation-model research system',
    words:['Large Language Models','Foundation Models','Multimodal AI','Transformers','Representation Learning','Agents','Reasoning','Data','Evaluation','Open Source'],
    candidates:[
      ['Large Language Model','Verified · papers + code'],['Neural Network','Verified · methods across sources'],['GPU','Inferred · GitHub workflow'],['Dataset','Verified · papers + repositories'],['AI Agent','Verified · projects + code'],['GitHub Repository','Verified · repository evidence'],['Research Paper','Verified · publication record'],['Vision System','Inferred · multimodal research'],['Digital Twin','Inferred · linked projects'],['Robot Arm','Inferred · embodied-AI direction']
    ]
  },
  general: {
    identity:'Researcher',
    focus:'Research Questions · Systems · Contributions',
    methods:'Analysis · Experimentation · Modeling',
    systems:'Research Instrument · Data · Model',
    flagship:'Research project',
    words:['Research','Methods','Experiment','Data','Model','System','Evidence','Project','Collaboration','Publication'],
    candidates:[
      ['Research Paper','Verified · publication record'],['Dataset','Verified · research sources'],['Research Instrument','Verified · project evidence'],['Experiment','Verified · methods'],['Neural Network','Inferred · computational methods'],['Simulation World','Inferred · modeling evidence'],['Sensor Network','Inferred · project evidence'],['GitHub Repository','Verified · repository evidence'],['Lab Notebook','Inferred · research workflow'],['Digital Twin','Inferred · system-level theme']
    ]
  }
};

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
function roleLabel(key){ return t(key); }
function objectLabel(key){ return t(key); }
function showToast(message){
  const el = document.getElementById('selectionToast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

function openCreate(){
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  showStep(1);
}
function closeWizard(){
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
function showStep(step){
  currentStep = step;
  steps.forEach(el => el.classList.toggle('active', String(el.dataset.step) === String(step)));
  if(typeof step === 'number'){
    progressSteps.forEach((el,idx)=>{
      const n=idx+1;
      el.classList.toggle('active',n===step);
      el.classList.toggle('done',n<step);
    });
  }
  document.querySelector('.wizard-body').scrollTop=0;
}

document.querySelectorAll('[data-open-create]').forEach(btn=>btn.addEventListener('click',openCreate));
closeCreate.addEventListener('click',closeWizard);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeWizard();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeWizard();});

document.querySelectorAll('[data-next]').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.disabled) return;
  const next=Number(btn.dataset.next);
  if(next===2){
    const first=document.getElementById('firstName');
    const last=document.getElementById('lastName');
    if(!first.value.trim()||!last.value.trim()){first.focus();return;}
  }
  if(next===4){
    if(selectedObjects.size<3||selectedObjects.size>5){showToast(t('Please select 3–5 signature objects.'));return;}
    syncPreview();
  }
  showStep(next);
}));
document.querySelectorAll('[data-back]').forEach(btn=>btn.addEventListener('click',()=>showStep(Number(btn.dataset.back))));

const browseButton=document.getElementById('browseButton');
const fileInput=document.getElementById('fileInput');
const uploadBox=document.getElementById('uploadBox');
const addedSources=document.getElementById('addedSources');

browseButton.addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',()=>{[...fileInput.files].forEach(file=>addSource(file.name.toLowerCase().includes('cv')?'CV':'PDF',file.name));fileInput.value='';});
['dragenter','dragover'].forEach(name=>uploadBox.addEventListener(name,e=>{e.preventDefault();uploadBox.style.borderColor='#17132d';}));
['dragleave','drop'].forEach(name=>uploadBox.addEventListener(name,e=>{e.preventDefault();uploadBox.style.borderColor='';}));
uploadBox.addEventListener('drop',e=>[...e.dataTransfer.files].forEach(file=>addSource(file.name.toLowerCase().includes('cv')?'CV':'PDF',file.name)));

function addSource(type,label){
  if(!label||sourceState.some(s=>s.label===label))return;
  sourceState.push({type,label});
  renderSources();
}
function renderSources(){
  addedSources.innerHTML=sourceState.map(s=>`<div class="added-source"><span>${escapeHTML(s.type)}</span><b>${escapeHTML(s.label)}</b><small>✓</small></div>`).join('');
}

document.getElementById('loadDemo').addEventListener('click',()=>{
  [['CV','Lahoule_Lee_CV.pdf'],['PDF','Selected_AI_Robotics_Papers.pdf'],['PDF','Digital_Twin_Project.pdf'],['GH','github.com/lahoule/research-demo']].forEach(([type,label])=>addSource(type,label));
  document.getElementById('scholarInput').value='https://scholar.google.com/demo-lahoule';
  document.getElementById('githubInput').value='https://github.com/lahoule';
  document.getElementById('researchGateInput').value='https://researchgate.net/profile/lahoule-lee';
});

document.getElementById('skipSources').addEventListener('click',()=>runAnalysis(true));
document.getElementById('analyzeButton').addEventListener('click',()=>runAnalysis(false));

function collectLinks(){
  [['GS',document.getElementById('scholarInput').value],['GH',document.getElementById('githubInput').value],['RG',document.getElementById('researchGateInput').value],['WEB',document.getElementById('websiteInput').value]].forEach(([type,value])=>{if(value.trim())addSource(type,value.trim());});
}

function runAnalysis(forceStarter=false){
  if(!forceStarter)collectLinks();
  starterMode=forceStarter||sourceState.length===0;
  showStep('loading');
  const statuses=starterMode?[
    ['Using your research identity...',18,'Creating a starter profile from role and field.'],
    ['Building a research word cloud...',38,'Finding recurring themes and research concepts.'],
    ['Connecting methods and systems...',60,'Linking methods to projects and research systems.'],
    ['Ranking traceable objects...',80,'Preparing ten candidates by relevance and visual meaning.'],
    ['Building your Researcher DNA...',96,'Preparing a profile you can review and edit.']
  ]:[
    ['Reading research sources...',18,'Extracting topics, methods, systems and recurring ideas.'],
    ['Building a research word cloud...',38,'Connecting signals across papers, code and profiles.'],
    ['Connecting methods and systems...',60,'Linking methods to projects and research systems.'],
    ['Ranking traceable objects...',80,'Preparing ten candidates with evidence trails.'],
    ['Building your Researcher DNA...',96,'Preparing a profile you can review and edit.']
  ];
  let i=0;
  const statusEl=document.getElementById('analysisStatus');
  const subEl=document.getElementById('analysisSubstatus');
  const bar=document.getElementById('analysisBar');
  bar.style.width='5%';
  const timer=setInterval(()=>{
    const [title,pct,sub]=statuses[i];
    statusEl.textContent=t(title);subEl.textContent=t(sub);bar.style.width=pct+'%';i+=1;
    if(i>=statuses.length){clearInterval(timer);setTimeout(()=>{syncResearcherDNA();showStep(3);},320);}
  },360);
}

function resolveProfile(fieldRaw){
  const field=(fieldRaw||'').toLowerCase();
  if(/bio|life science|protein|genom|cell|medical|medicine/.test(field))return profiles.life;
  if(/robot|autonom|control|digital twin|industrial|phm|predict|maintenance|rul|prognostic/.test(field))return profiles.robotics;
  if(/ai|machine learning|computer science|data|deep learning|language|llm|foundation/.test(field))return profiles.ai;
  return profiles.general;
}

function renderWordCloud(words){
  const sizeClasses=['w-xl','w-lg','w-md','w-md','w-sm','w-sm','w-xs','w-xs','w-sm','w-xs'];
  const colorClasses=['','coral','','blue','','mint','','','yellow',''];
  document.getElementById('dynamicWordCloud').innerHTML=words.map((word,i)=>`<span class="${sizeClasses[i]||'w-xs'} ${colorClasses[i]||''}">${escapeHTML(t(word))}</span>`).join('');
}

function renderCandidates(candidates,reset=true){
  if(reset){selectedObjects=new Set(candidates.slice(0,3).map(([name])=>name));}
  const root=document.getElementById('candidateObjects');
  root.innerHTML=candidates.map(([name,trace],idx)=>{
    const selected=selectedObjects.has(name);
    const symbol=objectSymbols[name]||'◆';
    const textClass=/^[A-Za-z·]{2,5}$/.test(symbol)?' text':'';
    return `<button type="button" class="candidate-object${selected?' selected':''}" data-object="${escapeHTML(name)}" aria-pressed="${selected?'true':'false'}"><span class="candidate-check">${selected?'✓':'+'}</span><span class="candidate-art${textClass}">${escapeHTML(symbol)}</span><b>${escapeHTML(objectLabel(name))}</b><small>${escapeHTML(t(trace))}</small><em>✓ ${escapeHTML(t('Traceable evidence'))}</em></button>`;
  }).join('');
  root.querySelectorAll('.candidate-object').forEach(btn=>btn.addEventListener('click',()=>toggleCandidate(btn.dataset.object)));
  updateSelectionUI();
}

function toggleCandidate(name){
  if(selectedObjects.has(name)){
    selectedObjects.delete(name);
  }else{
    if(selectedObjects.size>=5){showToast(t('You can select up to 5 objects.'));return;}
    selectedObjects.add(name);
  }
  renderCandidates(currentProfile.candidates,false);
}
function updateSelectionUI(){
  const count=selectedObjects.size;
  document.getElementById('selectionCount').textContent=count;
  document.getElementById('selectionHint').textContent=t(count<3?'Select at least 3':'Choose 3–5');
  document.getElementById('continueDesign').disabled=count<3||count>5;
}

function syncResearcherDNA(resetObjects=true){
  const role=document.getElementById('role').value;
  const field=document.getElementById('field').value.trim()||'Research';
  currentProfile=resolveProfile(field);
  const identity=starterMode?t(currentProfile.identity):(role==='PhD Researcher'?`${field} ${t('Researcher')}`:`${roleLabel(role)} · ${field}`);
  document.getElementById('resultIdentity').textContent=identity;
  document.getElementById('resultField').textContent=field;
  document.getElementById('resultFocus').textContent=t(currentProfile.focus);
  document.getElementById('resultMethods').textContent=t(currentProfile.methods);
  document.getElementById('resultObjects').textContent=t(currentProfile.systems);
  document.getElementById('resultFlagship').textContent=t(currentProfile.flagship);
  document.getElementById('resultGrounding').textContent=t(starterMode?'starter profile · not source-verified':'grounded in provided sources');
  document.getElementById('successIdentity').textContent=identity;
  document.getElementById('statPublications').textContent=starterMode?'0':'24';
  document.getElementById('statThemes').textContent=starterMode?'4':'8';
  document.getElementById('statMethods').textContent=starterMode?'5':'12';
  document.getElementById('statObjects').textContent='10';
  renderWordCloud(currentProfile.words);
  renderCandidates(currentProfile.candidates,resetObjects);
}

function syncPreview(){
  const first=document.getElementById('firstName').value.trim()||'Lahoule';
  const last=document.getElementById('lastName').value.trim()||'Lee';
  const role=document.getElementById('role').value;
  const field=document.getElementById('field').value.trim()||'Research';
  document.getElementById('previewName').textContent=`${first} ${last}`.trim().toUpperCase();
  document.getElementById('previewRole').textContent=`${roleLabel(role)} · ${field}`.toUpperCase();
  document.getElementById('previewField').textContent=field;
  document.getElementById('previewArtifact').textContent=t(currentProfile?.flagship||'Research system + visual concept');
  const objects=[...selectedObjects];
  document.getElementById('previewObjects').innerHTML=objects.map(o=>`<span><b>${escapeHTML(objectSymbols[o]||'◆')}</b><small>${escapeHTML(objectLabel(o))}</small></span>`).join('');
  document.getElementById('previewObjectCount').textContent=objects.length;
}

function refreshDynamicLanguage(){
  if(currentStep===3||currentStep===4||currentStep==='success'){
    syncResearcherDNA(false);
    if(currentStep===4)syncPreview();
  }
}
window.addEventListener('researcherdna:language',refreshDynamicLanguage);

document.getElementById('orderButton').addEventListener('click',()=>showStep('success'));
document.getElementById('restartButton').addEventListener('click',()=>showStep(1));
document.getElementById('closeSuccess').addEventListener('click',closeWizard);

const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');});},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
