import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, ToastContext } from '../App';
import './LoginPage.css';
import LoginIllustration from '../assets/images/login_illustration.png';


function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const showGlobalToast = useContext(ToastContext);

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

        const apiEndpoint = 'http://127.0.0.1:8000/api/auth/token/login/';

        try {
            const response = await axios.post(apiEndpoint, formData);

            const token = response.data.auth_token;

            const userProfileResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const { id, email, first_name, last_name, user_type, user_image, specialized_subject } = userProfileResponse.data;

            const userData = {
                token: token,
                userType: user_type,
                firstName: first_name,
                lastName: last_name,
                userImage: user_image || '',
                userId: id,
                specializedSubject: specialized_subject,
                email: email,
            };

            login(userData);

            if (user_type === 'student') {
                navigate('/student/dashboard');
            } else if (user_type === 'teacher') {
                navigate('/teacher/dashboard');
            } else if (user_type === 'team_member' || user_type === 'team_leader') {
                navigate('/team/dashboard');
            } else {
                navigate('/');
            }
            showGlobalToast('تم تسجيل الدخول بنجاح!', 'success');

        } catch (err) {
            console.error("Login error details:", err);
            let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';

            if (err.response) {
                if (err.response.data) {
                    if (err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    } else if (err.response.data.non_field_errors) {
                        errorMessage = err.response.data.non_field_errors.join(' | ');
                    } else if (typeof err.response.data === 'object') {
                        const fieldErrors = Object.entries(err.response.data)
                            .map(([field, messages]) => {
                                const fieldName = {
                                    email: 'البريد الإلكتروني',
                                    password: 'كلمة المرور',
                                }[field] || field;
                                return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                            })
                            .join(' | ');
                        errorMessage = `خطأ في البيانات المدخلة: ${fieldErrors}`;
                    } else {
                        errorMessage = 'فشل تسجيل الدخول. استجابة غير متوقعة من الخادم.';
                    }
                } else {
                    errorMessage = `خطأ في الخادم (الحالة: ${err.response.status}). يرجى المحاولة لاحقاً.`;
                }
            } else if (err.request) {
                errorMessage = 'لا يوجد استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت وأن الخادم يعمل.';
            } else {
                errorMessage = 'حدث خطأ غير متوقع أثناء إرسال الطلب.';
            }
            
            setError(errorMessage);
            showGlobalToast(errorMessage, 'error');
        }
    };

    return (
        <div className="login-page">
            {/* REMOVED: Header/Navbar is now in App.js */}

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

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default LoginPage;