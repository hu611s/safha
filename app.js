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
var _pageHistory = [];
var curCTab='booklets', curFilter='all';
var isDark=false, isGuest=false;
var searchIdx=[];

/* ── SESSION (localStorage) ──────────────────── */
function getSess(){ try{return JSON.parse(localStorage.getItem('dz_sess'))||null;}catch(e){return null;} }

/* ══════════════════════════════════════════════
   BALANCE SYSTEM — نظام الرصيد
══════════════════════════════════════════════ */
async function fetchAndCacheBalance(){
  var sess = getSess();
  if(!sess || !sess.id) return 0;
  try{
    var rows = await sb('users','GET',null,'?id=eq.'+sess.id+'&select=balance');
    var bal  = (rows && rows[0] && typeof rows[0].balance==='number') ? rows[0].balance : 0;
    sess.balance = bal; setSess(sess);
    return bal;
  }catch(e){
    /* عمود balance غير موجود أو خطأ شبكة — أعد الرصيد من الجلسة */
    return typeof sess.balance==='number' ? sess.balance : 0;
  }
}

function getCachedBalance(){
  var s = getSess(); return s ? (s.balance||0) : 0;
}

function updateBalanceUI(){
  var bal = getCachedBalance();
  var formatted = bal.toLocaleString('ar-IQ');
  // Update settings panel balance display
  document.querySelectorAll('.sb-balance-val').forEach(function(el){
    el.textContent = formatted + ' د.ع';
  });
  // Update nav sidebar balance button
  var navVal = document.getElementById('sb-nav-balance-val');
  if(navVal) navVal.textContent = formatted;
}

/* فتح معلومات الرصيد (للمستخدم العادي) */
function openBalanceInfo(){
  openBalanceOv();
}
/* ══════════════════════════════════════════════════════════════
   نظام شحن الرصيد بالأكواد
   الأكواد مشفرة بـ SHA-256 — لا يمكن عكسها
══════════════════════════════════════════════════════════════ */
var VALID_CODE_HASHES = ["8261a717dac128821c1193039f2602761a91ba569f6c65a915afadbac33cfae5", "78fdd8b85615bb38589e68a7c8f46f4350a192f6613a82066a6c0f34a501f347", "e0e235429a50b2b1e6a196c2a3eb8d61c94e0fcddf3e62dc7c1a7ad95a8082bd", "d2566112a04e23e396da0bd0ad3f3263ab21983cde0367adbe90cbbbbcf01160", "b725e18f7301a0be0cff71e24c5f9900a195d77db56666d22b87b9e75f337684", "00bf2b57a99c3bbcd299561cca2845d58a9677a70e74c52e04139e99e7c622d4", "a01fc7cc1f88e078d0cd859dcad145c9f5d4dea5490744fcfca2253f3c6ff288", "c7e427756754457c76eba33f6eacc603ddda2501ba56c979621cbef5589f7375", "ff9c65f3173e97013ce9adc7a2d897d211da0888be9e0f1569f4f14f2e64746c", "b32a683deffc7f1dc3d7df7b642610d7d36b2b27589817ade12c8da1930e80e8", "0bbf49fb485735e6de1ba58a9b6e05c44c5bfce2b0ef87652694cc2a36ec9654", "82456f3da4aed34118339cc11aeaddc1950ebc869390d3184d09c1fc146cba89", "c3c668ca6f6b23664c01952476570fae3e209eefd9f2d12b712283f737135d76", "6a71caaa32cf2a7d0d37b48c43ad9ebe63494e42c6331c8373574f35d53a4a02", "e533635174d7daa92636199de52d7c2e9ed52c027b7977bab6ea191b196c1fdd", "68a8f845a6cc4926211f05091f52304354cc180050fb62b5fc24e10d0d2fad20", "422177563b062195b95bdac339446349a214278786a662c28d9fdad43ea8e8fa", "1abb72bd8294764ba4f116c3d9f2b979517bd8c21e9691e64bfb28bf4c20f088", "44277dd174babeb2f217fd5190c8dc9c6ead94e76fd8c37c5432df4fd5f910e5", "bffe6a504ce4d8fca26812c7ea9c5278adeb2ba3113f41b147e2a6b5c7903ce2", "e714d9ad763ed85b88ab2b88512087a8bcbe1877dfe09d0483be7b118d0ea99d", "5418f885a41116be39e66b33ba9e92f7147100175d0382a8c4cc83c222daa4a4", "cd1ca1651bf5c93b1f4d5419fcdd58f543ba099501720010f9cc999ac02553bd", "3ae9b5f532cf9557cf0be8181c1389263d5fd17d0b27d47b93bd8c5cd2676498", "af36ae23649c6b5e91249401546f9e55765640522d9f805c48b5e059e52e76bb", "34558cb2bfbb86a60aff8033e083bed55f640bad2f0045def60ffccdc8262b16", "e2a4817c9d348bacc6660404a76280e68ebb8bffe6acdb7c156c77d802e017f4", "ec04ffb96750268cf9ba654450d22b615305835739fe00ce7ccde2f620aded4b", "22588bd267204ee7893ceeb5a74e4f344286c902c071fc7d82b931dcafb103cb", "de66bd7ee3ca6c3cdfae9cc97166a5f2af768e97571db688c037fad5a42ed97f", "88e8256289d9f374ee72d5ee90bfa60a7bca59bca17eba91c8f5552ac0985b79", "701fe6e10ab1cabe5a2062d60d3f8544586124dbf6c89597fa5ea7a7100358d2", "a85f4d54f7c789c8cc72fc42bcffdf98f3e44ab4e3e5924e28d41fdf86705fb2", "34dd8058b8373cf2c19cd73515a8bc9dc92b50dca2abe5104152dd94359f23c0", "5a13bc4a9d026340d868e850379961c7bc93a5283cbf38a30129e5b2618cf868", "109ab3f7a474e0c848a5fea31a343e755b92d8aa361fb0edd56aa5d46090e0d8", "44717a6daf3c36578b362e5c19bea3f1e25a2ec2ea11c0c4712f6ff63501d4be", "d7509f72db1d52e2e63f5332cbbb03f6024ad947ea81c4098465fd17629cdfa5", "c56bff418213d110158cb8d11e6749c0d866b92b3bf92c48c17d5b3d420be72e", "223e61e6eb22ed6c9e56df19b85a27e71af94eb33ab0e3055d7b69824a89c357", "d77e0707fa2917e837fb7c42b0c635f6609797fdf889a2237c8a47629ebaf8f7", "cb2af116c7b60ae3c32e03c0faea84ad03dfab4a81369c83682f003557f195cf", "0ea08729a6129bc05001e5f8e09a04b174c01b110f6d46594bdf83e054fc37b1", "5193f1c1574c7dd91a81038f31e2b4abe9c7d2f39a1b1a97a689d345e22a2a8f", "329ab3e93d5b456c4976887016055e3f45065db057be8504a1d17b802602dbbd", "28fed145ced2c4c0a8a1719a438ca4fdd98fb69ec824c9cd0928e3581d96cd17", "385c6140c2c6ecd84f1863acc357a13fa939d86d82db45afba62be34148dfeb9", "884126b80030ad5463805f1f8274832ed9e0fac2a3c712a615378427bef49809", "7c9bacd10915e73242fb21549c4f5452dff467933e99595262745d3ed669b25d", "7f7769be0c78efc446039cff0e70df5d0b2aa36b3c590a9066d5d362b896aba0", "46a35093646b884cc1dd19a03a443b20e236a8c4017fb7ce59b5e54074013879", "537a05a5e79ec7cf417b1cb7689b9a999ebf6f6cf90c6ff954e8a429e0326c9a", "8e423380f49084faf2aa3abca88dd72cd680e94f058af59a4de944640a1b9365", "053ab02ea9bd6036ff830d5a5cadb02211ee07966971cbccc37ad08fdcdd9910", "0cc6f022e6b7bde69ced54ec5667ef1f771eac62db09e6a4d2b741385196bb05", "8dfef460ed5756aa6166f4dbde6e0abf7b28e3ffea23ca85dedacf22f52a8ca8", "b8e484cd138ecc14b33035a9e51fd77f07150ab25f7015e2cce6e3290e3f6fd4", "181da4f899abeccdb8d3f6454014687c5c8742d75cc38db87e57793bfdbb70f5", "12b337fdeda28f597168ec32a798991b313f18b3f654197ae63aeafc5d1a30c0", "82fd993b4d8778df9553041dc595727387e21af5d0746fac0f43487b7e699cd2", "bf29a6442e56ae5d8e2a85627ec15def65907119b42067df728f632215cd2518", "55f5de7c723212840d88c9e857b65fc3a8da2c34598d39f325db5e118aa23feb", "bbe71ea2280b8a87ac972d1bd1f314ced8b8d90270042047bcd1ffda8e0f0264", "505299454627baa90693317357884a0b03318792b90430a135443702c6d90d2a", "db4da9ac1dba0394750b0374e6da81b1284af54ac280f8f7bc72800d00ee1d7e", "57011825e1a8c711d63535e5528c49515badfbe007ffd6768e4a5400fbf604e6", "95a33724e5ee91bf1e8ac5aab8d488fcecd16b84f626f07df7793678f55320f4", "6e0d27b444c8e06a94bb1079fa8e33b307a917b836a582444714c4e68b19222e", "b844dc6f33726b7bfe44d5e195bce12c2d7d74870be67f397b82d3f23f0ae484", "2bf837811b7bf23f10eb172284ac0311248ad66b71fabdfdb65c1f847df945ef", "bc7e59097f78393a6344520cb63f52ca1e4338932b3036cab3102755aa5cd2ef", "4dd71dc1c8bc48a266c72f00b213a40b706c1f45660685f86d2ea643663e649f", "a4b3c6762bb8d9bde4423fb2dbfc1df42b839bddc35a21bca600452c7fd7ad0e", "dde9a1724442a1e642835d7e6bf8ab678554f02428586b7d46cdf63a49045ca9", "b80e7b36926bb3e30ed832b0b66dfb2733be21f293ec272620bff9908583bdfc", "51e10b05b5447c3c57ac5b3a44a807ae5f22fb14cec4f8d5fa5c7e2c4189a2ab", "3cad8ea8b5d8ec3a8aa7482b771f9cde91e37dd3d5a9e0bcf58febd4b0f6a863", "7ee0bc21cfcee62ca111d30406c9a415c972a21a36899c67c854c8b56d939651", "3e3102daa76218afa661532ad851d5b71be9b5f882b38a0f741660556b373ca2", "f7bb7beb515343191edb1eb240e2e98f1533c50e1709c13855f186d87e0d6543", "1f988fe25fc5e9c7f225065004ec04be1facbed7bae488e438c17315609e652f", "121877c4e248db72a9ab158f36103ce0f28f213a3bc4527f076f04bafb1a9446", "6b9c6fc940a7c13100a1f0f934cff311dd2b6d712d16a61b091fd69ecaf040f1", "d795fc704f3574eda9320539915fa62c973c770a5f731055bed335fd78e7597a", "399479c659dfec311f4bb56a7b703e38e82c842b4321e17eda4a85edc091065a", "b74b11c9452ef6bddeac8ecc90e05d850d67219980171fc1efcf9a93e6ed5822", "0760fdecc462f641845a161f8624da02dd0134331dba2718709a9532ee4223c7", "8005317e1dfd4fd98e8b3be38fbba43fcf32e3950dac6f308c8a3852678b5215", "ba503c8df471cec751291aafadf3cbb6a4262330d66cca1375f625fd0dc25bf6", "2af693bf59eb80fa08e19a428c93b0bbafd3d0df4c6e3c2d4f006441d06c6863", "2aa5ee71dddddc901c055e4c66dd6521b58c61d5e3a3c7331f49aae29863f80d", "0420bb3ac7466a7882417c4d67bca27c7ab4a78a8ac3b28efbf9aeabe6ae42c9", "e70435eb1de4a62a7fb910c904e9e87bc542d6ef47f0670f192662c29be72636", "fc91d096ea9a5a5a6ed333bc381b8b4caf1fc51fbb3a550e9c0a67dd98d3b1e6", "657f309db01f65b2cc17230e32d4a97534efe0255bb781e1e5673bb58eb70b62", "a027295c1fab19c77312e37db39d06109a4a9d7a0ffe3322798c30a53f2ec191", "ecde9d2e531ce42d612b1e32707962476f1dd0133750d438f2d78142ff34ca61", "abc0c4a7ec8e7344cb176c8e9b1f27c85cd5c136f98bf7e1a38ea1a1be20ed22", "3c244c71cab83bd71fb128e193ec602711703ace109d514facbd62075cb5ded7", "1e0ff21515e6f6cb895568aa48ac60f655e640f977c64f6fbbfb2dd4e8f68536", "2f3ddb5e567eeb2bc65f36e72f2a7cb13603eeb77757ffe8e896a3be83acd058"];

/* تنسيق الكود أثناء الكتابة: XXXX-XXXX-XXXX */
function ovbFormatCode(inp){
  var raw = inp.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase().slice(0,12);
  var parts = [];
  if(raw.length > 0) parts.push(raw.slice(0,4));
  if(raw.length > 4) parts.push(raw.slice(4,8));
  if(raw.length > 8) parts.push(raw.slice(8,12));
  inp.value = parts.join('-');
}

/* SHA-256 بالـ Web Crypto API */
async function sha256(msg){
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}

/* فتح overlay الرصيد */
async function openBalanceOv(){
  var sess = getSess();
  if(!sess || !sess.id || isGuest){
    toast('🔒 يجب تسجيل الدخول لعرض الرصيد','warn');
    return;
  }
  // تحديث الرصيد
  var bal = await fetchAndCacheBalance().catch(function(){ return getCachedBalance(); });
  updateBalanceUI();
  var amtEl = document.getElementById('ovb-amount');
  if(amtEl) amtEl.innerHTML = bal.toLocaleString('ar-IQ') + ' <span class="ovb-currency">د.ع</span>';
  // إظهار
  var bk = document.getElementById('ov-balance-backdrop');
  var ov = document.getElementById('ov-balance');
  if(bk) bk.style.display = 'block';
  if(ov) ov.style.display = 'flex';
  // تنظيف الحقل والرسالة
  var inp = document.getElementById('ovb-code-input');
  if(inp) inp.value = '';
  var msg = document.getElementById('ovb-msg');
  if(msg){ msg.textContent=''; msg.className='ovb-msg'; }
  setTimeout(function(){ if(inp) inp.focus(); }, 120);
}

