/**
 * Doroz AI Summarizer — Vercel Serverless Function
 * POST /api/summarize
 *
 * يستقبل ملفاً (صورة أو PDF) بصيغة base64 ويرسله إلى Gemini
 * ثم يُعيد النتيجة إلى الموقع.
 *
 * متغيرات البيئة المطلوبة في Vercel:
 *   GEMINI_API_KEY   — مفتاح Google Gemini API
 *   SB_URL           — رابط Supabase (لحساب الحد اليومي)
 *   SB_SERVICE_KEY   — Supabase service_role key (ليس publishable)
 *   DAILY_LIMIT      — الحد اليومي (افتراضي 5)
 *   ALLOWED_ORIGIN   — رابط الموقع (اختياري، للأمان)
 */

export const config = { runtime: 'edge' };

/* ── نموذج Gemini المستخدم ── */
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ── المفتاح الاحتياطي (يعمل مباشرة إذا لم تُضبط متغيرات Vercel) ── */
const GEMINI_KEY_FALLBACK = 'AIzaSyAr7bZPIlO1cIv-B0sMI_iHqrZSbmv4Hws';

/* ── Prompts بالعربية ── */
const PROMPTS = {
  summary:
    'أنت مساعد تعليمي ذكي لطلاب المرحلة الثانوية العراقية.\n'
    + 'المطلوب:\n'
    + '1. استخرج عنوان الدرس أو الموضوع واكتبه هكذا في السطر الأول: [عنوان: ...]\n'
    + '2. اكتب ملخصاً واضحاً ومبسطاً للمحتوى الدراسي بفقرات منظمة.\n'
    + 'اكتب باللغة العربية الفصحى البسيطة فقط.',

  points:
    'أنت مساعد تعليمي ذكي.\n'
    + 'المطلوب:\n'
    + '1. استخرج عنوان الدرس واكتبه هكذا في السطر الأول: [عنوان: ...]\n'
    + '2. استخرج أهم النقاط والمعلومات والقوانين والمفاهيم الأساسية.\n'
    + 'اعرضها مرقمة: "1. النقطة الأولى" وهكذا.\n'
    + 'اكتب باللغة العربية فقط.',

  qa:
    'أنت مساعد تعليمي ذكي.\n'
    + 'المطلوب:\n'
    + '1. استخرج عنوان الدرس واكتبه هكذا في السطر الأول: [عنوان: ...]\n'
    + '2. أنشئ من 6 إلى 10 أسئلة وأجوبة تغطي المادة بشكل شامل.\n'
    + 'استخدم هذا الشكل بالضبط:\n'
    + 'س: نص السؤال\n'
    + 'ج: نص الجواب\n\n'
    + 'اكتب باللغة العربية فقط.'
};

