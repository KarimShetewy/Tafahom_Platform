import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './Dashboard.css';

function TeamDashboard() {
    const navigate = useNavigate();
    const firstName = sessionStorage.getItem('firstName') || 'عضو فريق عمل'; // تم التوحيد إلى sessionStorage

    const handleLogout = () => {
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('firstName');
        navigate('/login');
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
                            <li><Link to="/team/users">إدارة المستخدمين</Link></li>
                            <li><Link to="/team/content">إدارة المحتوى</Link></li>
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
                    <h3>لوحة تحكم فريق العمل</h3>
                    <p>هذه هي صفحة لوحة تحكم فريق العمل المحمية.</p>
                </div>
            </main>
        </div>
    );
}

export default TeamDashboard;
