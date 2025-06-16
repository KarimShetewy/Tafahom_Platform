import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- استيراد useNavigate لتوجيه المستخدم
import './LoginPage.css'; // لتطبيق التنسيقات الخاصة بالصفحة
import TafahomLogo from '../assets/images/tafahom_logo.png'; // استيراد الشعار
import LoginIllustration from '../assets/images/login_illustration.png'; // الصورة التوضيحية لصفحة تسجيل الدخول

function LoginPage() {
  const navigate = useNavigate(); // استخدام useNavigate hook
  // حالة لإدارة بيانات النموذج
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // حالة لحفظ رسائل الأخطاء القادمة من الـ API أو الأخطاء العامة
  const [error, setError] = useState(null); 

  // دالة لمعالجة التغييرات في حقول الإدخال
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // دالة لمعالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault(); // منع السلوك الافتراضي للمتصفح (إعادة تحميل الصفحة)
    setError(null); // مسح أي رسائل أخطاء سابقة

    const apiEndpoint = 'http://127.0.0.1:8000/api/users/login/'; // نقطة نهاية الـ Login API في Django

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // مهم جداً لإخبار السيرفر بأن البيانات هي JSON
            },
            body: JSON.stringify(formData), // تحويل بيانات النموذج إلى JSON وإرسالها
        });

        const responseData = await response.json(); // قراءة الاستجابة كـ JSON

        if (response.ok) { // التحقق مما إذا كانت الاستجابة ناجحة (حالة HTTP 2xx)
            alert(responseData.message || 'تم تسجيل الدخول بنجاح!'); // عرض رسالة نجاح
            // تخزين التوكن ونوع المستخدم والاسم الأول في Local Storage (مهم للمصادقة لاحقاً في التطبيق)
            localStorage.setItem('userToken', responseData.token);
            localStorage.setItem('userType', responseData.user_type);
            localStorage.setItem('userEmail', formData.email); 
            localStorage.setItem('firstName', responseData.first_name); // <--- تخزين الاسم الأول هنا
            
            // توجيه المستخدم إلى صفحة مختلفة بناءً على نوع المستخدم
            if (responseData.user_type === 'student') {
                navigate('/student/dashboard'); // مثال: توجيه الطالب إلى لوحة تحكم الطالب
            } else if (responseData.user_type === 'teacher') {
                navigate('/teacher/dashboard'); // مثال: توجيه الأستاذ إلى لوحة تحكم الأستاذ
            } else if (responseData.user_type === 'team_member') {
                navigate('/team/dashboard'); // مثال: توجيه عضو فريق العمل إلى لوحة تحكم الفريق
            } else {
                navigate('/dashboard'); // توجيه افتراضي
            }
        } else {
            // التعامل مع الأخطاء القادمة من الـ API (مثل بيانات اعتماد خاطئة)
            let errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
            if (responseData) {
                // عرض رسائل الأخطاء المفصلة من الـ serializer في Django
                // Non-field errors هي الأخطاء العامة التي لا ترتبط بحقل معين
                if (responseData.non_field_errors) {
                    errorMessage = responseData.non_field_errors.join('\n');
                } else if (responseData.email) {
                    errorMessage = `البريد الإلكتروني: ${Array.isArray(responseData.email) ? responseData.email.join(', ') : responseData.email}`;
                } else if (responseData.password) {
                    errorMessage = `كلمة المرور: ${Array.isArray(responseData.password) ? responseData.password.join(', ') : responseData.password}`;
                } else {
                    errorMessage = Object.values(responseData).flat().join('\n'); // لأي أخطاء أخرى
                }
            }
            setError(errorMessage); // تعيين رسالة الخطأ لعرضها في الصفحة
            console.error('API Error:', responseData);
        }
    } catch (error) {
        // التعامل مع أخطاء الشبكة أو مشاكل غير متوقعة
        console.error('Network Error or other issue:', error);
        setError('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
    }
  };

  return (
    <div className="login-page">
      {/* Header - نفس الهيدر في كل الصفحات */}
      <header className="app-header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              {/* هنا الشعار يصبح رابطاً للصفحة الرئيسية */}
              <Link to="/">
                <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" />
              </Link>
            </div>
            <ul className="nav-links">
              <li><Link to="/">الرئيسية</Link></li>
              <li><Link to="/about">عن المنصة</Link></li> {/* مسارات وهمية حالياً */}
              <li><Link to="/teachers-list">الاساتذة</Link></li> {/* مسارات وهمية حالياً */}
              <li><Link to="/courses">الكورسات</Link></li> {/* مسارات وهمية حالياً */}
              <li><Link to="/contact">تواصل معنا</Link></li> {/* مسارات وهمية حالياً */}
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
                {error && <div className="error-message-box">{error}</div>} {/* لعرض رسائل الخطأ */}
                {/* حقل البريد الإلكتروني */}
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

                {/* حقل كلمة المرور */}
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

                {/* زر تسجيل الدخول */}
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