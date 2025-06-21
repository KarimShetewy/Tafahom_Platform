import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png';
import DefaultUserImage from '../assets/images/default_user.png';
import DashboardTeacherHero from '../assets/images/dashboard_teacher_hero.png';
import './Dashboard.css';
import { AuthContext, ToastContext } from '../App';

function TeacherDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const showGlobalToast = useContext(ToastContext);

    // REMOVED: const [firstName, setFirstName] = useState('');
    // REMOVED: const [userType, setUserType] = useState('');
    // REMOVED: const [token, setToken] = useState('');
    // REMOVED: const [userImage, setUserImage] = useState('');
    // REMOVED: const [userFullName, setUserFullName] = useState('');


    useEffect(() => {
        if (!user || user.userType !== 'teacher' || !user.token) {
            navigate('/login');
        }
    }, [navigate, user]);

    const handleLogoutConfirm = () => {
        showGlobalToast(
            'هل أنت متأكد من تسجيل الخروج؟',
            'confirm',
            (confirmed) => {
                if (confirmed) {
                    logout();
                    navigate('/login');
                }
            }
        );
    };

    if (!user || user.userType !== 'teacher') {
        return <p>جاري التحقق من الصلاحيات...</p>;
    }

    return (
        <div className="dashboard-page">
            {/* REMOVED: Header/Navbar is now in App.js */}
            {/* <header className="app-header">
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
                            <div className="user-profile-widget">
                                <img 
                                    src={user.userImage || DefaultUserImage} 
                                    alt={user.firstName} 
                                    className="user-profile-image" 
                                    onError={(e) => e.target.src = DefaultUserImage} 
                                />
                                <span className="user-profile-name">أهلاً، {user.firstName}</span>
                            </div>
                            <button onClick={handleLogoutConfirm} className="btn btn-secondary">تسجيل الخروج</button>
                        </div>
                    </nav>
                </div>
            </header> */}

            <main className="main-content dashboard-content">
                <section className="teacher-dashboard-hero-section">
                    <div className="container teacher-hero-container">
                        <div className="teacher-hero-content">
                            <h1 className="teacher-welcome-title">
                                أهلاً بك، <span className="teacher-name-highlight">أستاذ {user.firstName}!</span>
                            </h1>
                            <p className="teacher-dashboard-intro">من هنا يمكنك إدارة كورساتك ومتابعة طلابك بكل سهولة.</p>
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
                            <div className="teacher-hero-actions">
                                <Link to="/teacher/add-course" className="btn btn-primary">ابدأ إضافة كورس</Link>
                                <Link to="/teacher/my-courses" className="btn btn-secondary">إدارة الكورسات</Link>
                            </div>
                        </div>
                    </div>
                    {/* طبقة شفافة وتأثير الجزيئات كما في CourseDetailPage */}
                    <div className="teacher-hero-overlay" style={{ backgroundImage: `url(${DashboardTeacherHero})` }}></div>
                </section>

                <div className="container dashboard-sections-wrapper">
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