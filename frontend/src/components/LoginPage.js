import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import LoginIllustration from '../assets/images/login_illustration.png';
import axios from 'axios'; // إضافة axios لجلب بيانات المستخدم بعد تسجيل الدخول


function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const apiEndpoint = 'http://127.0.0.1:8000/api/users/login/';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (response.ok) {
            alert(responseData.message || 'تم تسجيل الدخول بنجاح!');
            // تخزين التوكن ونوع المستخدم والاسم الأول في sessionStorage
            sessionStorage.setItem('userToken', responseData.token);
            sessionStorage.setItem('userType', responseData.user_type);
            sessionStorage.setItem('userEmail', formData.email);
            sessionStorage.setItem('firstName', responseData.first_name);
            
            // NEW: تخزين specialized_subject إذا كان المستخدم أستاذ
            // تأكد أن specialized_subject يعود من LoginSerializer في Backend
            if (responseData.user_type === 'teacher' && responseData.specialized_subject) {
                sessionStorage.setItem('specializedSubject', responseData.specialized_subject);
            } else {
                sessionStorage.removeItem('specializedSubject'); // إزالة إذا لم يكن أستاذ أو ليس لديه تخصص
            }


            if (responseData.user_type === 'student') {
                navigate('/student/dashboard');
            } else if (responseData.user_type === 'teacher') {
                navigate('/teacher/dashboard');
            } else if (responseData.user_type === 'team_member') {
                navigate('/team/dashboard');
            } else {
                navigate('/'); // توجيه افتراضي إلى الصفحة الرئيسية
            }
        } else {
            let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
            if (responseData) {
                if (responseData.non_field_errors) {
                    errorMessage = responseData.non_field_errors.join('\n');
                } else if (responseData.email) {
                    errorMessage = `البريد الإلكتروني: ${Array.isArray(responseData.email) ? responseData.email.join(', ') : responseData.email}`;
                } else if (responseData.password) {
                    errorMessage = `كلمة المرور: ${Array.isArray(responseData.password) ? responseData.password.join(', ') : responseData.password}`;
                } else {
                    errorMessage = Object.values(responseData).flat().join('\n');
                }
            }
            setError(errorMessage);
            console.error('API Error:', responseData);
        }
    } catch (error) {
        console.error('Network Error or other issue:', error);
        setError('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
    }
  };

  return (
    <div className="login-page">
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
              <li><Link to="/about">عن المنصة</Link></li>
              <li><Link to="/teachers-list">الاساتذة</Link></li>
              <li><Link to="/courses">الكورسات</Link></li>
              <li><Link to="/contact">تواصل معنا</Link></li>
            </ul>
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
              <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <section className="login-section">
          <div className="container login-container">
            <div className="login-image-wrapper">
              <img src={LoginIllustration} alt="Login Illustration" className="login-illustration" />
              <p className="image-caption">انضم إلى تفاهم وابدأ رحلتك التعليمية</p>
            </div>
            <div className="login-form-wrapper">
              <h2>تسجيل الدخول</h2>
              <form className="login-form" onSubmit={handleSubmit}>
                {error && <div className="error-message-box">{error}</div>}
                <div className="form-group">
                  <label htmlFor="login-email">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">كلمة المرور:</label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary submit-btn">تسجيل الدخول</button>

                <div className="login-links">
                  <Link to="/forgot-password" className="forgot-password-link">هل نسيت كلمة المرور؟</Link>
                  <p>ليس لديك حساب؟ <Link to="/register/student" className="create-account-link">إنشاء حساب جديد</Link></p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;
