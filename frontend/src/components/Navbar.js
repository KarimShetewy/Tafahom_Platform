// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import DefaultUserImage from '../assets/images/default_user.png'; // صورة افتراضية للمستخدم

// استيراد الـ Context الذي يحمل بيانات المستخدم ودوال التوست
import { AuthContext, ToastContext } from '../App'; 
import './Navbar.css'; // تنسيقات الـ Navbar

function Navbar() {
    const { user, logout } = useContext(AuthContext); 
    const showGlobalToast = useContext(ToastContext); 
    const navigate = useNavigate();

    const handleLogoutConfirm = () => {
        showGlobalToast(
            'هل أنت متأكد من تسجيل الخروج؟',
            'confirm', // نوع جديد للتوست يشير إلى أنه توست تأكيد
            (confirmed) => { // دالة callback عند اختيار المستخدم
                if (confirmed) {
                    logout(); // تنفيذ تسجيل الخروج
                    navigate('/login'); // التوجيه لصفحة تسجيل الدخول
                }
            }
        );
    };

    return (
        <header className="app-header">
            <div className="container">
                <nav className="navbar">
                    <div className="logo">
                        <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/">الرئيسية</Link></li>
                        {user && user.userType === 'teacher' && (
                            <>
                                <li><Link to="/teacher/dashboard">لوحة التحكم</Link></li>
                                <li><Link to="/teacher/add-course">إضافة كورس جديد</Link></li>
                                <li><Link to="/teacher/my-courses">إدارة كورساتي</Link></li>
                            </>
                        )}
                        {user && user.userType === 'student' && (
                            <li><Link to="/student/dashboard">لوحة التحكم</Link></li>
                        )}
                        {user && user.userType === 'team_member' && (
                            <li><Link to="/team/dashboard">لوحة التحكم</Link></li>
                        )}
                        {/* REMOVED: <li><Link to="/courses">الكورسات</Link></li> */}
                        {/* REMOVED: <li><Link to="/teachers-list">الاساتذة</Link></li> */}
                        <li><Link to="/about">عن المنصة</Link></li>
                        {/* REMOVED: <li><Link to="/contact">تواصل معنا</Link></li> */}
                    </ul>
                    <div className="auth-buttons">
                        {user && user.userType ? ( 
                            <>
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
                            </>
                        ) : ( 
                            <>
                                <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
                                <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;