// frontend/src/components/Toast.js
import React, { useEffect, useState } from 'react';
import './Toast.css';

// أيقونات لأزرار التأكيد/الإلغاء (يمكن استبدالها بـ FontAwesome/Lucide React لاحقاً)
const CHECK_ICON = '✔️';
const CROSS_ICON = '✖️';

// مكون Toast
// يعرض رسائل تنبيه للمستخدم، ويمكن أن يكون تفاعلياً لرسائل التأكيد.
function Toast({ message, type, duration = 3000, onDismiss, toastCallback }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            // إذا لم يكن توست تأكيد، أخفه تلقائياً بعد المدة المحددة
            if (type !== 'confirm') { 
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    if (onDismiss) { // استدعاء دالة onDismiss لمسح الرسالة من الـ App Context
                        onDismiss();
                    }
                }, duration);
                return () => clearTimeout(timer); // تنظيف المؤقت عند إزالة المكون أو تغيير الرسالة
            }
        } else {
            setIsVisible(false); // إخفاء التوست إذا لم يكن هناك رسالة
        }
    }, [message, type, duration, onDismiss]); // إعادة تشغيل الـ Effect عند تغيير هذه المتغيرات

    // لا تعرض المكون إذا لم يكن مرئياً
    if (!isVisible) {
        return null;
    }

    // دالة لجلب الأيقونة المناسبة لنوع التوست
    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            case 'confirm': return '❓'; // أيقونة لسؤال التأكيد
            default: return '💬'; // أيقونة افتراضية
        }
    };

    // دالة للتعامل مع ضغط زر التأكيد
    const handleConfirmAction = () => {
        setIsVisible(false); // إخفاء التوست فوراً
        if (toastCallback) {
            toastCallback(true); // استدعاء الـ callback بـ true (موافقة المستخدم)
        }
        onDismiss(); // مسح الرسالة والحالة من App.js Context
    };

    // دالة للتعامل مع ضغط زر الإلغاء
    const handleCancelAction = () => {
        setIsVisible(false); // إخفاء التوست فوراً
        if (toastCallback) {
            toastCallback(false); // استدعاء الـ callback بـ false (رفض المستخدم)
        }
        onDismiss(); // مسح الرسالة والحالة من App.js Context
    };

    return (
        <div className={`toast-notification ${type} ${isVisible ? 'show' : ''}`}>
            <span className="toast-icon">{getIcon()}</span>
            <span className="toast-message-text">{message}</span>
            {/* عرض الأزرار فقط إذا كان نوع التوست "confirm" */}
            {type === 'confirm' && ( 
                <div className="toast-actions">
                    <button className="btn toast-confirm-btn" onClick={handleConfirmAction}>
                        {CHECK_ICON} تأكيد
                    </button>
                    <button className="btn toast-cancel-btn" onClick={handleCancelAction}>
                        {CROSS_ICON} لا
                    </button>
                </div>
            )}
        </div>
    );
}

export default Toast;