/* إغلاق overlay الرصيد */
function closeBalanceOv(){
  var bk = document.getElementById('ov-balance-backdrop');
  var ov = document.getElementById('ov-balance');
  if(bk) bk.style.display='none';
  if(ov) ov.style.display='none';
}

/* عملية استرداد الكود */
async function redeemCode(){
  var sess = getSess();
  if(!sess || !sess.id || isGuest){
    toast('🔒 يجب تسجيل الدخول','warn'); return;
  }

  var inp = document.getElementById('ovb-code-input');
  var msgEl = document.getElementById('ovb-msg');
  var btn = document.getElementById('ovb-recharge-btn');

  var code = (inp ? inp.value : '').trim().toUpperCase();
  if(!code){
    _ovbMsg('⚠️ أدخل الكود أولاً','warn'); return;
  }
  // التحقق من صيغة الكود XXXX-XXXX-XXXX
  if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)){
    _ovbMsg('⚠️ صيغة الكود غير صحيحة (مثال: A7K9-X2L4-P8Q1)','warn'); return;
  }

  // تعطيل الزر أثناء المعالجة
  if(btn){ btn.disabled=true; btn.textContent='⏳ جارٍ التحقق...'; }
  _ovbMsg('','');

  try{
    // 1. احسب hash
    var hash = await sha256(code);

    // 2. تحقق أن الـ hash موجود
    if(!VALID_CODE_HASHES.includes(hash)){
      _ovbMsg('❌ الكود غير صحيح أو غير موجود','err');
      return;
    }

    // 3. تحقق من عدم الاستخدام المسبق في Supabase
    var used = await sb('used_codes','GET',null,'?code_hash=eq.'+hash+'&select=id');
    if(used && used.length){
      _ovbMsg('❌ هذا الكود استُخدم مسبقاً وتم تعطيله','err');
      return;
    }

    // 4. أضف الكود للمستخدمة
    await sb('used_codes','POST',{
      code_hash:  hash,
      used_by:    sess.id,
      used_at:    new Date().toISOString()
    });

    // 5. احسب الرصيد الجديد
    var rows = await sb('users','GET',null,'?id=eq.'+sess.id+'&select=balance');
    var curBal = (rows && rows[0] && typeof rows[0].balance==='number') ? rows[0].balance : (sess.balance||0);
    var newBal = curBal + 150000;

    // 6. حدّث الرصيد في DB
    await sb('users','PATCH',{balance: newBal},'?id=eq.'+sess.id);

    // 7. حدّث الجلسة والـ UI
    sess.balance = newBal; setSess(sess); updateBalanceUI();
    var amtEl = document.getElementById('ovb-amount');
    if(amtEl) amtEl.innerHTML = newBal.toLocaleString('ar-IQ') + ' <span class="ovb-currency">د.ع</span>';

    // 8. رسالة نجاح وتنظيف
    if(inp) inp.value = '';
    _ovbMsg('✅ تم الشحن بنجاح! أُضيف 150,000 د.ع إلى رصيدك 🎉','ok');
    toast('✅ تم شحن 150,000 د.ع بنجاح!','ok');

  }catch(e){
    _ovbMsg('❌ خطأ: '+(e.message||'حاول مجدداً'),'err');
  }finally{
    if(btn){ btn.disabled=false; btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><path d="M12 5v14M5 12l7-7 7 7"/></svg> شحن الرصيد'; }
  }
}

/* عرض رسالة داخل overlay */
function _ovbMsg(text, type){
  var el = document.getElementById('ovb-msg');
  if(!el) return;
  el.textContent = text;
  el.className = 'ovb-msg' + (type ? ' ovb-msg-'+type : '');
}


/* ══════════════════════════════════════════════
   ACTIVITY LOG — تسجيل نشاط المستخدم
   يُسجَّل في جدول activity_logs في Supabase
══════════════════════════════════════════════ */
function logActivity(type, data){
  /* type: 'exam' | 'lecture' | 'booklet'
     data: { item_id, item_name, subject_name, score(exam only) } */
  var sess = getSess();
  if(!sess || !sess.id || isGuest) return;
  try{
    var payload = {
      user_id:      sess.id,
      username:     sess.username || '',
      type:         type,
      item_id:      data.item_id   || '',
      item_name:    data.item_name  || '',
      subject_name: data.subject_name || '',
      score:        data.score !== undefined ? data.score : null,
      created_at:   new Date().toISOString()
    };
    sb('activity_logs','POST',payload).catch(function(){});
  }catch(e){}
}

var _activityCache  = [];
var _curTeacherId   = null;   /* المدرس المفتوح حالياً */
var _curTeacherPrice = 0;     /* سعره */

async function loadActivityLog(){
  var sess = getSess();
  if(!sess || !sess.id) return;
  try{
    var rows = (await sb('activity_logs','GET',null,
      '?user_id=eq.'+sess.id+'&order=created_at.desc&limit=20')) || [];
    _activityCache = rows;
    renderActivityLog(rows);
  }catch(e){
    var list = el('activity-list');
    if(list) list.innerHTML = '<div class="state-box"><p style="color:var(--d-tx3)">تعذّر تحميل السجل</p></div>';
  }
}

function renderActivityLog(rows){
  var list = el('activity-list');
  if(!list) return;
  if(!rows || !rows.length){
    list.innerHTML = '<div class="state-box" style="padding:40px 0"><div class="state-ic">📋</div><h3 style="color:var(--d-tx1)">لا يوجد نشاط بعد</h3><p style="color:var(--d-tx3)">ستظهر هنا الاختبارات والمحاضرات والملازم التي تفاعلت معها</p></div>';
    return;
  }
  var ICONS = {exam:'📝', lecture:'📹', booklet:'📚'};
  var LABELS = {exam:'اختبار', lecture:'محاضرة', booklet:'ملزمة'};
  var COLORS = {exam:'var(--d-yellow)', lecture:'var(--d-p400)', booklet:'var(--d-teal)'};
  var html = '';
  rows.forEach(function(r){
    var icon  = ICONS[r.type]  || '📌';
    var label = LABELS[r.type] || r.type;
    var color = COLORS[r.type] || 'var(--d-p400)';
    var time  = getTimeAgo(r.created_at);
    var extra = '';
    if(r.type === 'exam' && r.score !== null && r.score !== undefined){
      var sc = parseInt(r.score);
      var col = sc >= 80 ? '#22c55e' : sc >= 50 ? '#f59e0b' : '#ef4444';
      extra = '<span class="act-score" style="background:'+col+'20;color:'+col+';border:1px solid '+col+'40">'+sc+'%</span>';
    }
    html += '<div class="act-row">'
          + '<div class="act-ic" style="background:'+color+'18;color:'+color+'">'+icon+'</div>'
          + '<div class="act-info">'
          +   '<div class="act-name">'+r.item_name+'</div>'
          +   '<div class="act-meta">'
          +     '<span class="act-type-badge" style="background:'+color+'18;color:'+color+'">'+label+'</span>'
          +     (r.subject_name ? '<span>'+r.subject_name+'</span>' : '')
          +   '</div>'
          + '</div>'
          + '<div class="act-right">'
          +   extra
          +   '<div class="act-time">'+time+'</div>'
          + '</div>'
          + '</div>';
  });
  list.innerHTML = html;
}

function openActivityLog(){
  goPage('pg-activity');
  loadActivityLog();
}

function setSess(s){ localStorage.setItem('dz_sess',JSON.stringify(s)); }
function getFavs(){ try{return JSON.parse(localStorage.getItem('dz_favs'))||[];}catch(e){return[];} }
function setFavs(f){ localStorage.setItem('dz_favs',JSON.stringify(f)); }

/* ── UTILS ───────────────────────────────────── */
function el(id){ return document.getElementById(id); }
function goPage(pid){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});
  if(el(pid)) el(pid).classList.add('active');
  window.scrollTo(0,0);
  // Track page history for back button
  if(!_pageHistory) _pageHistory = [];
  if(_pageHistory[_pageHistory.length-1] !== pid) _pageHistory.push(pid);
  if(_pageHistory.length > 20) _pageHistory.shift();
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
function showBottomNav(s){
  var n=el('bottomNav');
  if(n){if(s)n.classList.remove('hidden');else n.classList.add('hidden');}
  // Sync global top bar
  var gt=el('gtbar');
  if(gt){if(s)gt.classList.remove('hidden');else gt.classList.add('hidden');}
  // Body class for page top-padding
  if(s){document.body.classList.add('has-gtbar');}else{document.body.classList.remove('has-gtbar');}
  if(s){updateGtbarAvatar();syncNotifToggle();}
  // Auth page: always full-screen, hide all chrome
  var pgAuth=el('pg-auth');
  if(pgAuth){
    if(s){ pgAuth.style.paddingTop=''; }
    else { pgAuth.style.paddingTop='0'; }
  }
}

/* ══════════════════════════════════════════════════════════
   GLOBAL TOP BAR + SIDEBAR
   ══════════════════════════════════════════════════════════ */

function showGlobalTopBar(s){
  var b=el('gtbar');
  if(b){ if(s)b.classList.remove('hidden'); else b.classList.add('hidden'); }
}

function updateGtbarAvatar(){
  var sess=getSess();
  if(!sess) return;
  var av=el('gtbar-avatar');
  var sbAv=el('sb-avatar');
  var sbUn=el('sb-uname');
  var sbSt=el('sb-ustage');
  if(av){
    if(sess.photo_url){
      av.innerHTML='<img src="'+sess.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.textContent=\''+((sess.name||'؟').charAt(0).toUpperCase())+'\'">';
    } else {
      av.textContent=(sess.name||'؟').charAt(0).toUpperCase();
    }
  }
  if(sbAv){
    if(sess.photo_url){
      sbAv.innerHTML='<img src="'+sess.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.textContent=\''+((sess.name||'؟').charAt(0).toUpperCase())+'\'">';
    } else {
      sbAv.textContent=(sess.name||'؟').charAt(0).toUpperCase();
    }
  }
  if(sbUn) sbUn.textContent=sess.name||sess.username||'—';
  if(sbSt){
    var sm=STAGES_META&&STAGES_META[curStage];
    sbSt.textContent=sm?sm.name:(curStage?curStage:'—');
  }
  // Dark toggle sync
  updateSbThemeIcon();
}

/* ── Sidebar open/close ─────────────────────────── */
function openSidebar(){
  var sb=el('sidebar'), ov=el('sb-overlay');
  if(!sb||!ov) return;
  updateGtbarAvatar();
  sb.classList.add('open');
  ov.classList.add('open');
  document.body.style.overflow='hidden';
  // Always show main nav, hide settings sub-panel
  var sp=el('sb-settings-panel'); if(sp) sp.style.display='none';
  var nav=el('sidebar')&&el('sidebar').querySelector('.sb-nav'); if(nav) nav.style.display='';
  var ft=el('sidebar')&&el('sidebar').querySelector('.sb-footer'); if(ft) ft.style.display='';
}
function closeSidebar(){
  var sb=el('sidebar'), ov=el('sb-overlay');
  if(!sb||!ov) return;
  sb.classList.remove('open');
  ov.classList.remove('open');
  document.body.style.overflow='';
}

/* ── Settings sub-panel inside sidebar ───────────── */
function openSbSettings(){
  var sp=el('sb-settings-panel');
  var nav=el('sidebar')&&el('sidebar').querySelector('.sb-nav');
  var ft=el('sidebar')&&el('sidebar').querySelector('.sb-footer');
  if(sp){ sp.style.display=''; sp.style.animation='sbSubIn .22s ease'; }
  if(nav) nav.style.display='none';
  if(ft) ft.style.display='none';
  updateSbDarkToggle();
  // تعبئة معلومات الحساب
  var sess=getSess();
  var av=el('sb-account-avatar');
  var nm=el('sb-account-name');
  var un=el('sb-account-username');
  var mt=el('sb-account-meta');
  var st=el('sb-account-stage');
  var logoutBtn=el('sb-logout-btn');
  var loginBtn=el('sb-login-btn');
  if(sess&&sess.name){
    if(av){
      if(sess.photo_url){
        av.innerHTML='<img src="'+sess.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.textContent=\''+(sess.name.charAt(0).toUpperCase())+'\'"/>';
      } else { av.textContent=sess.name.charAt(0).toUpperCase(); }
    }
    if(nm) nm.textContent=sess.name||'—';
    if(un) un.textContent=sess.username?('@'+sess.username):'';
    // عمر وجنس
    var meta=[];
    var age=localStorage.getItem('dz_age');
    var gender=localStorage.getItem('dz_gender');
    if(age) meta.push(age+' سنة');
    if(gender) meta.push(gender==='male'?'ذكر':'أنثى');
    if(mt) mt.textContent=meta.join(' • ')||'';
    // مرحلة وصف
    var sm=STAGES_META&&curStage?STAGES_META[curStage]:null;
    var gr=curGrade?ALL_GRADES.find(function(g){return g.id===curGrade;}):null;
    var stageText=sm?sm.name:'لم تختر مرحلة';
    var gradeText=gr?(' — '+gr.name):'';
    if(st) st.textContent=stageText+gradeText;
    if(logoutBtn) logoutBtn.style.display='';
    if(loginBtn) loginBtn.style.display='none';
  } else {
    if(av) av.textContent='؟';
    if(nm) nm.textContent='زائر';
    if(un) un.textContent='';
    if(mt) mt.textContent='';
    if(st) st.textContent='';
    if(logoutBtn) logoutBtn.style.display='none';
    if(loginBtn) loginBtn.style.display='';
  }
}
function closeSbSettings(){
  var sp=el('sb-settings-panel');
  var nav=el('sidebar')&&el('sidebar').querySelector('.sb-nav');
  var ft=el('sidebar')&&el('sidebar').querySelector('.sb-footer');
  if(sp) sp.style.display='none';
  if(nav) nav.style.display='';
  if(ft) ft.style.display='';
}

