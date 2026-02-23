/* ═══════════════════════════════════════════════
   دوروز — app.js
   Supabase-connected | Full Auth | Live Content
═══════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────── */
var SB_URL = 'https://dbzlvpcudhmodthrairs.supabase.co';
var SB_KEY = 'sb_publishable_Vza6oiH3BYu7SnFN94qWLw_nQRV3HG9';

/* ── SUPABASE REST ───────────────────────────── */
async function sb(table, method, body, query){
  var url = SB_URL+'/rest/v1/'+table+(query||'');
  var headers = {
    'apikey': SB_KEY,
    'Authorization': 'Bearer '+SB_KEY,
    'Content-Type': 'application/json'
  };
  if(method==='POST'||method==='PATCH') headers['Prefer']='return=representation';
  var opts = {method:method||'GET', headers:headers};
  if(body) opts.body=JSON.stringify(body);
  var r = await fetch(url, opts);
  if(!r.ok){
    var txt=await r.text();
    try{ var j=JSON.parse(txt); throw new Error(j.message||j.hint||j.error||txt); }
    catch(e2){ if(e2.message===txt) throw new Error('خطأ '+r.status+': '+txt.slice(0,120)); throw e2; }
  }
  var ct=r.headers.get('content-type')||'';
  if(ct.includes('json')&&r.status!==204){try{return await r.json();}catch(e){return null;}}
  return null;
}

/* ── DATA ────────────────────────────────────── */
var ALL_GRADES = [
  {id:'p1',name:'أول ابتدائي',  icon:'🌼',bg:'linear-gradient(135deg,#22c55e,#15803d)',stage:'primary',  sub:'مواد دراسية'},
  {id:'p2',name:'ثاني ابتدائي', icon:'🌻',bg:'linear-gradient(135deg,#22c55e,#15803d)',stage:'primary',  sub:'مواد دراسية'},
  {id:'p3',name:'ثالث ابتدائي', icon:'🌷',bg:'linear-gradient(135deg,#16a34a,#166534)',stage:'primary',  sub:'مواد دراسية'},
  {id:'p4',name:'رابع ابتدائي', icon:'🍀',bg:'linear-gradient(135deg,#16a34a,#166534)',stage:'primary',  sub:'مواد دراسية'},
  {id:'p5',name:'خامس ابتدائي', icon:'🌿',bg:'linear-gradient(135deg,#15803d,#14532d)',stage:'primary',  sub:'مواد دراسية'},
  {id:'p6',name:'سادس ابتدائي', icon:'🌱',bg:'linear-gradient(135deg,#15803d,#14532d)',stage:'primary',  sub:'مواد دراسية'},
  {id:'m1',name:'أول متوسط',    icon:'📗',bg:'linear-gradient(135deg,#667eea,#764ba2)',stage:'middle',   sub:'مواد دراسية'},
  {id:'m2',name:'ثاني متوسط',   icon:'📙',bg:'linear-gradient(135deg,#7c3aed,#6d28d9)',stage:'middle',   sub:'مواد دراسية'},
  {id:'m3',name:'ثالث متوسط',   icon:'📕',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)',stage:'middle',   sub:'مواد دراسية'},
  {id:'s1',name:'رابع إعدادي',  icon:'🧪',bg:'linear-gradient(135deg,#f59e0b,#d97706)',stage:'secondary',sub:'مواد دراسية'},
  {id:'s2',name:'خامس إعدادي',  icon:'⚗️',bg:'linear-gradient(135deg,#ea580c,#c2410c)',stage:'secondary',sub:'مواد دراسية'},
  {id:'s3',name:'سادس إعدادي',  icon:'🔭',bg:'linear-gradient(135deg,#dc2626,#b91c1c)',stage:'secondary',sub:'مواد دراسية'},
  {id:'vb1',name:'فرع صناعي',   icon:'🏭',bg:'linear-gradient(135deg,#db2777,#be185d)',stage:'vocational',sub:'مهني متخصص',branch:'industrial'},
  {id:'vb2',name:'فرع تجاري',   icon:'💼',bg:'linear-gradient(135deg,#0ea5e9,#0284c7)',stage:'vocational',sub:'مهني متخصص',branch:'commerce'},
  {id:'vb3',name:'فرع زراعي',   icon:'🌾',bg:'linear-gradient(135deg,#22c55e,#15803d)',stage:'vocational',sub:'مهني متخصص',branch:'agriculture'},
  {id:'vb4',name:'فرع سياحة',   icon:'✈️',bg:'linear-gradient(135deg,#f59e0b,#d97706)',stage:'vocational',sub:'مهني متخصص',branch:'tourism'},
  {id:'vb5',name:'فرع حاسوب',   icon:'💻',bg:'linear-gradient(135deg,#6366f1,#4f46e5)',stage:'vocational',sub:'مهني متخصص',branch:'computer'},
  {id:'vb6',name:'تقنيات حاسوب',icon:'🖥️',bg:'linear-gradient(135deg,#8b5cf6,#7c3aed)',stage:'vocational',sub:'مهني متخصص',branch:'tech'},
  {id:'vb7',name:'فنون تطبيقية',icon:'🎨',bg:'linear-gradient(135deg,#ec4899,#be185d)',stage:'vocational',sub:'مهني متخصص',branch:'arts'}
];

