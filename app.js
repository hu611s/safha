/* ═══════════════════════════════════════════════
   منصة صفحة التعليمية — app.js v6
   Clean | Stage-Lock | Favorites | Settings | Search
═══════════════════════════════════════════════ */

/* ── DATA ──────────────────────────────────────── */
var ALL_GRADES = [
  {id:'p1',name:'أول ابتدائي',   icon:'🌼',bg:'linear-gradient(135deg,#22c55e,#15803d)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'p2',name:'ثاني ابتدائي',  icon:'🌻',bg:'linear-gradient(135deg,#22c55e,#15803d)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'p3',name:'ثالث ابتدائي',  icon:'🌷',bg:'linear-gradient(135deg,#16a34a,#166534)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'p4',name:'رابع ابتدائي',  icon:'🍀',bg:'linear-gradient(135deg,#16a34a,#166534)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'p5',name:'خامس ابتدائي',  icon:'🌿',bg:'linear-gradient(135deg,#15803d,#14532d)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'p6',name:'سادس ابتدائي',  icon:'🌱',bg:'linear-gradient(135deg,#15803d,#14532d)', stage:'primary',  sub:'٨ مواد دراسية'},
  {id:'m1',name:'أول متوسط',     icon:'📗',bg:'linear-gradient(135deg,#667eea,#764ba2)', stage:'middle',   sub:'٨ مواد دراسية'},
  {id:'m2',name:'ثاني متوسط',    icon:'📙',bg:'linear-gradient(135deg,#7c3aed,#6d28d9)', stage:'middle',   sub:'٨ مواد دراسية'},
  {id:'m3',name:'ثالث متوسط',    icon:'📕',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)', stage:'middle',   sub:'٨ مواد دراسية'},
  {id:'s1',name:'رابع إعدادي',   icon:'🧪',bg:'linear-gradient(135deg,#f59e0b,#d97706)', stage:'secondary',sub:'٨ مواد دراسية'},
  {id:'s2',name:'خامس إعدادي',   icon:'⚗️',bg:'linear-gradient(135deg,#ea580c,#c2410c)', stage:'secondary',sub:'٨ مواد دراسية'},
  {id:'s3',name:'سادس إعدادي',   icon:'🔭',bg:'linear-gradient(135deg,#dc2626,#b91c1c)', stage:'secondary',sub:'٨ مواد دراسية'},
  {id:'vb1',name:'فرع صناعي',    icon:'🏭',bg:'linear-gradient(135deg,#db2777,#be185d)', stage:'vocational',sub:'فرع مهني متخصص',branch:'industrial'},
  {id:'vb2',name:'فرع تجاري',    icon:'💼',bg:'linear-gradient(135deg,#0ea5e9,#0284c7)', stage:'vocational',sub:'فرع مهني متخصص',branch:'commerce'},
  {id:'vb3',name:'فرع زراعي',    icon:'🌾',bg:'linear-gradient(135deg,#22c55e,#15803d)', stage:'vocational',sub:'فرع مهني متخصص',branch:'agriculture'},
  {id:'vb4',name:'فرع سياحة',    icon:'✈️',bg:'linear-gradient(135deg,#f59e0b,#d97706)', stage:'vocational',sub:'فرع مهني متخصص',branch:'tourism'},
  {id:'vb5',name:'فرع حاسوب',    icon:'💻',bg:'linear-gradient(135deg,#6366f1,#4f46e5)', stage:'vocational',sub:'فرع مهني متخصص',branch:'computer'},
  {id:'vb6',name:'تقنيات حاسوب', icon:'🖥️',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)', stage:'vocational',sub:'فرع مهني متخصص',branch:'tech'},
  {id:'vb7',name:'فنون تطبيقية', icon:'🎨',bg:'linear-gradient(135deg,#ec4899,#be185d)', stage:'vocational',sub:'فرع مهني متخصص',branch:'arts'}
];

var STAGES_META = {
  primary:   {name:'الابتدائية',  icon:'🌱', bg:'linear-gradient(135deg,#22c55e,#16a34a)'},
  middle:    {name:'المتوسطة',    icon:'📘', bg:'linear-gradient(135deg,#667eea,#764ba2)'},
  secondary: {name:'الإعدادية',   icon:'🔬', bg:'linear-gradient(135deg,#ea580c,#c2410c)'},
  vocational:{name:'المهني',      icon:'⚙️', bg:'linear-gradient(135deg,#db2777,#be185d)'}
};

var SUBJ_SCI = [
  {id:'arabic', label:'اللغة العربية',    emoji:'📝',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},
  {id:'islamic',label:'التربية الإسلامية',emoji:'🕌',cover:'linear-gradient(135deg,#059669,#065f46)'},
  {id:'english',label:'اللغة الإنكليزية',emoji:'🌍',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},
  {id:'math',   label:'الرياضيات',        emoji:'🔢',cover:'linear-gradient(135deg,#667eea,#764ba2)'},
  {id:'chem',   label:'الكيمياء',          emoji:'⚗️',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},
  {id:'phys',   label:'الفيزياء',          emoji:'⚡',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},
  {id:'bio',    label:'الأحياء',           emoji:'🌿',cover:'linear-gradient(135deg,#22c55e,#15803d)'},
  {id:'social', label:'اجتماعيات',         emoji:'🗺️',cover:'linear-gradient(135deg,#ec4899,#be185d)'}
];

var SUBJ_LIT = [
  {id:'arabic', label:'اللغة العربية',    emoji:'📝',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},
  {id:'islamic',label:'التربية الإسلامية',emoji:'🕌',cover:'linear-gradient(135deg,#059669,#065f46)'},
  {id:'english',label:'اللغة الإنكليزية',emoji:'🌍',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},
  {id:'math',   label:'الرياضيات',        emoji:'🔢',cover:'linear-gradient(135deg,#667eea,#764ba2)'},
  {id:'history',label:'التاريخ',          emoji:'🏛️',cover:'linear-gradient(135deg,#ea580c,#c2410c)'},
  {id:'geo',    label:'الجغرافيا',        emoji:'🌐',cover:'linear-gradient(135deg,#0ea5e9,#0284c7)'},
  {id:'philo',  label:'الفلسفة',          emoji:'🧠',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},
  {id:'social', label:'اجتماعيات',        emoji:'🗺️',cover:'linear-gradient(135deg,#ec4899,#be185d)'}
];

var BOOKLETS = {
  arabic: ['ملزمة النحو والصرف','ملزمة البلاغة والأدب','ملزمة القراءة والتعبير'],
  islamic:['ملزمة العقيدة والتوحيد','ملزمة الفقه والعبادات','ملزمة السيرة النبوية'],
  english:['Grammar & Writing','Reading & Vocabulary','Listening & Speaking'],
  math:   ['ملزمة الجبر والمعادلات','ملزمة الهندسة','ملزمة الإحصاء والتحليل'],
  chem:   ['ملزمة الكيمياء العضوية','ملزمة التفاعلات الكيميائية','ملزمة الجدول الدوري'],
  phys:   ['ملزمة الميكانيكا','ملزمة الكهرباء والمغناطيس','ملزمة الموجات والضوء'],
  bio:    ['ملزمة الخلية والوراثة','ملزمة التشريح والأجهزة','ملزمة البيئة والنظم'],
  social: ['ملزمة التاريخ','ملزمة الجغرافيا','ملزمة التربية الوطنية'],
  history:['ملزمة التاريخ القديم','ملزمة العصور الوسطى','ملزمة التاريخ الحديث'],
  geo:    ['ملزمة الجغرافيا الطبيعية','ملزمة الجغرافيا البشرية','ملزمة الخرائط'],
  philo:  ['ملزمة علم المنطق','ملزمة الفلسفة الكلاسيكية','ملزمة الأخلاق والقيم']
};

var EXAMS = {
  arabic: [{n:'اختبار النحو — الفصل الأول',t:'شهري',c:'#667eea'},{n:'اختبار البلاغة',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — عربي',t:'سنوي',c:'#dc2626'}],
  islamic:[{n:'اختبار العقيدة',t:'شهري',c:'#059669'},{n:'اختبار الفقه',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — إسلامية',t:'سنوي',c:'#dc2626'}],
  english:[{n:'Grammar Test',t:'Monthly',c:'#3b82f6'},{n:'Reading Exam',t:'Mid-Term',c:'#f59e0b'},{n:'Final English Exam',t:'Final',c:'#dc2626'}],
  math:   [{n:'اختبار الجبر',t:'شهري',c:'#667eea'},{n:'اختبار الهندسة',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — رياضيات',t:'سنوي',c:'#dc2626'}],
  chem:   [{n:'اختبار الذرات',t:'شهري',c:'#f59e0b'},{n:'اختبار التفاعلات',t:'نصف سنوي',c:'#ea580c'},{n:'الاختبار النهائي — كيمياء',t:'سنوي',c:'#dc2626'}],
  phys:   [{n:'اختبار الحركة',t:'شهري',c:'#8b5cf6'},{n:'اختبار الكهرباء',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — فيزياء',t:'سنوي',c:'#dc2626'}],
  bio:    [{n:'اختبار الخلية',t:'شهري',c:'#22c55e'},{n:'اختبار الأجهزة',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — أحياء',t:'سنوي',c:'#dc2626'}],
  social: [{n:'اختبار التاريخ',t:'شهري',c:'#ec4899'},{n:'اختبار الجغرافيا',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — اجتماعيات',t:'سنوي',c:'#dc2626'}],
  history:[{n:'اختبار التاريخ القديم',t:'شهري',c:'#ea580c'},{n:'اختبار العصور الوسطى',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — تاريخ',t:'سنوي',c:'#dc2626'}],
  geo:    [{n:'اختبار الجغرافيا الطبيعية',t:'شهري',c:'#0ea5e9'},{n:'اختبار الجغرافيا البشرية',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — جغرافيا',t:'سنوي',c:'#dc2626'}],
  philo:  [{n:'اختبار المنطق',t:'شهري',c:'#8b5cf6'},{n:'اختبار الفلسفة',t:'نصف سنوي',c:'#f59e0b'},{n:'الاختبار النهائي — فلسفة',t:'سنوي',c:'#dc2626'}]
};

var CURRICULUM = {
  arabic: ['الفصل الأول: النحو والصرف|الفعل، الفاعل، المفعول به، الحال، التمييز','الفصل الثاني: البلاغة|المجاز، الاستعارة، التشبيه، الكناية','الفصل الثالث: الأدب|الشعر الجاهلي، الإسلامي، العباسي'],
  islamic:['الفصل الأول: العقيدة|التوحيد، أركان الإيمان، أسماء الله الحسنى','الفصل الثاني: الفقه|الطهارة، الصلاة، الزكاة، الصيام، الحج','الفصل الثالث: السيرة|المولد، البعثة، الهجرة، الغزوات'],
  english:['Unit 1: Grammar|Tenses, Modal Verbs, Conditionals, Passive Voice','Unit 2: Reading|Comprehension, Inference, Critical Thinking','Unit 3: Writing|Essays, Reports, Letters, Summaries'],
  math:   ['الوحدة الأولى: الجبر|المعادلات، المتباينات، الاقترانات، المتتاليات','الوحدة الثانية: الهندسة|المثلثات، الدوائر، التحويلات','الوحدة الثالثة: الإحصاء|التوزيعات، الاحتمالات، الإحصاء الوصفي'],
  chem:   ['الوحدة الأولى: التركيب الذري|الجدول الدوري، الإلكترونات، الروابط','الوحدة الثانية: التفاعلات|أنواع التفاعلات، الكيمياء الحرارية','الوحدة الثالثة: العضوية|الهيدروكربونات، المجاميع الوظيفية'],
  phys:   ['الوحدة الأولى: الميكانيكا|الحركة، القوى، قوانين نيوتن، الطاقة','الوحدة الثانية: الكهرباء|التيار، الجهد، المقاومة، الدوائر','الوحدة الثالثة: الموجات|الضوء، الصوت، الأشعة، التداخل'],
  bio:    ['الوحدة الأولى: الخلية|البناء، الوظيفة، الانقسام، التكاثر','الوحدة الثانية: الأجهزة|الهضم، التنفس، الدورة الدموية، العصبي','الوحدة الثالثة: الوراثة|الجينات، قوانين مندل، الطفرات'],
  social: ['الوحدة الأولى: التاريخ|الحضارات القديمة، الإسلام، الحداثة','الوحدة الثانية: الجغرافيا|التضاريس، المناخ، السكان، الاقتصاد','الوحدة الثالثة: التربية الوطنية|الدستور، المؤسسات، المواطنة'],
  history:['الوحدة الأولى: الحضارات|مصر، الرافدين، اليونان، الرومان','الوحدة الثانية: العصور الوسطى|الإسلام، أوروبا، الإمبراطوريات','الوحدة الثالثة: الحديث|الثورات، الاستعمار، الحرب العالمية'],
  geo:    ['الوحدة الأولى: الطبيعية|التضاريس، المناخ، المياه، التربة','الوحدة الثانية: البشرية|السكان، المدن، الاقتصاد، الهجرة','الوحدة الثالثة: الخرائط|أنواعها، قراءتها، رسمها، الإحداثيات'],
  philo:  ['الوحدة الأولى: المنطق|الاستدلال، القياس، الاستقراء، الصوري','الوحدة الثانية: الفلسفة|سقراط، أفلاطون، أرسطو، الإسلامية','الوحدة الثالثة: الأخلاق|النظريات الأخلاقية، القيم، المواطنة']
};

var PG_COUNT = [32, 48, 56];

/* ── STATE ─────────────────────────────────────── */
var curStage   = null;
var curBranch  = null;
var curGrade   = null;
var curSubject = null;
var curCTab    = 'booklets';
var curFilter  = 'all';
var isDark     = false;
var isGuest    = false;
var searchIdx  = [];

/* ── SUPABASE CONFIG ────────────────────────────── */
var SUPA_URL = 'https://dbzlvpcudhmodthrairs.supabase.co';
var SUPA_KEY = 'sb_publishable_Vza6oiH3BYu7SnFN94qWLw_nQRV3HG9';

async function supa(table, method, body, query){
  var url = SUPA_URL+'/rest/v1/'+table+(query||'');
  var opts = {
    method: method||'GET',
    headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json','Prefer':'return=representation'}
  };
  if(body) opts.body=JSON.stringify(body);
  var r=await fetch(url,opts);
  if(!r.ok){var e=await r.text();throw new Error(e);}
  try{return await r.json();}catch(e){return null;}
}

/* ── UTILS ─────────────────────────────────────── */
function el(id){ return document.getElementById(id); }

function goPage(pid){
  document.querySelectorAll('.pg').forEach(function(p){ p.classList.remove('active'); });
  el(pid).classList.add('active');
  window.scrollTo(0,0);
}

function toast(msg, type){
  var t=el('toast'); if(!t) return;
  var cols={ok:'linear-gradient(135deg,#059669,#047857)',err:'linear-gradient(135deg,#dc2626,#b91c1c)',info:'linear-gradient(135deg,#1e1b4b,#312e81)',warn:'linear-gradient(135deg,#ea580c,#c2410c)'};
  t.style.background=cols[type]||cols.info;
  t.textContent=msg;
  t.classList.remove('hidden','show');
  void t.offsetWidth;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t=setTimeout(function(){ t.classList.remove('show'); setTimeout(function(){ t.classList.add('hidden'); },400); },2800);
}

/* ── MODALS ────────────────────────────────────── */
function openModal(id){
  var ov=el(id); if(!ov) return;
  ov.classList.remove('hidden');
  document.body.style.overflow='hidden';
  // Close on backdrop click
  ov.onclick=function(e){ if(e.target===ov) closeModal(id); };
}
function closeModal(id){
  var ov=el(id); if(!ov) return;
  ov.classList.add('hidden');
  document.body.style.overflow='';
}

/* ── SETTINGS ──────────────────────────────────── */
function openSettings(){
  syncSettingsUI();
  openModal('ov-settings');
  setNavActive('settings');
}

function syncSettingsUI(){
  var s=getSess();
  var av=el('set-avatar'), un=el('set-uname'), us=el('set-ustage');
  if(s && s.name){
    if(av) av.textContent=s.name.charAt(0).toUpperCase();
    if(un) un.textContent=s.name;
  } else {
    if(av) av.textContent='؟';
    if(un) un.textContent='زائر';
  }
  if(us){
    us.textContent = (curStage && STAGES_META[curStage]) ? STAGES_META[curStage].name : 'لم تختر مرحلة';
  }
  var lbl=el('set-theme-lbl');
  if(lbl) lbl.textContent = isDark ? 'الوضع الليلي' : 'الوضع النهاري';
}

function askChangeStage(){
  closeModal('ov-settings');
  setTimeout(function(){ openModal('ov-changestage'); },200);
}

function doChangeStage(){
  closeModal('ov-changestage');
  setTimeout(function(){ openStagePicker('change'); },200);
}

/* ── STAGE PICKER ──────────────────────────────── */
function openStagePicker(mode){
  var title=el('picker-title'), sub=el('picker-sub'), grid=el('picker-grid');
  if(title) title.textContent = mode==='first' ? 'اختر مرحلتك الدراسية' : 'اختر مرحلة جديدة';
  if(sub)   sub.textContent   = mode==='first' ? 'اختر مرحلتك لعرض المحتوى المناسب لك' : 'سيتم تحديث المحتوى حسب مرحلتك الجديدة';

  var stageConf = [
    {id:'primary',   grades:['أول','ثاني','ثالث','رابع','خامس','سادس ابتدائي']},
    {id:'middle',    grades:['أول متوسط','ثاني متوسط','ثالث متوسط']},
    {id:'secondary', grades:['رابع إعدادي','خامس إعدادي','سادس إعدادي']},
    {id:'vocational',grades:['صناعي · تجاري · زراعي · حاسوب · فنون']}
  ];

  var html='';
  stageConf.forEach(function(sc){
    var sm=STAGES_META[sc.id];
    html += '<div class="pk-card" style="background:'+sm.bg+'" onclick="pickStage(\''+sc.id+'\')">'
          + '<div class="pk-ic" style="background:rgba(255,255,255,.2)">'+sm.icon+'</div>'
          + '<div class="pk-info"><div class="pk-name">'+sm.name+'</div>'
          + '<div class="pk-grades">'+sc.grades.join(' · ')+'</div></div>'
          + '<div class="pk-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></div>'
          + '</div>';
  });
  if(grid) grid.innerHTML=html;

  openModal('ov-picker');
}

async function pickStage(stageId){
  curStage=stageId;
  curBranch=null;
  var s=getSess();
  if(s && s.name){
    s.stage=stageId; s.branch=null;
    setSess(s);
    if(s.id){
      try{ await supa('users','PATCH',{stage:stageId,branch:null},'?id=eq.'+s.id); }catch(e){}
    }
  }
  closeModal('ov-picker');
  var sm=STAGES_META[stageId];
  toast('✅ تم اختيار '+sm.name, 'ok');
  setTimeout(function(){ buildGradePage(); goPage('pg-grade'); setNavActive('home'); },300);
}

/* ── AUTH ──────────────────────────────────────── */
function switchTab(tab){
  var isLogin = tab==='login';
  el('frm-login').classList.toggle('hidden', !isLogin);
  el('frm-register').classList.toggle('hidden', isLogin);
  el('tab-login').classList.toggle('active', isLogin);
  el('tab-reg').classList.toggle('active', !isLogin);
  el('tab-line').style.right = isLogin ? '0' : '50%';
  el('tab-line').style.left  = isLogin ? 'auto' : '0';
  el('l-err').textContent=''; el('r-err').textContent='';
}

function toggleEye(iid, bid){
  var inp=el(iid); if(!inp) return;
  var isPass=inp.type==='password';
  inp.type=isPass?'text':'password';
  var b=el(bid); if(!b) return;
  b.innerHTML=isPass
    ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

async function doLogin(){
  var name=el('l-name').value.trim(), pass=el('l-pass').value, err=el('l-err');
  err.textContent='';
  if(!name){err.textContent='⚠️ أدخل اسمك';return;}
  if(!pass){err.textContent='⚠️ أدخل كلمة المرور';return;}
  var btn=el('l-name').closest('form')||document.querySelector('.auth-form');
  var loginBtn=document.querySelector('#frm-login .btn-auth');
  if(loginBtn){loginBtn.textContent='جارٍ الدخول...';loginBtn.disabled=true;}
  try{
    var rows=await supa('users','GET',null,'?username=eq.'+encodeURIComponent(name.toLowerCase())+'&password=eq.'+encodeURIComponent(pass)+'&select=*');
    if(!rows||!rows.length){err.textContent='⚠️ اسم أو كلمة مرور خاطئة';}
    else{
      var user=rows[0];
      await supa('users','PATCH',{last_login:new Date().toISOString()},'?id=eq.'+user.id);
      setSess({id:user.id,name:user.display_name,stage:user.stage||null,branch:user.branch||null,joined:new Date(user.joined_at).getTime()});
      isGuest=false; curStage=user.stage||null; curBranch=user.branch||null;
      updatePills(user.display_name);
      showBottomNav(true);
      toast('👋 أهلاً '+user.display_name,'ok');
      if(!curStage){openStagePicker('first');}else{buildGradePage();goPage('pg-grade');setNavActive('home');}
    }
  }catch(e){err.textContent='⚠️ '+e.message;}
  if(loginBtn){loginBtn.textContent='دخول';loginBtn.disabled=false;}
}

async function doRegister(){
  var name=el('r-name').value.trim(), pass=el('r-pass').value, pass2=el('r-pass2').value, err=el('r-err');
  err.textContent='';
  if(!name){err.textContent='⚠️ أدخل اسمك';return;}
  if(name.length<2){err.textContent='⚠️ الاسم قصير جداً';return;}
  if(!pass){err.textContent='⚠️ أدخل كلمة المرور';return;}
  if(pass.length<4){err.textContent='⚠️ ٤ أحرف على الأقل';return;}
  if(pass!==pass2){err.textContent='⚠️ كلمتا المرور غير متطابقتين';return;}
  var regBtn=document.querySelector('#frm-register .btn-auth');
  if(regBtn){regBtn.textContent='جارٍ الإنشاء...';regBtn.disabled=true;}
  try{
    var existing=await supa('users','GET',null,'?username=eq.'+encodeURIComponent(name.toLowerCase())+'&select=id');
    if(existing&&existing.length){err.textContent='⚠️ هذا الاسم مسجل مسبقاً';}
    else{
      var rows=await supa('users','POST',{username:name.toLowerCase(),password:pass,display_name:name,stage:null,branch:null,joined_at:new Date().toISOString()});
      var user=rows&&rows[0];
      setSess({id:user?user.id:null,name:name,stage:null,branch:null,joined:Date.now()});
      isGuest=false; curStage=null; curBranch=null;
      updatePills(name);
      showBottomNav(true);
      toast('🎉 أهلاً '+name+'! حسابك جاهز','ok');
      openStagePicker('first');
    }
  }catch(e){err.textContent='⚠️ '+e.message;}
  if(regBtn){regBtn.textContent='إنشاء حساب';regBtn.disabled=false;}
}

function doGuest(){
  isGuest=true; curStage=null; curBranch=null;
  updatePills('زائر');
  showBottomNav(true);
  toast('👤 دخلت كضيف','info');
  openStagePicker('first');
}

function doLogout(){
  closeModal('ov-settings');
  setTimeout(function(){
    if(!confirm('تسجيل الخروج؟')) return;
    localStorage.removeItem('edu_session');
    curStage=null; curBranch=null; curGrade=null; isGuest=false;
    showBottomNav(false);
    switchTab('login');
    el('l-name').value=''; el('l-pass').value=''; el('l-err').textContent='';
    toast('👋 تم تسجيل الخروج','info');
    goPage('pg-auth');
  },100);
}

/* ── STORAGE ───────────────────────────────────── */
function getSess(){ try{ return JSON.parse(localStorage.getItem('edu_session'))||null; }catch(e){ return null; } }
function setSess(s){ localStorage.setItem('edu_session',JSON.stringify(s)); }
function getUsers(){ try{ return JSON.parse(localStorage.getItem('edu_users'))||{}; }catch(e){ return {}; } }
function setUsers(u){ localStorage.setItem('edu_users',JSON.stringify(u)); }
function getFavs(){ try{ return JSON.parse(localStorage.getItem('edu_favs'))||[]; }catch(e){ return []; } }
function setFavs(f){ localStorage.setItem('edu_favs',JSON.stringify(f)); }

/* ── NAVIGATION ────────────────────────────────── */
function showBottomNav(show){
  var nav=el('bottomNav'); if(!nav) return;
  nav.classList.toggle('hidden',!show);
}

function setNavActive(tab){
  document.querySelectorAll('.bnb').forEach(function(b){ b.classList.remove('active'); });
  var a=el('bnav-'+tab); if(a) a.classList.add('active');
}

function updatePills(name){
  ['upill-grade','upill-class'].forEach(function(id){
    var e=el(id); if(e) e.textContent='👤 '+name;
  });
}

function bottomNav(tab){
  setNavActive(tab);
  if(tab==='home')   { buildGradePage(); goPage('pg-grade'); }
  if(tab==='search') { goPage('pg-search'); setTimeout(function(){ var i=el('search-inp'); if(i) i.focus(); },200); }
  if(tab==='favs')   { buildFavsPage(); goPage('pg-favs'); }
  if(tab==='profile'){ buildProfile(); goPage('pg-profile'); }
  if(tab==='settings'){ openSettings(); }
}

/* ── GRADE PAGE ────────────────────────────────── */
function buildGradePage(){
  var sm = curStage ? STAGES_META[curStage] : null;
  var ic=el('grade-hero-ic'), h1=el('grade-hero-h1'), p=el('grade-hero-p'), tt=el('grade-tbar-title'), ts=el('grade-tbar-sub');
  if(ic) ic.textContent = sm ? sm.icon : '📚';
  if(h1) h1.textContent = sm ? 'صفوف '+sm.name : 'اختر صفك';
  if(p)  p.textContent  = sm ? 'اختر صفك الدراسي' : 'حدد مرحلتك أولاً';
  if(tt) tt.textContent = sm ? sm.name : 'صفحة التعليمية';
  if(ts) ts.textContent = 'اختر صفك';

  var grades = curStage ? ALL_GRADES.filter(function(g){ return g.stage===curStage; }) : ALL_GRADES;
  var list=el('grades-list'); if(!list) return;
  list.className='grades-grid';
  var html='';
  grades.forEach(function(g){
    html += '<div class="grade-card" onclick="goGrade(\''+g.id+'\')" style="background:'+g.bg+'">'
          + '<div class="gc-shine"></div>'
          + '<div class="gc-icon">'+g.icon+'</div>'
          + '<div class="gc-name">'+g.name+'</div>'
          + '<div class="gc-sub">'+g.sub+'</div>'
          + '</div>';
  });
  list.innerHTML=html;
}

function goGrade(gid){
  curGrade=gid;
  var g=ALL_GRADES.find(function(x){ return x.id===gid; });
  if(!g) return;

  el('class-tbar-title').textContent=g.name;
  el('class-tbar-sub').textContent='المواد الدراسية';

  var subjects = curStage==='secondary' ? (curBranch==='literary'?SUBJ_LIT:SUBJ_SCI) : SUBJ_SCI;

  // Subject strip — scrollable squares
  var tabs='';
  subjects.forEach(function(s,i){
    tabs += '<button class="stab'+(i===0?' on':'')+'" id="stab-'+s.id+'" onclick="switchSubject(\''+s.id+'\')">'
          + '<div class="stab-sq" style="background:'+s.cover+'">'+s.emoji+'</div>'
          + '<span class="stab-lb">'+s.label+'</span>'
          + '</button>';
  });
  el('sub-strip').innerHTML=tabs;
  curSubject=subjects[0].id;
  curCTab='booklets';
  document.querySelectorAll('.ctab').forEach(function(b,i){ b.classList.toggle('active',i===0); });
  renderContent();
  goPage('pg-class');
}

function switchSubject(sid){
  if(sid===curSubject) return;
  curSubject=sid;
  document.querySelectorAll('.stab').forEach(function(t){ t.classList.remove('on'); });
  var at=el('stab-'+sid);
  if(at){ at.classList.add('on'); at.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}); }
  renderContent();
}

function switchCTab(tab,btn){
  curCTab=tab;
  document.querySelectorAll('.ctab').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  renderContent();
}

/* ── CONTENT RENDER ────────────────────────────── */
function getSubj(sid){
  var all=SUBJ_SCI.concat(SUBJ_LIT.filter(function(s){ return !SUBJ_SCI.find(function(x){ return x.id===s.id; }); }));
  return all.find(function(s){ return s.id===sid; })||null;
}

function renderContent(){
  var subj=getSubj(curSubject); if(!subj) return;
  var labels={booklets:'الملازم الدراسية',exams:'الاختبارات',favs:'المفضلة',curriculum:'المنهج الدراسي'};
  var head='<div class="subj-hd">'
          +'<div class="subj-hd-ic" style="background:'+subj.cover+'">'+subj.emoji+'</div>'
          +'<div><div class="subj-hd-name">'+subj.label+'</div>'
          +'<div class="subj-hd-hint">'+labels[curCTab]+'</div></div></div>';

  el('class-body').innerHTML=head+'<div class="loading-spin"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';

  if(curCTab==='booklets')       loadBookletsFromDB(subj, head);
  else if(curCTab==='exams')     loadExamsFromDB(subj, head);
  else if(curCTab==='favs')      el('class-body').innerHTML=head+renderSubjFavs(subj);
  else                            el('class-body').innerHTML=head+renderCurriculum(subj);
}

async function loadBookletsFromDB(subj, head){
  try{
    var rows=await supa('booklets','GET',null,
      '?is_visible=eq.true&stage=eq.'+curStage+'&subject_id=eq.'+subj.id+'&order=created_at.asc');
    rows=rows||[];
    // Fallback to static if DB empty
    if(!rows.length){
      el('class-body').innerHTML=head+renderBookletsStatic(subj);
      return;
    }
    var html='<div class="sec-lbl">📂 الملازم ('+rows.length+')</div><div class="bk-grid">';
    rows.forEach(function(b){
      var fid='bk-'+b.id;
      var isFav=isFaved(fid);
      var safe=b.name.replace(/'/g,'&#39;');
      var fileUrl=b.file_url||'';
      html += '<div class="bk-card">'
            + '<div class="bk-cover" style="background:'+(b.color||subj.cover)+'">'+(b.emoji||subj.emoji)+'</div>'
            + '<div class="bk-body">'
            + '<div class="bk-name">'+b.name+'</div>'
            + '<div class="bk-meta">📄 '+b.subject_name+(b.grade?' — '+b.grade:'')+'</div>'
            + '<div class="bk-actions">'
            + (fileUrl?'<button class="btn-view" onclick="openFile(\''+fileUrl+'\')">👁 عرض</button>':'<button class="btn-view" style="opacity:.4" disabled>غير متاح</button>')
            + (fileUrl?'<a class="btn-dl" href="'+fileUrl+'" download target="_blank">⬇ تحميل</a>':'<button class="btn-dl" style="opacity:.4" disabled>⬇ تحميل</button>')
            + '</div>'
            + '<button class="bk-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'booklet\',\''+(b.color||subj.cover)+'\',\''+(b.emoji||subj.emoji)+'\')">'
            + '<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
            + (isFav?'محفوظة':'حفظ في المفضلة')
            + '</button>'
            + '</div></div>';
    });
    html+='</div>';
    el('class-body').innerHTML=head+html;
  }catch(e){
    el('class-body').innerHTML=head+renderBookletsStatic(subj);
  }
}

async function loadExamsFromDB(subj, head){
  try{
    var rows=await supa('exams','GET',null,
      '?is_visible=eq.true&stage=eq.'+curStage+'&subject_id=eq.'+subj.id+'&order=created_at.asc');
    rows=rows||[];
    if(!rows.length){
      el('class-body').innerHTML=head+renderExamsStatic(subj);
      return;
    }
    var tc={'شهري':'#667eea','نصف سنوي':'#f59e0b','سنوي':'#dc2626','تجريبي':'#8b5cf6'};
    var html='<div class="sec-lbl">📝 الاختبارات ('+rows.length+')</div><div class="exam-list">';
    rows.forEach(function(ex){
      var fid='ex-'+ex.id;
      var isFav=isFaved(fid);
      var safe=ex.name.replace(/'/g,'&#39;');
      var color=ex.color||tc[ex.exam_type]||'#667eea';
      var fileUrl=ex.file_url||'';
      html += '<div class="exam-item">'
            + '<div class="exam-badge" style="background:'+color+'">'+ex.exam_type+'</div>'
            + '<div class="exam-info"><div class="exam-name">'+ex.name+'</div>'
            + '<div class="exam-meta">'+ex.subject_name+(ex.academic_year?' — '+ex.academic_year:'')+'</div></div>'
            + '<div class="exam-actions">'
            + (fileUrl?'<a class="btn-exam" href="'+fileUrl+'" download target="_blank">⬇ تحميل</a>':'<button class="btn-exam" style="opacity:.4" disabled>غير متاح</button>')
            + '<button class="exam-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'exam\',\''+color+'\',\'📝\')">'
            + '<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
            + '</button>'
            + '</div></div>';
    });
    html+='</div>';
    el('class-body').innerHTML=head+html;
  }catch(e){
    el('class-body').innerHTML=head+renderExamsStatic(subj);
  }
}

/* Static fallbacks when DB has no data yet */
function renderBookletsStatic(subj){
  var names=BOOKLETS[subj.id]||['ملزمة 1','ملزمة 2','ملزمة 3'];
  var html='<div class="sec-lbl">📂 الملازم ('+names.length+')</div><div class="bk-grid">';
  names.forEach(function(n,b){
    var fid='bk-'+subj.id+'-'+b;
    var isFav=isFaved(fid);
    var safe=n.replace(/'/g,'&#39;');
    html += '<div class="bk-card">'
          + '<div class="bk-cover" style="background:'+subj.cover+'">'+subj.emoji+'</div>'
          + '<div class="bk-body">'
          + '<div class="bk-name">'+n+'</div>'
          + '<div class="bk-meta">📄 '+PG_COUNT[b]+' صفحة</div>'
          + '<div class="bk-actions">'
          + '<button class="btn-view" onclick="doAct(\'view\',\''+safe+'\')">👁 عرض</button>'
          + '<button class="btn-dl" onclick="doAct(\'dl\',\''+safe+'\')">⬇ تحميل</button>'
          + '</div>'
          + '<button class="bk-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'booklet\',\''+subj.cover+'\',\''+subj.emoji+'\')">'
          + '<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
          + (isFav?'محفوظة':'حفظ في المفضلة')
          + '</button>'
          + '</div></div>';
  });
  return html+'</div>';
}

function renderBooklets(subj){ return renderBookletsStatic(subj); }

function renderExamsStatic(subj){
  var list=EXAMS[subj.id]||[];
  if(!list.length) return '<div class="sec-lbl">لا توجد اختبارات</div>';
  var html='<div class="sec-lbl">📝 الاختبارات ('+list.length+')</div><div class="exam-list">';
  list.forEach(function(ex,i){
    var fid='ex-'+subj.id+'-'+i;
    var isFav=isFaved(fid);
    var safe=ex.n.replace(/'/g,'&#39;');
    html += '<div class="exam-item">'
          + '<div class="exam-badge" style="background:'+ex.c+'">'+ex.t+'</div>'
          + '<div class="exam-info"><div class="exam-name">'+ex.n+'</div><div class="exam-meta">'+subj.label+'</div></div>'
          + '<div class="exam-actions">'
          + '<button class="btn-exam" onclick="doAct(\'exam\',\''+safe+'\')">⬇ تحميل</button>'
          + '<button class="exam-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'exam\',\''+ex.c+'\',\'📝\')">'
          + '<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
          + '</button>'
          + '</div></div>';
  });
  return html+'</div>';
}

function renderExams(subj){ return renderExamsStatic(subj); }

function openFile(url){ window.open(url,'_blank'); }

function renderSubjFavs(subj){
  var favs=getFavs().filter(function(f){ return f.meta===subj.label; });
  if(!favs.length) return '<div class="state-box"><div class="state-ic">🔖</div><h3>لا مفضلات لهذه المادة</h3><p>اضغط ❤️ لحفظ ملزمة أو اختبار</p></div>';
  var html='<div class="sec-lbl">❤️ مفضلتك ('+favs.length+')</div><div class="exam-list">';
  favs.forEach(function(f){
    html += '<div class="exam-item">'
          + '<div class="exam-badge" style="background:'+f.cover+'">'+f.emoji+'</div>'
          + '<div class="exam-info"><div class="exam-name">'+f.name+'</div><div class="exam-meta">'+f.type+'</div></div>'
          + '<button class="fav-del" onclick="removeFav(\''+f.id+'\')">'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
          + '</button></div>';
  });
  return html+'</div>';
}

function renderCurriculum(subj){
  var units=CURRICULUM[subj.id]||[];
  if(!units.length) return '<div class="sec-lbl">المنهج غير متاح</div>';
  var html='<div class="sec-lbl">📖 المنهج — '+subj.label+'</div><div class="curr-list">';
  units.forEach(function(u,i){
    var parts=u.split('|'), title=parts[0].trim();
    var lessons=parts[1]?parts[1].split('،'):[];
    html += '<div class="curr-unit" id="cu-'+i+'">'
          + '<div class="curr-head" onclick="toggleUnit('+i+')">'
          + '<div class="curr-htitle">📚 '+title+'</div>'
          + '<div class="curr-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>'
          + '</div><div class="curr-body">';
    lessons.forEach(function(l){ html+='<div class="curr-lesson">'+l.trim()+'</div>'; });
    html+='</div></div>';
  });
  return html+'</div>';
}

function toggleUnit(i){
  var u=el('cu-'+i); if(u) u.classList.toggle('open');
}

function doAct(type,name){
  var m={view:'📖 جارٍ فتح: ',dl:'⬇️ جارٍ تحميل: ',exam:'⬇️ تحميل: '};
  toast((m[type]||'')+name, type==='view'?'info':'ok');
}

/* ── FAVORITES ─────────────────────────────────── */
function isFaved(id){ return getFavs().some(function(f){ return f.id===id; }); }

function toggleFav(id, name, meta, type, cover, emoji){
  // Guest check — show friendly notification
  if(isGuest){
    showGuestAlert();
    return;
  }
  var favs=getFavs();
  var idx=favs.findIndex(function(f){ return f.id===id; });
  if(idx>=0){
    favs.splice(idx,1);
    setFavs(favs);
    toast('💔 أُزيل من المفضلة','info');
  } else {
    favs.unshift({id:id,name:name,meta:meta,type:type==='booklet'?'ملزمة':'اختبار',cover:cover,emoji:emoji});
    setFavs(favs);
    toast('❤️ أُضيف إلى المفضلة','ok');
  }
  // Re-render current content
  renderContent();
}

function showGuestAlert(){
  // Friendly animated notification for guests
  var old=el('guest-alert'); if(old) old.remove();
  var div=document.createElement('div');
  div.id='guest-alert';
  div.className='guest-alert';
  div.innerHTML='<div class="ga-inner">'
    +'<div class="ga-heart">💝</div>'
    +'<div class="ga-text">'
    +'<div class="ga-title">سجّل دخولك أولاً!</div>'
    +'<div class="ga-sub">المفضلة متاحة للأعضاء فقط</div>'
    +'</div>'
    +'<button class="ga-btn" onclick="doGuestLogin()">دخول</button>'
    +'<button class="ga-close" onclick="this.closest(\'.guest-alert\').remove()">✕</button>'
    +'</div>';
  document.body.appendChild(div);
  // Auto remove after 5s
  setTimeout(function(){ var a=el('guest-alert'); if(a) a.classList.add('ga-out'); setTimeout(function(){ var a=el('guest-alert'); if(a) a.remove(); },400); },4500);
}

function doGuestLogin(){
  var a=el('guest-alert'); if(a) a.remove();
  showBottomNav(false);
  goPage('pg-auth');
  switchTab('login');
}

function removeFav(id){
  var favs=getFavs().filter(function(f){ return f.id!==id; });
  setFavs(favs);
  toast('🗑️ أُزيل من المفضلة','info');
  buildFavsPage();
}

function buildFavsPage(){
  var favs=getFavs();
  var list=el('favs-list'), empty=el('favs-empty');
  if(!favs.length){
    if(list) list.innerHTML='';
    if(empty) empty.classList.remove('hidden');
    return;
  }
  if(empty) empty.classList.add('hidden');
  var html='';
  favs.forEach(function(f,i){
    html += '<div class="fav-item" style="animation-delay:'+(i*0.04)+'s">'
          + '<div class="fav-ic" style="background:'+f.cover+'">'+f.emoji+'</div>'
          + '<div class="fav-info"><div class="fav-name">'+f.name+'</div><div class="fav-meta">'+f.meta+' · '+f.type+'</div></div>'
          + '<span class="fav-type" style="background:'+(f.type==='ملزمة'?'#22c55e':'#667eea')+'">'+f.type+'</span>'
          + '<button class="fav-del" onclick="removeFav(\''+f.id+'\')">'
          + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>'
          + '</button></div>';
  });
  if(list) list.innerHTML=html;
}

/* ── THEME ─────────────────────────────────────── */
function toggleTheme(){
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  localStorage.setItem('edu_theme',isDark?'dark':'light');
  var lbl=el('set-theme-lbl'); if(lbl) lbl.textContent=isDark?'الوضع الليلي':'الوضع النهاري';
  toast(isDark?'🌙 الوضع الليلي':'☀️ الوضع النهاري','info');
}

/* ── SEARCH ────────────────────────────────────── */
function buildSearchIndex(){
  searchIdx=[];
  var allSubj=SUBJ_SCI.concat(SUBJ_LIT.filter(function(s){ return !SUBJ_SCI.find(function(x){ return x.id===s.id; }); }));
  allSubj.forEach(function(s){
    searchIdx.push({type:'subjects',name:s.label,emoji:s.emoji,cover:s.cover,meta:'مادة دراسية'});
    (BOOKLETS[s.id]||[]).forEach(function(b){
      searchIdx.push({type:'booklets',name:b,emoji:s.emoji,cover:s.cover,meta:'ملزمة — '+s.label});
    });
    (EXAMS[s.id]||[]).forEach(function(ex){
      searchIdx.push({type:'exams',name:ex.n,emoji:'📝',cover:'linear-gradient(135deg,#667eea,#764ba2)',meta:'اختبار — '+s.label+' — '+ex.t});
    });
  });
  ALL_GRADES.forEach(function(g){
    searchIdx.push({type:'grade',name:g.name,emoji:g.icon,cover:g.bg,meta:'صف — '+STAGES_META[g.stage].name});
  });
}

function setFilter(f,btn){
  curFilter=f;
  document.querySelectorAll('.sf').forEach(function(b){ b.classList.remove('active'); });
  if(btn) btn.classList.add('active');
  var inp=el('search-inp'); if(inp&&inp.value.trim()) doSearch(inp.value);
}

function doSearch(q){
  q=q.trim();
  var clr=el('s-clear'); if(clr) clr.classList.toggle('hidden',!q);
  var start=el('sr-start'), empty=el('sr-empty'), list=el('sr-list');
  if(!q){ start.classList.remove('hidden'); empty.classList.add('hidden'); list.innerHTML=''; return; }
  start.classList.add('hidden');

  var filtered=searchIdx.filter(function(item){
    var tm=curFilter==='all'||item.type===curFilter;
    var qm=item.name.toLowerCase().indexOf(q.toLowerCase())!==-1||item.meta.toLowerCase().indexOf(q.toLowerCase())!==-1;
    return tm&&qm;
  });

  if(!filtered.length){ empty.classList.remove('hidden'); list.innerHTML=''; return; }
  empty.classList.add('hidden');

  var tc={subjects:'#667eea',booklets:'#22c55e',exams:'#f59e0b',grade:'#0ea5e9'};
  var tn={subjects:'مادة',booklets:'ملزمة',exams:'اختبار',grade:'صف'};
  var html='';
  filtered.slice(0,25).forEach(function(item,i){
    var hl=item.name.replace(new RegExp('('+escReg(q)+')','gi'),'<mark>$1</mark>');
    html+='<div class="sr-item" style="animation-delay:'+(i*0.03)+'s">'
        +'<div class="sr-ic" style="background:'+item.cover+'">'+item.emoji+'</div>'
        +'<div class="sr-info"><div class="sr-name">'+hl+'</div><div class="sr-meta">'+item.meta+'</div></div>'
        +'<span class="sr-tag" style="background:'+(tc[item.type]||'#667eea')+'">'+tn[item.type]+'</span>'
        +'</div>';
  });
  list.innerHTML=html;
}

function clearSearch(){
  var i=el('search-inp'); if(i) i.value='';
  var c=el('s-clear'); if(c) c.classList.add('hidden');
  el('sr-list').innerHTML='';
  el('sr-empty').classList.add('hidden');
  el('sr-start').classList.remove('hidden');
}

function escReg(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

/* ── PROFILE ───────────────────────────────────── */
function buildProfile(){
  var s=getSess(); if(!s){ goPage('pg-auth'); return; }
  var av=el('p-avatar'); if(av) av.textContent=s.name.charAt(0).toUpperCase();
  var pn=el('p-name'); if(pn) pn.textContent=s.name;
  var en=el('edit-name'); if(en) en.value=s.name;
  var chip=el('p-chip');
  if(chip) chip.textContent=(curStage&&STAGES_META[curStage])?STAGES_META[curStage].name:'لم تختر مرحلة';
  var sd=el('st-days');
  if(sd&&s.joined) sd.textContent=Math.max(1,Math.floor((Date.now()-s.joined)/864e5));
  var sf=el('st-favs'); if(sf) sf.textContent=getFavs().length;
  ['old-pass','new-pass'].forEach(function(id){ var e=el(id); if(e) e.value=''; });
  var pe=el('pass-err'); if(pe) pe.textContent='';
}

function saveName(){
  var newN=el('edit-name').value.trim();
  if(!newN||newN.length<2){ toast('⚠️ الاسم قصير','warn'); return; }
  var s=getSess(); if(!s) return;
  var users=getUsers(), ok=s.name.toLowerCase(), nk=newN.toLowerCase();
  if(nk!==ok&&users[nk]){ toast('⚠️ الاسم مستخدم','err'); return; }
  var ud=users[ok];
  if(ud){ delete users[ok]; ud.name=newN; users[nk]=ud; setUsers(users); }
  s.name=newN; setSess(s);
  buildProfile(); updatePills(newN);
  toast('✅ تم تغيير الاسم','ok');
}

function changePass(){
  var op=el('old-pass').value, np=el('new-pass').value, err=el('pass-err');
  err.textContent='';
  if(!op){ err.textContent='⚠️ أدخل كلمة المرور الحالية'; return; }
  if(!np||np.length<4){ err.textContent='⚠️ ٤ أحرف على الأقل'; return; }
  var s=getSess(); if(!s) return;
  var users=getUsers(), user=users[s.name.toLowerCase()];
  if(!user||user.pass!==op){ err.textContent='⚠️ كلمة المرور غير صحيحة'; return; }
  user.pass=np; users[s.name.toLowerCase()]=user; setUsers(users);
  el('old-pass').value=''; el('new-pass').value='';
  toast('✅ تم تغيير كلمة المرور','ok');
}

function deleteAccount(){
  if(!confirm('حذف الحساب نهائياً؟ لا يمكن التراجع!')) return;
  var s=getSess();
  if(s){ var u=getUsers(); delete u[s.name.toLowerCase()]; setUsers(u); }
  localStorage.removeItem('edu_session');
  localStorage.removeItem('edu_favs');
  curStage=null; curBranch=null; isGuest=false;
  showBottomNav(false);
  switchTab('login');
  goPage('pg-auth');
  toast('🗑️ تم حذف الحساب','info');
}

/* ── PARTICLES ─────────────────────────────────── */
function buildParticles(){
  var c=el('authBg'); if(!c) return;
  for(var i=0;i<20;i++){
    var d=document.createElement('div'); d.className='abg-p';
    var s=Math.random()*16+5;
    d.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*13+8)+'s;animation-delay:'+(Math.random()*10)+'s;';
    c.appendChild(d);
  }
}

/* ── BOOT ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',function(){
  buildParticles();
  buildSearchIndex();

  // Theme
  var th=localStorage.getItem('edu_theme');
  if(th==='dark'){ isDark=true; document.documentElement.setAttribute('data-theme','dark'); }

  // Session
  var s=getSess();
  if(s && s.name){
    isGuest=false;
    curStage=s.stage||null; curBranch=s.branch||null;
    updatePills(s.name);
    showBottomNav(true);
    if(!curStage){ openStagePicker('first'); }
    else { buildGradePage(); goPage('pg-grade'); setNavActive('home'); }
  } else {
    showBottomNav(false);
    goPage('pg-auth');
  }

  // Enter key
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter') return;
    var fl=el('frm-login'), fr=el('frm-register');
    if(fl&&!fl.classList.contains('hidden')) doLogin();
    else if(fr&&!fr.classList.contains('hidden')) doRegister();
  });
});