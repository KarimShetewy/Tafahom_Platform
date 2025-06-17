import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './Dashboard.css';

function TeacherDashboard() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [userType, setUserType] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        // جلب بيانات المستخدم من Local Storage
        const storedFirstName = localStorage.getItem('firstName');
        const storedUserType = localStorage.getItem('userType');
        const storedToken = localStorage.getItem('token'); // *** تغيير هنا: استخدام 'token' ***

        if (storedUserType === 'teacher' && storedToken) {
            setFirstName(storedFirstName);
            setUserType(storedUserType);
            setToken(storedToken);
        } else {
            // إذا لم يكن مسجل دخول كأستاذ، أعد التوجيه إلى صفحة تسجيل الدخول
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        // مسح بيانات المستخدم من Local Storage
        localStorage.removeItem('token'); // *** تغيير هنا: استخدام 'token' ***
        localStorage.removeItem('userType');
        localStorage.removeItem('firstName');
        localStorage.removeItem('userEmail');
        // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة تسجيل الدخول
        navigate('/login');
    };

    if (!token || userType !== 'teacher') {
        return <p>جاري التحقق من الصلاحيات...</p>;
    }

    return (
        <div className="dashboard-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/teacher/dashboard">لوحة التحكم</Link></li>
                            <li><Link to="/teacher/add-course">إضافة كورس جديد</Link></li>
                            <li><Link to="/teacher/my-courses">إدارة كورساتي</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            <button onClick={handleLogout} className="btn btn-secondary">تسجيل الخروج</button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content dashboard-content">
                <div className="container">
                    <h2 className="welcome-message">أهلاً بك، أستاذ {firstName}!</h2>
                    <p className="dashboard-intro">هذه لوحة تحكم الأستاذ. من هنا يمكنك إدارة كورساتك ومتابعة طلابك.</p>
                    
                    <div className="dashboard-sections-grid">
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