var STAGES_META = {
  primary:   {name:'الابتدائية', icon:'🌱',bg:'linear-gradient(135deg,#22c55e,#16a34a)'},
  middle:    {name:'المتوسطة',   icon:'📘',bg:'linear-gradient(135deg,#667eea,#764ba2)'},
  secondary: {name:'الإعدادية',  icon:'🔬',bg:'linear-gradient(135deg,#ea580c,#c2410c)'},
  vocational:{name:'المهني',     icon:'⚙️',bg:'linear-gradient(135deg,#db2777,#be185d)'}
};

var SUBJ_SCI = [
  {id:'arabic', label:'اللغة العربية',    emoji:'📝',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},
  {id:'islamic',label:'التربية الإسلامية',emoji:'🕌',cover:'linear-gradient(135deg,#059669,#065f46)'},
  {id:'english',label:'اللغة الإنكليزية',emoji:'🌍',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},
  {id:'math',   label:'الرياضيات',        emoji:'🔢',cover:'linear-gradient(135deg,#667eea,#764ba2)'},
  {id:'chem',   label:'الكيمياء',         emoji:'⚗️',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},
  {id:'phys',   label:'الفيزياء',         emoji:'⚡',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},
  {id:'bio',    label:'الأحياء',          emoji:'🌿',cover:'linear-gradient(135deg,#22c55e,#15803d)'},
  {id:'social', label:'اجتماعيات',        emoji:'🗺️',cover:'linear-gradient(135deg,#ec4899,#be185d)'}
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

var CURRICULUM = {
  arabic: ['الفصل الأول: النحو والصرف|الفعل، الفاعل، المفعول به، الحال، التمييز','الفصل الثاني: البلاغة|المجاز، الاستعارة، التشبيه، الكناية','الفصل الثالث: الأدب|الشعر الجاهلي، الإسلامي، العباسي'],
  islamic:['الفصل الأول: العقيدة|التوحيد، أركان الإيمان، أسماء الله الحسنى','الفصل الثاني: الفقه|الطهارة، الصلاة، الزكاة، الصيام، الحج','الفصل الثالث: السيرة|المولد، البعثة، الهجرة، الغزوات'],
  english:['Unit 1: Grammar|Tenses, Modals, Conditionals, Passive Voice','Unit 2: Reading|Comprehension, Inference, Critical Thinking','Unit 3: Writing|Essays, Reports, Letters, Summaries'],
  math:   ['الوحدة الأولى: الجبر|المعادلات، المتباينات، الاقترانات','الوحدة الثانية: الهندسة|المثلثات، الدوائر، التحويلات','الوحدة الثالثة: الإحصاء|التوزيعات، الاحتمالات'],
  chem:   ['الوحدة الأولى: التركيب الذري|الجدول الدوري، الإلكترونات','الوحدة الثانية: التفاعلات|أنواعها، الكيمياء الحرارية','الوحدة الثالثة: العضوية|الهيدروكربونات، المجاميع الوظيفية'],
  phys:   ['الوحدة الأولى: الميكانيكا|الحركة، القوى، قوانين نيوتن','الوحدة الثانية: الكهرباء|التيار، الجهد، المقاومة','الوحدة الثالثة: الموجات|الضوء، الصوت، الأشعة'],
  bio:    ['الوحدة الأولى: الخلية|البناء، الوظيفة، الانقسام','الوحدة الثانية: الأجهزة|الهضم، التنفس، الدورة الدموية','الوحدة الثالثة: الوراثة|الجينات، قوانين مندل'],
  social: ['الوحدة الأولى: التاريخ|الحضارات، الإسلام، الحداثة','الوحدة الثانية: الجغرافيا|التضاريس، المناخ، السكان','الوحدة الثالثة: التربية الوطنية|الدستور، المؤسسات'],
  history:['الوحدة الأولى: الحضارات|مصر، الرافدين، اليونان','الوحدة الثانية: العصور الوسطى|الإسلام، أوروبا','الوحدة الثالثة: الحديث|الثورات، الاستعمار'],
  geo:    ['الوحدة الأولى: الطبيعية|التضاريس، المناخ، المياه','الوحدة الثانية: البشرية|السكان، المدن، الاقتصاد','الوحدة الثالثة: الخرائط|أنواعها، قراءتها، رسمها'],
  philo:  ['الوحدة الأولى: المنطق|الاستدلال، القياس، الاستقراء','الوحدة الثانية: الفلسفة|سقراط، أفلاطون، أرسطو','الوحدة الثالثة: الأخلاق|النظريات الأخلاقية، القيم']
};

/* ── نظام الاختبارات الجديد ── */
var COURSE_NAMES  = {'1':'الكورس الأول','2':'الكورس الثاني','ns':'—','ls':'—'};
var COURSE_LABELS = {'1':'📚 الكورس الأول','2':'📖 الكورس الثاني','ns':'📊 نصف السنة','ls':'🏁 آخر السنة'};
var EXAM_COLORS   = {
  'شهر أول':'#667eea','شهر ثاني':'#8b5cf6',
  'نصف السنة':'#f59e0b','آخر السنة':'#dc2626'
};
// الأنواع المتاحة لكل كورس
var COURSE_TYPES = {
  '1':  ['شهر أول','شهر ثاني'],
  '2':  ['شهر أول','شهر ثاني'],
  'ns': ['نصف السنة'],
  'ls': ['آخر السنة']
};

/* ── STATE ───────────────────────────────────── */
var curStage=null, curBranch=null, curGrade=null, curSubject=null;
var curCTab='booklets', curFilter='all';
var isDark=false, isGuest=false;
var searchIdx=[];

/* ── SESSION (localStorage) ──────────────────── */
function getSess(){ try{return JSON.parse(localStorage.getItem('dz_sess'))||null;}catch(e){return null;} }
function setSess(s){ localStorage.setItem('dz_sess',JSON.stringify(s)); }
function getFavs(){ try{return JSON.parse(localStorage.getItem('dz_favs'))||[];}catch(e){return[];} }
function setFavs(f){ localStorage.setItem('dz_favs',JSON.stringify(f)); }

/* ── UTILS ───────────────────────────────────── */
function el(id){ return document.getElementById(id); }
function goPage(pid){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});
  el(pid).classList.add('active');
  window.scrollTo(0,0);
}
function toast(msg,type){
  var t=el('toast'); if(!t)return;
  var c={ok:'linear-gradient(135deg,#059669,#047857)',err:'linear-gradient(135deg,#dc2626,#b91c1c)',info:'linear-gradient(135deg,#1e1b4b,#312e81)',warn:'linear-gradient(135deg,#ea580c,#c2410c)'};
  t.style.background=c[type]||c.info; t.textContent=msg;
  t.classList.remove('hidden','show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.classList.add('hidden');},400);},2800);
}
function openModal(id){var o=el(id);if(!o)return;o.classList.remove('hidden');document.body.style.overflow='hidden';o.onclick=function(e){if(e.target===o)closeModal(id);};}
function closeModal(id){var o=el(id);if(!o)return;o.classList.add('hidden');document.body.style.overflow='';}
function showBottomNav(s){var n=el('bottomNav');if(n){if(s)n.classList.remove('hidden');else n.classList.add('hidden');}}
function setNavActive(k){
  var m={home:'bnav-home',search:'bnav-search',favs:'bnav-favs',profile:'bnav-profile',settings:'bnav-settings'};
  document.querySelectorAll('.bnb').forEach(function(b){b.classList.remove('active');});
  var t=el(m[k]); if(t)t.classList.add('active');
}
function updatePills(n){
  document.querySelectorAll('.user-pill').forEach(function(p){p.textContent=n.charAt(0).toUpperCase();});
}

/* ── SETTINGS ────────────────────────────────── */
function openSettings(){syncSettingsUI();openModal('ov-settings');setNavActive('settings');}
function syncSettingsUI(){
  var s=getSess();
  var av=el('set-avatar'),un=el('set-uname'),us=el('set-ustage');
  if(s&&s.name){if(av)av.textContent=s.name.charAt(0).toUpperCase();if(un)un.textContent=s.name;}
  else{if(av)av.textContent='؟';if(un)un.textContent='زائر';}
  if(us)us.textContent=(curStage&&STAGES_META[curStage])?STAGES_META[curStage].name:'لم تختر مرحلة';
  var lbl=el('set-theme-lbl');if(lbl)lbl.textContent=isDark?'الوضع الليلي':'الوضع النهاري';
}
function askChangeStage(){closeModal('ov-settings');setTimeout(function(){openModal('ov-changestage');},200);}
function doChangeStage(){closeModal('ov-changestage');setTimeout(function(){openStagePicker('change');},200);}
function toggleTheme(){
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  localStorage.setItem('dz_theme',isDark?'dark':'light');
  var lbl=el('set-theme-lbl');if(lbl)lbl.textContent=isDark?'الوضع الليلي':'الوضع النهاري';
  toast(isDark?'🌙 الوضع الليلي':'☀️ الوضع النهاري','info');
}

/* ── STAGE PICKER ────────────────────────────── */
function openStagePicker(mode){
  var title=el('picker-title'),sub=el('picker-sub'),grid=el('picker-grid');
  if(title)title.textContent=mode==='change'?'اختر مرحلة جديدة':'اختر مرحلتك الدراسية';
  if(sub)sub.textContent='اختر مرحلتك لعرض المحتوى المناسب';
  var stages=['primary','middle','secondary','vocational'];
  var html='';
  stages.forEach(function(st){
    var m=STAGES_META[st];
    html+='<div class="pk-item" onclick="pickStage(\''+st+'\')">'
        +'<div class="pk-ic" style="background:'+m.bg+'">'+m.icon+'</div>'
        +'<div class="pk-nm">'+m.name+'</div>'
        +'<div class="pk-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></div>'
        +'</div>';
  });
  if(grid)grid.innerHTML=html;
  openModal('ov-picker');
}

async function pickStage(stageId){
  curStage=stageId; curBranch=null;
  var s=getSess();
  if(s&&s.name){
    s.stage=stageId; s.branch=null; setSess(s);
    if(s.id){try{await sb('users','PATCH',{stage:stageId,branch:null},'?id=eq.'+s.id);}catch(e){}}
  }
  closeModal('ov-picker');
  toast('✅ تم اختيار '+STAGES_META[stageId].name,'ok');
  setTimeout(function(){buildGradePage();goPage('pg-grade');setNavActive('home');},300);
}

/* ── AUTH ────────────────────────────────────── */
function switchTab(tab){
  var isL=tab==='login';
  el('frm-login').classList.toggle('hidden',!isL);
  el('frm-register').classList.toggle('hidden',isL);
  el('tab-login').classList.toggle('active',isL);
  el('tab-reg').classList.toggle('active',!isL);
  el('tab-line').style.right=isL?'0':'50%';
  el('tab-line').style.left=isL?'auto':'0';
  el('l-err').textContent='';el('r-err').textContent='';
}

function toggleEye(iid,bid){
  var inp=el(iid);if(!inp)return;
  var isP=inp.type==='password'; inp.type=isP?'text':'password';
  var b=el(bid);if(!b)return;
  b.innerHTML=isP
    ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

async function doLogin(){
  var name=el('l-name').value.trim(), pass=el('l-pass').value, err=el('l-err');
  err.textContent='';
  if(!name){err.textContent='⚠️ أدخل اسمك';return;}
  if(!pass){err.textContent='⚠️ أدخل كلمة المرور';return;}
  var btn=document.querySelector('#frm-login .btn-auth');
  if(btn){btn.textContent='جارٍ الدخول...';btn.disabled=true;}
  try{
    var rows=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(name.toLowerCase())+'&password=eq.'+encodeURIComponent(pass)+'&select=*');
    if(!rows||!rows.length){err.textContent='⚠️ اسم أو كلمة مرور خاطئة';}
    else{
      var u=rows[0];
      try{await sb('users','PATCH',{last_login:new Date().toISOString()},'?id=eq.'+u.id);}catch(e){}
      setSess({id:u.id,name:u.display_name,stage:u.stage||null,branch:u.branch||null,joined:new Date(u.joined_at).getTime()});
      isGuest=false; curStage=u.stage||null; curBranch=u.branch||null;
      updatePills(u.display_name); showBottomNav(true);
      toast('👋 أهلاً '+u.display_name,'ok');
      if(!curStage){openStagePicker('first');}else{buildGradePage();goPage('pg-grade');setNavActive('home');}
    }
  }catch(e){err.textContent='⚠️ خطأ: '+e.message;}
  if(btn){btn.textContent='دخول';btn.disabled=false;}
}

async function doRegister(){
  var name=el('r-name').value.trim();
  var pass=el('r-pass').value;
  var pass2=el('r-pass2').value;
  var err=el('r-err');
  err.textContent='';
  // التحقق من المدخلات
  if(!name){err.textContent='⚠️ أدخل اسمك';return;}
  if(name.length<2){err.textContent='⚠️ الاسم قصير جداً (٢ أحرف على الأقل)';return;}
  if(name.length>30){err.textContent='⚠️ الاسم طويل جداً';return;}
  if(!pass){err.textContent='⚠️ أدخل كلمة المرور';return;}
  if(pass.length<4){err.textContent='⚠️ كلمة المرور ٤ أحرف على الأقل';return;}
  if(pass!==pass2){err.textContent='⚠️ كلمتا المرور غير متطابقتين';return;}
  var btn=document.querySelector('#frm-register .btn-auth');
  if(btn){btn.textContent='جارٍ إنشاء الحساب...';btn.disabled=true;}
  try{
    // فحص تكرار الاسم
    var existing=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(name.toLowerCase())+'&select=id');
    if(existing&&existing.length){
      err.textContent='⚠️ هذا الاسم مسجل مسبقاً، جرّب اسماً آخر';
      if(btn){btn.textContent='إنشاء حساب';btn.disabled=false;}
      return;
    }
    // إنشاء الحساب في Supabase (جدول users)
    var now=new Date().toISOString();
    var rows=await sb('users','POST',{
      username: name.toLowerCase().trim(),
      password: pass,
      display_name: name,
      stage: null,
      branch: null,
      joined_at: now,
      last_login: now
    });
    if(!rows||!rows.length){
      err.textContent='⚠️ فشل إنشاء الحساب، حاول مجدداً';
      if(btn){btn.textContent='إنشاء حساب';btn.disabled=false;}
      return;
    }
    var u=rows[0];
    // حفظ الجلسة محلياً
    setSess({id:u.id,name:u.display_name,stage:null,branch:null,joined:Date.now()});
    isGuest=false; curStage=null; curBranch=null;
    updatePills(u.display_name);
    showBottomNav(true);
    toast('🎉 أهلاً '+u.display_name+'! حسابك جاهز','ok');
    openStagePicker('first');
  }catch(e){
    console.error('Register error:',e);
    err.textContent='⚠️ خطأ: '+e.message;
    if(btn){btn.textContent='إنشاء حساب';btn.disabled=false;}
  }
}

