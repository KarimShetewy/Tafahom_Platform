import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './Dashboard.css';

function StudentDashboard() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [userType, setUserType] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedFirstName = sessionStorage.getItem('firstName'); // تم التوحيد إلى sessionStorage
        const storedUserType = sessionStorage.getItem('userType'); // تم التوحيد إلى sessionStorage
        const storedToken = sessionStorage.getItem('userToken'); // تم التوحيد إلى sessionStorage

        if (storedUserType === 'student' && storedToken) {
            setFirstName(storedFirstName);
            setUserType(storedUserType);
            setToken(storedToken);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('userEmail');
        navigate('/login');
    };

    if (!token || userType !== 'student') {
        return <p>جاري التحقق من الصلاحيات...</p>; 
    }

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
                    <h2>مرحباً بك يا {firstName}!</h2>
                    <h3>لوحة تحكم الطالب</h3>
                    <p>هذه هي صفحة لوحة تحكم الطالب المحمية.</p>
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