/* ══════════════════════════════════════════════
   نقطة الدخول الرئيسية
══════════════════════════════════════════════ */
export default async function handler(req) {

  /* CORS headers */
  const origin = req.headers.get('origin') || '*';
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
  const corsOrigin = (allowedOrigin === '*' || origin === allowedOrigin)
    ? origin : allowedOrigin;

  const corsHeaders = {
    'Access-Control-Allow-Origin':  corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
    'Content-Type': 'application/json; charset=utf-8'
  };

  /* Preflight */
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  /* ── قراءة الطلب ── */
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  const { fileData, mimeType, mode, userId } = body;

  /* التحقق من البيانات */
  if (!fileData)       return json({ error: 'fileData مطلوب' },  400, corsHeaders);
  if (!mimeType)       return json({ error: 'mimeType مطلوب' },  400, corsHeaders);
  if (!PROMPTS[mode])  return json({ error: 'mode غير صالح' },   400, corsHeaders);

  /* ── حد الاستخدام اليومي: مُعطَّل مؤقتاً ──
     لإعادة تفعيله: احذف هذا السطر وأزل التعليق عن الكود أدناه */
  const limitResult = { ok: true, remaining: 999, limit: 999 };

  /* لإعادة التفعيل: احذف السطر أعلاه وأزل التعليق عن هذا:
  const limitResult = await checkAndIncrementLimit(userId);
  if (!limitResult.ok) {
    return json({
      error:   'limit_exceeded',
      message: limitResult.message,
      limit:   limitResult.limit,
      used:    limitResult.used
    }, 429, corsHeaders);
  }
  */

  /* ── استدعاء Gemini ── */
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || GEMINI_KEY_FALLBACK;

  const geminiBody = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: fileData } },
        { text: PROMPTS[mode] }
      ]
    }],
    generationConfig: {
      temperature:     0.3,
      maxOutputTokens: 2000,
      topP:            0.8
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  try {
    const geminiResp = await fetch(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(geminiBody)
      }
    );

    if (!geminiResp.ok) {
      const errText = await geminiResp.text();
      let errMsg = `Gemini API error ${geminiResp.status}`;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson?.error?.message || errMsg;
      } catch {}
      return json({ error: errMsg }, 502, corsHeaders);
    }

    const geminiData = await geminiResp.json();

    /* استخراج النص */
    const text = geminiData?.candidates?.[0]?.content?.parts
      ?.map(p => p.text || '').join('').trim() || '';

    if (!text) {
      return json({ error: 'لم يُعِد Gemini نتيجة — حاول مرة أخرى' }, 502, corsHeaders);
    }

    /* استخراج العنوان */
    let topic = '';
    let cleanText = text;
    const topicMatch = text.match(/\[عنوان:\s*([^\]]+)\]/);
    if (topicMatch?.[1]) {
      topic     = topicMatch[1].trim();
      cleanText = text.replace(topicMatch[0], '').trim();
    }

    return json({
      ok:        true,
      topic,
      text:      cleanText,
      remaining: limitResult.remaining,
      limit:     limitResult.limit
    }, 200, corsHeaders);

  } catch (err) {
    return json({ error: err.message || 'خطأ غير متوقع' }, 500, corsHeaders);
  }
}

/* ══════════════════════════════════════════════
   فحص وزيادة عداد الاستخدام في Supabase
══════════════════════════════════════════════ */
async function checkAndIncrementLimit(userId) {
  const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '5', 10);
  const SB_URL      = process.env.SB_URL;
  const SB_KEY      = process.env.SB_SERVICE_KEY;
  const today       = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  /* إذا لم يكن هناك Supabase → نسمح دائماً (fallback) */
  if (!SB_URL || !SB_KEY) {
    return { ok: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
  }

  /* معرّف المستخدم — نستخدم IP كـ fallback للضيوف */
  const uid = userId || 'guest';

  const headers = {
    'apikey':        SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation'
  };

  /* محاولة قراءة السجل الحالي */
  try {
    const readResp = await fetch(
      `${SB_URL}/rest/v1/summ_usage?user_id=eq.${encodeURIComponent(uid)}&date=eq.${today}&select=*`,
      { headers }
    );

    if (!readResp.ok) {
      /* إذا فشل الاتصال → اسمح بالمرور (لا تكسر الموقع) */
      return { ok: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
    }

    const rows = await readResp.json();

    if (rows.length === 0) {
      /* سجل جديد */
      await fetch(`${SB_URL}/rest/v1/summ_usage`, {
        method:  'POST',
        headers,
        body: JSON.stringify({ user_id: uid, date: today, count: 1 })
      });
      return { ok: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
    }

    const currentCount = rows[0].count || 0;

    if (currentCount >= DAILY_LIMIT) {
      return {
        ok:      false,
        message: `لقد وصلت إلى الحد المسموح به (${DAILY_LIMIT} عمليات يومياً). يتجدد الحد منتصف الليل.`,
        limit:   DAILY_LIMIT,
        used:    currentCount
      };
    }

    /* تحديث العداد */
    await fetch(
      `${SB_URL}/rest/v1/summ_usage?user_id=eq.${encodeURIComponent(uid)}&date=eq.${today}`,
      {
        method:  'PATCH',
        headers,
        body: JSON.stringify({ count: currentCount + 1 })
      }
    );

    return {
      ok:        true,
      remaining: DAILY_LIMIT - currentCount - 1,
      limit:     DAILY_LIMIT
    };

  } catch {
    /* أي خطأ → اسمح بالمرور حتى لا يتأثر المستخدم */
    return { ok: true, remaining: DAILY_LIMIT - 1, limit: DAILY_LIMIT };
  }
}

/* ── Helper ── */
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}