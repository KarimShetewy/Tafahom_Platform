import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import DefaultUserImage from '../assets/images/default_user.png'; // صورة افتراضية للمستخدم
import './TeamDashboard.css'; // ملف الأنماط الخاص بلوحة تحكم فريق العمل
import { AuthContext, ToastContext } from '../App'; // استيراد الـ Contexts


function TeamDashboard() {
    const navigate = useNavigate();
    // جلب بيانات المستخدم ودالة تسجيل الخروج من AuthContext
    const { user, logout } = useContext(AuthContext); 
    // جلب دالة إظهار التوست من ToastContext
    const showGlobalToast = useContext(ToastContext); 

    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن عضو فريق عمل أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'team_member' || !user.token) {
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
    if (!user || user.userType !== 'team_member') {
        return <p>جاري التحقق من الصلاحيات...</p>;
    }

    return (
        <div className="team-dashboard-page">
            {/* REMOVED: Header/Navbar is now in App.js and is handled globally. */}
            {/* You should not have a <header> element here to avoid duplicates. */}

            <main className="main-content">
                <div className="container">
                    <h2 className="team-welcome-title">أهلاً بك، {user.firstName}!</h2> {/* استخدام user.firstName مباشرة من الـ Context */}
                    <p className="dashboard-intro">هذه لوحة تحكم فريق العمل. من هنا يمكنك متابعة المهام والإحصائيات.</p>
                    
                    <div className="team-dashboard-grid">
                        {/* يمكنك إضافة روابط لصفحات الإدارة الخاصة بفريق العمل هنا */}
                        <Link to="/team/tasks" className="team-dashboard-card"> {/* مسار افتراضي للمهام */}
                            <h3>مهامي</h3>
                            <p>عرض المهام المخصصة لك ومتابعة تقدمها.</p>
                        </Link>
                        <Link to="/team/reports" className="team-dashboard-card"> {/* مسار افتراضي للتقارير */}
                            <h3>التقارير والإحصائيات</h3>
                            <p>اطلع على تقارير الأداء والإحصائيات العامة للمنصة.</p>
                        </Link>
                        <Link to="/team/users-management" className="team-dashboard-card"> {/* مسار افتراضي لإدارة المستخدمين */}
                            <h3>إدارة المستخدمين</h3>
                            <p>مراجعة طلبات الحسابات وإدارة المستخدمين (إذا كانت لديك صلاحيات).</p>
                        </Link>
                        <Link to="/team/content-management" className="team-dashboard-card"> {/* مسار افتراضي لإدارة المحتوى */}
                            <h3>إدارة المحتوى</h3>
                            <p>إدارة محتوى الكورسات والمواد التعليمية (إذا كانت لديك صلاحيات).</p>
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

export default TeamDashboard;