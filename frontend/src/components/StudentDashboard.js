import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './Dashboard.css'; // سنستخدم ملف CSS مشترك للـ Dashboards

function StudentDashboard() {
    const navigate = useNavigate();
    // جلب الاسم الأول من localStorage بدلاً من الإيميل
    const firstName = localStorage.getItem('firstName') || 'يا طالب العلم'; // <--- تم التعديل هنا
    // const userEmail = localStorage.getItem('userEmail'); // يمكن الاحتفاظ به للعرض الثانوي

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('firstName'); // <--- أضف هذا السطر لمسح الاسم الأول
        navigate('/login'); // التوجيه لصفحة تسجيل الدخول
    };

    return (
        <div className="dashboard-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/">
                                <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" />
                            </Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/student/courses">كورساتي</Link></li>
                            <li><Link to="/student/schedule">جدولي</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            <button className="btn btn-secondary" onClick={handleLogout}>تسجيل الخروج</button>
                        </div>
                    </nav>
                </div>
            </header>
            <main className="main-content dashboard-content">
                <div className="container">
                    {/* عرض الاسم الأول هنا */}
                    <h2>مرحباً بك يا {firstName}!</h2> {/* <--- تم التعديل هنا */}
                    <h3>لوحة تحكم الطالب</h3>
                    <p>هذه هي صفحة لوحة تحكم الطالب المحمية.</p>
                    {/* هنا سنعرض محتوى خاص بالطلاب مثل الكورسات المسجل فيها، الواجبات، الدرجات */}
                </div>
            </main>
        </div>
    );
}

export default StudentDashboard;