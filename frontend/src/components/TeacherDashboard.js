import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import DefaultUserImage from '../assets/images/default_user.png'; // صورة افتراضية للمستخدم
import DashboardTeacherHero from '../assets/images/dashboard_teacher_hero.png'; // صورة خلفية الهيرو سكشن (يجب توفيرها)
import './Dashboard.css'; // ملف الأنماط الخاص بالداشبورد
import { AuthContext, ToastContext } from '../App'; // استيراد الـ Contexts


function TeacherDashboard() {
    const navigate = useNavigate();
    // جلب بيانات المستخدم ودالة تسجيل الخروج من AuthContext
    const { user, logout } = useContext(AuthContext); 
    // جلب دالة إظهار التوست من ToastContext
    const showGlobalToast = useContext(ToastContext); 

    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن معلماً أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'teacher' || !user.token) {
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
    if (!user || user.userType !== 'teacher') {
        return <p>جاري التحقق من الصلاحيات...</p>;
    }

    return (
        <div className="dashboard-page">
            {/* REMOVED: Header/Navbar is now in App.js and is handled globally. */}
            {/* You should not have a <header> element here to avoid duplicates. */}

            <main className="main-content dashboard-content">
                {/* قسم Hero في لوحة تحكم المعلم: خلفية ديناميكية، عنوان ترحيبي، إحصائيات سريعة، وأزرار */}
                <section className="teacher-dashboard-hero-section">
                    <div className="container teacher-hero-container">
                        <div className="teacher-hero-content">
                            <h1 className="teacher-welcome-title">
                                أهلاً بك، <span className="teacher-name-highlight">أستاذ {user.firstName}!</span> {/* استخدام user.firstName مباشرة من الـ Context */}
                            </h1>
                            <p className="teacher-dashboard-intro">من هنا يمكنك إدارة كورساتك ومتابعة طلابك بكل سهولة.</p>
                            
                            {/* قسم إحصائيات سريعة (يمكن ربطها ببيانات حقيقية لاحقاً) */}
                            <div className="teacher-hero-stats">
                                <div className="stat-item">
                                    <span className="stat-icon">📚</span>
                                    <span className="stat-value">5+</span>
                                    <span className="stat-label">كورسات نشطة</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">🎓</span>
                                    <span className="stat-value">250+</span>
                                    <span className="stat-label">طالب مسجل</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-icon">⭐</span>
                                    <span className="stat-value">4.8</span>
                                    <span className="stat-label">متوسط التقييم</span>
                                </div>
                            </div>
                            
                            {/* أزرار الإجراءات الرئيسية في الهيرو سكشن */}
                            <div className="teacher-hero-actions">
                                <Link to="/teacher/add-course" className="btn btn-primary">ابدأ إضافة كورس</Link>
                                <Link to="/teacher/my-courses" className="btn btn-secondary">إدارة الكورسات</Link>
                            </div>
                        </div>
                    </div>
                    {/* طبقة شفافة وتأثير الجزيئات المتحركة (تنسيقاتها في Dashboard.css) */}
                    <div className="teacher-hero-overlay" style={{ backgroundImage: `url(${DashboardTeacherHero})` }}></div>
                </section>

                {/* حاوية لباقي أقسام لوحة التحكم (البطاقات) لسحبها للأعلى فوق الـ Hero Section */}
                <div className="container dashboard-sections-wrapper">
                    <div className="dashboard-sections-grid">
                        {/* بطاقات الأقسام التي تؤدي إلى صفحات أخرى أو وظائف */}
                        <Link to="/teacher/add-course" className="dashboard-section-card">
                            <h3>إضافة كورس جديد</h3>
                            <p>ابدأ في إنشاء كورس تعليمي جديد.</p>
                        </Link>
                        <Link to="/teacher/my-courses" className="dashboard-section-card">
                            <h3>إدارة كورساتي</h3>
                            <p>عرض وتعديل وحذف كورساتك الموجودة.</p>
                        </Link>
                        <div className="dashboard-section-card">
                            <h3>الطلاب المشتركين</h3>
                            <p>شاهد قائمة الطلاب المشتركين في كورساتك.</p>
                        </div>
                        <div className="dashboard-section-card">
                            <h3>التقارير والإحصائيات</h3>
                            <p>اطلع على أداء كورساتك وإحصائيات الأرباح.</p>
                        </div>
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

export default TeacherDashboard;