function doGuest(){
  isGuest=true; curStage=null; curBranch=null;
  updatePills('ض'); showBottomNav(true);
  toast('👤 دخلت كضيف','info');
  openStagePicker('first');
}

function doLogout(){
  closeModal('ov-settings');
  setTimeout(function(){
    if(!confirm('تسجيل الخروج؟'))return;
    localStorage.removeItem('dz_sess');
    curStage=null;curBranch=null;curGrade=null;isGuest=false;
    showBottomNav(false); switchTab('login');
    var ln=el('l-name'),lp=el('l-pass');
    if(ln)ln.value='';if(lp)lp.value='';if(el('l-err'))el('l-err').textContent='';
    toast('👋 تم تسجيل الخروج','info');
    goPage('pg-auth');
  },100);
}

/* ── BOTTOM NAV ──────────────────────────────── */
function bottomNav(k){
  setNavActive(k);
  if(k==='home'){buildGradePage();goPage('pg-grade');}
  else if(k==='search'){goPage('pg-search');var i=el('search-inp');if(i)i.focus();}
  else if(k==='favs'){buildFavsPage();goPage('pg-favs');}
  else if(k==='profile'){buildProfile();goPage('pg-profile');}
  else if(k==='settings'){openSettings();}
}

/* ── GRADE PAGE ──────────────────────────────── */
function buildGradePage(){
  var pg=el('pg-grade');if(!pg)return;
  var grades=ALL_GRADES.filter(function(g){return g.stage===curStage;});
  var hdr=el('grade-hd-title');
  if(hdr&&STAGES_META[curStage])hdr.textContent=STAGES_META[curStage].name;
  var grid=el('grade-grid');if(!grid)return;
  var html='';
  grades.forEach(function(g){
    html+='<div class="grade-card" onclick="openGrade(\''+g.id+'\')" style="background:'+g.bg+';animation-delay:'+(grades.indexOf(g)*0.04)+'s">'
        +'<div class="gc-ic">'+g.icon+'</div>'
        +'<div class="gc-nm">'+g.name+'</div>'
        +'<div class="gc-sub">'+g.sub+'</div>'
        +'</div>';
  });
  grid.innerHTML=html;
}

