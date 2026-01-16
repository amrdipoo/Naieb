// ✅ الحل الأمثل: استخدام IIFE
(function() {
    'use strict';
    
    // ==================== منع التحميل المزدوج ====================
    if (window.supabaseConfigLoaded) {
        console.log('⚠️ إعدادات Supabase محملة مسبقاً، تخطي التحميل...');
        return; // ✅ الآن داخل دالة IIFE
    }
    window.supabaseConfigLoaded = true;
    
    // ==================== بداية الكود الفعلي ====================
    console.log('🔧 تحميل إعدادات Supabase...');
    
    const SUPABASE_URL = 'https://gcgjzqiumgesultletws.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2p6cWl1bWdlc3VsdGxldHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0Njg1MTksImV4cCI6MjA4NDA0NDUxOX0.ZGQMe3J22-pdlB_zU_jKofk-tR56kWY7TK5JfDB_fJo';
    
    // ==================== تهيئة العميل ====================
    let supabaseClient = null;
    
    try {
        if (typeof window.supabase === 'undefined') {
            console.error('❌ مكتبة Supabase غير محملة');
            return;
        }
        
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ تم تهيئة Supabase Client');
        
    } catch (error) {
        console.error('❌ فشل تهيئة Supabase:', error);
        return;
    }
    
    // ==================== تعريض للاستخدام العام ====================
    window.supabaseConnection = {
        client: supabaseClient,
        config: { url: SUPABASE_URL, key: SUPABASE_ANON_KEY },
        
        async testConnection() {
            try {
                const { data, error } = await supabaseClient
                    .from('requests')
                    .select('id')
                    .limit(1);
                
                return {
                    success: !error,
                    message: error ? error.message : 'Connection successful'
                };
            } catch (error) {
                return { success: false, message: error.message };
            }
        }
    };
    
    console.log('✅ تم تحميل supabase-config.js بنجاح');
    
})(); // نهاية الـ IIFE
