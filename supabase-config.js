// supabase-config.js - نسخة محدثة مع إصلاح الاتصال
console.log('🔧 تحميل إعدادات Supabase...');

// ==================== الخطوة 1: إعدادات Supabase الصحيحة ====================
// ⚠️ ⚠️ ⚠️ مهم: ضع معلوماتك الحقيقية هنا ⚠️ ⚠️ ⚠️
const SUPABASE_URL = 'https://gcgjzqiumgesultletws.supabase.co'; // مثال - غير هذا
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZ2p6cWl1bWdlc3VsdGxldHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0Njg1MTksImV4cCI6MjA4NDA0NDUxOX0.ZGQMe3J22-pdlB_zU_jKofk-tR56kWY7TK5JfDB_fJo'; // مثال - غير هذا

// ==================== الخطوة 2: التحقق من الإعدادات ====================
function validateConfig() {
    console.log('🔍 التحقق من إعدادات Supabase...');
    
    const issues = [];
    
    if (!SUPABASE_URL) {
        issues.push('❌ SUPABASE_URL فارغ');
    } else if (!SUPABASE_URL.includes('supabase.co')) {
        issues.push('❌ SUPABASE_URL غير صحيح - يجب أن يحتوي على supabase.co');
    }
    
    if (!SUPABASE_ANON_KEY) {
        issues.push('❌ SUPABASE_ANON_KEY فارغ');
    } else if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
        issues.push('❌ SUPABASE_ANON_KEY غير صحيح - يجب أن يبدأ بـ eyJ');
    }
    
    if (issues.length > 0) {
        console.error('مشاكل في الإعدادات:', issues);
        return false;
    }
    
    console.log('✅ إعدادات Supabase صحيحة');
    return true;
}

// ==================== الخطوة 3: تهيئة Supabase ====================
let supabase = null;

try {
    // تحميل مكتبة Supabase أولاً
    if (typeof window.supabase === 'undefined') {
        console.error('❌ مكتبة Supabase غير محملة');
        throw new Error('Supabase library not loaded');
    }
    
    // التحقق من الإعدادات
    if (!validateConfig()) {
        throw new Error('Invalid Supabase configuration');
    }
    
    // إنشاء العميل
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        global: {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        },
        db: {
            schema: 'public'
        }
    });
    
    console.log('✅ تم تهيئة Supabase Client');
} catch (error) {
    console.error('❌ فشل تهيئة Supabase:', error.message);
    supabase = null;
}

// ==================== الخطوة 4: دالة الاتصال المبسطة ====================
async function connectToSupabase() {
    console.log('🔗 محاولة الاتصال بـ Supabase...');
    
    if (!supabase) {
        console.error('❌ Supabase client غير مهيأ');
        return { success: false, message: 'Supabase client not initialized' };
    }
    
    try {
        // اختبار بسيط - جلب عدد الطلبات
        const { data, error } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true })
            .limit(1);
        
        if (error) {
            console.error('❌ خطأ في الاتصال:', {
                message: error.message,
                code: error.code,
                details: error.details
            });
            return { success: false, message: error.message };
        }
        
        console.log('✅ تم الاتصال بنجاح!');
        return { success: true, message: 'Connected successfully' };
        
    } catch (error) {
        console.error('❌ استثناء في الاتصال:', error);
        return { success: false, message: error.message };
    }
}

// ==================== الخطوة 5: دالة اختبار الاتصال الشامل ====================
async function testFullConnection() {
    console.log('🧪 بدء اختبار الاتصال الشامل...');
    
    const results = {
        config: validateConfig(),
        supabaseClient: !!supabase,
        networkTest: false,
        apiTest: false,
        tableTest: false
    };
    
    // 1. اختبار الشبكة
    try {
        const networkResponse = await fetch(SUPABASE_URL + '/rest/v1/', {
            method: 'HEAD',
            headers: {
                'apikey': SUPABASE_ANON_KEY
            }
        });
        results.networkTest = networkResponse.ok;
        console.log('📡 اختبار الشبكة:', networkResponse.ok ? '✅' : '❌');
    } catch (error) {
        console.error('📡 اختبار الشبكة فشل:', error.message);
    }
    
    // 2. اختبار API
    if (supabase) {
        try {
            const { error } = await supabase.from('requests').select('id').limit(1);
            results.apiTest = !error;
            console.log('🔌 اختبار API:', !error ? '✅' : '❌', error?.message || '');
        } catch (error) {
            console.error('🔌 اختبار API فشل:', error.message);
        }
    }
    
    // 3. اختبار الجدول
    if (supabase && results.apiTest) {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('count', { count: 'exact', head: true });
            
            results.tableTest = !error;
            console.log('📊 اختبار الجدول:', !error ? '✅' : '❌');
        } catch (error) {
            console.error('📊 اختبار الجدول فشل:', error.message);
        }
    }
    
    console.log('📋 نتائج الاختبار:', results);
    return results;
}