/* ── Dark mode sync ──────────────────────────────── */
function updateSbThemeIcon(){
  var tog=el('sb-dark-toggle'); if(!tog) return;
  var lbl=el('sb-theme-label');
  if(isDark){
    tog.classList.add('on');
    if(lbl) lbl.textContent='الوضع النهاري';
  } else {
    tog.classList.remove('on');
    if(lbl) lbl.textContent='الوضع الليلي';
  }
}
function updateSbDarkToggle(){ updateSbThemeIcon(); }

/* ── Notifications toggle ──────────────────────── */
var _notifEnabled = localStorage.getItem('dz_notif')!=='off';
function toggleNotifSetting(){
  _notifEnabled = !_notifEnabled;
  localStorage.setItem('dz_notif', _notifEnabled?'on':'off');
  var t=el('sb-notif-toggle'); if(t){ if(_notifEnabled)t.classList.add('on'); else t.classList.remove('on'); }
  toast(_notifEnabled?'🔔 الإشعارات مفعّلة':'🔕 الإشعارات معطّلة','ok');
}
function syncNotifToggle(){
  _notifEnabled = localStorage.getItem('dz_notif')!=='off';
  var t=el('sb-notif-toggle'); if(t){ if(_notifEnabled)t.classList.add('on'); else t.classList.remove('on'); }
}

/* ── Notifications panel ────────────────────────── */
/* ── Notification Dropdown (top bar bell) ────────────── */
var _notifDropdownOpen = false;
function toggleNotifDropdown(e){
  e.stopPropagation();
  var dd = el('notif-dropdown');
  if(!dd) return;
  if(_notifDropdownOpen){
    dd.classList.add('hidden');
    _notifDropdownOpen = false;
  } else {
    dd.classList.remove('hidden');
    _notifDropdownOpen = true;
    loadNotifs().then(function(){ renderNotifDropdown(); });
  }
}
function renderNotifDropdown(){
  var list = el('notif-dd-list');
  if(!list) return;
  if(!_notifsCache.length){
    list.innerHTML = '<div style="text-align:center;padding:28px 16px;color:var(--d-tx3)"><div style="font-size:2rem;margin-bottom:8px">🔔</div><div style="font-size:.82rem;font-weight:700">لا توجد إشعارات حالياً</div></div>';
    return;
  }
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  var html = '';
  _notifsCache.slice(0,8).forEach(function(n){
    var isRead = readIds.includes(n.id);
    var typeIcon = n.type==='lecture'?'📹':n.type==='exam'?'📝':n.type==='booklet'?'📚':'🔔';
    html += '<div class="notif-dd-item'+(isRead?'':' notif-dd-unread')+'" onclick="markNotifRead(\''+n.id+'\');renderNotifDropdown()">'          + '<div class="notif-dd-icon">'+typeIcon+'</div>'          + '<div class="notif-dd-body">'          + '<div class="notif-dd-title">'+n.title+'</div>'          + (n.body?'<div class="notif-dd-sub">'+n.body+'</div>':'')          + '<div class="notif-dd-time">'+getTimeAgo(n.created_at)+'</div>'          + '</div>'          + (isRead?'':'<div class="notif-dd-dot"></div>')          + '</div>';
  });
  list.innerHTML = html;
}
// Close dropdown when clicking outside
document.addEventListener('click', function(e){
  if(_notifDropdownOpen){
    var dd = el('notif-dropdown');
    var btn = el('gtbar-notif-btn');
    if(dd && !dd.contains(e.target) && !btn.contains(e.target)){
      dd.classList.add('hidden');
      _notifDropdownOpen = false;
    }
  }
});
function openNotifPanel(){ toggleNotifDropdown({stopPropagation:function(){}}); }

/* ── Contact modal ──────────────────────────────── */
function openContactModal(){
  window.open('https://forms.gle/hEavZ1hKWnHG8wcu9','_blank');
}

/* ── FAQ & Guide ────────────────────────────────── */
function openFaqModal(){ openModal('ov-faq'); }
function openGuideModal(){ openModal('ov-guide'); }

/* ── Notifications badge ─────────────────────────── */
function setNotifBadge(count){
  var b=el('notif-badge');
  if(!b) return;
  if(count>0){ b.textContent=count>9?'9+':count; b.classList.remove('hidden'); }
  else b.classList.add('hidden');
}

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
  // user-pill elements removed — global gtbar handles avatar display
  if(typeof updateGtbarAvatar==='function') updateGtbarAvatar();
  try{ updateBalanceUI(); }catch(e){}
}

/* ── SETTINGS ────────────────────────────────── */
function openSettings(){syncSettingsUI();openModal('ov-settings');setNavActive('settings');}
function openSupport(){openModal('ov-support');}
function syncSettingsUI(){
  if(typeof updateSbDarkToggle==='function') updateSbDarkToggle();
  if(typeof updateGtbarAvatar==='function') updateGtbarAvatar();
  var s=getSess();
  var av=el('set-avatar'), un=el('set-uname'), us=el('set-ustage');
  var setUsername=el('set-username-val');
  var setMeta=el('set-meta-val');

  if(s&&s.name){
    // Avatar
    if(av){
      if(s.photo_url){
        av.innerHTML='<img src="'+s.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.textContent=\''+(s.name.charAt(0).toUpperCase())+'\'"/>';
      } else { av.textContent=s.name.charAt(0).toUpperCase(); }
    }
    if(un) un.textContent=s.name;
    if(setUsername) setUsername.textContent=s.username?('@'+s.username):'—';
    // Age & gender from localStorage
    var age=localStorage.getItem('dz_age');
    var gender=localStorage.getItem('dz_gender');
    var metaParts=[];
    if(age) metaParts.push(age+' سنة');
    if(gender) metaParts.push(gender==='male'?'ذكر':'أنثى');
    if(setMeta) setMeta.textContent=metaParts.join(' • ')||'—';
    // Stage & grade
    var sm=curStage&&STAGES_META?STAGES_META[curStage]:null;
    var gr=curGrade?ALL_GRADES.find(function(g){return g.id===curGrade;}):null;
    var stageText=sm?sm.name:'لم تختر مرحلة';
    var gradeText=gr?(' — '+gr.name):'';
    if(us) us.textContent=stageText+gradeText;
  } else {
    if(av) av.textContent='؟';
    if(un) un.textContent='زائر';
    if(setUsername) setUsername.textContent='—';
    if(setMeta) setMeta.textContent='—';
    if(us) us.textContent='لم تختر مرحلة';
  }
  var lbl=el('set-theme-lbl');if(lbl)lbl.textContent=isDark?'الوضع الليلي ✓':'الوضع النهاري';
  var tog=el('set-toggle'),kn=el('set-knob');
  if(tog) tog.classList.toggle('on',!!isDark);
  if(kn) kn.style.transform=isDark?'translateX(-20px)':'';
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
    primary:   {name:'الابتدائية', sub:'الصفوف الأول — السادس',  icon:'🌱', accent:'#22c55e', bg:'rgba(34,197,94,.10)'},
    middle:    {name:'المتوسطة',   sub:'الصفوف الأول — الثالث',  icon:'📘', accent:'#3b82f6', bg:'rgba(59,130,246,.10)'},
    secondary: {name:'الإعدادية',  sub:'الرابع — السادس إعدادي', icon:'🔬', accent:'#f97316', bg:'rgba(249,115,22,.10)'},
    vocational:{name:'المهني',     sub:'الفروع المهنية والتقنية', icon:'⚙️', accent:'#8b5cf6', bg:'rgba(139,92,246,.10)'}
  };
  var html='<div class="stage-vlist">';
  stages.forEach(function(st){
    var m=stageMeta[st]||{name:st,sub:'',icon:'📚',accent:'#667eea',bg:'rgba(102,126,234,.10)'};
    html+='<div class="stage-vcard" onclick="pickerSelectStage(\''+st+'\')">'
        +'<div class="svc-icon" style="background:'+m.bg+';color:'+m.accent+'">'+m.icon+'</div>'
        +'<div class="svc-body">'
        +'<div class="svc-name">'+m.name+'</div>'
        +'<div class="svc-sub">'+m.sub+'</div>'
        +'</div>'
        +'<div class="svc-arr" style="color:'+m.accent+'">'
        +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>'
        +'</div>'
        +'</div>';
  });
  html+='</div>';
  grid.innerHTML=html;
}

/* Called when a stage card is tapped — CLOSE picker and go to pg-grade */
function pickerSelectStage(stageId){
  curStage = stageId;
  curGrade = null;
  closeModal('ov-picker');
  buildGradePage();
  goPage('pg-grade');
  setNavActive('home');
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

/* Called from Settings "تغيير المرحلة" — reopens stage picker */
function changeStageFromSettings(){
  openStagePicker('change');
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
  setTimeout(function(){
    // بعد اختيار المرحلة: إذا كان الصف محفوظاً انتقل للمواد مباشرة
    if(curGrade){
      var gradeObj=ALL_GRADES.find(function(g){return g.id===curGrade;});
      if(gradeObj && gradeObj.stage===curStage){
        openGradeSubjectsGrid(curGrade); setNavActive('home'); return;
      } else { curGrade=null; }
    }
    buildGradePage(); goPage('pg-grade'); setNavActive('home');
  },300);
}

/* ══════════════════════════════════════════════════════════
   NEW AUTH SYSTEM — Welcome + Login + Register Wizard
   ══════════════════════════════════════════════════════════ */

/* Legacy stub for any code that calls switchTab */
function switchTab(tab){ showAuthScreen(tab==='login'?'login':'register'); }

function showAuthScreen(screen){
  var w=el('auth-welcome'), lc=el('auth-login-card'), rc=el('auth-register-card');
  if(w) w.classList.add('hidden');
  if(lc) lc.classList.add('hidden');
  if(rc) rc.classList.add('hidden');
  if(screen==='welcome' && w){ w.classList.remove('hidden'); }
  else if(screen==='login' && lc){ lc.classList.remove('hidden'); var e=el('l-err');if(e)e.textContent=''; }
  else if(screen==='register' && rc){
    rc.classList.remove('hidden');
    _regStep=1; _regGender=null; _regStage=null; _regGrade=null; _regPhotoFile=null;
    regWizardGo(1);
    buildRegStageList();
  }
}

/* ── Register Wizard state ─────────────────────── */
var _regStep=1, _regGender=null, _regStage=null, _regGrade=null, _regPhotoFile=null;
var _usernameCheckTimer=null;

function regWizardGo(step){
  _regStep=step;
  [1,2,3].forEach(function(s){
    var el_=el('reg-step-'+s); if(el_) el_.classList.toggle('hidden', s!==step);
  });
  var titles={1:'معلومات الحساب',2:'بياناتك الشخصية',3:'مرحلتك الدراسية'};
  var t=el('reg-step-title'); if(t) t.textContent=titles[step]||'';
  var s=el('reg-step-sub'); if(s) s.textContent='الخطوة '+step+' من 3';
  var pb=el('reg-progress-bar'); if(pb) pb.style.width=(step/3*100)+'%';
  var backBtn=el('reg-back-btn');
  if(backBtn) backBtn.style.visibility = step===1?'hidden':'visible';
}
function regWizardBack(){
  if(_regStep<=1){ showAuthScreen('welcome'); }
  else { regWizardGo(_regStep-1); }
}
function regWizardNext(fromStep){
  if(fromStep===1){
    var dn=el('r-display-name').value.trim();
    var un=el('r-username').value.trim().toLowerCase();
    var pw=el('r-pass').value;
    var err=el('r-err');
    err.textContent='';
    if(!dn){ err.textContent='⚠️ أدخل اسمك الكامل'; return; }
    var unFmt = validateUsernameFormat(un);
    if(!unFmt.ok){ err.textContent = unFmt.msg || '⚠️ اسم المستخدم غير صالح'; return; }
    if(!pw||pw.length<4){ err.textContent='⚠️ كلمة المرور ٤ أحرف على الأقل'; return; }
    var status=el('reg-username-status');
    if(status&&status.dataset.valid==='false'){ err.textContent='⚠️ اسم المستخدم مستخدم مسبقاً'; return; }
    regWizardGo(2);
  } else if(fromStep===2){
    var err2=el('r-err-2'); err2.textContent='';
    if(!_regGender){ err2.textContent='⚠️ اختر الجنس'; return; }
    var age=el('r-age').value;
    if(!age||isNaN(age)||age<5||age>60){ err2.textContent='⚠️ أدخل عمراً صحيحاً (5–60)'; return; }
    regWizardGo(3);
  }
}
function selectGender(g){
  _regGender=g;
  var m=el('gender-male'), f=el('gender-female');
  if(m) m.classList.toggle('selected',g==='male');
  if(f) f.classList.toggle('selected',g==='female');
}
function previewRegPhoto(input){
  var file=input.files[0]; if(!file) return;
  _regPhotoFile=file;
  var reader=new FileReader();
  reader.onload=function(e){
    var prev=el('reg-photo-preview');
    if(prev) prev.innerHTML='<img src="'+e.target.result+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
  };
  reader.readAsDataURL(file);
}
function buildRegStageList(){
  var stages=[
    {id:'primary', name:'الابتدائية', icon:'🌱', accent:'#22c55e', bg:'rgba(34,197,94,.10)'},
    {id:'middle',  name:'المتوسطة',   icon:'📘', accent:'#3b82f6', bg:'rgba(59,130,246,.10)'},
    {id:'secondary',name:'الإعدادية', icon:'🔬', accent:'#f97316', bg:'rgba(249,115,22,.10)'},
    {id:'vocational',name:'المهني',   icon:'⚙️', accent:'#8b5cf6', bg:'rgba(139,92,246,.10)'}
  ];
  var container=el('reg-stage-list'); if(!container) return;
  var html='';
  stages.forEach(function(s){
    html+='<div class="reg-stage-opt" id="reg-stage-'+s.id+'" onclick="selectRegStage(\''+s.id+'\')">'        +'<div class="reg-stage-ic" style="background:'+s.bg+';color:'+s.accent+'">'+s.icon+'</div>'        +'<span>'+s.name+'</span>'        +'</div>';
  });
  container.innerHTML=html;
}
function selectRegStage(stageId){
  _regStage=stageId; _regGrade=null;
  document.querySelectorAll('.reg-stage-opt').forEach(function(o){ o.classList.remove('selected'); });
  var opt=el('reg-stage-'+stageId); if(opt) opt.classList.add('selected');
  // Show grades
  var gradeSection=el('reg-grade-section');
  var gradeList=el('reg-grade-list');
  if(!gradeSection||!gradeList) return;
  var grades=ALL_GRADES.filter(function(g){return g.stage===stageId;});
  var html='';
  grades.forEach(function(g){
    html+='<div class="reg-grade-opt" id="reg-grade-'+g.id+'" onclick="selectRegGrade(\''+g.id+'\')">'+g.name+'</div>';
  });
  gradeList.innerHTML=html;
  gradeSection.classList.remove('hidden');
  updateRegFinishBtn();
}
function selectRegGrade(gradeId){
  _regGrade=gradeId;
  document.querySelectorAll('.reg-grade-opt').forEach(function(o){ o.classList.remove('selected'); });
  var opt=el('reg-grade-'+gradeId); if(opt) opt.classList.add('selected');
  updateRegFinishBtn();
}
function updateRegFinishBtn(){
  var btn=el('reg-finish-btn');
  if(!btn) return;
  var ok = _regStage && _regGrade;
  btn.disabled=!ok;
  btn.style.opacity=ok?'1':'0.5';
  btn.style.cursor=ok?'pointer':'not-allowed';
}
var _checkUsernameTimer=null;
var _checkEditUsernameTimer=null;
function checkEditUsername(val){
  var status=el('edit-username-status');
  if(!status) return;
  val=(val||'').toLowerCase();
  if(!val){ status.innerHTML=''; status.dataset.valid=''; return; }
  var fmt=validateUsernameFormat(val);
  if(!fmt.ok){
    status.innerHTML=fmt.msg?'<span style="color:#ef4444">'+fmt.msg+'</span>':'';
    status.dataset.valid='false';
    return;
  }
  status.innerHTML='<span style="color:var(--d-tx3)">⏳ جارٍ التحقق...</span>';
  clearTimeout(_checkEditUsernameTimer);
  _checkEditUsernameTimer=setTimeout(async function(){
    try{
      var sess=getSess();
      var q='?username=eq.'+encodeURIComponent(val)+'&select=id';
      if(sess&&sess.id) q+='&id=neq.'+sess.id;
      var rows=await sb('users','GET',null,q);
      if(rows&&rows.length){
        status.innerHTML='<span style="color:#ef4444">❌ مستخدم مسبقاً</span>';
        status.dataset.valid='false';
      } else {
        status.innerHTML='<span style="color:#22c55e">✅ متاح</span>';
        status.dataset.valid='true';
      }
    }catch(e){ status.innerHTML=''; }
  }, 600);
}
/* Username validation: lowercase letters (a-z) and dots only, no consecutive dots, no start/end dots */
var USERNAME_REGEX = /^[a-z]+(\.[a-z]+)*$/;
function validateUsernameFormat(val){
  if(!val) return {ok:false, msg:''};
  if(val.length < 5) return {ok:false, msg:'⚠️ اسم المستخدم 5 أحرف على الأقل'};
  if(!USERNAME_REGEX.test(val)) return {ok:false, msg:'⚠️ اسم المستخدم يجب أن يحتوي على أحرف إنجليزية فقط ويمكن استخدام نقطة بين الكلمات.'};
  return {ok:true, msg:''};
}

function checkUsernameAvail(val){
  var status=el('reg-username-status');
  if(!status) return;
  val = (val||'').toLowerCase();
  if(!val){ status.innerHTML=''; status.dataset.valid=''; return; }
  // Format check first (instant, no server)
  var fmt = validateUsernameFormat(val);
  if(!fmt.ok){
    status.innerHTML = fmt.msg ? '<span style="color:#ef4444">'+fmt.msg+'</span>' : '';
    status.dataset.valid = 'false';
    return;
  }
  status.innerHTML='<span style="color:var(--d-tx3)">⏳ جارٍ التحقق...</span>';
  clearTimeout(_checkUsernameTimer);
  _checkUsernameTimer=setTimeout(async function(){
    try{
      var rows=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(val)+'&select=id');
      if(rows&&rows.length){
        status.innerHTML='<span style="color:#ef4444">❌ اسم المستخدم مستخدم مسبقاً</span>';
        status.dataset.valid='false';
      } else {
        status.innerHTML='<span style="color:#22c55e">✅ اسم المستخدم متاح</span>';
        status.dataset.valid='true';
      }
    }catch(e){ status.innerHTML=''; }
  }, 600);
}

