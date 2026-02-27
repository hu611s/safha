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

var GRADE_SUBJECTS = {
  'p1': [{id:'quran',label:'القرآن الكريم',emoji:'📖',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#047857)'},{id:'reading',label:'القراءة',emoji:'📚',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'p3': [{id:'quran',label:'القرآن الكريم',emoji:'📖',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#047857)'},{id:'reading',label:'القراءة',emoji:'📚',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'p4': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'm1': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},{id:'cs',label:'حاسوب',emoji:'💻',img:'https://i.ibb.co/DD5N8Kwv/warning.png',cover:'linear-gradient(135deg,#6366f1,#4f46e5)'},{id:'ethics',label:'أخلاقية',emoji:'🧭',img:'https://i.ibb.co/Z6CpCq32/engagement.png',cover:'linear-gradient(135deg,#0ea5e9,#0284c7)'}],
  'm3': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}],
  's1': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'رياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},{id:'cs',label:'الحاسوب',emoji:'💻',img:'https://i.ibb.co/DD5N8Kwv/warning.png',cover:'linear-gradient(135deg,#6366f1,#4f46e5)'}],
  's3': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'رياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}],
  'p2': [{id:'quran',label:'القرآن الكريم',emoji:'📖',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#047857)'},{id:'reading',label:'القراءة',emoji:'📚',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'p5': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'p6': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'science',label:'العلوم',emoji:'🔬',cover:'linear-gradient(135deg,#22c55e,#15803d)'}],
  'm2': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'الرياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'social',label:'الاجتماعيات',emoji:'🗺️',img:'https://i.ibb.co/PZfJrBFV/world.png',cover:'linear-gradient(135deg,#ec4899,#be185d)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},{id:'cs',label:'حاسوب',emoji:'💻',img:'https://i.ibb.co/DD5N8Kwv/warning.png',cover:'linear-gradient(135deg,#6366f1,#4f46e5)'},{id:'ethics',label:'أخلاقية',emoji:'🧭',img:'https://i.ibb.co/Z6CpCq32/engagement.png',cover:'linear-gradient(135deg,#0ea5e9,#0284c7)'}],
  's2': [{id:'islamic',label:'التربية الإسلامية',emoji:'🕌',img:'https://i.ibb.co/qLn2PQh0/quran-1.png',cover:'linear-gradient(135deg,#059669,#065f46)'},{id:'arabic',label:'اللغة العربية',emoji:'📝',img:'https://i.ibb.co/nsLRP3Dq/date.png',cover:'linear-gradient(135deg,#ef4444,#b91c1c)'},{id:'english',label:'اللغة الإنكليزية',emoji:'🌍',img:'https://i.ibb.co/bjXSHtDL/eng.png',cover:'linear-gradient(135deg,#3b82f6,#1d4ed8)'},{id:'math',label:'رياضيات',emoji:'🔢',img:'https://i.ibb.co/XfFVtdzC/calculator.png',cover:'linear-gradient(135deg,#667eea,#764ba2)'},{id:'bio',label:'أحياء',emoji:'🌿',img:'https://i.ibb.co/PZF7Pq0y/plant-cell.png',cover:'linear-gradient(135deg,#22c55e,#15803d)'},{id:'chem',label:'كيمياء',emoji:'⚗️',img:'https://i.ibb.co/8vJcqSz/flask.png',cover:'linear-gradient(135deg,#f59e0b,#d97706)'},{id:'phys',label:'فيزياء',emoji:'⚡',img:'https://i.ibb.co/fVb4tY2H/science.png',cover:'linear-gradient(135deg,#8b5cf6,#6d28d9)'},{id:'cs',label:'الحاسوب',emoji:'💻',img:'https://i.ibb.co/DD5N8Kwv/warning.png',cover:'linear-gradient(135deg,#6366f1,#4f46e5)'}],
};


/* compat aliases */
var SUBJ_SCI = GRADE_SUBJECTS['m1'];
var SUBJ_LIT = GRADE_SUBJECTS['m3'];

/* ── subject icon helper ── */
function subjIcon(s, cls){
  cls = cls||'';
  if(s.img) return '<img src="'+s.img+'" class="subj-png-icon'+( cls?' '+cls:'' )+'" alt="'+s.label+'" loading="lazy">'
             +'<span class="subj-emoji-fallback" style="display:none">'+s.emoji+'</span>';
  return s.emoji;
}


/* المنهج يُجلب من Supabase — curriculum_chapters + curriculum_items */

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
  var c={ok:'linear-gradient(135deg,#22c55e,#16a34a)',err:'linear-gradient(135deg,#ef4444,#dc2626)',info:'linear-gradient(135deg,#2563eb,#4f46e5)',warn:'linear-gradient(135deg,#f59e0b,#d97706)'};
  t.style.background=c[type]||c.info; t.textContent=msg;
  t.classList.remove('hidden','show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(function(){t.classList.remove('show');setTimeout(function(){t.classList.add('hidden');},400);},2800);
}
function openModal(id){var o=el(id);if(!o)return;o.classList.remove('hidden');document.body.style.overflow='hidden';o.onclick=function(e){if(e.target===o)closeModal(id);};}
function closeModal(id){var o=el(id);if(!o)return;o.classList.add('hidden');document.body.style.overflow='';}
function showBottomNav(s){var n=el('bottomNav');if(n){if(s)n.classList.remove('hidden');else n.classList.add('hidden');}}

/* ── نافذة تأكيد مخصصة (بديل confirm المتصفح) ── */
function showConfirm(opts){
  /* opts: { title, msg, icon, yesText, yesCls, onYes } */
  var ic  = el('confirm-icon');
  var ti  = el('confirm-title');
  var ms  = el('confirm-msg');
  var btn = el('confirm-yes');
  if(!ic||!ti||!ms||!btn) return;

  ic.textContent  = opts.icon  || '⚠️';
  ti.textContent  = opts.title || 'هل أنت متأكد؟';
  ms.textContent  = opts.msg   || '';
  btn.textContent = opts.yesText || 'تأكيد';
  btn.className   = 'confirm-yes ' + (opts.yesCls || '');

  btn.onclick = function(){
    closeModal('ov-confirm');
    if(opts.onYes) opts.onYes();
  };
  openModal('ov-confirm');
}
function setNavActive(k){
  var m={home:'bnav-home',search:'bnav-search',favs:'bnav-favs',teachers:'bnav-teachers',settings:'bnav-settings'};
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
function pickAuthStage(stageId){
  /* تحديد البطاقة المختارة بصرياً */
  document.querySelectorAll('.asp-card').forEach(function(c){
    c.classList.toggle('asp-active', c.dataset.stage === stageId);
  });
  /* حفظ الاختيار مؤقتاً ليُرسل مع التسجيل أو الدخول */
  window._pendingStage = stageId;
}

function askChangeStage(){closeModal('ov-settings');setTimeout(function(){openModal('ov-changestage');},200);}
function doChangeStage(){
  // Clear current grade so user must pick a new one for the new stage
  curGrade = null;
  var s = getSess();
  if(s){ s.grade = null; setSess(s); }
  closeModal('ov-changestage');
  setTimeout(function(){ openStagePicker('change'); }, 200);
}
function toggleTheme(){
  isDark=!isDark;
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  localStorage.setItem('dz_theme',isDark?'dark':'light');
  var lbl=el('set-theme-lbl');if(lbl)lbl.textContent=isDark?'الوضع الليلي':'الوضع النهاري';
  toast(isDark?'🌙 الوضع الليلي':'☀️ الوضع النهاري','info');
}

/* ── STAGE PICKER ────────────────────────────── */
function openStagePicker(mode){
  window._pickerMode = mode||'first';
  var title=el('picker-title'),sub=el('picker-sub'),grid=el('picker-grid');
  if(title)title.textContent=mode==='change'?'اختر مرحلة جديدة':'اختر مرحلتك الدراسية';
  if(sub)sub.textContent='اختر مرحلتك لعرض المحتوى المناسب';
  buildStagePickerCards(grid);
  openModal('ov-picker');
}

function buildStagePickerCards(grid){
  if(!grid)return;
  var stages=['primary','middle','secondary','vocational'];
  var stageMeta={
    primary:   {name:'الابتدائية', sub:'الصفوف الأول — السادس',  icon:'🌱', grad:'linear-gradient(135deg,#22c55e,#16a34a)', glow:'rgba(34,197,94,.28)'},
    middle:    {name:'المتوسطة',   sub:'الصفوف الأول — الثالث',  icon:'📘', grad:'linear-gradient(135deg,#3b82f6,#4f46e5)', glow:'rgba(59,130,246,.28)'},
    secondary: {name:'الإعدادية',  sub:'الرابع — السادس إعدادي', icon:'🔬', grad:'linear-gradient(135deg,#f97316,#ea580c)', glow:'rgba(249,115,22,.28)'},
    vocational:{name:'المهني',     sub:'الفروع المهنية والتقنية', icon:'⚙️', grad:'linear-gradient(135deg,#8b5cf6,#6d28d9)', glow:'rgba(139,92,246,.28)'}
  };
  var html='<div class="stage-cards-grid">';
  stages.forEach(function(st){
    var m=stageMeta[st]||STAGES_META[st];
    html+='<div class="stage-pick-card" onclick="pickerSelectStage(\''+st+'\')">'
        +'<div class="spc-glow" style="background:'+m.glow+'"></div>'
        +'<div class="spc-icon-wrap" style="background:'+m.grad+'">'+m.icon+'</div>'
        +'<div class="spc-body">'
        +'<div class="spc-name">'+m.name+'</div>'
        +'<div class="spc-sub">'+m.sub+'</div>'
        +'</div>'
        +'<div class="spc-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></div>'
        +'</div>';
  });
  html+='</div>';
  grid.innerHTML=html;
}

/* Called when a stage card is tapped inside the picker modal */
function pickerSelectStage(stageId){
  var grid=el('picker-grid');
  var title=el('picker-title');
  var sub=el('picker-sub');
  var stageMeta={
    primary:   {name:'الابتدائية', grad:'linear-gradient(135deg,#22c55e,#16a34a)'},
    middle:    {name:'المتوسطة',   grad:'linear-gradient(135deg,#3b82f6,#4f46e5)'},
    secondary: {name:'الإعدادية',  grad:'linear-gradient(135deg,#f97316,#ea580c)'},
    vocational:{name:'المهني',     grad:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}
  };
  var m=stageMeta[stageId]||STAGES_META[stageId];
  if(!m)return;

  if(title)title.textContent='اختر صفك الدراسي';
  if(sub)sub.textContent='مرحلة '+m.name;

  var grades=ALL_GRADES.filter(function(g){return g.stage===stageId;});

  var backFn = "buildStagePickerCards(el('picker-grid'));el('picker-title').textContent='\u0627\u062e\u062a\u0631 \u0645\u0631\u062d\u0644\u062a\u0643 \u0627\u0644\u062f\u0631\u0627\u0633\u064a\u0629';el('picker-sub').textContent='\u0627\u062e\u062a\u0631 \u0645\u0631\u062d\u0644\u062a\u0643 \u0644\u0639\u0631\u0636 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0645\u0646\u0627\u0633\u0628'";
  var html='<div class="grade-picker-back">'
    +'<button class="grade-back-btn" onclick="'+backFn+'">'
    +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><polyline points="9 18 15 12 9 6"/></svg>'
    +'\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0645\u0631\u0627\u062d\u0644</button>'
    +'<div class="grade-stage-chip" style="background:'+m.grad+'">'+m.name+'</div>'
    +'</div>';

  html+='<div class="grade-cards-grid">';
  grades.forEach(function(g){
    var lbl = g.name;
    html+='<div class="grade-pick-card" onclick="pickerSelectGrade(\''+stageId+'\',\''+g.id+'\')">'
        +'<div class="gpc-icon" style="background:'+g.bg+'">'+g.icon+'</div>'
        +'<div class="gpc-name">'+lbl+'</div>'
        +'</div>';
  });
  html+='</div>';

  if(grid){ grid.innerHTML=html; grid.classList.add('grade-anim'); }
}

/* Called when a grade button is tapped inside the picker modal */
async function pickerSelectGrade(stageId, gradeId){
  curStage=stageId; curGrade=gradeId; curBranch=null;
  var gradeObj=ALL_GRADES.find(function(g){return g.id===gradeId;});

  // Mark selected
  document.querySelectorAll('.grade-picker-btn').forEach(function(b){b.classList.remove('gpb-active');});
  event && event.target && event.target.classList.add('gpb-active');

  // Save to DB
  var s=getSess();
  if(s){
    s.stage=stageId; s.grade=gradeId; s.branch=null;
    setSess(s);
    if(s.id){
      try{ await sb('users','PATCH',{stage:stageId,grade:gradeId,branch:null},'?id=eq.'+s.id); }catch(e){}
    }
  }

  closeModal('ov-picker');
  syncSettingsUI && syncSettingsUI();
  toast('✅ '+(gradeObj?gradeObj.name:'الصف')+' — جاهز','ok');
  setTimeout(function(){
    buildGradePage();
    openGradeSubjectsGrid(gradeId);
    setNavActive('home');
  }, 260);
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
      var chosenStage=u.stage||window._pendingStage||null;
      setSess({id:u.id,name:u.display_name,stage:chosenStage,grade:u.grade||null,branch:u.branch||null,joined:new Date(u.joined_at).getTime()});
      curGrade=u.grade||null;
      isGuest=false; curStage=chosenStage; curBranch=u.branch||null;
      /* حفظ المرحلة في قاعدة البيانات إن كانت مختارة من الـ picker */
      if(chosenStage&&!u.stage){try{await sb('users','PATCH',{stage:chosenStage},'?id=eq.'+u.id);}catch(e){}}
      window._pendingStage=null;
      updatePills(u.display_name); showBottomNav(true);
      toast('👋 أهلاً '+u.display_name,'ok');
      if(!curStage){
        openStagePicker('first');
      } else if(curGrade){
        var gradeObj = ALL_GRADES.find(function(g){return g.id===curGrade;});
        if(gradeObj && gradeObj.stage === curStage){
          buildGradePage();
          setTimeout(function(){ openGradeSubjectsGrid(curGrade); }, 120);
          setNavActive('home');
        } else {
          curGrade = null;
          buildGradePage(); goPage('pg-grade'); setNavActive('home');
        }
      } else {
        buildGradePage(); goPage('pg-grade'); setNavActive('home');
      }
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
    var regStage=window._pendingStage||null;
    if(regStage){try{await sb('users','PATCH',{stage:regStage},'?id=eq.'+u.id);}catch(e){}}
    window._pendingStage=null;
    setSess({id:u.id,name:u.display_name,stage:regStage,branch:null,joined:Date.now()});
    isGuest=false; curStage=regStage; curBranch=null;
    updatePills(u.display_name);
    showBottomNav(true);
    toast('🎉 أهلاً '+u.display_name+'! حسابك جاهز','ok');
    if(!curStage){
      openStagePicker('first');
    } else {
      buildGradePage(); goPage('pg-grade'); setNavActive('home');
    }
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
    showConfirm({
      icon:'👋',
      title:'تسجيل الخروج',
      msg:'هل تريد الخروج من حسابك؟',
      yesText:'نعم، اخرج',
      yesCls:'confirm-warn',
      onYes:function(){
        localStorage.removeItem('dz_sess');
        curStage=null;curBranch=null;curGrade=null;isGuest=false;
        showBottomNav(false); switchTab('login');
        var ln=el('l-name'),lp=el('l-pass');
        if(ln)ln.value='';if(lp)lp.value='';if(el('l-err'))el('l-err').textContent='';
        toast('👋 تم تسجيل الخروج','info');
        goPage('pg-auth');
      }
    });
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
  var sm = STAGES_META[curStage];
  if(!sm) return;

  // تحديث الهيدر العلوي
  var tt = el('grade-tbar-title');
  if(tt) tt.textContent = sm.name;

  // تحديث Hero
  var hi = el('grade-hero-ic');
  var hh = el('grade-hero-h1');
  var hp = el('grade-hero-p');
  if(hi) hi.textContent = sm.icon;
  if(hh) hh.textContent = sm.name;
  if(hp) hp.textContent = 'اختر صفك الدراسي';

  // بناء بطاقات الصفوف
  var grades = ALL_GRADES.filter(function(g){ return g.stage === curStage; });
  var grid = el('grades-grid');
  if(!grid) return;

  var html = '';
  grades.forEach(function(g, i){
    html += '<div class="grade-card" onclick="openGrade(\''+g.id+'\')"'
          + ' style="background:'+g.bg+';animation-delay:'+(i*0.06)+'s">'
          + '<div class="gc-shine"></div>'
          + '<div class="gc-ic">'+g.icon+'</div>'
          + '<div class="gc-nm">'+g.name+'</div>'
          + '<div class="gc-sub">'+g.sub+'</div>'
          + '</div>';
  });
  grid.innerHTML = html;
}

function openGrade(gid){
  var g=ALL_GRADES.find(function(x){return x.id===gid;});if(!g)return;
  curGrade=gid;

  // المواد حسب الصف المحدد
  var subjs = GRADE_SUBJECTS[gid] || GRADE_SUBJECTS['m1'];

  // بناء شريط المواد
  var strip=el('sub-strip');
  if(strip){
    strip.innerHTML=subjs.map(function(s,i){
      return'<button class="stab'+(i===0?' on':'')+'" onclick="openSubject(\''+s.id+'\',this)" style="animation-delay:'+(i*0.04)+'s">'
          +'<div class="stab-sq" style="background:'+s.cover+'">'+ subjIcon(s) +'</div>'
          +'<span class="stab-lb">'+s.label+'</span>'
          +'</button>';
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
  document.querySelectorAll('.stab').forEach(function(s){s.classList.remove('on');});
  if(el_)el_.classList.add('on');
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
  // ابحث في مواد الصف الحالي أولاً ثم في جميع المواد
  var cur = curGrade ? (GRADE_SUBJECTS[curGrade]||[]) : [];
  var found = cur.find(function(s){return s.id===id;});
  if(found) return found;
  // fallback: ابحث في جميع القوائم
  for(var g in GRADE_SUBJECTS){
    var s=GRADE_SUBJECTS[g].find(function(s){return s.id===id;});
    if(s) return s;
  }
  return null;
}

/* ── RENDER CONTENT (with Supabase) ──────────── */
function renderContent(){
  var subj=getSubj(curSubject);if(!subj)return;
  var labels={booklets:'الملازم الدراسية',exams:'الاختبارات',favs:'مكتبتي',curriculum:'المنهج الدراسي'};
  var head='<div class="subj-hd">'
          +'<div class="subj-hd-ic" style="background:'+subj.cover+'">'+ subjIcon(subj) +'</div>'
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
        // أولاً: زر الاختبار التفاعلي إن وُجدت أسئلة
        var hasQuiz=ex.questions&&ex.questions!=='null'&&ex.questions!=='[]';
        if(hasQuiz){
          html+='<button class="btn-quiz" onclick="startQuiz(\''+ex.id+'\',\''+safe+'\')">🎯 ابدأ الاختبار</button>';
        }
        if(ex.file_url){
          html+='<a class="btn-exam" href="'+ex.file_url+'" target="_blank">⬇ تحميل</a>';
        }else if(!hasQuiz){
          html+='<button class="btn-exam" style="opacity:.38;cursor:default" disabled>غير متاح</button>';
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

/* ══════════════════════════════════════════════
   THEMES — نظام الثيمات المتعددة
══════════════════════════════════════════════ */
var THEMES = [
  {id:'purple', name:'بنفسجي كلاسيكي', bg:'linear-gradient(145deg,#667eea,#764ba2)',  pri:'linear-gradient(135deg,#667eea,#764ba2)',  pri_c:'#667eea'},
  {id:'blue',   name:'أزرق المحيط',    bg:'linear-gradient(145deg,#0ea5e9,#0284c7)',  pri:'linear-gradient(135deg,#0ea5e9,#0284c7)',  pri_c:'#0ea5e9'},
  {id:'teal',   name:'فيروزي هادئ',   bg:'linear-gradient(145deg,#14b8a6,#0d9488)',  pri:'linear-gradient(135deg,#14b8a6,#0d9488)',  pri_c:'#14b8a6'},
  {id:'green',  name:'أخضر النعمة',   bg:'linear-gradient(145deg,#22c55e,#15803d)',  pri:'linear-gradient(135deg,#22c55e,#15803d)',  pri_c:'#22c55e'},
  {id:'rose',   name:'وردي الفجر',    bg:'linear-gradient(145deg,#f43f5e,#be185d)',  pri:'linear-gradient(135deg,#f43f5e,#be185d)',  pri_c:'#f43f5e'},
  {id:'orange', name:'برتقالي الشروق',bg:'linear-gradient(145deg,#f97316,#c2410c)',  pri:'linear-gradient(135deg,#f97316,#c2410c)',  pri_c:'#f97316'},
  {id:'amber',  name:'ذهبي الغروب',  bg:'linear-gradient(145deg,#f59e0b,#b45309)',  pri:'linear-gradient(135deg,#f59e0b,#b45309)',  pri_c:'#f59e0b'},
  {id:'indigo', name:'نيلي عميق',     bg:'linear-gradient(145deg,#6366f1,#4f46e5)',  pri:'linear-gradient(135deg,#6366f1,#4f46e5)',  pri_c:'#6366f1'},
  {id:'dark',   name:'أسود أنيق',     bg:'linear-gradient(145deg,#1e1b4b,#312e81)',  pri:'linear-gradient(135deg,#4f46e5,#3730a3)',  pri_c:'#818cf8'},
  {id:'crimson',name:'أحمر الجمر',    bg:'linear-gradient(145deg,#dc2626,#991b1b)',  pri:'linear-gradient(135deg,#dc2626,#991b1b)',  pri_c:'#f87171'},
];

var curThemeId = 'purple';

function openThemePicker(){
  var grid = el('theme-grid');
  if(grid){
    var html = '';
    THEMES.forEach(function(t){
      var isActive = t.id === curThemeId;
      html += '<div class="theme-card'+(isActive?' active':'')+'" onclick="applyTheme(\''+t.id+'\')" style="background:'+t.bg+'">'
            + '<div class="theme-check">'+(isActive?'✓':'')+'</div>'
            + '<div class="theme-name">'+t.name+'</div>'
            + '</div>';
    });
    grid.innerHTML = html;
  }
  openModal('ov-themes');
}

function applyTheme(id){
  var t = THEMES.find(function(x){return x.id===id;});
  if(!t) return;
  curThemeId = id;
  var root = document.documentElement;
  root.style.setProperty('--bg',  t.bg);
  root.style.setProperty('--pri', t.pri);
  root.style.setProperty('--pri-c', t.pri_c);
  localStorage.setItem('dz_theme_id', id);
  var nm = el('set-theme-name'); if(nm) nm.textContent = t.name;
  // تحديث grid
  document.querySelectorAll('.theme-card').forEach(function(c){
    c.classList.remove('active');
    c.querySelector('.theme-check').textContent='';
  });
  var active = document.querySelector('.theme-card[onclick*="\''+id+'\'"]');
  if(active){ active.classList.add('active'); active.querySelector('.theme-check').textContent='✓'; }
  toast('🎨 '+t.name,'ok');
  closeModal('ov-themes');
}

function loadSavedTheme(){
  var savedId = localStorage.getItem('dz_theme_id');
  if(savedId && savedId !== 'purple') applyTheme(savedId);
  var savedDark = localStorage.getItem('dz_theme');
  if(savedDark==='dark'){ isDark=true; document.documentElement.setAttribute('data-theme','dark'); }
  // تحديث اسم الثيم الحالي
  var t = THEMES.find(function(x){return x.id===(savedId||'purple');});
  var nm = el('set-theme-name'); if(nm&&t) nm.textContent = t.name;
}

/* ══════════════════════════════════════════════
   GOOGLE LOGIN — تسجيل الدخول بـ Google
══════════════════════════════════════════════ */
function doGoogleLogin(){
  // Supabase OAuth - يحتاج تفعيل Google Provider في Supabase Dashboard
  var url = SB_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(window.location.origin + window.location.pathname);
  window.location.href = url;
}

// معالجة callback من Google بعد التوجيه
async function handleOAuthCallback(){
  var hash = window.location.hash;
  if(!hash || !hash.includes('access_token')) return false;
  var params = new URLSearchParams(hash.substring(1));
  var token = params.get('access_token');
  if(!token) return false;
  try{
    // جلب بيانات المستخدم من Supabase Auth
    var r = await fetch(SB_URL+'/auth/v1/user', {
      headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token}
    });
    var user = await r.json();
    if(!user||!user.email) return false;
    var email = user.email;
    var displayName = (user.user_metadata&&user.user_metadata.full_name) || email.split('@')[0];
    var username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g,'') + '_g';
    // تحقق أو أنشئ المستخدم
    var rows = await sb('users','GET',null,'?username=eq.'+encodeURIComponent(username)+'&select=id,username,display_name,stage,branch');
    var dbUser = rows&&rows[0];
    if(!dbUser){
      var created = await sb('users','POST',{username:username,password:'google_oauth',display_name:displayName,joined_at:new Date().toISOString(),last_login:new Date().toISOString()});
      dbUser = created&&created[0];
    } else {
      await sb('users','PATCH',{last_login:new Date().toISOString()},'?id=eq.'+dbUser.id);
    }
    // حفظ الجلسة
    var sess = {id:dbUser?dbUser.id:'',name:displayName,stage:dbUser?dbUser.stage:null,branch:dbUser?dbUser.branch:null,joined:Date.now(),isGoogle:true};
    setSess(sess);
    window.history.replaceState(null,'',window.location.pathname);
    return sess;
  }catch(e){console.error('OAuth error:',e);return false;}
}

/* ══════════════════════════════════════════════
   DUOLINGO-STYLE QUIZ — الاختبار التفاعلي
══════════════════════════════════════════════ */
var Q = {
  data:    null,   // {name, questions:[]}
  answers: [],     // إجابات المستخدم
  idx:     0,      // السؤال الحالي
  locked:  false   // منع الضغط المتكرر أثناء الانتقال
};

/* ── فتح الاختبار ── */
async function startQuiz(examId){
  try{
    var rows = await sb('exams','GET',null,'?id=eq.'+examId+'&select=name,questions');
    var ex   = rows&&rows[0];
    if(!ex||!ex.questions){ toast('⚠️ لا توجد أسئلة','warn'); return; }
    var qs = JSON.parse(ex.questions);
    if(!qs||!qs.length){ toast('⚠️ لا توجد أسئلة','warn'); return; }
    Q.data    = {name:ex.name, questions:qs};
    Q.answers = new Array(qs.length).fill(null);
    Q.idx     = 0;
    Q.locked  = false;
    _qRenderIntro();
    openModal('ov-quiz');
  }catch(e){ toast('❌ '+e.message,'err'); }
}

/* ── شاشة المقدمة ── */
function _qRenderIntro(){
  var qs    = Q.data.questions;
  var total = qs.length;
  var mcqN  = qs.filter(function(q){return q.type!=='tf';}).length;
  var tfN   = qs.filter(function(q){return q.type==='tf';}).length;
  var mins  = Math.max(1, Math.ceil(total * 0.6));

  _qSet(
    '<div class="dq-intro">'
   +'<button class="dq-x" onclick="closeModal(\'ov-quiz\')" aria-label="إغلاق">'
   +  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
   +'</button>'
   +'<div class="dq-intro-anim">'
   +'<div class="dq-anim-ring dq-ar1"></div>'
   +'<div class="dq-anim-ring dq-ar2"></div>'
   +'<div class="dq-anim-ring dq-ar3"></div>'
   +'<div class="dq-anim-core">'
   +'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="26" height="26"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>'
   +'</div>'
   +'</div>'
   +'<h2 class="dq-intro-name">'+Q.data.name+'</h2>'
   +'<div class="dq-intro-chips">'
   +'<span class="dq-chip dq-chip-blue">'+total+' سؤال</span>'
   +(mcqN?'<span class="dq-chip dq-chip-purple">'+mcqN+' اختيار متعدد</span>':'')
   +(tfN?'<span class="dq-chip dq-chip-teal">'+tfN+' صح/خطأ</span>':'')
   +'<span class="dq-chip dq-chip-amber">~'+mins+' دقيقة</span>'
   +'</div>'
   +'<p class="dq-intro-tip">اقرأ كل سؤال بهدوء وأجب بثقة 💪</p>'
   +'<button class="dq-start-btn" onclick="_qLaunch()">'
   +'<span>ابدأ الاختبار</span>'
   +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>'
   +'</button>'
   +'</div>'
  );
}

/* ── تشغيل الاختبار ── */
function _qLaunch(){
  Q.idx    = 0;
  Q.locked = false;
  _qRenderQ();
}

/* ── رسم السؤال ── */
function _qRenderQ(){
  Q.locked = false;
  var qs    = Q.data.questions;
  var i     = Q.idx;
  var q     = qs[i];
  var total = qs.length;
  var pct   = Math.round((i / total) * 100);
  var LABELS= ['أ','ب','ج','د'];

  /* ── بناء الخيارات ── */
  var optsHtml = '';
  if(q.type === 'tf'){
    optsHtml =
      '<button class="dq-opt dq-tf-t" onclick="_qPick(this,true)">'
     +'<span class="dq-tf-ic">✅</span><span>صح</span>'
     +'</button>'
     +'<button class="dq-opt dq-tf-f" onclick="_qPick(this,false)">'
     +'<span class="dq-tf-ic">❌</span><span>خطأ</span>'
     +'</button>';
  } else {
    var opts = (q.opts||[]).filter(function(o){return o&&o.trim();});
    opts.forEach(function(opt, oi){
      optsHtml +=
        '<button class="dq-opt dq-mcq-opt" onclick="_qPick(this,'+oi+')">'
       +'<span class="dq-opt-badge">'+LABELS[oi]+'</span>'
       +'<span class="dq-opt-text">'+opt+'</span>'
       +'</button>';
    });
  }

  _qSet(
    '<div class="dq-screen">'

    /* ─ شريط علوي ─ */
   +'<div class="dq-header">'
   +'<button class="dq-x" onclick="_qConfirmExit()" aria-label="خروج">'
   +  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
   +'</button>'
   +'<div class="dq-prog-track"><div class="dq-prog-fill" style="width:'+pct+'%"></div></div>'
   +'<div class="dq-counter"><span class="dq-ci">'+(i+1)+'</span>/<span class="dq-ct">'+total+'</span></div>'
   +'</div>'

    /* ─ body: السؤال + الخيارات ─ */
   +'<div class="dq-body">'

   +'<div class="dq-q-card">'
   +'<div class="dq-q-tag">السؤال '+(i+1)+' من '+total+'</div>'
   +'<div class="dq-q-text">'+q.text+'</div>'
   +'</div>'

   +'<div class="dq-opts'+(q.type==='tf'?' dq-tf-opts':'')+'">'
   +optsHtml
   +'</div>'

   +'</div>'   /* end dq-body */
   +'</div>'   /* end dq-screen */
  );

  /* أنيميشن دخول السؤال */
  requestAnimationFrame(function(){
    var scr = document.querySelector('.dq-screen');
    if(scr) scr.classList.add('dq-in');
  });
}

/* ── اختيار إجابة ── */
function _qPick(btn, val){
  if(Q.locked) return;
  Q.locked = true;

  /* تحديد الزر المضغوط */
  btn.classList.add('dq-picked');
  Q.answers[Q.idx] = val;

  /* انتقال للسؤال التالي بعد 280ms */
  setTimeout(function(){
    var qs = Q.data.questions;
    if(Q.idx < qs.length - 1){
      Q.idx++;
      var scr = document.querySelector('.dq-screen');
      if(scr){
        scr.classList.add('dq-out');
        setTimeout(function(){ _qRenderQ(); }, 200);
      } else {
        _qRenderQ();
      }
    } else {
      _qFinish();
    }
  }, 280);
}

/* ── تأكيد الخروج ── */
function _qConfirmExit(){
  showConfirm({
    icon:'🎯',
    title:'الخروج من الاختبار',
    msg:'إذا خرجت الآن ستضيع إجاباتك ولن تُحفظ النتيجة.',
    yesText:'نعم، اخرج',
    yesCls:'confirm-warn',
    onYes:function(){ closeModal('ov-quiz'); }
  });
}

/* ── إنهاء الاختبار وحساب النتيجة ── */
function _qFinish(){
  var qs      = Q.data.questions;
  var correct = 0;
  var wrong   = 0;
  var skipped = 0;
  qs.forEach(function(q, i){
    var ans = Q.answers[i];
    if(ans === null){ skipped++; return; }
    if(ans === q.correct) correct++;
    else wrong++;
  });
  var total = qs.length;
  var pct   = Math.round((correct / total) * 100);
  _qRenderResult(correct, wrong, skipped, total, pct);
}

/* ── صفحة النتائج ── */
function _qRenderResult(correct, wrong, skipped, total, pct){
  /* رسالة تحفيزية */
  var msg, emoji, colorClass;
  if(pct === 100){
    msg='أنت نجم! أجبت على كل الأسئلة بشكل صحيح 🌟'; emoji='🏆'; colorClass='dq-gold';
  } else if(pct >= 90){
    msg='رائع جداً! أداء مميز يستحق التقدير 🎉'; emoji='🥇'; colorClass='dq-gold';
  } else if(pct >= 75){
    msg='جيد جداً! واصل التعلم وستصل للقمة 💪'; emoji='🥈'; colorClass='dq-silver';
  } else if(pct >= 60){
    msg='جيد! أنت على الطريق الصحيح، راجع الأخطاء 📖'; emoji='🥉'; colorClass='dq-bronze';
  } else if(pct >= 40){
    msg='لا بأس، راجع المادة وحاول مجدداً! 📚'; emoji='💡'; colorClass='dq-warn';
  } else {
    msg='المحاولة الأولى ليست الأخيرة، أعد الدراسة وحاول 🔄'; emoji='🌱'; colorClass='dq-low';
  }

  /* دائرة النسبة SVG */
  var r   = 44;
  var cir = 2 * Math.PI * r;
  var off = cir - (pct / 100) * cir;
  var pctColor = pct>=75?'#22c55e':pct>=50?'#f59e0b':'#ef4444';

  _qSet(
    '<div class="dq-result">'

    /* زر الإغلاق */
   +'<button class="dq-x dq-rx" onclick="closeModal(\'ov-quiz\')">'
   +  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
   +'</button>'

    /* الإيموجي والرسالة */
   +'<div class="dq-res-top">'
   +'<div class="dq-res-emoji">'+emoji+'</div>'
   +'<div class="dq-res-msg">'+msg+'</div>'
   +'</div>'

    /* دائرة النسبة */
   +'<div class="dq-circle-wrap">'
   +'<svg class="dq-ring" viewBox="0 0 100 100" width="140" height="140">'
   +'<circle cx="50" cy="50" r="'+r+'" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="10"/>'
   +'<circle cx="50" cy="50" r="'+r+'" fill="none" stroke="'+pctColor+'" stroke-width="10"'
   +' stroke-dasharray="'+cir.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"'
   +' stroke-linecap="round" transform="rotate(-90 50 50)"'
   +' style="transition:stroke-dashoffset 1s ease .2s"/>'
   +'</svg>'
   +'<div class="dq-circle-inner">'
   +'<div class="dq-pct-num" style="color:'+pctColor+'">'+pct+'%</div>'
   +'<div class="dq-pct-lbl">النتيجة</div>'
   +'</div>'
   +'</div>'

    /* إحصائيات */
   +'<div class="dq-res-cards">'
   +'<div class="dq-rc dq-rc-green"><div class="dq-rc-n">'+correct+'</div><div class="dq-rc-l">✅ صحيحة</div></div>'
   +'<div class="dq-rc dq-rc-red"><div class="dq-rc-n">'+wrong+'</div><div class="dq-rc-l">❌ خاطئة</div></div>'
   +(skipped?'<div class="dq-rc dq-rc-gray"><div class="dq-rc-n">'+skipped+'</div><div class="dq-rc-l">⬜ متروكة</div></div>':'')
   +'<div class="dq-rc dq-rc-blue"><div class="dq-rc-n">'+total+'</div><div class="dq-rc-l">📋 المجموع</div></div>'
   +'</div>'

    /* أزرار */
   +'<div class="dq-res-btns">'
   +_qBuildReview()
   +'<button class="dq-retry-btn" onclick="_qLaunch()">🔄 إعادة الاختبار</button>'
   +'<button class="dq-close-btn" onclick="closeModal(\'ov-quiz\')">✔ إغلاق</button>'
   +'</div>'
   +'</div>'
  );

  /* أنيمي دائرة بعد رسم ─ تأخير لإعطاء متسع للـ CSS transition */
  setTimeout(function(){
    var ring = document.querySelector('.dq-ring circle:last-child');
    if(ring){
      ring.style.strokeDashoffset = off.toFixed(1);
    }
  }, 100);
}


/* ── مراجعة الأخطاء ── */
function _qBuildReview(){
  var qs = Q.data.questions;
  var LABELS = ['أ','ب','ج','د'];
  var wrongs = [];
  qs.forEach(function(q,i){
    var ans = Q.answers[i];
    if(ans===null||ans===q.correct) return;
    wrongs.push({q:q,given:ans,idx:i});
  });
  if(!wrongs.length) return '';

  var html='<div class="dq-review">';
  html+='<div class="dq-review-hd"><span class="dq-review-ic">🔍</span><span class="dq-review-title">مراجعة الأخطاء</span><span class="dq-review-badge">'+wrongs.length+'</span></div>';
  wrongs.forEach(function(item){
    var q=item.q, given=item.given, isTF=q.type==='tf';
    var correctText=isTF?(q.correct===true?'صح ✅':'خطأ ❌'):(q.opts&&q.opts[q.correct]!=null?LABELS[q.correct]+'. '+q.opts[q.correct]:'—');
    var givenText  =isTF?(given===true?'صح ✅':'خطأ ❌'):(q.opts&&q.opts[given]!=null?LABELS[given]+'. '+q.opts[given]:'—');
    html+='<div class="dq-ri">';
    html+='<div class="dq-ri-num">'+(item.idx+1)+'</div>';
    html+='<div class="dq-ri-body">';
    html+='<div class="dq-ri-q">'+q.text+'</div>';
    html+='<div class="dq-ri-row dq-ri-wrong"><span class="dq-ri-lbl">إجابتك</span><span class="dq-ri-val">'+givenText+'</span></div>';
    html+='<div class="dq-ri-row dq-ri-right"><span class="dq-ri-lbl">الصحيح</span><span class="dq-ri-val">'+correctText+'</span></div>';
    html+='</div></div>';
  });
  html+='</div>';
  return html;
}

/* ── helper: inject HTML ── */
function _qSet(html){
  var inner = el('quiz-inner');
  if(inner) inner.innerHTML = html;
}

/* (kept for backward compat) */
function renderQuizResult(){}
function renderQuestion(){}
function launchQuiz(){ _qLaunch(); }
function finishQuiz(){  _qFinish(); }
function goQuestion(i){ Q.idx=i; _qRenderQ(); }
function confirmCloseQuiz(){ _qConfirmExit(); }

function renderCurriculum(subj){
  // يعرض spinner ثم يجلب من Supabase
  var spinner='<div class="loading-spin"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ تحميل المنهج...</span></div>';
  setTimeout(function(){loadCurriculumFromDB(subj);},0);
  return '<div class="sec-lbl">📖 المنهج — '+subj.label+'</div>'+spinner;
}

async function loadCurriculumFromDB(subj){
  var body=el('class-body');if(!body)return;
  var head=body.querySelector('.subj-hd')?body.innerHTML.split('</div>').slice(0,2).join('</div>')+'</div>':'';
  try{
    var q='?subject_id=eq.'+subj.id+'&stage=eq.'+curStage+'&grade=eq.'+curGrade+'&order=sort_order.asc';
    var chapters=(await sb('curriculum_chapters','GET',null,q))||[];
    var chapIds=chapters.map(function(c){return c.id;});
    var items=[];
    if(chapIds.length){
      var q2='?chapter_id=in.('+chapIds.join(',')+')'+'&order=sort_order.asc';
      items=(await sb('curriculum_items','GET',null,q2))||[];
    }
    // كتاب المنهج PDF
    var bookQ='?subject_id=eq.'+subj.id+'&stage=eq.'+curStage+'&grade=eq.'+curGrade;
    var bookRows=(await sb('curriculum_books','GET',null,bookQ))||[];
    var book=bookRows[0]||null;

    var html='<div class="sec-lbl">📖 المنهج — '+subj.label+'</div>';

    // زر كتاب المنهج
    if(book&&book.file_url){
      html+='<a href="'+book.file_url+'" target="_blank" class="curr-book-btn">'
          +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>'
          +'📥 تحميل كتاب المنهج</a>';
    }

    if(!chapters.length){
      html+='<div class="state-box"><div class="state-ic">📖</div><h3>المنهج قيد الإعداد</h3><p>سيُضاف المنهج قريباً</p></div>';
      body.innerHTML=html;return;
    }

    html+='<div class="curr-list">';
    chapters.forEach(function(ch,ci){
      var chItems=items.filter(function(it){return it.chapter_id===ch.id;});
      html+='<div class="curr-unit" id="cu-'+ci+'">'
          +'<div class="curr-head" onclick="toggleUnit('+ci+')">'
          +'<div class="curr-htitle">📚 '+ch.title+'</div>'
          +'<div class="curr-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>'
          +'</div><div class="curr-body">';
      if(chItems.length){
        chItems.forEach(function(it){
          html+='<div class="curr-item">'
              +'<div class="curr-item-title">'+it.label+'</div>';
          if(it.content){
            html+='<div class="curr-item-body">'+it.content.replace(/\n/g,'<br>')+'</div>';
          }
          html+='</div>';
        });
      }else{
        html+='<div class="curr-lesson" style="color:var(--tx3);font-style:italic">لا يوجد محتوى بعد</div>';
      }
      html+='</div></div>';
    });
    html+='</div>';
    body.innerHTML=html;
  }catch(e){
    body.innerHTML='<div class="sec-lbl">📖 المنهج — '+subj.label+'</div>'
                 +'<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
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
        +'<span class="fav-type" style="background:'+(f.type==='ملزمة'?'#16a34a':'#2563eb')+'">'+f.type+'</span>'
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
    searchIdx.push({type:'subjects',name:s.label,emoji:s.emoji,img:s.img,cover:s.cover,meta:'مادة دراسية'});
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
        +'<span class="sr-tag" style="background:'+(tc[item.type]||'#2563eb')+'">'+tn[item.type]+'</span>'
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

function deleteAccount(){
  showConfirm({
    icon:'🗑️',
    title:'حذف الحساب',
    msg:'سيتم حذف حسابك وجميع بياناتك نهائياً ولا يمكن التراجع!',
    yesText:'نعم، احذف حسابي',
    yesCls:'confirm-danger',
    onYes:function(){_doDeleteNow();}
  });
}
async function _doDeleteNow(){
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

  loadSavedTheme();
  // Handle Google OAuth callback
  handleOAuthCallback().then(function(sess){
    if(sess){
      isGuest=false; curStage=sess.stage||null; curBranch=sess.branch||null;
      updatePills(sess.name); showBottomNav(true);
      if(!curStage){
        openStagePicker('first');
      } else if(sess.grade){
        curGrade = sess.grade;
        var gradeObj = ALL_GRADES.find(function(g){return g.id===curGrade;});
        if(gradeObj && gradeObj.stage === curStage){
          buildGradePage();
          setTimeout(function(){ openGradeSubjectsGrid(curGrade); }, 120);
          setNavActive('home');
        } else {
          curGrade = null;
          buildGradePage(); goPage('pg-grade'); setNavActive('home');
        }
      } else {
        buildGradePage(); goPage('pg-grade'); setNavActive('home');
      }
    }
  });

  var s=getSess();
  if(s&&s.name){
    isGuest=false;
    curStage=s.stage||null;curBranch=s.branch||null;
    curGrade=s.grade||null;
    updatePills(s.name);showBottomNav(true);
    if(!curStage){
      openStagePicker('first');
    } else if(curGrade){
      // التحقق أن الصف المحفوظ ينتمي للمرحلة الحالية
      var gradeObj = ALL_GRADES.find(function(g){return g.id===curGrade;});
      if(gradeObj && gradeObj.stage === curStage){
        // المرحلة والصف متطابقان — انتقل مباشرة لمواد الصف
        buildGradePage();
        setTimeout(function(){ openGradeSubjectsGrid(curGrade); }, 120);
        setNavActive('home');
      } else {
        // الصف لا ينتمي للمرحلة — اختر صفاً جديداً
        curGrade = null;
        buildGradePage(); goPage('pg-grade'); setNavActive('home');
      }
    } else {
      // المرحلة محفوظة لكن الصف لم يُحدد — اختر الصف
      buildGradePage(); goPage('pg-grade'); setNavActive('home');
    }
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

/* ══════════════════════════════════════════════
   SUBJECTS GRID — عرض المواد على شكل شبكة
══════════════════════════════════════════════ */
var curSDetTab = 'exams';

function openGradeSubjectsGrid(gid){
  var g = ALL_GRADES.find(function(x){return x.id===gid;});
  if(!g) return;
  curGrade = gid;

  var subjs = GRADE_SUBJECTS[gid] || GRADE_SUBJECTS['m1'];

  // عنوان الصفحة
  var tt = el('subjects-tbar-title');
  var ts = el('subjects-tbar-sub');
  if(tt) tt.textContent = g.name;
  if(ts) ts.textContent = 'المواد الدراسية';

  // زر الرجوع
  var bb = el('subjects-back-btn');
  if(bb) bb.onclick = function(){ goPage('pg-grade'); };

  var grid = el('subj-grid');
  if(!grid) return;
  var html = '';
  subjs.forEach(function(s, i){
    html += '<div class="subj-card" onclick="openSubjDetail(\''+s.id+'\')" style="background:'+s.cover+';animation-delay:'+(i*0.06)+'s">'
          + '<div class="subj-card-shine"></div>'
          + '<div class="subj-card-emoji">'+ subjIcon(s) +'</div>'
          + '<div class="subj-card-name">'+s.label+'</div>'
          + '</div>';
  });
  grid.innerHTML = html;
  goPage('pg-subjects');
}

function openSubjDetail(sid){
  curSubject = sid;
  curSDetTab = 'exams';
  var subj = getSubj(sid);
  if(!subj) return;

  var tt = el('sdet-tbar-title');
  var ts = el('sdet-tbar-sub');
  if(tt) tt.textContent = subj.label;
  if(ts){ if(subj.img){ ts.innerHTML = '<img src="'+subj.img+'" class="subj-png-icon" style="width:18px;height:18px;vertical-align:middle;margin-left:4px" alt=""> '+subj.label; } else { ts.textContent = subj.emoji + ' ' + subj.label; } }

  // reset tabs
  document.querySelectorAll('#pg-subj-detail .ctab').forEach(function(t,i){ t.classList.toggle('active', i===0); });

  renderSDetContent();
  goPage('pg-subj-detail');
}

function switchSDetTab(tab, el_){
  curSDetTab = tab;
  document.querySelectorAll('#pg-subj-detail .ctab').forEach(function(t){ t.classList.remove('active'); });
  if(el_) el_.classList.add('active');
  renderSDetContent();
}

function renderSDetContent(){
  var subj = getSubj(curSubject);
  if(!subj) return;
  var body = el('sdet-body');
  if(!body) return;

  var spinner = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';

  var tabNames={'exams':'الاختبارات','booklets':'الملازم','curriculum':'المنهج','subj-teachers':'المدرسون'};
  var head = '<div class="subj-hd">'
           + '<div class="subj-hd-ic" style="background:'+subj.cover+'">'+(subj.img?'<img src="'+subj.img+'" style="width:36px;height:36px;object-fit:contain" alt="'+subj.label+'">':subj.emoji)+'</div>'
           + '<div><div class="subj-hd-name">'+subj.label+'</div>'
           + '<div class="subj-hd-hint">'+(tabNames[curSDetTab]||'')+'</div></div></div>';

  body.innerHTML = head + spinner;

  if(curSDetTab==='exams')      loadExams(subj, head);
  else if(curSDetTab==='booklets') loadBooklets(subj, head);
  else if(curSDetTab==='subj-teachers') loadSubjTeachers(subj, head);
  else { body.innerHTML = head + renderCurriculum(subj); }
}

/* ── SUBJECT TEACHERS TAB ─────────────────────── */
async function loadSubjTeachers(subj, head){
  var body = el('sdet-body');
  if(!body) return;
  var spinner = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5a7bf5" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';
  body.innerHTML = head + spinner;
  try{
    // Load teachers matching subject + stage + grade
    var q = '?is_visible=eq.true&order=sort_order.asc,created_at.asc';
    if(curStage) q += '&stage=eq.'+curStage;
    if(curGrade) q += '&grade_id=eq.'+curGrade;
    // Match subject name
    var allTeachers = (await sb('teachers','GET',null,q)) || [];
    var teachers = allTeachers.filter(function(t){
      if(!t.subject_name) return false;
      var tn = t.subject_name.toLowerCase().replace(/\s/g,'');
      var sn = subj.label.toLowerCase().replace(/\s/g,'');
      return tn.includes(sn) || sn.includes(tn);
    });

    if(!teachers.length){
      body.innerHTML = head + '<div class="state-box"><div class="state-ic">👨‍🏫</div><h3>لا يوجد مدرسون لهذه المادة بعد</h3><p>سيُضافون قريباً</p></div>';
      return;
    }

    // For each teacher get lecture count
    var teacherIds = teachers.map(function(t){return t.id;});
    var chapRows = [];
    try{
      chapRows = (await sb('teacher_chapters','GET',null,'?teacher_id=in.('+teacherIds.join(',')+')'+'&is_visible=eq.true')) || [];
    }catch(e){ chapRows = []; }

    // Count lectures per teacher via chapter counts
    var lecCountByTeacher = {};
    teachers.forEach(function(t){ lecCountByTeacher[t.id] = 0; });
    chapRows.forEach(function(ch){
      if(lecCountByTeacher[ch.teacher_id] !== undefined){
        lecCountByTeacher[ch.teacher_id] += (ch.lecture_count||0);
      }
    });

    var html = head + '<div class="teachers-subj-grid">';
    teachers.forEach(function(t, i){
      var avatarHtml = t.photo_url
        ? '<img src="'+t.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.style.display=\'none\'">'
        : '<div style="display:flex;align-items:center;justify-content:center;font-size:2rem;width:100%;height:100%">👨‍🏫</div>';
      var lecCount = lecCountByTeacher[t.id] || 0;
      html += '<div class="teacher-card" style="animation-delay:'+(i*0.06)+'s" data-tid="'+t.id+'" data-tname="'+t.name.replace(/"/g,'&quot;')+'" data-tphoto="'+(t.photo_url||'')+'" data-tsubj="'+(t.subject_name||'')+'" data-tgrade="'+(t.grade_label||'')+'">';
      html += '<div class="teacher-avatar">'+avatarHtml+'</div>';
      html += '<div class="teacher-name">'+t.name+'</div>';
      html += '<div class="teacher-meta">'+(t.subject_name||'')+'</div>';
      html += '<div class="teacher-lec-cnt">📹 '+lecCount+' محاضرة</div>';
      html += '</div>';
    });
    html += '</div>';
    body.innerHTML = html;

    // Attach click handlers
    body.querySelectorAll('.teacher-card').forEach(function(card){
      card.onclick = function(){
        openTeacher(card.dataset.tid, card.dataset.tname, card.dataset.tphoto, card.dataset.tsubj, card.dataset.tgrade);
      };
    });
  }catch(e){
    body.innerHTML = head + '<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
}

/* Override openGrade: save grade to DB then show subjects */
var _origOpenGrade = openGrade;
openGrade = function(gid){
  pickGradeAndSave(gid);
};

/* ══════════════════════════════════════════════
   GRADE PICKER — حفظ الصف تلقائياً
══════════════════════════════════════════════ */
async function pickGradeAndSave(gid){
  curGrade = gid;
  var s = getSess();
  if(s && s.id){
    s.grade = gid;
    setSess(s);
    try{ await sb('users','PATCH',{grade:gid},'?id=eq.'+s.id); }catch(e){}
  }
  syncSettingsUI();
  openGradeSubjectsGrid(gid);
}

/* ══════════════════════════════════════════════
   STAGE PICKER — بعد اختيار المرحلة تظهر الصفوف
══════════════════════════════════════════════ */
/* Override pickStage: save stage, clear old grade, show grade grid */
var _origPickStage = pickStage;
pickStage = async function(stageId){
  curStage = stageId; curBranch = null;
  curGrade = null;  // ALWAYS reset grade when changing stage
  var s = getSess();
  if(s){
    s.stage = stageId; s.branch = null; s.grade = null;
    setSess(s);
    if(s.id){
      try{ await sb('users','PATCH',{stage:stageId,branch:null,grade:null},'?id=eq.'+s.id); }catch(e){}
    }
  }
  closeModal('ov-picker');
  // Always show grade selection after picking stage
  setTimeout(function(){
    buildGradePage();
    goPage('pg-grade');
    setNavActive('home');
  }, 200);
};

/* ══════════════════════════════════════════════
   PROFILE — عرض المرحلة والصف
══════════════════════════════════════════════ */
var _origBuildProfile = buildProfile;
buildProfile = function(){
  _origBuildProfile();
  var s = getSess();
  if(!s) return;
  var chip = el('p-chip');
  if(chip){
    var stageName = (curStage && STAGES_META[curStage]) ? STAGES_META[curStage].name : '';
    var gradeObj = curGrade ? ALL_GRADES.find(function(g){return g.id===curGrade;}) : null;
    var gradeName = gradeObj ? gradeObj.name : '';
    if(stageName && gradeName) chip.textContent = stageName + ' — ' + gradeName;
    else if(stageName) chip.textContent = stageName;
    else chip.textContent = 'لم تختر مرحلة';
  }
  // load saved grade
  if(!curGrade && s.grade){
    curGrade = s.grade;
  }
};


/* ══════════════════════════════════════════════
   SETTINGS syncSettingsUI — إضافة الصف
══════════════════════════════════════════════ */
var _origSyncSettingsUI = syncSettingsUI;
syncSettingsUI = function(){
  _origSyncSettingsUI();
  var us = el('set-ustage');
  if(us){
    var stageName = (curStage && STAGES_META[curStage]) ? STAGES_META[curStage].name : '';
    var gradeObj = curGrade ? ALL_GRADES.find(function(g){return g.id===curGrade;}) : null;
    var gradeName = gradeObj ? gradeObj.name : '';
    if(stageName && gradeName) us.textContent = stageName + ' — ' + gradeName;
    else if(stageName) us.textContent = stageName;
    else us.textContent = 'لم تختر مرحلة';
  }
};

/* ══════════════════════════════════════════════
   BOTTOM NAV — إضافة المدرسين
══════════════════════════════════════════════ */
var _origBottomNav = bottomNav;
bottomNav = function(k){
  if(k==='teachers'){ setNavActive('teachers'); buildTeachersPage(); goPage('pg-teachers'); return; }
  if(k==='settings'){ openSettings(); return; }
  // 'profile' still works but via settings now
  if(k==='profile'){ openSettings(); return; }
  setNavActive(k);
  _origBottomNav(k);
};

/* ══════════════════════════════════════════════
   TEACHERS — المدرسون
══════════════════════════════════════════════ */
async function buildTeachersPage(){
  var grid = el('teachers-grid');
  if(!grid) return;
  grid.innerHTML = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';
  try{
    // فلترة المدرسين حسب مرحلة وصف الطالب
    var q = '?is_visible=eq.true&order=sort_order.asc,created_at.asc';
    if(curStage) q += '&stage=eq.'+curStage;
    if(curGrade) q += '&grade_id=eq.'+curGrade;
    var rows = (await sb('teachers','GET',null,q)) || [];

    // إذا لم يوجد مدرسون مخصصون للصف، اعرض مدرسي المرحلة فقط
    if(!rows.length && curGrade && curStage){
      var q2 = '?is_visible=eq.true&order=sort_order.asc,created_at.asc';
      if(curStage) q2 += '&stage=eq.'+curStage;
      rows = (await sb('teachers','GET',null,q2)) || [];
    }

    if(!rows.length){
      var gradeObj = curGrade ? ALL_GRADES.find(function(g){return g.id===curGrade;}) : null;
      var stageN = (curStage && STAGES_META[curStage]) ? STAGES_META[curStage].name : '';
      var gradeN = gradeObj ? gradeObj.name : '';
      var hint = (stageN||gradeN) ? ' لـ '+(gradeN||stageN) : '';
      grid.innerHTML = '<div class="state-box"><div class="state-ic">👨‍🏫</div><h3>لا يوجد مدرسون'+hint+' بعد</h3><p>سيُضافون قريباً</p></div>';
      return;
    }
    var html = '';
    rows.forEach(function(t, i){
      var avatarHtml = t.photo_url
        ? '<img src="'+t.photo_url+'" style="width:100%;height:100%;object-fit:cover">'
        : '<div style="display:flex;align-items:center;justify-content:center;font-size:2.8rem;width:100%;height:100%">👨‍🏫</div>';
      html += '<div class="teacher-card" style="animation-delay:'+(i*0.06)+'s">';
      html += '<div class="teacher-avatar">'+avatarHtml+'</div>';
      html += '<div class="teacher-name">'+t.name+'</div>';
      html += '<div class="teacher-meta">'+t.subject_name+(t.grade_label?' — '+t.grade_label:'')+'</div>';
      html += '</div>';
    });
    grid.innerHTML = html;
    var cards = grid.querySelectorAll('.teacher-card');
    rows.forEach(function(t, i){
      if(cards[i]) cards[i].onclick = function(){
        openTeacher(t.id, t.name, t.photo_url||'', t.subject_name, t.grade_label||'');
      };
    });
  }catch(e){
    grid.innerHTML = '<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
}


/* ── OPEN TEACHER PAGE ──────────────────────── */
function openTeacher(tid, tname, tphoto, tsubj, tgrade){
  // Update topbar
  var tt = el('tc-tbar-title');
  if(tt) tt.textContent = tname;

  // Build teacher hero
  var hero = el('teacher-hero');
  if(hero){
    var avatarHtml = tphoto
      ? '<img src="'+tphoto+'" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.22)" onerror="this.style.display=\'none\'">'
      : '<div style="width:54px;height:54px;border-radius:50%;background:var(--d-grad);display:flex;align-items:center;justify-content:center;font-size:1.8rem">👨‍🏫</div>';
    hero.innerHTML = '<div style="display:flex;align-items:center;gap:14px;padding:16px 20px">'
      + avatarHtml
      + '<div><div style="font-family:Tajawal,sans-serif;font-size:1rem;font-weight:900;color:var(--d-tx1)">'+tname+'</div>'
      + '<div style="font-size:.78rem;color:var(--d-tx3);margin-top:2px">'+tsubj+(tgrade?' — '+tgrade:'')+'</div></div>'
      + '</div>';
  }

  // Back button
  var backBtn = el('tc-tbar-title');
  var pg = document.getElementById('pg-teacher-chapters');
  if(pg){
    var bb = pg.querySelector('.back-btn');
    if(bb) bb.onclick = function(){
      // If we came from subject detail teachers tab, go back there
      goPage('pg-teachers');
    };
  }

  goPage('pg-teacher-chapters');
  loadTeacherChapters(tid);
}

async function loadTeacherChapters(tid){
  var grid = el('tc-grid');
  if(!grid) return;
  grid.innerHTML = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';

  try{
    var rows = (await sb('teacher_chapters','GET',null,'?teacher_id=eq.'+tid+'&is_visible=eq.true&order=sort_order.asc,created_at.asc')) || [];
    if(!rows.length){
      grid.innerHTML = '<div class="state-box"><div class="state-ic">📂</div><h3>لا توجد فصول بعد</h3><p>سيُضاف المحتوى قريباً</p></div>';
      return;
    }
    var html = '';
    rows.forEach(function(ch, i){
      var coverHtml = ch.cover_url
        ? '<img src="'+ch.cover_url+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">'
        : '<div class="tc-cover-placeholder">📁</div>';
      html += '<div class="tc-card" onclick="openChapterLectures(\''+ch.id+'\',\''+ch.title.replace(/'/g,"\\'")+'\',\''+  (ch.cover_url||'')+'\',\''+tid+'\')" style="animation-delay:'+(i*0.07)+'s">'
            + '<div class="tc-cover" style="background:linear-gradient(135deg,#1e293b,#334155)">'+coverHtml+'</div>'
            + '<div class="tc-info"><div class="tc-title">'+ch.title+'</div>'
            + '<div class="tc-meta">📹 '+(ch.lecture_count||0)+' محاضرة</div></div>'
            + '</div>';
    });
    grid.innerHTML = html;
  }catch(e){
    grid.innerHTML = '<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ</h3><p>'+e.message+'</p></div>';
  }
}

var curChapterId = null;

async function openChapterLectures(chid, chtitle, chcover, tid){
  curChapterId = chid;

  var tt = el('lec-tbar-title');
  var ts = el('lec-tbar-sub');
  if(tt) tt.textContent = chtitle;
  if(ts) ts.textContent = 'المحاضرات';

  var backBtn = el('lec-back-btn');
  if(backBtn) backBtn.onclick = function(){ goPage('pg-teacher-chapters'); };

  // Chapter hero
  var hero = el('lec-chapter-hero');
  if(hero){
    if(chcover){
      hero.innerHTML = '<img class="lec-chapter-img" src="'+chcover+'" alt="'+chtitle+'" onerror="this.parentNode.innerHTML=\'<div class=\\"lec-chapter-img-placeholder\\">📁</div>\'">'
        + '<div class="lec-chapter-info"><div class="lec-chapter-title">'+chtitle+'</div></div>';
    } else {
      hero.innerHTML = '<div class="lec-chapter-img-placeholder">📁</div>'
        + '<div class="lec-chapter-info"><div class="lec-chapter-title">'+chtitle+'</div></div>';
    }
  }

  var list = el('lec-list');
  if(!list){ goPage('pg-lectures'); return; }
  list.innerHTML = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';
  goPage('pg-lectures');

  try{
    var rows = (await sb('lectures','GET',null,'?chapter_id=eq.'+chid+'&is_visible=eq.true&order=sort_order.asc,created_at.asc')) || [];
    if(!rows.length){
      list.innerHTML = '<div class="state-box"><div class="state-ic">🎬</div><h3>لا توجد محاضرات بعد</h3><p>سيُضاف المحتوى قريباً</p></div>';
      return;
    }
    var html = '';
    rows.forEach(function(lec, i){
      html += '<div class="lec-item" onclick="openVideoPlayer(\''+lec.id+'\',\''+lec.title.replace(/'/g,"\\'")+'\',\''+  (lec.video_url||'')+'\',\''+chtitle.replace(/'/g,"\\'")+'\',\''+chid+'\')" style="animation-delay:'+(i*0.06)+'s">'
            + '<div class="lec-num">'+(i+1)+'</div>'
            + '<div class="lec-info"><div class="lec-name">'+lec.title+'</div><div class="lec-meta">'+(lec.duration?'⏱ '+lec.duration:' محاضرة')+'</div></div>'
            + '<div class="lec-play-ic"><svg viewBox="0 0 24 24" fill="white" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg></div>'
            + '</div>';
    });
    list.innerHTML = html;
  }catch(e){
    list.innerHTML = '<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ</h3><p>'+e.message+'</p></div>';
  }
}

/* ══════════════════════════════════════════════
   VIDEO PLAYER — مشغل الفيديو
══════════════════════════════════════════════ */
var vidState = { url:'', title:'', chapterTitle:'', chapterId:'' };

// ── تتبع مشاهدات المحاضرات ──
var _viewTrackTimer = null;
var _viewLectureId = null;
var _viewMaxPct = 0;

async function trackLectureView(lectureId, pct){
  var sess = getSess();
  if(!sess || !sess.id) return;
  try{
    var existing = await sb('lecture_views','GET',null,'?lecture_id=eq.'+lectureId+'&user_id=eq.'+sess.id+'&select=id,watch_pct');
    if(existing && existing.length){
      var curPct = existing[0].watch_pct||0;
      var newPct = Math.max(curPct, Math.round(pct));
      if(newPct > curPct){
        await sb('lecture_views','PATCH',{watch_pct:newPct,last_watched:new Date().toISOString()},'?lecture_id=eq.'+lectureId+'&user_id=eq.'+sess.id);
      }
    } else {
      await sb('lecture_views','POST',{
        lecture_id:lectureId,
        user_id:sess.id,
        username:sess.username||'',
        display_name:sess.display_name||sess.username||'',
        watch_pct:Math.round(pct),
        last_watched:new Date().toISOString()
      });
    }
  }catch(e){ console.warn('track view error:',e.message); }
}

function openVideoPlayer(lid, ltitle, vurl, chtitle, chid){
  if(!vurl){ toast('⚠️ لا يوجد رابط فيديو','warn'); return; }

  // Stop previous tracking
  if(_viewTrackTimer){ clearInterval(_viewTrackTimer); _viewTrackTimer=null; }
  _viewLectureId = lid;
  _viewMaxPct = 0;

  vidState = { url:vurl, title:ltitle, chapterTitle:chtitle, chapterId:chid };

  // Set back button
  var bb = el('vid-back-btn');
  if(bb) bb.onclick = function(){
    var vid = el('main-video');
    if(vid){ vid.pause(); vid.src=''; }
    goPage('pg-lectures');
  };

  var tt = el('vid-title');
  var ts = el('vid-sub');
  var ti = el('vid-info-title');
  var si = el('vid-info-sub');
  if(tt) tt.textContent = ltitle;
  if(ts) ts.textContent = chtitle;
  if(ti) ti.textContent = ltitle;
  if(si) si.textContent = chtitle + ' · محاضرة';

  goPage('pg-video');

  // Load video
  setTimeout(function(){
    var vid = el('main-video');
    if(!vid) return;
    vid.src = vurl;
    vid.load();
    _vidBindEvents(vid);
    // Show paused state
    var cont = el('vid-container');
    if(cont) cont.classList.add('vid-paused');
  }, 50);
}

function _vidBindEvents(vid){
  vid.onplay = function(){
    _vidUpdatePlayBtn(true);
    var cont = el('vid-container');
    if(cont) cont.classList.remove('vid-paused');
  };
  vid.onpause = function(){
    _vidUpdatePlayBtn(false);
    var cont = el('vid-container');
    if(cont) cont.classList.add('vid-paused');
  };
  vid.ontimeupdate = function(){
    _vidUpdateProgress(vid);
    // Track watch percentage
    if(vid.duration && _viewLectureId){
      var pct = (vid.currentTime / vid.duration) * 100;
      if(pct > _viewMaxPct + 5){
        _viewMaxPct = pct;
        trackLectureView(_viewLectureId, pct);
      }
    }
  };
  vid.onended = function(){
    if(_viewLectureId) trackLectureView(_viewLectureId, 100);
  };
  vid.onloadedmetadata = function(){
    var d = el('vid-duration');
    if(d) d.textContent = _vidFmt(vid.duration);
  };
  vid.onprogress = function(){
    _vidUpdateBuffer(vid);
  };

  // Progress track click
  var track = el('vid-progress-track');
  if(track){
    track.onclick = function(e){
      var rect = track.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      vid.currentTime = pct * vid.duration;
    };
  }
}

function _vidUpdatePlayBtn(playing){
  var icon = el('play-icon');
  if(!icon) return;
  if(playing){
    icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    icon.setAttribute('fill','none');
    icon.setAttribute('stroke','white');
    icon.setAttribute('stroke-width','2');
  } else {
    icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    icon.setAttribute('fill','white');
    icon.setAttribute('stroke','none');
  }
  // center icon too
  var ci = el('center-play-icon');
  if(ci){
    if(playing){
      ci.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      ci.setAttribute('fill','none');ci.setAttribute('stroke','white');ci.setAttribute('stroke-width','2');
    } else {
      ci.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
      ci.setAttribute('fill','white');ci.setAttribute('stroke','none');
    }
  }
}

function _vidUpdateProgress(vid){
  if(!vid.duration) return;
  var pct = (vid.currentTime / vid.duration) * 100;
  var fill = el('vid-prog-fill');
  var thumb = el('vid-prog-thumb');
  var cur = el('vid-current');
  if(fill) fill.style.width = pct+'%';
  if(thumb) thumb.style.left = pct+'%';
  if(cur) cur.textContent = _vidFmt(vid.currentTime);
}

function _vidUpdateBuffer(vid){
  if(!vid.duration || !vid.buffered.length) return;
  var pct = (vid.buffered.end(vid.buffered.length-1) / vid.duration) * 100;
  var buf = el('vid-buf');
  if(buf) buf.style.width = pct+'%';
}

function _vidFmt(s){
  if(isNaN(s)) return '0:00';
  var m = Math.floor(s/60);
  var sec = Math.floor(s%60);
  return m+':'+(sec<10?'0':'')+sec;
}

function vidTogglePlay(){
  var vid = el('main-video');
  if(!vid) return;
  if(vid.paused) vid.play();
  else vid.pause();
}

function vidSeek(secs){
  var vid = el('main-video');
  if(!vid) return;
  vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + secs));
}

function vidToggleMute(){
  var vid = el('main-video');
  if(!vid) return;
  vid.muted = !vid.muted;
  var icon = el('vol-icon');
  if(icon){
    if(vid.muted){
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
    } else {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>';
    }
  }
}

function vidSetVol(val){
  var vid = el('main-video');
  if(!vid) return;
  vid.volume = parseFloat(val);
  vid.muted = (parseFloat(val) === 0);
}

function vidToggleSpeedMenu(){
  var menu = el('vid-speed-menu');
  if(menu) menu.classList.toggle('hidden');
}

function vidSetSpeed(sp){
  var vid = el('main-video');
  if(!vid) return;
  vid.playbackRate = sp;
  var btn = el('vid-speed-btn');
  if(btn) btn.textContent = (sp===1?'1×':sp+'×');
  // mark active
  document.querySelectorAll('.vid-speed-menu button').forEach(function(b){
    b.classList.toggle('spd-active', parseFloat(b.textContent)===sp || (sp===1 && b.textContent==='عادي'));
  });
  var menu = el('vid-speed-menu');
  if(menu) menu.classList.add('hidden');
}

function vidFullscreen(){
  var cont = el('vid-container');
  var vid = el('main-video');
  if(!cont) return;
  if(document.fullscreenElement){
    document.exitFullscreen();
  } else {
    if(vid.requestFullscreen) vid.requestFullscreen();
    else if(cont.requestFullscreen) cont.requestFullscreen();
    else if(vid.webkitEnterFullscreen) vid.webkitEnterFullscreen();
  }
}

/* Close speed menu on outside click */
document.addEventListener('click', function(e){
  var menu = el('vid-speed-menu');
  var btn = el('vid-speed-btn');
  if(menu && !menu.classList.contains('hidden')){
    if(!menu.contains(e.target) && e.target !== btn){
      menu.classList.add('hidden');
    }
  }
});


/* ══════════════════════════════════════════════
   NOTIFICATIONS SYSTEM
══════════════════════════════════════════════ */
var _notifsCache = [];

async function loadNotifs(){
  var s = getSess();
  if(!s || !s.id) return;
  try{
    // Get unread notifs for this user's stage/grade + global notifs
    var q = '?is_active=eq.true&order=created_at.desc&limit=50';
    var rows = (await sb('notifications','GET',null,q)) || [];
    // Filter: global (no stage/grade) OR matches user stage/grade
    rows = rows.filter(function(n){
      if(!n.target_stage && !n.target_grade) return true; // global
      if(n.target_stage && n.target_stage !== curStage) return false;
      if(n.target_grade && n.target_grade !== curGrade) return false;
      return true;
    });
    _notifsCache = rows;
    updateNotifBadge(rows);
  }catch(e){ console.warn('Notifs load error:',e.message); }
}

function updateNotifBadge(rows){
  // Count unread — check localStorage for read IDs
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  var unread = rows.filter(function(n){ return !readIds.includes(n.id); }).length;
  // Update all badges
  document.querySelectorAll('.notif-badge').forEach(function(b){
    if(unread > 0){
      b.textContent = unread > 99 ? '99+' : unread;
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}

function openNotifs(){
  loadNotifs().then(function(){
    renderNotifsList();
  });
  openModal('ov-notifs');
}

function renderNotifsList(){
  var list = el('notifs-list');
  if(!list) return;
  if(!_notifsCache.length){
    list.innerHTML = '<div class="state-box" style="padding:40px 0"><div class="state-ic">🔔</div><h3 style="color:var(--d-tx1)">لا توجد إشعارات</h3><p style="color:var(--d-tx3)">ستظهر هنا عند إضافة محتوى جديد</p></div>';
    return;
  }
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  var html = '';
  _notifsCache.forEach(function(n){
    var isRead = readIds.includes(n.id);
    var timeAgo = getTimeAgo(n.created_at);
    var typeIcon = n.type==='lecture'?'📹':n.type==='exam'?'📝':n.type==='booklet'?'📚':'🔔';
    html += '<div class="notif-item'+(isRead?'':' notif-unread')+'" onclick="markNotifRead(\''+n.id+'\')">'
          + '<div class="notif-icon-wrap">'+typeIcon+'</div>'
          + '<div class="notif-content">'
          + '<div class="notif-title">'+n.title+'</div>'
          + (n.body?'<div class="notif-body">'+n.body+'</div>':'')
          + '<div class="notif-time">'+timeAgo+'</div>'
          + '</div>'
          + (isRead?'':'<div class="notif-dot"></div>')
          + '</div>';
  });
  list.innerHTML = html;
}

function markNotifRead(id){
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  if(!readIds.includes(id)){ readIds.push(id); }
  localStorage.setItem('dz_notifs_read', JSON.stringify(readIds));
  updateNotifBadge(_notifsCache);
  renderNotifsList();
}

function markAllNotifsRead(){
  var readIds = _notifsCache.map(function(n){return n.id;});
  localStorage.setItem('dz_notifs_read', JSON.stringify(readIds));
  updateNotifBadge(_notifsCache);
  renderNotifsList();
}

function getTimeAgo(dateStr){
  var diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if(diff < 60)    return 'الآن';
  if(diff < 3600)  return Math.floor(diff/60)+' دقيقة';
  if(diff < 86400) return Math.floor(diff/3600)+' ساعة';
  return Math.floor(diff/86400)+' يوم';
}

// Load notifs after login/boot
var _origSetSess = setSess;
// Auto-load notifs when user is available
(function(){
  var orig = window.onload;
  setTimeout(function(){
    if(getSess() && getSess().id) loadNotifs();
  }, 2000);
})();