// ==================== الخطوة 6: نظام العمل المختلط ====================
class ConnectionManager {
    constructor() {
        this.isConnected = false;
        this.lastAttempt = null;
        this.retryCount = 0;
    }
    
    async initialize() {
        console.log('🚀 تهيئة مدير الاتصال...');
        
        // محاولة الاتصال أولاً
        const connectionResult = await connectToSupabase();
        
        if (connectionResult.success) {
            this.isConnected = true;
            this.showSuccessMessage();
            return true;
        }
        
        // إذا فشل، جرب اختبار شامل
        console.log('🔄 فشل الاتصال الأولي، جاري اختبار شامل...');
        const testResults = await testFullConnection();
        
        if (testResults.networkTest && testResults.apiTest) {
            this.isConnected = true;
            this.showSuccessMessage();
            return true;
        }
        
        // إذا فشل كل شيء
        this.isConnected = false;
        this.showErrorMessage(connectionResult.message || 'فشل الاتصال');
        return false;
    }
    
    async retryConnection() {
        console.log('🔄 محاولة إعادة الاتصال...');
        this.retryCount++;
        this.lastAttempt = new Date();
        
        // إظهار رسالة الانتظار
        this.showLoadingMessage();
        
        // انتظار قليل
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // محاولة الاتصال مجدداً
        return await this.initialize();
    }
    
    showSuccessMessage() {
        console.log('🎉 الاتصال ناجح!');
        
        // إرسال إشعار إلى التطبيق الرئيسي
        this.dispatchEvent('supabase-connected', { 
            timestamp: new Date().toISOString(),
            retryCount: this.retryCount
        });
    }
    
    showErrorMessage(message) {
        console.error('💥 فشل الاتصال:', message);
        
        // إرسال إشعار إلى التطبيق الرئيسي
        this.dispatchEvent('supabase-error', { 
            message: message,
            timestamp: new Date().toISOString(),
            retryCount: this.retryCount
        });
    }
    
    showLoadingMessage() {
        this.dispatchEvent('supabase-connecting', {
            timestamp: new Date().toISOString()
        });
    }
    
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    }
    
    getStatus() {
        return {
            isConnected: this.isConnected,
            lastAttempt: this.lastAttempt,
            retryCount: this.retryCount,
            supabaseUrl: SUPABASE_URL,
            configValid: validateConfig()
        };
    }
}

// ==================== الخطوة 7: التصدير للاستخدام ====================
const connectionManager = new ConnectionManager();