/* ── Full register wizard submit ─────────────────────────── */
async function doRegisterWizard(){
  var err3=el('r-err-3'); if(err3) err3.textContent='';
  if(!_regStage){ if(err3) err3.textContent='⚠️ اختر المرحلة الدراسية'; return; }
  if(!_regGrade){ if(err3) err3.textContent='⚠️ اختر الصف'; return; }
  var dn=el('r-display-name').value.trim();
  var un=el('r-username').value.trim().toLowerCase();
  var pw=el('r-pass').value;
  var age=el('r-age')?parseInt(el('r-age').value)||null:null;
  var btn=el('reg-finish-btn');
  if(btn){btn.textContent='⏳ جارٍ الإنشاء...'; btn.disabled=true;}
  try{
    var existing=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(un)+'&select=id');
    if(existing&&existing.length){
      if(err3) err3.textContent='⚠️ اسم المستخدم مستخدم مسبقاً';
      if(btn){btn.textContent='إنشاء الحساب والبدء 🚀'; btn.disabled=false;} return;
    }
    var now=new Date().toISOString();
    // Save only columns that exist in the users table
    var payload={
      username: un, password: pw, display_name: dn,
      stage: _regStage, grade: _regGrade, branch: null,
      joined_at: now, last_login: now
    };
    // Store gender/age locally only (not in DB unless columns exist)
    if(_regGender) localStorage.setItem('dz_gender', _regGender);
    if(age) localStorage.setItem('dz_age', age);
    var rows=await sb('users','POST',payload);
    if(!rows||!rows.length){ if(err3) err3.textContent='⚠️ فشل الإنشاء'; if(btn){btn.textContent='إنشاء الحساب والبدء 🚀'; btn.disabled=false;} return; }
    var u=rows[0];
    // Upload photo if selected
    var photoUrl=null;
    if(_regPhotoFile){
      try{
        var ext=_regPhotoFile.name.split('.').pop()||'jpg';
        var path='photos/'+u.id+'.'+ext;
        await fetch(SB_URL+'/storage/v1/object/files/'+path,{method:'POST',headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'x-upsert':'true'},body:_regPhotoFile});
        photoUrl=SB_URL+'/storage/v1/object/public/files/'+path;
        await sb('users','PATCH',{photo_url:photoUrl},'?id=eq.'+u.id);
      }catch(e){ console.warn('Photo upload:',e); }
    }
    setSess({id:u.id,name:dn,stage:_regStage,grade:_regGrade,branch:null,joined:Date.now(),photo_url:photoUrl});
    isGuest=false; curStage=_regStage; curGrade=_regGrade; curBranch=null;
    updatePills(dn); showBottomNav(true);
    toast('🎉 أهلاً '+dn+'! حسابك جاهز','ok');
    setTimeout(function(){ goHome(); }, 200);
  }catch(e){
    console.error('doRegisterWizard:',e);
    if(err3) err3.textContent='⚠️ خطأ: '+e.message;
    if(btn){btn.textContent='إنشاء الحساب والبدء 🚀'; btn.disabled=false;}
  }
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
      setSess({id:u.id,name:u.display_name,stage:chosenStage,grade:u.grade||null,branch:u.branch||null,joined:new Date(u.joined_at).getTime(),balance:u.balance||0});
      curGrade=u.grade||null;
      isGuest=false; curStage=chosenStage; curBranch=u.branch||null;
      /* حفظ المرحلة في قاعدة البيانات إن كانت مختارة من الـ picker */
      if(chosenStage&&!u.stage){try{await sb('users','PATCH',{stage:chosenStage},'?id=eq.'+u.id);}catch(e){}}
      window._pendingStage=null;
      updatePills(u.display_name); showBottomNav(true);
      try{ fetchAndCacheBalance().then(updateBalanceUI); }catch(e){}
      toast('👋 أهلاً '+u.display_name,'ok');
      setTimeout(function(){ goHome(); }, 120);
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
      setTimeout(function(){ goHome(); }, 120);
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
  closeSidebar();
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
        showBottomNav(false);
        var ln=el('l-name'),lp=el('l-pass');
        if(ln)ln.value='';if(lp)lp.value='';if(el('l-err'))el('l-err').textContent='';
        toast('👋 تم تسجيل الخروج','info');
        goPage('pg-auth');
        setTimeout(function(){ showAuthScreen('welcome'); }, 50);
      }
    });
  },100);
}

/* ── SMART HOME NAVIGATION ───────────────────── */
/* الانتقال لصفحة المواد مباشرة إذا كانت المرحلة والصف محفوظين */
function goHome(){
  setNavActive('home');
  var sess=getSess();
  if(!sess||!sess.id){
    goPage('pg-auth'); return;
  }
  if(!curStage){
    openStagePicker('first'); return;
  }
  if(curGrade){
    var gradeObj=ALL_GRADES.find(function(g){return g.id===curGrade;});
    if(gradeObj && gradeObj.stage===curStage){
      openGradeSubjectsGrid(curGrade); return;
    } else {
      curGrade=null;
    }
  }
  // المرحلة موجودة لكن الصف لم يختر بعد
  buildGradePage(); goPage('pg-grade');
}

/* ── BOTTOM NAV ──────────────────────────────── */
function bottomNav(k){
  setNavActive(k);
  if(k==='home'){ goHome(); }
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

  // تحديث Hero مع زر تغيير المرحلة
  var hi = el('grade-hero-ic');
  var hh = el('grade-hero-h1');
  var hp = el('grade-hero-p');
  if(hi) hi.textContent = sm.icon;
  if(hh) hh.textContent = sm.name;
  if(hp) hp.textContent = 'اختر صفك الدراسي';

  // بناء كروت الصفوف — تصميم كبير واضح
  var stageMeta={
    primary:   {grad:'linear-gradient(135deg,#22c55e,#16a34a)', glow:'rgba(34,197,94,.22)'},
    middle:    {grad:'linear-gradient(135deg,#3b82f6,#4f46e5)', glow:'rgba(59,130,246,.22)'},
    secondary: {grad:'linear-gradient(135deg,#f97316,#ea580c)', glow:'rgba(249,115,22,.22)'},
    vocational:{grad:'linear-gradient(135deg,#8b5cf6,#6d28d9)', glow:'rgba(139,92,246,.22)'}
  };
  var sm2 = stageMeta[curStage] || {grad:'linear-gradient(135deg,#3b82f6,#4f46e5)',glow:'rgba(59,130,246,.22)'};

  var grades = ALL_GRADES.filter(function(g){ return g.stage === curStage; });
  var grid = el('grades-grid');
  if(!grid) return;

  var html = '';
  grades.forEach(function(g, i){
    html += '<div class="grade-big-card" onclick="openGrade(\''+g.id+'\')" style="animation-delay:'+(i*0.055)+'s">'
          + '<div class="gbc-icon" style="background:'+g.bg+'">'+g.icon+'</div>'
          + '<div class="gbc-body">'
          + '<div class="gbc-name">'+g.name+'</div>'
          + '<div class="gbc-sub">'+g.sub+'</div>'
          + '</div>'
          + '<div class="gbc-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg></div>'
          + '</div>';
  });
  grid.innerHTML = html;
}