function openGrade(gid){
  var g=ALL_GRADES.find(function(x){return x.id===gid;});if(!g)return;
  curGrade=gid;
  var isSci=['s1','s2','s3','m1','m2','m3'].indexOf(gid)!==-1;
  var isLit=['s1','s2','s3'].indexOf(gid)!==-1;
  var subjs=(isLit&&curBranch!=='sci')?SUBJ_LIT:SUBJ_SCI;
  // Vocational: use sci
  var strip=el('sub-strip');
  if(strip){
    strip.innerHTML=subjs.map(function(s,i){
      return'<div class="sub-item'+(i===0?' active':'')+'" onclick="openSubject(\''+s.id+'\',this)" style="animation-delay:'+(i*0.03)+'s">'
          +'<div class="sub-ic" style="background:'+s.cover+'">'+s.emoji+'</div>'
          +'<span>'+s.label+'</span></div>';
    }).join('');
  }
  curSubject=subjs[0].id;
  var hdr=el('class-tbar-title');if(hdr)hdr.textContent=g.name;
  var sub=el('class-tbar-sub');if(sub)sub.textContent='المواد الدراسية';
  curCTab='booklets';
  document.querySelectorAll('.ctab').forEach(function(t){t.classList.remove('active');});
  var firstTab=document.querySelector('.ctab');if(firstTab)firstTab.classList.add('active');
  goPage('pg-class');
  renderContent();
}