window.supabaseConnection = {
    supabase,
    connectionManager,
    
    // دالات عامة
    async connect() {
        return await connectionManager.initialize();
    },
    
    async reconnect() {
        return await connectionManager.retryConnection();
    },
    
    async test() {
        return await testFullConnection();
    },
    
    getStatus() {
        return connectionManager.getStatus();
    },
    
    // دالات البيانات
    async saveRequest(requestData) {
        if (!connectionManager.isConnected || !supabase) {
            console.warn('⚠️ Supabase غير متصل، جاري الحفظ محلياً');
            return { success: false, local: true, message: 'Working offline' };
        }
        
        try {
            const { data, error } = await supabase
                .from('requests')
                .insert([{
                    national_id: requestData.nationalId,
                    applicant_name: requestData.applicantName,
                    request_title: requestData.requestTitle,
                    request_summary: requestData.requestSummary,
                    request_date: requestData.requestDate,
                    category: requestData.category,
                    status: requestData.status || 'submitted',
                    priority: requestData.priority || 'medium',
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            return { 
                success: true, 
                data: data,
                message: 'تم الحفظ في قاعدة البيانات'
            };
        } catch (error) {
            console.error('❌ فشل حفظ البيانات:', error);
            return { 
                success: false, 
                local: true,
                message: 'فشل الحفظ في السحابة، جاري الحفظ محلياً'
            };
        }
    },
    
    async getRequests() {
        if (!connectionManager.isConnected || !supabase) {
            console.warn('⚠️ Supabase غير متصل، جاري استخدام البيانات المحلية');
            return { success: false, local: true, data: [] };
        }
        
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return { 
                success: true, 
                data: data || [],
                message: 'تم جلب البيانات من السحابة'
            };
        } catch (error) {
            console.error('❌ فشل جلب البيانات:', error);
            return { 
                success: false, 
                local: true,
                data: [],
                message: 'فشل جلب البيانات من السحابة'
            };
        }
    }
};

// ==================== الخطوة 8: التهيئة التلقائية ====================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 صفحة Supabase Config جاهزة');
    
    // تأخير بسيط لتحميل المكتبات الأخرى
    setTimeout(async () => {
        console.log('⏳ بدء الاتصال التلقائي بـ Supabase...');
        
        // محاولة الاتصال
        const connected = await connectionManager.initialize();
        
        if (connected) {
            console.log('✨ النظام متصل بـ Supabase وجاهز للعمل');
            
            // إعلام التطبيق الرئيسي
            if (window.appReady) {
                window.appReady(true);
            }
        } else {
            console.log('⚠️ النظام سيعمل محلياً بدون Supabase');
            
            // إعلام التطبيق الرئيسي
            if (window.appReady) {
                window.appReady(false);
            }
        }
    }, 1500);
});

// ==================== الخطوة 9: أدوات التصحيح ====================
window.debugSupabase = {
    // إعادة تعيين الاتصال
    async reset() {
        console.clear();
        console.log('🔄 إعادة تعيين اتصال Supabase...');
        localStorage.removeItem('supabase_last_error');
        location.reload();
    },
    
    // عرض معلومات الاتصال (بدون عرض المفتاح كاملاً)
    showInfo() {
        const maskedKey = SUPABASE_ANON_KEY 
            ? SUPABASE_ANON_KEY.substring(0, 20) + '...' + SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 20)
            : 'غير محدد';
        
        console.log('📊 معلومات Supabase:');
        console.log('- URL:', SUPABASE_URL || 'غير محدد');
        console.log('- Key:', maskedKey);
        console.log('- Key Length:', SUPABASE_ANON_KEY?.length || 0);
        console.log('- Client:', supabase ? '✅ مهيأ' : '❌ غير مهيأ');
        console.log('- الاتصال:', connectionManager.isConnected ? '✅ متصل' : '❌ غير متصل');
    },
    
    // اختبار الاتصال مع تفاصيل
    async detailedTest() {
        console.group('🧪 اختبار مفصل للاتصال');
        const results = await testFullConnection();
        
        if (results.networkTest && results.apiTest) {
            console.log('🎉 كل الاختبارات ناجحة!');
            console.log('📝 الحل: النظام جاهز للعمل مع Supabase');
        } else {
            console.log('🔧 المشكلات المكتشفة:');
            
            if (!results.config) {
                console.log('- ❌ إعدادات Supabase غير صحيحة');
                console.log('- الحل: تأكد من SUPABASE_URL و SUPABASE_ANON_KEY');
            }
            
            if (!results.networkTest) {
                console.log('- ❌ مشكلة في الشبكة');
                console.log('- الحل: تحقق من اتصال الإنترنت وإعدادات CORS في Supabase');
            }
            
            if (!results.apiTest) {
                console.log('- ❌ مشكلة في API');
                console.log('- الحل: تحقق من أن الجداول موجودة في Supabase');
            }
        }
        
        console.groupEnd();
        return results;
    }
};

console.log('✅ تم تحميل supabase-config.js بنجاح');