async function openGrade(gid){
  var g=ALL_GRADES.find(function(x){return x.id===gid;});if(!g)return;
  curGrade=gid;

  // Save grade to DB
  var sess=getSess();
  if(sess){
    sess.grade=gid; sess.stage=curStage; setSess(sess);
    if(sess.id){
      try{ await sb('users','PATCH',{grade:gid,stage:curStage},'?id=eq.'+sess.id); }catch(e){}
    }
  }
  syncSettingsUI && syncSettingsUI();
  toast('✅ '+g.name+' — جاهز','ok');

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
  // اذهب مباشرة لصفحة المواد الدراسية (pg-subjects)
  openGradeSubjectsGrid(gid);
  setNavActive('home');
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

async function loadBooklets(subj,head,bodyId){
  bodyId = bodyId || 'class-body';
  try{
    /*
     * فلترة الملازم:
     * - stage يجب أن يطابق curStage دائماً
     * - grade: إما يطابق curGrade أو يكون null (يظهر للجميع)
     * الاستعلام يجلب بشكل منفصل ثم يدمج:
     *   1) ملازم مرتبطة بالصف المحدد
     *   2) ملازم بدون صف محدد (للمرحلة كاملة)
     */
    var rows = [];
    if(curStage && curGrade){
      // جلب الملازم المخصصة للصف المحدد
      var q1 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade=eq.'+curGrade
              +'&subject_id=eq.'+subj.id
              +'&order=created_at.asc';
      var specific = (await sb('booklets','GET',null,q1)) || [];

      // جلب الملازم العامة للمرحلة (بدون صف محدد)
      var q2 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade=is.null'
              +'&subject_id=eq.'+subj.id
              +'&order=created_at.asc';
      var general = (await sb('booklets','GET',null,q2)) || [];

      // دمج وإزالة التكرار
      var seen = {};
      rows = specific.concat(general).filter(function(b){
        if(seen[b.id]) return false;
        seen[b.id] = true;
        return true;
      });
    } else if(curStage){
      // لا يوجد صف محدد — اعرض ملازم المرحلة فقط (grade=null)
      var q = '?is_visible=eq.true&stage=eq.'+curStage
             +'&grade=is.null'
             +'&subject_id=eq.'+subj.id
             +'&order=created_at.asc';
      rows = (await sb('booklets','GET',null,q)) || [];
    } else {
      rows = [];
    }
    if(!rows.length){
      el(bodyId).innerHTML=head+'<div class="state-box"><div class="state-ic">📚</div><h3>لا توجد ملازم بعد</h3><p>ترقب المحتوى قريباً</p></div>';
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
          +(b.file_url?'<button class="btn-view" onclick="openFile(\''+b.file_url+'\',b.name,b.subject_name,b.id)">👁 عرض</button>':'<button class="btn-view" disabled style="opacity:.45">غير متاح</button>')
          +(b.file_url?'<a class="btn-dl" href="'+b.file_url+'" download target="_blank">⬇ تحميل</a>':'<button class="btn-dl" disabled style="opacity:.45">⬇ تحميل</button>')
          +'</div>'
          +'<button class="bk-fav'+(isFav?' saved':'')+'" id="favbtn-'+fid+'" onclick="toggleFav(\''+fid+'\',\''+safe+'\',\''+subj.label+'\',\'ملزمة\',\''+(b.color||subj.cover)+'\',\''+(b.emoji||'📝')+'\')">'
          +'<svg viewBox="0 0 24 24" fill="'+(isFav?'#f43f5e':'none')+'" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
          +(isFav?'محفوظة':'حفظ')+'</button>'
          +'</div></div>';
    });
    el(bodyId).innerHTML=head+html+'</div>';
  }catch(e){
    el(bodyId).innerHTML=head+'<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
}

async function loadExams(subj,head,bodyId){
  bodyId = bodyId || 'class-body';
  try{
    /*
     * فلترة الاختبارات:
     * - stage يجب أن يطابق curStage
     * - grade: إما يطابق curGrade أو null (يظهر للجميع)
     */
    var rows = [];
    if(curStage && curGrade){
      // اختبارات مخصصة للصف
      var q1 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade=eq.'+curGrade
              +'&subject_id=eq.'+subj.id
              +'&order=created_at.asc';
      var specific = (await sb('exams','GET',null,q1)) || [];

      // اختبارات عامة للمرحلة
      var q2 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade=is.null'
              +'&subject_id=eq.'+subj.id
              +'&order=created_at.asc';
      var general = (await sb('exams','GET',null,q2)) || [];

      var seen = {};
      rows = specific.concat(general).filter(function(ex){
        if(seen[ex.id]) return false;
        seen[ex.id] = true;
        return true;
      });
    } else if(curStage){
      var q = '?is_visible=eq.true&stage=eq.'+curStage
             +'&grade=is.null'
             +'&subject_id=eq.'+subj.id
             +'&order=created_at.asc';
      rows = (await sb('exams','GET',null,q)) || [];
    } else {
      rows = [];
    }
    if(!rows.length){
      el(bodyId).innerHTML=head+'<div class="state-box"><div class="state-ic">📝</div><h3>لا توجد اختبارات بعد</h3><p>ترقب المحتوى قريباً</p></div>';
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
    el(bodyId).innerHTML=head+html;
  }catch(e){
    el(bodyId).innerHTML=head+'<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ</h3><p>'+e.message+'</p></div>';
  }
}

function openFile(url, itemName, subjectName, itemId){
  window.open(url,'_blank');
  if(itemName) logActivity('booklet',{item_id:itemId||url,item_name:itemName,subject_name:subjectName||''});
}

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
  // Log exam activity
  var _examName = Q.data && Q.data.name ? Q.data.name : 'اختبار';
  logActivity('exam',{item_id:'exam_'+Date.now(),item_name:_examName,subject_name:'',score:Math.round((correct/(qs.length||1))*100)});
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

function renderCurriculum(subj,bodyId){
  bodyId = bodyId || 'class-body';
  var spinner='<div class="loading-spin"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ تحميل المنهج...</span></div>';
  setTimeout(function(){loadCurriculumFromDB(subj,bodyId);},0);
  return '<div class="sec-lbl">📖 المنهج — '+subj.label+'</div>'+spinner;
}

async function loadCurriculumFromDB(subj,bodyId){
  bodyId = bodyId || 'class-body';
  var body=el(bodyId);if(!body)return;
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
/* ══ openProfilePage — opens profile with DB refresh ══ */
async function openProfilePage(){
  var sess=getSess();
  if(!sess||!sess.id){ goPage('pg-auth'); return; }
  buildProfile();       // show local data immediately
  goPage('pg-profile'); // navigate now

  // Fetch fresh data from DB
  try{
    var rows=await sb('users','GET',null,'?id=eq.'+sess.id+'&select=id,display_name,username,photo_url,joined_at');
    if(rows&&rows[0]){
      var u=rows[0];
      // Sync photo to session
      if(u.photo_url) sess.photo_url=u.photo_url;
      if(u.display_name){ sess.name=u.display_name; setSess(sess); }
      // Update avatar
      var av=el('p-avatar');
      if(av){
        if(u.photo_url){
          av.innerHTML='<img src="'+u.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.parentNode.textContent=\''+((u.display_name||'؟').charAt(0).toUpperCase())+'\'">';
        } else {
          av.textContent=(u.display_name||sess.name||'؟').charAt(0).toUpperCase();
        }
      }
      var pn=el('p-name'); if(pn) pn.textContent=u.display_name||sess.name;
      var en=el('edit-name'); if(en) en.value=u.display_name||sess.name;
    }
  }catch(e){ console.warn('openProfilePage DB error:',e.message); }
}

/* Upload profile photo */
async function uploadProfilePhoto(input){
  var file = input.files[0];
  if(!file) return;
  var sess = getSess(); if(!sess||!sess.id) return;
  var statusEl = el('p-photo-status');
  if(statusEl) statusEl.textContent = '⏳ جارٍ الرفع...';
  try{
    var ext = file.name.split('.').pop() || 'jpg';
    var path = 'photos/'+sess.id+'.'+ext;
    // Upload to Supabase storage
    var fd = new FormData(); fd.append('file', file);
    var res = await fetch(SB_URL+'/storage/v1/object/files/'+path,{
      method:'POST',
      headers:{ 'apikey': SB_KEY, 'Authorization':'Bearer '+SB_KEY, 'x-upsert':'true' },
      body: file
    });
    if(!res.ok){ var err=await res.json(); throw new Error(err.message||'فشل الرفع'); }
    var photoUrl = SB_URL+'/storage/v1/object/public/files/'+path;
    // Save to DB
    await sb('users','PATCH',{photo_url:photoUrl},'?id=eq.'+sess.id);
    // Update session + UI
    sess.photo_url = photoUrl; setSess(sess);
    var av = el('p-avatar');
    if(av) av.innerHTML='<img src="'+photoUrl+'?t='+Date.now()+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
    if(statusEl) statusEl.textContent = '✅ تم تحديث الصورة';
    setTimeout(function(){ if(statusEl) statusEl.textContent=''; },3000);
    toast('✅ تم تحديث الصورة','ok');
  }catch(e){
    if(statusEl) statusEl.textContent = '❌ '+e.message;
    toast('❌ فشل الرفع: '+e.message,'err');
    console.error('uploadProfilePhoto:',e);
  }
  input.value = '';
}

function buildProfile(){
  var s=getSess();if(!s){goPage('pg-auth');return;}
  // Avatar
  var av=el('p-avatar');
  if(av){
    if(s.photo_url){
      av.innerHTML='<img src="'+s.photo_url+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%" onerror="this.style.display=\'none\'">';
    } else {
      av.textContent=(s.name||'؟').charAt(0).toUpperCase();
    }
  }
  var pn=el('p-name');if(pn)pn.textContent=s.name||'—';
  var en=el('edit-name');if(en)en.value=s.name||'';
  var eu=el('edit-username');if(eu)eu.value=s.username||'';
  var chip=el('p-chip');
  if(chip){
    var stageLabel=(curStage&&STAGES_META[curStage])?STAGES_META[curStage].name:'';
    var gradeObj=curGrade?ALL_GRADES.find(function(g){return g.id===curGrade;}):null;
    chip.textContent=(stageLabel&&gradeObj)?(stageLabel+' — '+gradeObj.name):(stageLabel||'لم تختر مرحلة');
  }
  // Stage/grade info in profile
  var psiStage=el('psi-stage'), psiGrade=el('psi-grade');
  if(psiStage) psiStage.textContent=(curStage&&STAGES_META[curStage])?STAGES_META[curStage].name:'—';
  if(psiGrade){
    var go=curGrade?ALL_GRADES.find(function(g){return g.id===curGrade;}):null;
    psiGrade.textContent=go?go.name:'—';
  }
  var sd=el('st-days');if(sd&&s.joined)sd.textContent=Math.max(1,Math.floor((Date.now()-s.joined)/864e5));
  var sf=el('st-favs');if(sf)sf.textContent=getFavs().length;
  ['old-pass','new-pass'].forEach(function(id){var e=el(id);if(e)e.value='';});
  var pe=el('pass-err');if(pe)pe.textContent='';
}

async function saveName(){
  return saveProfileInfo();
}

async function saveProfileInfo(){
  var newN=(el('edit-name')?el('edit-name').value.trim():'');
  var newU=(el('edit-username')?el('edit-username').value.trim().toLowerCase():'');
  var s=getSess();if(!s)return;
  if(!newN||newN.length<2){toast('⚠️ الاسم قصير','warn');return;}
  if(newU && newU.length>0){
    var unFmt2=validateUsernameFormat(newU);
    if(!unFmt2.ok){ toast(unFmt2.msg||'⚠️ اسم المستخدم غير صالح','warn'); return; }
  }
  // Check username uniqueness
  if(newU && newU!==s.username){
    try{
      var ex=await sb('users','GET',null,'?username=eq.'+encodeURIComponent(newU)+'&id=neq.'+s.id+'&select=id');
      if(ex&&ex.length){toast('⚠️ اسم المستخدم مستخدم مسبقاً','err');return;}
    }catch(e){}
  }
  var patch={display_name:newN};
  if(newU) patch.username=newU;
  try{
    await sb('users','PATCH',patch,'?id=eq.'+s.id);
    s.name=newN;if(newU)s.username=newU;setSess(s);
    buildProfile();updatePills(newN);updateGtbarAvatar();
    toast('✅ تم حفظ المعلومات','ok');
  }catch(e){toast('❌ '+e.message,'err');}
}

/* Profile Stage/Grade edit */
var _profStage=null, _profGrade=null;
function openProfileStageEdit(){
  _profStage=curStage; _profGrade=curGrade;
  buildProfStageList();
  openModal('ov-profile-stage');
}
function buildProfStageList(){
  var stages=[
    {id:'primary', name:'الابتدائية', icon:'🌱', accent:'#22c55e', bg:'rgba(34,197,94,.10)'},
    {id:'middle',  name:'المتوسطة',   icon:'📘', accent:'#3b82f6', bg:'rgba(59,130,246,.10)'},
    {id:'secondary',name:'الإعدادية', icon:'🔬', accent:'#f97316', bg:'rgba(249,115,22,.10)'},
    {id:'vocational',name:'المهني',   icon:'⚙️', accent:'#8b5cf6', bg:'rgba(139,92,246,.10)'}
  ];
  var container=el('prof-stage-list'); if(!container) return;
  var html='';
  stages.forEach(function(s){
    var isSel=(s.id===_profStage);
    html+='<div class="reg-stage-opt'+(isSel?' selected':'')+'" id="prof-stage-opt-'+s.id+'" onclick="selectProfStage(\''+s.id+'\')">'        +'<div class="reg-stage-ic" style="background:'+s.bg+';color:'+s.accent+'">'+s.icon+'</div>'        +'<span>'+s.name+'</span>'        +'</div>';
  });
  container.innerHTML=html;
  if(_profStage) buildProfGradeList(_profStage);
}
function selectProfStage(stageId){
  _profStage=stageId; _profGrade=null;
  document.querySelectorAll('#prof-stage-list .reg-stage-opt').forEach(function(o){ o.classList.remove('selected'); });
  var opt=el('prof-stage-opt-'+stageId); if(opt) opt.classList.add('selected');
  buildProfGradeList(stageId);
  updateProfSaveBtn();
}
function buildProfGradeList(stageId){
  var gs=el('prof-grade-section'), gl=el('prof-grade-list');
  if(!gs||!gl) return;
  var grades=ALL_GRADES.filter(function(g){return g.stage===stageId;});
  var html='';
  grades.forEach(function(g){
    var isSel=(g.id===_profGrade);
    html+='<div class="reg-grade-opt'+(isSel?' selected':'')+'" id="prof-grade-opt-'+g.id+'" onclick="selectProfGrade(\''+g.id+'\')">'+g.name+'</div>';
  });
  gl.innerHTML=html;
  gs.classList.remove('hidden');
}
function selectProfGrade(gradeId){
  _profGrade=gradeId;
  document.querySelectorAll('#prof-grade-list .reg-grade-opt').forEach(function(o){ o.classList.remove('selected'); });
  var opt=el('prof-grade-opt-'+gradeId); if(opt) opt.classList.add('selected');
  updateProfSaveBtn();
}
function updateProfSaveBtn(){
  var btn=el('prof-stage-save-btn');
  if(!btn) return;
  var ok=_profStage&&_profGrade;
  btn.disabled=!ok; btn.style.opacity=ok?'1':'0.5'; btn.style.cursor=ok?'pointer':'not-allowed';
}
async function saveProfileStage(){
  if(!_profStage||!_profGrade){toast('⚠️ اختر المرحلة والصف','warn');return;}
  var s=getSess();if(!s)return;
  try{
    await sb('users','PATCH',{stage:_profStage,grade:_profGrade},'?id=eq.'+s.id);
    s.stage=_profStage; s.grade=_profGrade; setSess(s);
    curStage=_profStage; curGrade=_profGrade; curBranch=null;
    closeModal('ov-profile-stage');
    buildProfile();
    toast('✅ تم تحديث المرحلة والصف','ok');
    // Reload grade page with new stage/grade
    setTimeout(function(){
      buildGradePage();
      openGradeSubjectsGrid(curGrade);
      setNavActive('home');
    }, 500);
  }catch(e){ toast('❌ '+e.message,'err'); }
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
  try{
    var c=el('authBg');if(!c)return;
    for(var i=0;i<20;i++){
      var d=document.createElement('div');d.className='abg-p';
      var s=Math.random()*16+5;
      d.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*13+8)+'s;animation-delay:'+(Math.random()*10)+'s;';
      c.appendChild(d);
    }
  }catch(e){}
}

/* ── BOOT ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',function(){
  try{ buildParticles(); }catch(e){}
  try{ buildSearchIndex(); }catch(e){};

  try{ loadSavedTheme(); }catch(e){}
  // Handle Google OAuth callback
  try{ handleOAuthCallback().then(function(sess){
    if(sess){
      isGuest=false; curStage=sess.stage||null; curBranch=sess.branch||null;
      curGrade=sess.grade||null;
      updatePills(sess.name); showBottomNav(true);
      setTimeout(function(){ goHome(); }, 120);
    }
  }).catch(function(){}); }catch(e){}

  var s=getSess();
  if(s&&s.name){
    isGuest=false;
    curStage=s.stage||null;curBranch=s.branch||null;
    curGrade=s.grade||null;
    updatePills(s.name);showBottomNav(true);
    // تحديث الرصيد في الخلفية
    try{ fetchAndCacheBalance().then(updateBalanceUI); }catch(e){}
    // انتقل مباشرة للمواد إذا كانت المرحلة والصف محفوظين
    setTimeout(function(){ goHome(); }, 80);
  }else{
    showBottomNav(false);goPage('pg-auth');
    setTimeout(function(){ showAuthScreen('welcome'); }, 50);
  }

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;
    var lc=el('auth-login-card');
    if(lc&&!lc.classList.contains('hidden')){ doLogin(); return; }
    var rc=el('auth-register-card');
    if(rc&&!rc.classList.contains('hidden')){
      if(_regStep===1) regWizardNext(1);
      else if(_regStep===2) regWizardNext(2);
    }
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
  // Save grade to session and DB
  var _s=getSess();
  if(_s){
    _s.grade=gid; setSess(_s);
    if(_s.id&&!isGuest){
      try{ sb('users','PATCH',{grade:gid},'?id=eq.'+_s.id); }catch(e){}
    }
  }

  var subjs = GRADE_SUBJECTS[gid] || GRADE_SUBJECTS['m1'];

  // عنوان الصفحة
  var tt = el('subjects-tbar-title');
  var ts = el('subjects-tbar-sub');
  if(tt) tt.textContent = g.name;
  if(ts) ts.textContent = 'المواد الدراسية';

  // زر الرجوع مخفي — لا يمكن الرجوع لاختيار الصف من هنا
  var bb = el('subjects-back-btn');
  if(bb) { bb.style.display='none'; }

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

  if(curSDetTab==='exams')         loadExams(subj, head, 'sdet-body');
  else if(curSDetTab==='booklets')  loadBooklets(subj, head, 'sdet-body');
  else if(curSDetTab==='subj-teachers') loadSubjTeachers(subj, head);
  else { body.innerHTML = head + renderCurriculum(subj, 'sdet-body'); }
}

/* ── SUBJECT TEACHERS TAB ─────────────────────── */
async function loadSubjTeachers(subj, head){
  var body = el('sdet-body');
  if(!body) return;
  var spinner = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5a7bf5" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';
  body.innerHTML = head + spinner;
  try{
    // Load teachers: صف محدد + مدرسون عامون للمرحلة
    var allTeachers = [];
    if(curStage && curGrade){
      var tq1 = '?is_visible=eq.true&stage=eq.'+curStage+'&grade_id=eq.'+curGrade+'&order=sort_order.asc,created_at.asc';
      var tq2 = '?is_visible=eq.true&stage=eq.'+curStage+'&grade_id=is.null&order=sort_order.asc,created_at.asc';
      var tSpec = (await sb('teachers','GET',null,tq1)) || [];
      var tGen  = (await sb('teachers','GET',null,tq2)) || [];
      var tSeen = {};
      allTeachers = tSpec.concat(tGen).filter(function(t){
        if(tSeen[t.id]) return false; tSeen[t.id]=true; return true;
      });
    } else if(curStage){
      var tq = '?is_visible=eq.true&stage=eq.'+curStage+'&grade_id=is.null&order=sort_order.asc,created_at.asc';
      allTeachers = (await sb('teachers','GET',null,tq)) || [];
    }
    // Match subject name
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

    // جلب اشتراكات المستخدم الحالي (إن وُجد) لعرض "مشترك"
    var mySubIds = {};
    var sess0 = getSess();
    if(sess0 && sess0.id && !isGuest && teacherIds.length){
      try{
        var subR = (await sb('teacher_subscriptions','GET',null,
          '?user_id=eq.'+sess0.id+'&teacher_id=in.('+teacherIds.join(',')+')'+'&select=teacher_id')) || [];
        subR.forEach(function(r){ mySubIds[r.teacher_id] = true; });
      }catch(e){}
    }

    var html = head + '<div class="teachers-subj-grid">';
    teachers.forEach(function(t, i){
      var avatarHtml = t.photo_url
        ? '<img src="'+t.photo_url+'" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">'
        : '<div style="display:flex;align-items:center;justify-content:center;font-size:2rem;width:100%;height:100%">👨‍🏫</div>';
      var lecCount = lecCountByTeacher[t.id] || 0;
      var isPaid = t.price && t.price > 0;
      var isSubbed = !!mySubIds[t.id];
      var priceTag = isSubbed
        ? '<div class="tc-price-tag tc-price-subbed">✅ مشترك</div>'
        : isPaid
          ? '<div class="tc-price-tag tc-price-paid">💰 سعر الدورة: '+t.price.toLocaleString('ar-IQ')+' د.ع</div>'
          : '<div class="tc-price-tag tc-price-free">✅ دورة مجانية</div>';
      html += '<div class="teacher-card" style="animation-delay:'+(i*0.06)+'s" data-tid="'+t.id+'" data-tname="'+t.name.replace(/"/g,'&quot;')+'" data-tphoto="'+(t.photo_url||'')+'" data-tsubj="'+(t.subject_name||'')+'" data-tgrade="'+(t.grade_label||'')+'" data-tprice="'+(t.price||0)+'">';
      html += '<div class="teacher-avatar">'+avatarHtml+'</div>';
      html += '<div class="teacher-name">'+t.name+'</div>';
      html += '<div class="teacher-meta">'+(t.subject_name||'')+'</div>';
      html += priceTag;
      html += '<div class="teacher-lec-cnt">📹 '+lecCount+' محاضرة</div>';
      html += '</div>';
    });
    html += '</div>';
    body.innerHTML = html;

    // Attach click handlers
    body.querySelectorAll('.teacher-card').forEach(function(card){
      card.onclick = function(){
        openTeacher(card.dataset.tid, card.dataset.tname, card.dataset.tphoto, card.dataset.tsubj, card.dataset.tgrade, parseInt(card.dataset.tprice||0));
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
  // بعد تغيير المرحلة يجب اختيار صف جديد
  setTimeout(function(){
    curGrade = null;
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
  if(k==='settings'){ openSidebar(); return; }
  if(k==='profile'){ openProfilePage(); return; }
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
    /*
     * فلترة المدرسين:
     * - grade_id = curGrade → مدرسون مخصصون لهذا الصف
     * - grade_id = null     → مدرسون لكل صفوف المرحلة
     * كلاهما يجب أن يطابق stage
     */
    var rows = [];
    if(curStage && curGrade){
      // مدرسون مخصصون للصف
      var q1 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade_id=eq.'+curGrade
              +'&order=sort_order.asc,created_at.asc';
      var specific = (await sb('teachers','GET',null,q1)) || [];

      // مدرسون عامون للمرحلة (grade_id = null)
      var q2 = '?is_visible=eq.true&stage=eq.'+curStage
              +'&grade_id=is.null'
              +'&order=sort_order.asc,created_at.asc';
      var general = (await sb('teachers','GET',null,q2)) || [];

      var seen = {};
      rows = specific.concat(general).filter(function(t){
        if(seen[t.id]) return false;
        seen[t.id] = true;
        return true;
      });
    } else if(curStage){
      // لا يوجد صف محدد — مدرسو المرحلة العامون فقط
      var q = '?is_visible=eq.true&stage=eq.'+curStage
             +'&grade_id=is.null'
             +'&order=sort_order.asc,created_at.asc';
      rows = (await sb('teachers','GET',null,q)) || [];
    } else {
      rows = [];
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
      var isPaid = t.price && t.price > 0;
      html += '<div class="teacher-card" style="animation-delay:'+(i*0.06)+'s" data-tprice="'+(t.price||0)+'">';
      html += '<div class="teacher-avatar">'+avatarHtml+'</div>';
      html += '<div class="teacher-name">'+t.name+'</div>';
      html += '<div class="teacher-meta">'+t.subject_name+(t.grade_label?' — '+t.grade_label:'')+'</div>';
      html += isPaid
        ? '<div class="tc-price-tag tc-price-paid">💰 سعر الدورة: '+t.price.toLocaleString('ar-IQ')+' د.ع</div>'
        : '<div class="tc-price-tag tc-price-free">✅ دورة مجانية</div>';
      html += '</div>';
    });
    grid.innerHTML = html;
    var cards = grid.querySelectorAll('.teacher-card');
    rows.forEach(function(t, i){
      if(cards[i]) cards[i].onclick = function(){
        openTeacher(t.id, t.name, t.photo_url||'', t.subject_name, t.grade_label||'', parseInt(t.price||0));
      };
    });
  }catch(e){
    grid.innerHTML = '<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+e.message+'</p></div>';
  }
}


/* ── OPEN TEACHER PAGE ──────────────────────── */
async function openTeacher(tid, tname, tphoto, tsubj, tgrade, tprice){
  _curTeacherId    = tid;
  _curTeacherPrice = parseInt(tprice)||0;

  // Update topbar
  var tt = el('tc-tbar-title');
  if(tt) tt.textContent = tname;

  // Navigate first
  goPage('pg-teacher-chapters');

  // Build hero
  var hero = el('teacher-hero');
  if(hero){
    var avatarHtml = tphoto
      ? '<img src="'+tphoto+'" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.22)" onerror="this.style.display=\'none\'">'
      : '<div style="width:54px;height:54px;border-radius:50%;background:var(--d-grad);display:flex;align-items:center;justify-content:center;font-size:1.8rem">👨‍🏫</div>';

    // شارة السعر تحت الاسم
    var priceBadge = (_curTeacherPrice > 0)
      ? '<div class="th-price-badge th-price-paid">💰 سعر الدورة: ' + _curTeacherPrice.toLocaleString('ar-IQ') + ' د.ع</div>'
      : '<div class="th-price-badge th-price-free">✅ دورة مجانية</div>';

    hero.innerHTML =
      '<div class="teacher-hero-info">'
      + avatarHtml
      + '<div class="th-info">'
      + '<div class="th-name">'+tname+'</div>'
      + '<div class="th-subj">'+tsubj+(tgrade?' — '+tgrade:'')+'</div>'
      + priceBadge
      + '</div>'
      + '</div>';
  }

  // Check subscription & load
  await _openTeacherWithSubCheck(tid, _curTeacherPrice);
}

/* ─────────────────────────────────────────────
   فحص الاشتراك ثم تحميل الفصول
───────────────────────────────────────────── */
async function _openTeacherWithSubCheck(tid, price){
  var grid = el('tc-grid');
  if(!grid) return;
  grid.innerHTML = '<div class="loading-spin"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg><span>جارٍ التحميل...</span></div>';

  var sess    = getSess();
  var isFree  = (!price || price <= 0);

  // ── مجاني → عرض مباشر ──
  if(isFree){
    _showTeacherStartBtn(tid, price, true);
    loadTeacherChapters(tid);
    return;
  }

  // ── مدفوع: تحقق من تسجيل الدخول ──
  if(!sess || !sess.id || isGuest){
    _showTeacherGate(tid, price, false, 0);
    grid.innerHTML = '<div class="state-box"><div class="state-ic">🔒</div><h3 style="color:var(--d-tx1)">يجب تسجيل الدخول</h3><p style="color:var(--d-tx3)">سجّل دخولك للاشتراك في هذا المدرس</p></div>';
    return;
  }

  // ── تحقق من اشتراك سابق ──
  var isSubscribed = false;
  try{
    var subRows = await sb('teacher_subscriptions','GET',null,
      '?user_id=eq.'+sess.id+'&teacher_id=eq.'+tid+'&select=id');
    isSubscribed = !!(subRows && subRows.length);
  }catch(e){}

  if(isSubscribed){
    _showTeacherStartBtn(tid, price, true);
    loadTeacherChapters(tid);
    return;
  }

  // ── غير مشترك: اجلب الرصيد وعرض البوابة ──
  var balance = 0;
  try{
    var uRows = await sb('users','GET',null,'?id=eq.'+sess.id+'&select=balance');
    balance = (uRows && uRows[0] && typeof uRows[0].balance==='number') ? uRows[0].balance : 0;
    sess.balance = balance; setSess(sess); updateBalanceUI();
  }catch(e){
    /* عمود balance غير موجود — استخدم ما في الجلسة */
    balance = typeof sess.balance==='number' ? sess.balance : 0;
  }

  _showTeacherGate(tid, price, false, balance);
  grid.innerHTML =
    '<div class="state-box">'
    +'<div class="state-ic">🔒</div>'
    +'<h3 style="color:var(--d-tx1)">مدرس مدفوع</h3>'
    +'<p style="color:var(--d-tx3);margin-bottom:4px">اشترك الآن لمشاهدة جميع محاضرات هذا المدرس</p>'
    +'<div style="font-size:.92rem;font-weight:800;color:#f59e0b;margin-bottom:12px">💰 سعر الدورة: '+price.toLocaleString('ar-IQ')+' د.ع</div>'
    +'<button class="btn-main tsg-grid-btn" style="margin-top:4px;padding:12px 32px;font-size:.95rem" onclick="_doSubscribe(\''+tid+'\','+price+')">'
    +'💳 اشترك الآن — '+price.toLocaleString('ar-IQ')+' د.ع</button>'
    +'</div>';
}

/* حالة المدرس عند المشترك أو المجاني */
function _showTeacherStartBtn(tid, price, subscribed){
  var hero = el('teacher-hero');
  if(!hero) return;
  // أزل أي بوابة قديمة
  var old = hero.querySelector('.teacher-sub-gate');
  if(old) old.remove();
  var old2 = hero.querySelector('.tsg-start-wrap');
  if(old2) old2.remove();

  // إذا كان مدفوع ومشترك: أخفِ السعر وأظهر "مشترك" فقط
  if(subscribed && price > 0){
    // أخفِ شارة السعر
    var pBadge = hero.querySelector('.th-price-badge');
    if(pBadge) pBadge.style.display = 'none';
    // أضف شارة "مشترك"
    var wrap = document.createElement('div');
    wrap.className = 'tsg-start-wrap';
    wrap.innerHTML = '<div class="tsg-subscribed-badge">✅ مشترك</div>';
    // أدرجها بعد th-info مباشرة
    var thInfo = hero.querySelector('.th-info');
    if(thInfo) thInfo.appendChild(wrap);
    else hero.appendChild(wrap);
  }
}

/* بوابة الاشتراك في هيرو المدرس */
function _showTeacherGate(tid, price, subscribed, balance){
  var hero = el('teacher-hero');
  if(!hero) return;
  var old = hero.querySelector('.teacher-sub-gate');
  if(old) old.remove();

  var gate = document.createElement('div');
  gate.className = 'teacher-sub-gate';
  gate.innerHTML =
    '<div class="tsg-top">'
    +'<div class="tsg-lock">🔒</div>'
    +'<div class="tsg-texts">'
    +'<div class="tsg-title">مدرس مدفوع</div>'
    +'<div class="tsg-price">💰 سعر الدورة: '+price.toLocaleString('ar-IQ')+' د.ع</div>'
    +'</div>'
    +'</div>'
    +'<div class="tsg-balance">رصيدك الحالي: <strong>'+balance.toLocaleString('ar-IQ')+' د.ع</strong></div>'
    +'<button class="tsg-btn" onclick="_doSubscribe(\''+tid+'\','+price+')">'
    +'💳 اشترك الآن — '+price.toLocaleString('ar-IQ')+' د.ع</button>';
  hero.appendChild(gate);
}

/* ─────────────────────────────────────────────
   عملية الاشتراك الفعلية
───────────────────────────────────────────── */
async function _doSubscribe(tid, price){
  var sess = getSess();
  if(!sess || !sess.id || isGuest){
    toast('🔒 يجب تسجيل الدخول أولاً','warn'); return;
  }

  try{
    // 1. اجلب أحدث رصيد (مع التعامل مع غياب عمود balance)
    var balance = 0;
    try{
      var uRows = await sb('users','GET',null,'?id=eq.'+sess.id+'&select=balance');
      balance = (uRows && uRows[0] && typeof uRows[0].balance==='number') ? uRows[0].balance : 0;
    }catch(balErr){
      balance = typeof sess.balance==='number' ? sess.balance : 0;
    }

    // 2. تأكد من عدم الاشتراك المسبق
    var subCheck = await sb('teacher_subscriptions','GET',null,
      '?user_id=eq.'+sess.id+'&teacher_id=eq.'+tid+'&select=id');
    if(subCheck && subCheck.length){
      toast('✅ أنت مشترك بالفعل في هذا المدرس','ok');
      _openTeacherWithSubCheck(tid, price); return;
    }

    // 3. فحص الرصيد
    if(balance < price){
      var needed = price - balance;
      toast('❌ رصيدك غير كافٍ — تحتاج '+needed.toLocaleString('ar-IQ')+' د.ع إضافية','warn');
      // تحديث رسالة الرصيد في البوابة
      var balEl = document.querySelector('.tsg-balance');
      if(balEl) balEl.innerHTML = 'رصيدك الحالي: <strong style="color:#ef4444">'+balance.toLocaleString('ar-IQ')+' د.ع</strong> — <span style="color:#ef4444">غير كافٍ</span>';
      return;
    }

    // 4. خصم الرصيد
    var newBal = balance - price;
    try{
      await sb('users','PATCH',{balance: newBal},'?id=eq.'+sess.id);
    }catch(patchErr){
      if(patchErr.message && patchErr.message.toLowerCase().includes('balance')){
        toast('❌ عمود balance غير موجود — شغّل migration_balance_price.sql في Supabase','warn');
        return;
      }
      throw patchErr;
    }

    // 5. تسجيل الاشتراك
    await sb('teacher_subscriptions','POST',{
      user_id:      sess.id,
      teacher_id:   tid,
      price:        price,
      subscribed_at: new Date().toISOString()
    });

    // 6. حفظ الرصيد في الجلسة
    sess.balance = newBal; setSess(sess); updateBalanceUI();

    toast('✅ تم الاشتراك بنجاح! رصيدك المتبقي: '+newBal.toLocaleString('ar-IQ')+' د.ع','ok');

    // 7. أزل البوابة وأضف شارة "مشترك" ثم حمّل الفصول
    var gate = document.querySelector('.teacher-sub-gate');
    if(gate) gate.remove();
    var gridGate = document.querySelector('.tsg-grid-btn');
    if(gridGate && gridGate.parentElement) gridGate.parentElement.remove();
    _showTeacherStartBtn(tid, price, true);
    loadTeacherChapters(tid);

  }catch(e){
    toast('❌ خطأ: '+e.message,'warn');
  }
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

/* ═══════════════════════════════════════════════════════
   openChapterLectures — Full Featured Chapter Page
   ═══════════════════════════════════════════════════════ */
var _curChapterMeta = {tid:'', chtitle:'', chcover:'', chid:''};

async function openChapterLectures(chid, chtitle, chcover, tid){
  curChapterId = chid;
  _curChapterMeta = {tid:tid, chtitle:chtitle, chcover:chcover, chid:chid};

  // ── فحص الاشتراك قبل فتح الفصل ──
  if(tid && _curTeacherPrice > 0){
    var sess = getSess();
    if(!sess || !sess.id || isGuest){
      toast('🔒 يجب تسجيل الدخول لمشاهدة محاضرات هذا المدرس','warn');
      goPage('pg-teacher-chapters'); return;
    }
    try{
      var subRow = await sb('teacher_subscriptions','GET',null,
        '?user_id=eq.'+sess.id+'&teacher_id=eq.'+tid+'&select=id');
      if(!subRow || !subRow.length){
        toast('🔒 هذا المدرس يتطلب اشتراك — اشترك أولاً','warn');
        goPage('pg-teacher-chapters'); return;
      }
    }catch(e){ /* allow on error */ }
  }

  var tt = el('lec-tbar-title');
  var ts = el('lec-tbar-sub');
  if(tt) tt.textContent = chtitle;
  if(ts) ts.textContent = 'تفاصيل الفصل';

  var backBtn = el('lec-back-btn');
  if(backBtn) backBtn.onclick = function(){ goPage('pg-teacher-chapters'); };

  var hero = el('lec-chapter-hero');
  var list = el('lec-list');
  if(!list){ goPage('pg-lectures'); return; }

  // Skeleton loading
  if(hero) hero.innerHTML = '<div class="ch-hd-skeleton"><div class="ch-sk-cover"></div><div class="ch-sk-body"><div class="ch-sk-l"></div><div class="ch-sk-l ch-sk-l2"></div><div class="ch-sk-l ch-sk-l3"></div></div></div>';
  list.innerHTML = Array(3).fill(0).map(function(){ return '<div class="lec-sk-item"><div class="lec-sk-thumb"></div><div class="lec-sk-info"><div class="lec-sk-t"></div><div class="lec-sk-m"></div></div></div>'; }).join('');
  goPage('pg-lectures');

  try{
    var sess = getSess();

    // Parallel fetch
    var pLecs    = sb('lectures','GET',null,'?chapter_id=eq.'+chid+'&is_visible=eq.true&order=sort_order.asc,created_at.asc');
    var pTeacher = tid ? sb('teachers','GET',null,'?id=eq.'+tid+'&select=name,photo_url') : Promise.resolve([]);
    var pProg    = (sess && sess.id) ? sb('lecture_views','GET',null,'?user_id=eq.'+sess.id+'&select=lecture_id,watch_pct,last_watched') : Promise.resolve([]);

    var rows        = (await pLecs)    || [];
    var teacherRows = (await pTeacher) || [];
    var progRows    = (await pProg)    || [];

    _chapterLectures = rows;
    var teacher = teacherRows[0] || null;

    // Progress map
    var progMap = {};
    progRows.forEach(function(p){ progMap[p.lecture_id] = {pct: p.watch_pct||0, ts: p.last_watched||''}; });

    // Last watched IN this chapter
    var chIds = rows.map(function(r){return r.id;});
    var lastLid = null, lastTs = '';
    chIds.forEach(function(lid){
      if(progMap[lid] && progMap[lid].ts > lastTs){ lastTs = progMap[lid].ts; lastLid = lid; }
    });

    // Stats
    var totalLecs = rows.length;
    var doneLecs  = rows.filter(function(r){return (progMap[r.id]||{}).pct >= 80;}).length;
    var progPct   = totalLecs > 0 ? Math.round(doneLecs/totalLecs*100) : 0;

    // Total duration
    var totalSecs = 0;
    rows.forEach(function(r){
      if(!r.duration) return;
      var p = r.duration.split(':').map(Number);
      if(p.length===2) totalSecs += p[0]*60+p[1];
      else if(p.length===3) totalSecs += p[0]*3600+p[1]*60+p[2];
    });
    var totalMins = Math.round(totalSecs/60);
    var durStr = '';
    if(totalMins >= 60){ var h=Math.floor(totalMins/60),m=totalMins%60; durStr=h+' ساعة'+(m>0?' و'+m+' د':''); }
    else if(totalMins>0){ durStr=totalMins+' دقيقة'; }

    // Resume
    window._resumeLecId = lastLid || (rows[0] ? rows[0].id : null);

    // ── Build hero HTML ──
    if(hero){
      var coverStyle = chcover
        ? 'background-image:url('+chcover+');background-size:cover;background-position:center'
        : 'background:linear-gradient(135deg,#1a2942 0%,#2563eb 60%,#4f46e5 100%)';

      var teacherHtml = '';
      if(teacher){
        teacherHtml = '<div class="ch-hd-teacher">'
          + (teacher.photo_url ? '<img src="'+teacher.photo_url+'" class="ch-hd-tav"/>' : '<span class="ch-hd-tav-ph">👨‍🏫</span>')
          + '<span class="ch-hd-tname">'+teacher.name+'</span>'
          +'</div>';
      }

      var statsHtml = '<div class="ch-hd-stats">'
        +'<span class="ch-st"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'+totalLecs+' درس</span>'
        +(durStr?'<span class="ch-st-dot">•</span><span class="ch-st"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'+durStr+'</span>':'')
        +(doneLecs>0?'<span class="ch-st-dot">•</span><span class="ch-st ch-st-g"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>'+doneLecs+' مكتمل</span>':'')
        +'</div>';

      hero.innerHTML =
        '<div class="ch-hd-cover" style="'+coverStyle+'">'
        +'<div class="ch-hd-shade"></div>'
        +'<div class="ch-hd-corner-badge">'+totalLecs+' محاضرة</div>'
        +'</div>'
        +'<div class="ch-hd-prog"><div class="ch-hd-prog-bar" style="width:'+progPct+'%"></div></div>'
        +'<div class="ch-hd-body">'
        +'<h2 class="ch-hd-title">'+chtitle+'</h2>'
        +teacherHtml
        +statsHtml
        +'<button class="ch-hd-resume" onclick="_chapterResume()">'
        +'<svg viewBox="0 0 24 24" fill="white" width="15" height="15"><polygon points="5,3 19,12 5,21"/></svg>'
        +(lastLid ? 'متابعة من حيث توقفت' : 'ابدأ الآن')
        +'</button>'
        +'</div>';
    }

    // ── Lecture list ──
    if(!rows.length){
      list.innerHTML='<div class="state-box"><div class="state-ic">🎬</div><h3>لا توجد محاضرات بعد</h3><p>سيُضاف المحتوى قريباً</p></div>';
      return;
    }

    var html='<div class="ch-list-hdr"><span class="ch-list-hdr-t">📋 قائمة المحاضرات</span><span class="ch-list-cnt">'+totalLecs+' درس</span></div>';
    rows.forEach(function(lec,i){
      var p    = (progMap[lec.id]||{}).pct||0;
      var done = p>=80;
      var isLast = lec.id===lastLid;

      var thumbInner = done
        ? '<div class="lec-ck"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg></div>'
        : '';

      var thumb = lec.thumbnail_url
        ? '<div class="lec-thumb2" style="background-image:url('+lec.thumbnail_url+')">'+thumbInner+'</div>'
        : '<div class="lec-thumb2 lec-thumb2-ph">'
          +(done
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="rgba(255,255,255,.7)" width="14" height="14"><polygon points="5,3 19,12 5,21"/></svg>')
          +'</div>';

      html+='<div class="lec-row'+(done?' lec-row-done':'')+(isLast?' lec-row-cur':'')+'" data-i="'+i+'" style="animation-delay:'+(i*0.04)+'s">'
        +thumb
        +'<div class="lec-row-num">'+(done?'<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>':(i+1))+'</div>'
        +'<div class="lec-row-info">'
        +'<div class="lec-row-name">'+lec.title+'</div>'
        +'<div class="lec-row-meta">'
        +(lec.duration?'<span class="lec-dur">⏱ '+lec.duration+'</span>':'')
        +(done?'<span class="lec-done-chip">✓ مكتملة</span>':'')
        +'</div>'
        +'</div>'
        +(done
          ? '<div class="lec-row-end lec-row-end-ok"><svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg></div>'
          : '<div class="lec-row-end lec-row-end-pl"><svg viewBox="0 0 24 24" fill="white" width="12" height="12"><polygon points="5,3 19,12 5,21"/></svg></div>')
        +'</div>';
    });
    list.innerHTML=html;

    // Bind click events
    list.querySelectorAll('.lec-row').forEach(function(item){
      item.addEventListener('click',function(){
        var i=parseInt(this.dataset.i), lec=rows[i];
        if(!lec) return;
        openVideoPlayer(lec.id,lec.title,lec.video_url||'',chtitle,chid,i,lec.thumbnail_url||'');
      });
    });

  }catch(err){
    var l=el('lec-list');
    if(l) l.innerHTML='<div class="state-box"><div class="state-ic">⚠️</div><h3>خطأ في التحميل</h3><p>'+err.message+'</p></div>';
    console.error('openChapterLectures:',err);
  }
}

function _chapterResume(){
  var lid=window._resumeLecId; if(!lid) return;
  var idx=_chapterLectures.findIndex(function(l){return l.id===lid;}); if(idx===-1) idx=0;
  var lec=_chapterLectures[idx]; if(!lec) return;
  openVideoPlayer(lec.id,lec.title,lec.video_url||'',_curChapterMeta.chtitle,_curChapterMeta.chid,idx,lec.thumbnail_url||'');
}
/* ══════════════════════════════════════════════
   VIDEO PLAYER — مشغل الفيديو
══════════════════════════════════════════════ */
var vidState = { url:'', title:'', chapterTitle:'', chapterId:'', lectureId:'', thumbnail:'' };
var _chapterLectures  = [];  // current chapter's lecture list
var _curLecIndex      = -1;  // index in _chapterLectures
var _autoplayEnabled  = true; // user preference
var _autoplayTimer    = null;
var _autoplayCountdown = 0;

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
        // Update live progress bar if newly completed (≥80%)
        if(newPct >= 80 && curPct < 80){ _updateChapterProgressBar(); }
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
      // Update live progress bar if first completion (≥80%)
      if(Math.round(pct) >= 80){ _updateChapterProgressBar(); }
    }
  }catch(e){ console.warn('track view error:',e.message); }
}

/* Update chapter progress bar live without page reload */
function _updateChapterProgressBar(){
  var chid = _curChapterMeta && _curChapterMeta.chid;
  if(!chid || !_chapterLectures.length) return;
  var sess = getSess();
  if(!sess || !sess.id) return;
  // Re-fetch progress for this chapter's lectures
  var ids = _chapterLectures.map(function(l){return l.id;}).join(',');
  sb('lecture_views','GET',null,'?user_id=eq.'+sess.id+'&lecture_id=in.('+ids+')&select=lecture_id,watch_pct')
    .then(function(rows){
      rows = rows || [];
      var done = rows.filter(function(r){return (r.watch_pct||0)>=80;}).length;
      var total = _chapterLectures.length;
      var pct = total > 0 ? Math.round(done/total*100) : 0;
      // Update bar
      var bar = el('ch-hd-prog-bar');  // might not exist (on video page)
      if(bar){
        bar.style.width = pct + '%';
        // Flash animation
        bar.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
      }
      // Also update done count in stats
      var statEl = document.querySelector('.ch-st-g');
      if(statEl && done > 0) statEl.querySelector('span') && (statEl.querySelector('span').textContent = done + ' مكتمل');
    }).catch(function(){});
}

function openVideoPlayer(lid, ltitle, vurl, chtitle, chid, lecIdx, thumbUrl){
  // Auth check — guests cannot watch lectures
  var _s = getSess();
  if(isGuest || !_s || !_s.id){
    toast('🔒 يجب تسجيل الدخول لمشاهدة المحاضرات','warn');
    setTimeout(function(){ goPage('pg-auth'); }, 600);
    return;
  }
  if(!vurl){ toast('⚠️ لا يوجد رابط فيديو للمحاضرة','warn'); return; }
  // Log lecture activity
  logActivity('lecture',{item_id:lid||'',item_name:ltitle||'',subject_name:chtitle||''});

  // Stop previous tracking
  if(_viewTrackTimer){ clearInterval(_viewTrackTimer); _viewTrackTimer=null; }
  _viewLectureId = lid;
  _viewMaxPct = 0;

  _curLecIndex = (lecIdx !== undefined && lecIdx !== '') ? parseInt(lecIdx) : 
    _chapterLectures.findIndex(function(l){ return l.id === lid; });
  vidState = { url:vurl, title:ltitle, chapterTitle:chtitle, chapterId:chid, lectureId:lid, thumbnail:thumbUrl||'' };

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
  _buildVidChapterList(lid);  // Build chapter playlist

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
    _onLectureEnded();
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


/* ══════════════════════════════════════════════
   VIDEO — Chapter playlist & Autoplay
══════════════════════════════════════════════ */

function _buildVidChapterList(curLid){
  var list  = document.getElementById('vcl-list');
  var count = document.getElementById('vcl-count');
  if(!list) return;
  if(!_chapterLectures.length){ list.innerHTML = ''; return; }
  if(count) count.textContent = _chapterLectures.length + ' محاضرة';
  var html = '';
  _chapterLectures.forEach(function(lec, i){
    var isCur = lec.id === curLid;
    var thumbBg = lec.thumbnail_url ? 'background-image:url('+lec.thumbnail_url+')' : '';
    var thumbCls = lec.thumbnail_url ? 'vcl-thumb' : 'vcl-thumb vcl-thumb-def';
    var thumbInner = lec.thumbnail_url ? '' : '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5" width="16" height="16"><polygon points="5,3 19,12 5,21"/></svg>';
    html += '<div class="vcl-item'+(isCur?' vcl-active':'')+'" id="vcli-'+lec.id+'"'
          + ' data-lid="'+lec.id+'"'
          + ' data-idx="'+i+'">';
    html += '<div class="'+thumbCls+'" style="'+thumbBg+'">'+thumbInner+'</div>';
    html += '<div class="vcl-item-num">'+(isCur?'▶':i+1)+'</div>';
    html += '<div class="vcl-item-info">';
    html += '<div class="vcl-item-title">'+lec.title+'</div>';
    html += '<div class="vcl-item-meta">'+(lec.duration?'⏱ '+lec.duration:'')+'</div>';
    html += '</div></div>';
  });
  list.innerHTML = html;
  // Bind click handlers
  list.querySelectorAll('.vcl-item').forEach(function(item){
    var lid   = item.dataset.lid;
    var idx   = parseInt(item.dataset.idx);
    var lecObj = _chapterLectures[idx];
    if(!lecObj) return;
    item.onclick = function(){
      openVideoPlayer(lecObj.id, lecObj.title, lecObj.video_url||'', vidState.chapterTitle, vidState.chapterId, idx, lecObj.thumbnail_url||'');
    };
  });
  // Scroll active item into view
  setTimeout(function(){
    var active = document.getElementById('vcli-'+curLid);
    if(active) active.scrollIntoView({behavior:'smooth', block:'nearest'});
  }, 300);
}

function _buildVidChapterListFromRows(rows, curLid){
  _chapterLectures = rows;
  _buildVidChapterList(curLid);
}

function _onLectureEnded(){
  if(!_autoplayEnabled) return;
  var nextIdx = _curLecIndex + 1;
  if(nextIdx >= _chapterLectures.length) return; // آخر محاضرة
  var nextLec = _chapterLectures[nextIdx];
  if(!nextLec) return;
  _startAutoplayCountdown(nextLec, nextIdx);
}

function _startAutoplayCountdown(nextLec, nextIdx){
  _autoplayCountdown = 5;
  var banner = document.getElementById('vid-autoplay-banner');
  var titleEl = document.getElementById('vab-next-title');
  var cntEl = document.getElementById('vab-countdown');
  var fill  = document.getElementById('vab-fill');
  if(!banner) return;
  if(titleEl) titleEl.textContent = nextLec.title;
  if(cntEl) cntEl.textContent = _autoplayCountdown;
  if(fill) fill.style.width = '0%';
  banner.classList.remove('hidden');
  banner.classList.add('show');

  // Store next lec info
  window._autoplayNext = {lec: nextLec, idx: nextIdx};

  _autoplayTimer = setInterval(function(){
    _autoplayCountdown--;
    if(cntEl) cntEl.textContent = _autoplayCountdown;
    var pct = ((5 - _autoplayCountdown) / 5) * 100;
    if(fill) fill.style.width = pct + '%';
    if(_autoplayCountdown <= 0){
      clearInterval(_autoplayTimer);
      _autoplayTimer = null;
      playNextNow();
    }
  }, 1000);
}

function cancelAutoplay(){
  if(_autoplayTimer){ clearInterval(_autoplayTimer); _autoplayTimer = null; }
  var banner = document.getElementById('vid-autoplay-banner');
  if(banner){ banner.classList.remove('show'); setTimeout(function(){ banner.classList.add('hidden'); }, 400); }
}

function playNextNow(){
  if(_autoplayTimer){ clearInterval(_autoplayTimer); _autoplayTimer = null; }
  var banner = document.getElementById('vid-autoplay-banner');
  if(banner){ banner.classList.remove('show'); setTimeout(function(){ banner.classList.add('hidden'); }, 200); }
  if(window._autoplayNext){
    var l = window._autoplayNext.lec;
    var i = window._autoplayNext.idx;
    openVideoPlayer(l.id, l.title, l.video_url||'', vidState.chapterTitle, vidState.chapterId, i, l.thumbnail_url||'');
  }
}

function toggleAutoplay(){
  _autoplayEnabled = !_autoplayEnabled;
  try{ localStorage.setItem('doroz_autoplay', _autoplayEnabled ? 'true' : 'false'); }catch(e){}
  toast(_autoplayEnabled ? '✅ التشغيل التلقائي مفعّل' : '⏹ التشغيل التلقائي متوقف', 'info');
  // Update settings UI
  var btn = document.getElementById('autoplay-toggle-btn');
  if(btn) btn.textContent = _autoplayEnabled ? '✅ مفعّل' : '⏹ متوقف';
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
    /*
     * فلترة الإشعارات من جهة السيرفر:
     * نجلب: إشعارات عامة (بدون مرحلة/صف) + إشعارات خاصة بمرحلة المستخدم
     * ثم نفلتر client-side للصف المحدد
     */
    var rows = [];

    // إشعارات عامة (بدون مرحلة محددة)
    var q1 = '?is_active=eq.true&target_stage=is.null&order=created_at.desc&limit=30';
    var general = (await sb('notifications','GET',null,q1)) || [];

    // إشعارات مخصصة للمرحلة
    var specific = [];
    if(curStage){
      var q2 = '?is_active=eq.true&target_stage=eq.'+curStage+'&order=created_at.desc&limit=30';
      specific = (await sb('notifications','GET',null,q2)) || [];
      // فلترة client-side للصف المحدد
      if(curGrade){
        specific = specific.filter(function(n){
          return !n.target_grade || n.target_grade === curGrade;
        });
      }
    }

    // دمج وإزالة التكرار وترتيب حسب التاريخ
    var seen = {};
    rows = general.concat(specific).filter(function(n){
      if(seen[n.id]) return false;
      seen[n.id] = true;
      return true;
    }).sort(function(a,b){
      return new Date(b.created_at) - new Date(a.created_at);
    }).slice(0,50);

    _notifsCache = rows;
    updateNotifBadge(rows);
  }catch(e){ console.warn('Notifs load error:',e.message); }
}

function updateNotifBadge(rows){
  // Count unread — check localStorage for read IDs
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  var unread = rows.filter(function(n){ return !readIds.includes(n.id); }).length;
  // Update sidebar dot
  var dot = el('sb-notif-dot');
  if(dot){ if(unread>0) dot.classList.remove('hidden'); else dot.classList.add('hidden'); }
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

function openNotifsPage(){
  goPage('pg-notifs-page');
  loadNotifs().then(function(){ renderNotifsPage(); });
}

function renderNotifsPage(){
  var list = el('notifs-page-list');
  if(!list) return;
  var readIds = JSON.parse(localStorage.getItem('dz_notifs_read')||'[]');
  if(!_notifsCache.length){
    list.innerHTML = '<div class="state-box" style="padding:60px 0"><div class="state-ic">🔔</div><h3 style="color:var(--d-tx1)">لا توجد إشعارات</h3><p style="color:var(--d-tx3)">ستظهر هنا الإشعارات المرسلة لمرحلتك وصفك</p></div>';
    return;
  }
  var TICONS = {lecture:'📹', exam:'📝', booklet:'📚', general:'🔔'};
  var html = '';
  _notifsCache.forEach(function(n){
    var isRead = readIds.includes(n.id);
    var icon = TICONS[n.type]||'🔔';
    var time = getTimeAgo(n.created_at);
    html += '<div class="notif-page-row'+(isRead?'':' notif-unread')+'" onclick="markNotifRead(\''+n.id+'\');this.classList.remove(\'notif-unread\')">'
          + '<div class="notif-page-ic">'+icon+'</div>'
          + '<div class="notif-page-body">'
          +   '<div class="notif-page-title">'+n.title+'</div>'
          +   (n.body?'<div class="notif-page-text">'+n.body+'</div>':'')
          +   '<div class="notif-page-time">'+time+'</div>'
          + '</div>'
          + (isRead?'':'<div class="notif-unread-dot"></div>')
          + '</div>';
  });
  list.innerHTML = html;
  // Also update badge
  updateNotifBadge(_notifsCache);
}

// goBack: returns to previous meaningful page
function goBack(){
  if(_pageHistory.length > 1){
    _pageHistory.pop();
    var prev = _pageHistory[_pageHistory.length-1];
    // Navigate without pushing to history again
    document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});
    var pg = el(prev); if(pg) pg.classList.add('active');
    window.scrollTo(0,0);
  } else {
    goPage('pg-grade');
  }
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