function openSubject(sid,el_){
  curSubject=sid; curCTab='booklets';
  document.querySelectorAll('.sub-item').forEach(function(s){s.classList.remove('active');});
  if(el_)el_.classList.add('active');
  document.querySelectorAll('.ctab').forEach(function(t){t.classList.remove('active');});
  var ft=document.querySelector('.ctab');if(ft)ft.classList.add('active');
  renderContent();
}

function switchCTab(tab,el_){
  curCTab=tab;
  document.querySelectorAll('.ctab').forEach(function(t){t.classList.remove('active');});
  if(el_)el_.classList.add('active');
  renderContent();
}

function getSubj(id){
  return SUBJ_SCI.find(function(s){return s.id===id;})||SUBJ_LIT.find(function(s){return s.id===id;})||null;
}

/* ── RENDER CONTENT (with Supabase) ──────────── */
function renderContent(){
  var subj=getSubj(curSubject);if(!subj)return;
  var labels={booklets:'الملازم الدراسية',exams:'الاختبارات',favs:'مكتبتي',curriculum:'المنهج الدراسي'};
  var head='<div class="subj-hd">'
          +'<div class="subj-hd-ic" style="background:'+subj.cover+'">'+subj.emoji+'</div>'
          +'<div><div class="subj-hd-name">'+subj.label+'</div>'
          +'<div class="subj-hd-hint">'+labels[curCTab]+'</div></div></div>';

  var spinner='<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';
  el('class-body').innerHTML=head+spinner;

  if(curCTab==='booklets')     loadBooklets(subj,head);
  else if(curCTab==='exams')   loadExams(subj,head);
  else if(curCTab==='favs')    el('class-body').innerHTML=head+renderFavsSection(subj);
  else                          el('class-body').innerHTML=head+renderCurriculum(subj);
}

