import React, { useState, useEffect } from 'react'; // استيراد useEffect و useState
import { Link, useNavigate } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './Dashboard.css'; // سنستخدم ملف CSS مشترك للـ Dashboards

function StudentDashboard() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [userType, setUserType] = useState('');
    const [token, setToken] = useState(''); // لتخزين التوكن في حالة المكون

    useEffect(() => {
        // جلب بيانات المستخدم من Local Storage
        const storedFirstName = localStorage.getItem('firstName');
        const storedUserType = localStorage.getItem('userType');
        const storedToken = localStorage.getItem('token'); // *** تغيير هنا: استخدام 'token' ***

        // التحقق من صلاحية المستخدم
        if (storedUserType === 'student' && storedToken) {
            setFirstName(storedFirstName);
            setUserType(storedUserType);
            setToken(storedToken); // تحديث حالة التوكن في المكون
        } else {
            // إذا لم يكن مسجل دخول كطالب، أعد التوجيه إلى صفحة تسجيل الدخول
            navigate('/login');
        }
    }, [navigate]); // navigate في مصفوفة الاعتمادات لـ useEffect

    const handleLogout = () => {
        // مسح بيانات المستخدم من Local Storage
        localStorage.removeItem('token'); // *** تغيير هنا: استخدام 'token' ***
        localStorage.removeItem('userType');
        localStorage.removeItem('firstName');
        localStorage.removeItem('userEmail'); // لتنظيف كامل
        // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة تسجيل الدخول
        navigate('/login');
    };

    // عرض رسالة تحميل أو إعادة توجيه إذا لم يتم التحقق بعد
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
                    {/* عرض الاسم الأول هنا */}
                    <h2>مرحباً بك يا {firstName}!</h2>
                    <h3>لوحة تحكم الطالب</h3>
                    <p>هذه هي صفحة لوحة تحكم الطالب المحمية.</p>
                    {/* هنا سنعرض محتوى خاص بالطلاب مثل الكورسات المسجل فيها، الواجبات، الدرجات */}
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