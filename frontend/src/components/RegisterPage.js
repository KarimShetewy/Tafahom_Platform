import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; // تأكد من وجود هذا الملف


function RegisterPage() {
    return (
        <div className="register-page">
            {/* REMOVED: Header/Navbar is now in App.js and is handled globally. */}
            <main className="main-content">
                <section className="registration-section-landing">
                    <div className="container">
                        <h2>إنشاء حساب جديد</h2>
                        <div className="registration-type-selection">
                            <Link to="/register/student" className="btn btn-primary">
                                إنشاء حساب طالب
                            </Link>
                            <Link to="/register/teacher" className="btn btn-secondary">
                                تسجيل كأستاذ
                            </Link>
                            <Link to="/register/team" className="btn btn-secondary">
                                الانضمام لفريق العمل
                            </Link>
                        </div>
                        {/* رابط لتسجيل الدخول إذا كان لديه حساب */}
                        <p className="login-link-register-page">
                            هل لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
                        </p>
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

export default RegisterPage;