async function loadBooklets(subj,head){
  try{
    var q='?is_visible=eq.true&stage=eq.'+curStage+'&subject_id=eq.'+subj.id+'&order=created_at.asc';
    var rows=(await sb('booklets','GET',null,q))||[];
    if(!rows.length){
      el('class-body').innerHTML=head+'<div class="state-box"><div class="state-ic">📚</div><h3>لا توجد ملازم بعد</h3><p>ترقب المحتوى قريباً</p></div>';
      return;
    }
    var html='<div class="sec-lbl">📂 الملازم ('+rows.length+')</div><div class="bk-grid">';
    rows.forEach(function(b){
      var fid='bk-'+b.id, isFav=isFaved(fid);
      var safe=b.name.replace(/'/g,'&#39;');
      var coverHtml=b.cover_url
        ?'<img src="'+b.cover_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:inherit" onerror="this.parentNode.textContent=\''+b.emoji+'\'"/>'
        :b.emoji;
      html+='<div class="bk-card">'
          +'<div class="bk-cover" style="background:'+(b.cover_url?'none':b.color||subj.cover)+'">'+coverHtml+'</div>'
          +'<div class="bk-body">'
          +'<div class="bk-name">'+b.name+'</div>'
          +'<div class="bk-meta">📖 '+b.subject_name+(b.grade?' — '+b.grade:'')+'</div>'
          +'<div class="bk-actions">'
          +(b.file_url?'<button class="btn-view" onclick="openFile(\''+b.file_url+'\')">👁 عرض</button>':'<button class="btn-view" disabled style="opacity:.45">غير متاح</button>')
          +(b.file_url?'<a class="btn-dl" href="'+b.file_url+'" download target="_blank">⬇ تحميل</a>':'<button class="btn-dl" disabled style="opacity:.45">⬇ تحميل</button>')
          +'</div>'
          +'<button class="bk-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'ملزمة\',\''+(b.color||subj.cover)+'\',\''+(b.emoji||'📝')+'\')">'
          +'<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
          +(isFav?'محفوظة':'حفظ')+'</button>'
          +'</div></div>';
    });
    el('class-body').innerHTML=head+html+'</div>';
  }catch(e){
    el('class-body').innerHTML=head+'<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
}

async function loadExams(subj,head){
  try{
    var q='?is_visible=eq.true&stage=eq.'+curStage+'&subject_id=eq.'+subj.id+'&order=created_at.asc';
    var rows=(await sb('exams','GET',null,q))||[];
    if(!rows.length){
      el('class-body').innerHTML=head+'<div class="state-box"><div class="state-ic">📝</div><h3>لا توجد اختبارات بعد</h3><p>ترقب المحتوى قريباً</p></div>';
      return;
    }
    var groups={'1':[],'2':[],'ns':[],'ls':[]};
    rows.forEach(function(ex){
      var c=String(ex.course||'1');
      if(!groups[c])groups[c]=[];
      groups[c].push(ex);
    });
    var html='<div class="sec-lbl">📝 الاختبارات ('+rows.length+')</div>';
    var groupInfo={
      '1':  {label:'📚 الكورس الأول',  color:'#667eea'},
      '2':  {label:'📖 الكورس الثاني', color:'#8b5cf6'},
      'ns': {label:'📊 نصف السنة',     color:'#f59e0b'},
      'ls': {label:'🏁 آخر السنة',     color:'#dc2626'}
    };
    ['1','2','ns','ls'].forEach(function(cKey){
      var cExams=groups[cKey];
      if(!cExams||!cExams.length)return;
      var gi=groupInfo[cKey];
      html+='<div class="course-section"><div class="course-hd" style="border-right:3px solid '+gi.color+';padding-right:10px">'+gi.label+'</div><div class="exam-list">';
      cExams.forEach(function(ex){
        var fid='ex-'+ex.id;
        var isFav=isFaved(fid);
        var safe=ex.name.replace(/'/g,"\\'");
        var color=ex.color||EXAM_COLORS[ex.exam_type]||gi.color;
        var badge=ex.exam_type||(cKey==='ns'?'نصف السنة':cKey==='ls'?'آخر السنة':'اختبار');
        html+='<div class="exam-item">';
        html+='<div class="exam-badge" style="background:'+color+'">'+badge+'</div>';
        html+='<div class="exam-info"><div class="exam-name">'+ex.name+'</div>';
        html+='<div class="exam-meta">'+ex.subject_name+(ex.academic_year?' — '+ex.academic_year:'')+'</div></div>';
        html+='<div class="exam-actions">';
        if(ex.file_url){
          html+='<a class="btn-exam" href="'+ex.file_url+'" target="_blank">⬇ تحميل</a>';
        }else{
          html+='<button class="btn-exam" disabled style="opacity:.45">غير متاح</button>';
        }
        var favFill=isFav?'#f43f5e':'none';
        var favCls='exam-fav'+(isFav?' saved':'');
        html+='<button class="'+favCls+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'اختبار\',\''+color+'\',\'📝\')">';
        html+='<svg viewBox="0 0 24 24" fill="'+favFill+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';
        html+='</button></div></div>';
      });
      html+='</div></div>';
    });
    el('class-body').innerHTML=head+html;
  }catch(e){
    el('class-body').innerHTML=head+'<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ</h3><p>'+e.message+'</p></div>';
  }
}

function openFile(url){window.open(url,'_blank');}

function renderCurriculum(subj){
  var units=CURRICULUM[subj.id]||[];
  if(!units.length)return'<div class="sec-lbl">المنهج غير متاح</div>';
  var html='<div class="sec-lbl">📖 المنهج — '+subj.label+'</div><div class="curr-list">';
  units.forEach(function(u,i){
    var p=u.split('|'),title=p[0].trim(),lessons=p[1]?p[1].split('،'):[];
    html+='<div class="curr-unit" id="cu-'+i+'">'
        +'<div class="curr-head" onclick="toggleUnit('+i+')">'
        +'<div class="curr-htitle">📚 '+title+'</div>'
        +'<div class="curr-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>'
        +'</div><div class="curr-body">';
    lessons.forEach(function(l){html+='<div class="curr-lesson">'+l.trim()+'</div>';});
    html+='</div></div>';
  });
  return html+'</div>';
}

function toggleUnit(i){var u=el('cu-'+i);if(u)u.classList.toggle('open');}

/* ── FAVORITES ───────────────────────────────── */
function isFaved(id){return getFavs().some(function(f){return f.id===id;});}

function toggleFav(id,name,meta,type,cover,emoji){
  if(isGuest){
    toast('⚠️ ⚠️ سجّل حساباً لإضافة محتوى لمكتبتك','warn');return;
  }
  var favs=getFavs();
  var idx=favs.findIndex(function(f){return f.id===id;});
  if(idx!==-1){
    favs.splice(idx,1);setFavs(favs);
    toast('💔 تم الإزالة من مكتبتي','info');
  }else{
    favs.push({id:id,name:name,meta:meta,type:type,cover:cover,emoji:emoji});
    setFavs(favs);toast('❤️ تم الحفظ في مكتبتي','ok');
  }
  var btn=el('favbtn-'+id);
  if(btn){
    var now=isFaved(id);
    btn.className='bk-fav'+(btn.className.includes('exam-fav')?'':' ')+(now?' saved':'');
    if(type==='اختبار')btn.className='exam-fav'+(now?' saved':'');
    else btn.className='bk-fav'+(now?' saved':'');
    btn.querySelector('svg').setAttribute('fill',now?'#f43f5e':'none');
    btn.childNodes[btn.childNodes.length-1].textContent=type==='اختبار'?'':now?'محفوظة':'حفظ';
  }
}

function renderFavsSection(subj){
  var favs=getFavs().filter(function(f){return f.meta===subj.label;});
  if(!favs.length)return'<div class="state-box"><div class="state-ic">🔖</div><h3>لا محفوظات لهذه المادة</h3><p>اضغط ❤️ لإضافة ملزمة أو اختبار لمكتبتك</p></div>';
  var html='<div class="sec-lbl">❤️ مكتبتك ('+favs.length+')</div><div class="exam-list">';
  favs.forEach(function(f){
    html+='<div class="exam-item">'
        +'<div class="exam-badge" style="background:'+f.cover+'">'+f.emoji+'</div>'
        +'<div class="exam-info"><div class="exam-name">'+f.name+'</div><div class="exam-meta">'+f.type+'</div></div>'
        +'<button class="fav-del" onclick="removeFav(\''+f.id+'\')">'
        +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        +'</button></div>';
  });
  return html+'</div>';
}

function removeFav(id){
  var favs=getFavs().filter(function(f){return f.id!==id;});
  setFavs(favs);toast('💔 تم الإزالة','info');buildFavsPage();
}

function buildFavsPage(){
  var favs=getFavs();
  var list=el('favs-list'),empty=el('favs-empty');
  if(!favs.length){if(list)list.innerHTML='';if(empty)empty.classList.remove('hidden');return;}
  if(empty)empty.classList.add('hidden');
  var html='';
  favs.forEach(function(f){
    html+='<div class="fav-item">'
        +'<div class="fav-ic" style="background:'+f.cover+'">'+f.emoji+'</div>'
        +'<div class="fav-info"><div class="fav-name">'+f.name+'</div><div class="fav-meta">'+f.meta+' · '+f.type+'</div></div>'
        +'<span class="fav-type" style="background:'+(f.type==='ملزمة'?'#22c55e':'#667eea')+'">'+f.type+'</span>'
        +'<button class="fav-del" onclick="removeFav(\''+f.id+'\')">'
        +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>'
        +'</button></div>';
  });
  if(list)list.innerHTML=html;
}

/* ── SEARCH ──────────────────────────────────── */
function buildSearchIndex(){
  searchIdx=[];
  var allSubj=SUBJ_SCI.concat(SUBJ_LIT.filter(function(s){return!SUBJ_SCI.find(function(x){return x.id===s.id;});}));
  allSubj.forEach(function(s){
    searchIdx.push({type:'subjects',name:s.label,emoji:s.emoji,cover:s.cover,meta:'مادة دراسية'});
  });
  ALL_GRADES.forEach(function(g){
    searchIdx.push({type:'grade',name:g.name,emoji:g.icon,cover:g.bg,meta:'صف — '+STAGES_META[g.stage].name});
  });
}

function setFilter(f,btn){
  curFilter=f;
  document.querySelectorAll('.sf').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  var inp=el('search-inp');if(inp&&inp.value.trim())doSearch(inp.value);
}

function doSearch(q){
  q=q.trim();
  var clr=el('s-clear');if(clr)clr.classList.toggle('hidden',!q);
  var start=el('sr-start'),empty=el('sr-empty'),list=el('sr-list');
  if(!q){start.classList.remove('hidden');empty.classList.add('hidden');list.innerHTML='';return;}
  start.classList.add('hidden');
  var filtered=searchIdx.filter(function(item){
    var tm=curFilter==='all'||item.type===curFilter;
    var qm=item.name.toLowerCase().indexOf(q.toLowerCase())!==-1||item.meta.toLowerCase().indexOf(q.toLowerCase())!==-1;
    return tm&&qm;
  });
  if(!filtered.length){empty.classList.remove('hidden');list.innerHTML='';return;}
  empty.classList.add('hidden');
  var tc={subjects:'#667eea',booklets:'#22c55e',exams:'#f59e0b',grade:'#0ea5e9'};
  var tn={subjects:'مادة',booklets:'ملزمة',exams:'اختبار',grade:'صف'};
  var html='';
  filtered.slice(0,25).forEach(function(item,i){
    var hl=item.name.replace(new RegExp('('+item.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>');
    html+='<div class="sr-item" style="animation-delay:'+(i*0.03)+'s">'
        +'<div class="sr-ic" style="background:'+item.cover+'">'+item.emoji+'</div>'
        +'<div class="sr-info"><div class="sr-name">'+hl+'</div><div class="sr-meta">'+item.meta+'</div></div>'
        +'<span class="sr-tag" style="background:'+(tc[item.type]||'#667eea')+'">'+tn[item.type]+'</span>'
        +'</div>';
  });
  list.innerHTML=html;
}

function clearSearch(){
  var i=el('search-inp');if(i)i.value='';
  var c=el('s-clear');if(c)c.classList.add('hidden');
  el('sr-list').innerHTML='';
  el('sr-empty').classList.add('hidden');
  el('sr-start').classList.remove('hidden');
}

/* ── PROFILE ─────────────────────────────────── */
function buildProfile(){
  var s=getSess();if(!s){goPage('pg-auth');return;}
  var av=el('p-avatar');if(av)av.textContent=s.name.charAt(0).toUpperCase();
  var pn=el('p-name');if(pn)pn.textContent=s.name;
  var en=el('edit-name');if(en)en.value=s.name;
  var chip=el('p-chip');if(chip)chip.textContent=(curStage&&STAGES_META[curStage])?STAGES_META[curStage].name:'لم تختر مرحلة';
  var sd=el('st-days');if(sd&&s.joined)sd.textContent=Math.max(1,Math.floor((Date.now()-s.joined)/864e5));
  var sf=el('st-favs');if(sf)sf.textContent=getFavs().length;
  ['old-pass','new-pass'].forEach(function(id){var e=el(id);if(e)e.value='';});
  var pe=el('pass-err');if(pe)pe.textContent='';
}

async function saveName(){
  var newN=el('edit-name').value.trim();
  if(!newN||newN.length<2){toast('⚠️ الاسم قصير','warn');return;}
  var s=getSess();if(!s)return;
  try{
    var ex=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(newN.toLowerCase())+'&id=neq.'+s.id+'&select=id');
    if(ex&&ex.length){toast('⚠️ الاسم مستخدم','err');return;}
    await sb('users','PATCH',{display_name:newN,username:newN.toLowerCase()},'?id=eq.'+s.id);
    s.name=newN;setSess(s);buildProfile();updatePills(newN);
    toast('✅ تم تغيير الاسم','ok');
  }catch(e){toast('❌ '+e.message,'err');}
}

async function changePass(){
  var op=el('old-pass').value,np=el('new-pass').value,err=el('pass-err');
  err.textContent='';
  if(!op){err.textContent='⚠️ أدخل كلمة المرور الحالية';return;}
  if(!np||np.length<4){err.textContent='⚠️ ٤ أحرف على الأقل';return;}
  var s=getSess();if(!s)return;
  try{
    var rows=await sb('users','GET',null,'?id=eq.'+s.id+'&password=eq.'+encodeURIComponent(op)+'&select=id');
    if(!rows||!rows.length){err.textContent='⚠️ كلمة المرور الحالية خاطئة';return;}
    await sb('users','PATCH',{password:np},'?id=eq.'+s.id);
    el('old-pass').value='';el('new-pass').value='';
    toast('✅ تم تغيير كلمة المرور','ok');
  }catch(e){err.textContent='❌ '+e.message;}
}

async function deleteAccount(){
  if(!confirm('حذف الحساب نهائياً؟ لا يمكن التراجع!'))return;
  var s=getSess();
  if(s&&s.id){
    try{
      await sb('favorites','DELETE',null,'?username=eq.'+encodeURIComponent(s.name));
      await sb('users','DELETE',null,'?id=eq.'+s.id);
    }catch(e){}
  }
  localStorage.removeItem('dz_sess');
  localStorage.removeItem('dz_favs');
  curStage=null;curBranch=null;isGuest=false;
  showBottomNav(false);switchTab('login');goPage('pg-auth');
  toast('🗑️ تم حذف الحساب','info');
}

/* ── PARTICLES ───────────────────────────────── */
function buildParticles(){
  var c=el('authBg');if(!c)return;
  for(var i=0;i<20;i++){
    var d=document.createElement('div');d.className='abg-p';
    var s=Math.random()*16+5;
    d.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*13+8)+'s;animation-delay:'+(Math.random()*10)+'s;';
    c.appendChild(d);
  }
}

/* ── BOOT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',function(){
  buildParticles();
  buildSearchIndex();

  var th=localStorage.getItem('dz_theme');
  if(th==='dark'){isDark=true;document.documentElement.setAttribute('data-theme','dark');}

  var s=getSess();
  if(s&&s.name){
    isGuest=false;
    curStage=s.stage||null;curBranch=s.branch||null;
    updatePills(s.name);showBottomNav(true);
    if(!curStage){openStagePicker('first');}
    else{buildGradePage();goPage('pg-grade');setNavActive('home');}
  }else{
    showBottomNav(false);goPage('pg-auth');
  }

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;
    var fl=el('frm-login'),fr=el('frm-register');
    if(fl&&!fl.classList.contains('hidden'))doLogin();
    else if(fr&&!fr.classList.contains('hidden'))doRegister();
  });
});