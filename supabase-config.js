// supabase-config.js - نسخة محدثة مع إصلاح الاتصال
console.log('🔧 تحميل إعدادات Supabase...');

// ==================== الخطوة 0: منع التحميل المتكرر ====================
if (window.supabaseConfigLoaded) {
    console.log('⚠️ إعدادات Supabase محملة مسبقاً، تخطي التحميل...');
    return;
}
window.supabaseConfigLoaded = true;

// ==================== الخطوة 1: إعدادات Supabase الصحيحة ====================
const SUPABASE_URL = 'https://gcgjzqiumgesultletws.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2p6cWl1bWdlc3VsdGxldHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0Njg1MTksImV4cCI6MjA4NDA0NDUxOX0.ZGQMe3J22-pdlB_zU_jKofk-tR56kWY7TK5JfDB_fJo';

// ==================== الخطوة 3: تهيئة Supabase ====================
// استخدام متغير جديد لتجنب التعارض مع المكتبة الأصلية
let mySupabaseClient = null;

try {
    // تحميل مكتبة Supabase أولاً
    if (typeof window.supabase === 'undefined') {
        console.error('❌ مكتبة Supabase غير محملة');
        throw new Error('Supabase library not loaded');
    }
    
    // التحقق من الإعدادات
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Invalid Supabase configuration');
    }
    
    // إنشاء العميل
    mySupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
    
    console.log('✅ تم تهيئة Supabase Client');
} catch (error) {
    console.error('❌ فشل تهيئة Supabase:', error.message);
    mySupabaseClient = null;
}

// في بقية الكود، استبدل جميع مرات استخدام `supabase` بـ `mySupabaseClient`
