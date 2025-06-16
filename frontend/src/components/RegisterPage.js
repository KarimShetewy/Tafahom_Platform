import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // لاستخدام Link للتنقل
import './RegisterPage.css';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import RegistrationIllustration from '../assets/images/registration_illustration.png'; // الصورة الجانبية لصفحة التسجيل

// خيارات الفئة/التخصص (Category Choices) كما في الـ Backend
const CATEGORY_CHOICES = [
    { value: '', label: 'اختر الفئة المطلوبة' },
    { value: 'math', label: 'رياضيات' },
    { value: 'physics', label: 'فيزياء' },
    { value: 'chemistry', label: 'كيمياء' },
    { value: 'arabic', label: 'لغة عربية' },
    { value: 'english', label: 'لغة إنجليزية' },
    // أضف المزيد حسب الحاجة لتخصصات الأساتذة
];

const GENDER_CHOICES = [
    { value: '', label: 'اختر الجنس' },
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' },
];

function RegisterPage() {
    // إدارة حالة النموذج
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        user_type: '', // student or teacher
        gender: '',
        phone_number: '',
        // Student specific fields
        parent_phone_number: '',
        school_name: '',
        teacher_name_for_student: '',
        // Teacher specific fields
        qualifications: '',
        experience: '',
        category_type: '', // formerly job_position, now for teacher specialization
        what_will_you_add: '',
        // File fields
        personal_id_card: null,
        other_documents: null,
    });

    // للتحكم في الأقسام/الخطوات
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // القسم الأول، الثاني، الثالث، الأخير

    // دالة لمعالجة التغييرات في حقول الإدخال
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    // دالة للانتقال للقسم التالي
    const validateStep = () => {
        // هنا يمكن إضافة منطق للتحقق من صحة البيانات لكل قسم قبل الانتقال
        // For now, it just moves to the next step
        if (currentStep < totalSteps) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    // دالة للعودة للقسم السابق
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prevStep => prevStep - 1);
        }
    };

    // دالة لمعالجة إرسال النموذج النهائي
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data to be submitted:', formData);

        // هنا سنضيف منطق إرسال البيانات إلى Django API
        // باستخدام FormData لرفع الملفات

        const apiEndpoint = 'http://127.0.0.1:8000/api/users/account-requests/create/';
        const dataToSend = new FormData();

        // إضافة جميع الحقول النصية
        for (const key in formData) {
            if (formData[key] !== null && key !== 'personal_id_card' && key !== 'other_documents') {
                dataToSend.append(key, formData[key]);
            }
        }

        // إضافة الملفات (إذا كانت موجودة)
        if (formData.personal_id_card) {
            dataToSend.append('personal_id_card', formData.personal_id_card);
        }
        if (formData.other_documents) {
            dataToSend.append('other_documents', formData.other_documents);
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend, // لا تحدد Content-Type هنا، المتصفح سيتولى ذلك مع FormData
            });

            const responseData = await response.json();

            if (response.ok) { // حالة HTTP 2xx
                alert(responseData.message || 'تم إرسال طلب إنشاء الحساب بنجاح. سيتم مراجعته قريباً.');
                // يمكن إعادة تعيين النموذج أو توجيه المستخدم لصفحة شكر
                setFormData({
                    first_name: '', last_name: '', email: '', password: '', password_confirm: '',
                    user_type: '', gender: '', phone_number: '', parent_phone_number: '',
                    school_name: '', teacher_name_for_student: '', qualifications: '',
                    experience: '', category_type: '', what_will_you_add: '',
                    personal_id_card: null, other_documents: null,
                });
                setCurrentStep(1); // العودة للخطوة الأولى
            } else {
                // التعامل مع الأخطاء من الـ API
                let errorMessage = 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
                if (responseData) {
                    // عرض رسائل الأخطاء القادمة من الـ Serializer
                    errorMessage = Object.values(responseData).flat().join('\n');
                }
                alert('فشل إرسال الطلب:\n' + errorMessage);
                console.error('API Error:', responseData);
            }
        } catch (error) {
            console.error('Network Error or other issue:', error);
            alert('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
        }
    };

    // تحديد ما إذا كانت حقول الأستاذ أو الطالب ستظهر
    const isTeacher = formData.user_type === 'teacher';
    const isStudent = formData.user_type === 'student';

    return (
        <div className="register-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" />
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/about">عن المنصة</Link></li>
                            <li><Link to="/teachers">للاساتذة</Link></li>
                            <li><Link to="/students">للطلاب</Link></li>
                            <li><Link to="/contact">تواصل معنا</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
                            <Link to="/register" className="btn btn-primary">إنشاء حساب جديد</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="register-section">
                    <div className="container register-container">
                        <div className="register-form-wrapper">
                            <h2>طلب إنشاء حساب</h2>

                            {/* مؤشر التقدم / أزرار الأقسام */}
                            <div className="form-steps-indicator">
                                {[1, 2, 3, 4].map(step => (
                                    <button
                                        key={step}
                                        type="button"
                                        onClick={() => setCurrentStep(step)}
                                        className={`step-button ${currentStep === step ? 'active' : ''}`}
                                    >
                                        القسم {step === 1 ? 'الأول' : step === 2 ? 'الثاني' : step === 3 ? 'الثالث' : 'الأخير'}
                                    </button>
                                ))}
                            </div>

                            <form className="register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: بيانات أساسية */}
                                {currentStep === 1 && (
                                    <div className="form-step active-step">
                                        <h3>القسم الأول: معلومات شخصية</h3>
                                        <div className="form-group">
                                            <label htmlFor="first_name">الاسم الأول:</label>
                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">الاسم الأخير:</label>
                                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">البريد الإلكتروني:</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">كلمة المرور:</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password_confirm">تأكيد كلمة المرور:</label>
                                            <input type="password" id="password_confirm" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required />
                                        </div>
                                        <button type="button" onClick={validateStep} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: نوع المستخدم ومعلومات الاتصال */}
                                {currentStep === 2 && (
                                    <div className="form-step active-step">
                                        <h3>القسم الثاني: نوع الحساب ومعلومات الاتصال</h3>
                                        <div className="form-group">
                                            <label htmlFor="user_type">أرغب في التسجيل كـ:</label>
                                            <select id="user_type" name="user_type" value={formData.user_type} onChange={handleChange} required>
                                                <option value="">اختر نوع الحساب</option>
                                                <option value="student">طالب</option>
                                                <option value="teacher">أستاذ</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="gender">الجنس:</label>
                                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                                {GENDER_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone_number">رقم الهاتف:</label>
                                            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                                        </div>
                                        <button type="button" onClick={prevStep} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={validateStep} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثالث: معلومات خاصة بالطالب أو الأستاذ */}
                                {currentStep === 3 && (
                                    <div className="form-step active-step">
                                        <h3>القسم الثالث: معلومات إضافية</h3>
                                        {isStudent && (
                                            <div className="student-fields">
                                                <div className="form-group">
                                                    <label htmlFor="parent_phone_number">رقم هاتف ولي الأمر:</label>
                                                    <input type="tel" id="parent_phone_number" name="parent_phone_number" value={formData.parent_phone_number} onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="school_name">اسم المدرسة:</label>
                                                    <input type="text" id="school_name" name="school_name" value={formData.school_name} onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="teacher_name_for_student">اسم الأستاذ للطالب (إن وجد):</label>
                                                    <input type="text" id="teacher_name_for_student" name="teacher_name_for_student" value={formData.teacher_name_for_student} onChange={handleChange} />
                                                </div>
                                            </div>
                                        )}

                                        {isTeacher && (
                                            <div className="teacher-fields">
                                                <div className="form-group">
                                                    <label htmlFor="qualifications">المؤهلات:</label>
                                                    <textarea id="qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange}></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="experience">الخبرة:</label>
                                                    <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange}></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="category_type">الفئة المطلوبة (التخصص):</label>
                                                    <select id="category_type" name="category_type" value={formData.category_type} onChange={handleChange}>
                                                        {CATEGORY_CHOICES.map(option => (
                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="what_will_you_add">ما الذي ستضيفه لمنصة تفاهم؟</label>
                                                    <textarea id="what_will_you_add" name="what_will_you_add" value={formData.what_will_you_add} onChange={handleChange}></textarea>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <button type="button" onClick={prevStep} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={validateStep} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: رفع المستندات */}
                                {currentStep === 4 && (
                                    <div className="form-step active-step">
                                        <h3>القسم الأخير: رفع المستندات</h3>
                                        <div className="form-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية (أو هوية):</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="other_documents">مستندات أخرى (اختياري):</label>
                                            <input type="file" id="other_documents" name="other_documents" onChange={handleChange} />
                                        </div>
                                        <button type="button" onClick={prevStep} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" className="btn btn-primary submit-btn">طلب إنشاء حساب!</button>
                                    </div>
                                )}

                                {/* رابط لتسجيل الدخول إذا كان لديه حساب */}
                                <div className="has-account-link">
                                    هل لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
                                </div>
                            </form>
                        </div>
                        <div className="register-image-wrapper">
                            <img src={RegistrationIllustration} alt="Registration Illustration" className="registration-illustration-img" />
                            <h3 className="image-title">طلب إنشاء حساب</h3>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RegisterPage;