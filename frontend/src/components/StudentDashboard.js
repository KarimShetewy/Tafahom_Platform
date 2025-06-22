import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import './StudentDashboard.css'; // ملف الأنماط الخاص بلوحة تحكم الطالب
import { AuthContext, ToastContext } from '../App'; // استيراد الـ Contexts


function StudentDashboard() {
    const navigate = useNavigate();
    // جلب بيانات المستخدم ودالة تسجيل الخروج من AuthContext
    const { user, logout } = useContext(AuthContext); 
    // جلب دالة إظهار التوست من ToastContext
    const showGlobalToast = useContext(ToastContext); 

    // REMOVED: useState for firstName, userType, token, etc. as they are now from AuthContext


    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن طالباً أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'student' || !user.token) {
            navigate('/login');
        }
    }, [navigate, user]); // user كـ dependency لـ useEffect للتفاعل مع تغيير حالة المستخدم

    // دالة لتأكيد تسجيل الخروج باستخدام التوست التفاعلي
    const handleLogoutConfirm = () => { 
        showGlobalToast(
            'هل أنت متأكد من تسجيل الخروج؟',
            'confirm', // نوع التوست: "تأكيد"
            (confirmed) => { // دالة callback تنفذ بعد اختيار المستخدم في التوست
                if (confirmed) {
                    logout(); // تنفيذ دالة تسجيل الخروج من الـ Context (لمسح الجلسة)
                    navigate('/login'); // التوجيه لصفحة تسجيل الدخول
                }
            }
        );
    };

    // رسالة تحميل/تحقق من الصلاحيات إذا لم يكن المستخدم مؤهلاً
    if (!user || user.userType !== 'student') {
        return <p>جاري التحقق من الصلاحيات...</p>;
    }

    return (
        <div className="student-dashboard-page">
            {/* REMOVED: Header/Navbar is now in App.js and is handled globally. */}
            {/* You should not have a <header> element here to avoid duplicates. */}

            <main className="main-content">
                <div className="container">
                    <h2 className="student-welcome-title">أهلاً بك، طالب {user.firstName}!</h2> {/* استخدام user.firstName مباشرة من الـ Context */}
                    <p className="dashboard-intro">هذه لوحة تحكم الطالب. من هنا يمكنك متابعة كورساتك والوصول للمحتوى.</p>
                    
                    <div className="student-dashboard-grid">
                        <Link to="/courses" className="student-dashboard-card">
                            <h3>كورساتي</h3>
                            <p>عرض جميع الكورسات التي تشترك بها.</p>
                        </Link>
                        <Link to="/student/exams" className="student-dashboard-card"> {/* مسار افتراضي للامتحانات */}
                            <h3>امتحاناتي وواجباتي</h3>
                            <p>تابع امتحاناتك وواجباتك القادمة والسابقة.</p>
                        </Link>
                        <Link to="/student/progress" className="student-dashboard-card"> {/* مسار افتراضي للتقدم */}
                            <h3>تقدمي الدراسي</h3>
                            <p>راقب تقدمك في الكورسات.</p>
                        </Link>
                        <Link to="/student/profile" className="student-dashboard-card"> {/* مسار افتراضي للبروفايل */}
                            <h3>ملفي الشخصي</h3>
                            <p>تعديل بيانات ملفك الشخصي.</p>
                        </Link>
                    </div>
                </div>
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default StudentDashboard;