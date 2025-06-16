import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentRegistrationPage.css'; // لتطبيق التنسيقات الخاصة بالصفحة
import TafahomLogo from '../assets/images/tafahom_logo.png'; // استيراد الشعار
import StudentRegIllustration from '../assets/images/registration_illustration.png'; // الصورة الجانبية من باسطهالك

// خيارات المحافظات المصرية
const GOVERNORATE_CHOICES = [
    { value: '', label: 'اختر المحافظة' },
    { value: 'cairo', label: 'القاهرة' },
    { value: 'alexandria', label: 'الإسكندرية' },
    { value: 'giza', label: 'الجيزة' },
    { value: 'qalyubia', label: 'القليوبية' },
    { value: 'sharqia', label: 'الشرقية' },
    { value: 'monufia', label: 'المنوفية' },
    { value: 'beheira', label: 'البحيرة' },
    { value: 'gharbia', label: 'الغربية' },
    { value: 'kafr_el_sheikh', label: 'كفر الشيخ' },
    { value: 'fayoum', label: 'الفيوم' },
    { value: 'beni_suef', label: 'بني سويف' },
    { value: 'minya', label: 'المنيا' },
    { value: 'assiut', label: 'أسيوط' },
    { value: 'sohag', label: 'سوهاج' },
    { value: 'qena', label: 'قنا' },
    { value: 'luxor', label: 'الأقصر' },
    { value: 'aswan', label: 'أسوان' },
    { value: 'red_sea', label: 'البحر الأحمر' },
    { value: 'new_valley', label: 'الوادي الجديد' },
    { value: 'matrouh', label: 'مطروح' },
    { value: 'north_sinai', label: 'شمال سيناء' },
    { value: 'south_sinai', label: 'جنوب سيناء' },
    { value: 'suez', label: 'السويس' },
    { value: 'ismailia', label: 'الإسماعيلية' },
    { value: 'port_said', label: 'بورسعيد' },
    { value: 'damietta', label: 'دمياط' },
];

// الصفوف الدراسية (مرحلة الثانوي فقط كما هو مطلوب)
const ACADEMIC_LEVEL_CHOICES = [
    { value: '', label: 'اختر الصف الدراسي' },
    { value: 'first_secondary', label: 'الصف الأول الثانوي' },
    { value: 'second_secondary', label: 'الصف الثاني الثانوي' },
    { value: 'third_secondary', label: 'الصف الثالث الثانوي' },
];

// المسارات الأكاديمية الجديدة (جديد) - يتم تصفيتها حسب الصف
const ACADEMIC_TRACK_CHOICES_BY_LEVEL = {
    'first_secondary': [{ value: 'general', label: 'عام (الصف الأول الثانوي)' }],
    'second_secondary': [
        { value: '', label: 'اختر المسار' },
        { value: 'scientific', label: 'علمي (الصف الثاني الثانوي)' },
        { value: 'literary', label: 'أدبي (الصف الثاني الثانوي)' },
    ],
    'third_secondary': [
        { value: '', label: 'اختر المسار' },
        { value: 'science_section', label: 'علمي علوم (الصف الثالث الثانوي)' },
        { value: 'math_section', label: 'علمي رياضة (الصف الثالث الثانوي)' },
        { value: 'literary_sec_3', label: 'أدبي (الصف الثالث الثانوي)' },
    ],
};


const GENDER_CHOICES = [
    { value: '', label: 'اختر الجنس' },
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' },
];

// خيارات مهنة ولي الأمر
const PARENT_PROFESSION_CHOICES = [
    { value: '', label: 'اختر مهنة ولي الأمر' },
    { value: 'doctor', label: 'طبيب' },
    { value: 'engineer', label: 'مهندس' },
    { value: 'teacher', label: 'معلم' },
    { value: 'accountant', label: 'محاسب' },
    { value: 'other', label: 'أخرى' },
];


function StudentRegistrationPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        second_name: '',
        third_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        user_type: 'student', // دايماً 'student' لهذه الفورم
        gender: '',
        phone_number: '',
        parent_father_phone_number: '',
        parent_mother_phone_number: '',
        school_name: '',
        parent_profession: '',
        teacher_name_for_student: '',
        governorate: '',
        academic_level: '',
        academic_track: '', // جديد
        personal_id_card: null, // شهادة الميلاد أو البطاقة
    });

    const [currentSection, setCurrentSection] = useState(1);
    const totalSections = 4;
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
        // If academic_level changes, reset academic_track
        if (name === 'academic_level') {
            setFormData(prevData => ({
                ...prevData,
                academic_track: ''
            }));
        }
    };

    const validateSection = () => {
        let currentErrors = {};
        // منطق التحقق من صحة البيانات لكل قسم
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
        } else if (currentSection === 2) {
            if (!formData.parent_father_phone_number) currentErrors.parent_father_phone_number = 'رقم هاتف الأب مطلوب';
            if (!formData.school_name) currentErrors.school_name = 'اسم المدرسة مطلوب';
            if (!formData.parent_profession) currentErrors.parent_profession = 'مهنة ولي الأمر مطلوبة';
        } else if (currentSection === 3) {
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
            if (!formData.academic_level) currentErrors.academic_level = 'الصف الدراسي مطلوب';
            if (!formData.academic_track) currentErrors.academic_track = 'المسار الدراسي مطلوب'; // جديد
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب';
        } else if (currentSection === 4) {
            // يمكن جعل رفع الشهادة مطلوباً هنا
            // if (!formData.personal_id_card) currentErrors.personal_id_card = 'شهادة الميلاد/البطاقة مطلوبة';
        }


        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };


    const handleNextSection = () => {
        if (validateSection()) {
            if (currentSection < totalSections) {
                setCurrentSection(currentSection + 1);
            }
        } else {
            alert('الرجاء ملء جميع الحقول المطلوبة في هذا القسم قبل المتابعة.');
        }
    };

    const handlePrevSection = () => {
        if (currentSection > 1) {
            setCurrentSection(currentSection - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // التحقق النهائي قبل الإرسال
        if (!validateSection()) {
            alert('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.');
            return;
        }

        const apiEndpoint = 'http://127.0.0.1:8000/api/users/account-requests/create/'; //
        const dataToSend = new FormData();

        // إضافة جميع الحقول النصية (ماعدا الملفات)
        for (const key in formData) {
            if (formData[key] !== null && key !== 'personal_id_card') {
                dataToSend.append(key, formData[key]);
            }
        }

        // إضافة الملف (شهادة الميلاد أو البطاقة)
        if (formData.personal_id_card) {
            dataToSend.append('personal_id_card', formData.personal_id_card);
        }
        
        // التأكيد على user_type لضمان إرساله
        dataToSend.append('user_type', 'student');


        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend,
            });

            const responseData = await response.json();

            if (response.ok) { // حالة HTTP 2xx
                alert(responseData.message || 'تم إرسال طلب إنشاء الحساب بنجاح. سيتم مراجعته قريباً.'); //
                // إعادة تعيين النموذج بعد النجاح
                setFormData({
                    first_name: '', second_name: '', third_name: '', last_name: '',
                    email: '', password: '', password_confirm: '',
                    user_type: 'student', gender: '', phone_number: '', parent_father_phone_number: '',
                    parent_mother_phone_number: '', school_name: '', parent_profession: '',
                    teacher_name_for_student: '', governorate: '', academic_level: '',
                    academic_track: '', // جديد
                    personal_id_card: null,
                });
                setCurrentSection(1); // العودة للقسم الأول
                setErrors({}); // مسح الأخطاء
            } else {
                let errorMessage = 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'; //
                if (responseData) {
                    // عرض رسائل الأخطاء القادمة من الـ API بشكل أفضل
                    const apiErrors = Object.entries(responseData).map(([key, value]) => {
                        const fieldName = {
                            'first_name': 'الاسم الأول', 'second_name': 'الاسم الثاني', 'third_name': 'الاسم الثالث', 'last_name': 'الاسم الأخير',
                            'email': 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور', 'user_type': 'نوع المستخدم',
                            'gender': 'الجنس', 'phone_number': 'رقم الهاتف', 'parent_father_phone_number': 'رقم هاتف الأب', 'parent_mother_phone_number': 'رقم هاتف الأم',
                            'school_name': 'اسم المدرسة', 'parent_profession': 'مهنة ولي الأمر', 'teacher_name_for_student': 'اسم الأستاذ',
                            'governorate': 'المحافظة', 'academic_level': 'الصف الدراسي', 'academic_track': 'المسار الدراسي',
                            'personal_id_card': 'شهادة الميلاد/البطاقة', 'non_field_errors': ''
                        }[key] || key;
                        return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
                    }).join('\n');
                    errorMessage = `فشل إرسال الطلب:\n${apiErrors}`;
                }
                alert(errorMessage);
                console.error('API Error:', responseData);
            }
        } catch (error) {
            console.error('Network Error or other issue:', error);
            alert('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
        }
    };

    return (
        <div className="student-register-page">
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
                            <li><Link to="/about">عن المنصة</Link></li>
                            <li><Link to="/teachers-list">الاساتذة</Link></li>
                            <li><Link to="/courses">الكورسات</Link></li>
                            <li><Link to="/contact">تواصل معنا</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
                            <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد</Link> {/* هذا الزر يجب أن يفتح هذه الصفحة */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="student-register-section">
                    <div className="container student-register-container">
                        <div className="student-register-image-wrapper">
                            {/* الصورة الجانبية للشخص أمام الكمبيوتر */}
                            <img src={StudentRegIllustration} alt="طلب إنشاء حساب" className="student-illustration-img" />
                            <h3 className="image-title">طلب إنشاء حساب</h3>
                        </div>
                        <div className="student-register-form-wrapper">
                            <h2>طلب إنشاء حساب للطالب</h2>

                            {/* أزرار الأقسام */}
                            <div className="student-form-sections-nav">
                                <button type="button" onClick={() => setCurrentSection(1)} className={`section-nav-button ${currentSection === 1 ? 'active' : ''}`}>
                                    القسم الأول
                                </button>
                                <button type="button" onClick={() => setCurrentSection(2)} className={`section-nav-button ${currentSection === 2 ? 'active' : ''}`}>
                                    القسم الثاني
                                </button>
                                <button type="button" onClick={() => setCurrentSection(3)} className={`section-nav-button ${currentSection === 3 ? 'active' : ''}`}>
                                    القسم الثالث
                                </button>
                                <button type="button" onClick={() => setCurrentSection(4)} className={`section-nav-button ${currentSection === 4 ? 'active' : ''}`}>
                                    القسم الأخير
                                </button>
                            </div>


                            <form className="student-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات الطالب الأساسية */}
                                {currentSection === 1 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأول</h3>
                                        <div className="form-group">
                                            <label htmlFor="first_name">الاسم الأول:</label>
                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="second_name">الاسم الثاني (الأب):</label>
                                            <input type="text" id="second_name" name="second_name" value={formData.second_name} onChange={handleChange} />
                                            {errors.second_name && <span className="error-message">{errors.second_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="third_name">الاسم الثالث (الجد):</label>
                                            <input type="text" id="third_name" name="third_name" value={formData.third_name} onChange={handleChange} />
                                            {errors.third_name && <span className="error-message">{errors.third_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">الاسم الأخير (العائلة):</label>
                                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                                            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone_number">رقم الهاتف (للطالب):</label>
                                            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                                            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">البريد الإلكتروني:</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">كلمة المرور:</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                                            {errors.password && <span className="error-message">{errors.password}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password_confirm">تأكيد كلمة المرور:</label>
                                            <input type="password" id="password_confirm" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required />
                                            {errors.password_confirm && <span className="error-message">{errors.password_confirm}</span>}
                                        </div>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: معلومات ولي الأمر والمدرسة */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني</h3>
                                        <div className="form-group">
                                            <label htmlFor="parent_father_phone_number">رقم هاتف الأب:</label>
                                            <input type="tel" id="parent_father_phone_number" name="parent_father_phone_number" value={formData.parent_father_phone_number} onChange={handleChange} required />
                                            {errors.parent_father_phone_number && <span className="error-message">{errors.parent_father_phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_mother_phone_number">رقم هاتف الأم:</label>
                                            <input type="tel" id="parent_mother_phone_number" name="parent_mother_phone_number" value={formData.parent_mother_phone_number} onChange={handleChange} />
                                            {errors.parent_mother_phone_number && <span className="error-message">{errors.parent_mother_phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="school_name">اسم المدرسة:</label>
                                            <input type="text" id="school_name" name="school_name" value={formData.school_name} onChange={handleChange} required />
                                            {errors.school_name && <span className="error-message">{errors.school_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_profession">مهنة ولي الأمر:</label>
                                            <select id="parent_profession" name="parent_profession" value={formData.parent_profession} onChange={handleChange} required>
                                                {PARENT_PROFESSION_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.parent_profession && <span className="error-message">{errors.parent_profession}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="teacher_name_for_student">اسم الأستاذ للطالب (إن وجد):</label>
                                            <input type="text" id="teacher_name_for_student" name="teacher_name_for_student" value={formData.teacher_name_for_student} onChange={handleChange} />
                                            {errors.teacher_name_for_student && <span className="error-message">{errors.teacher_name_for_student}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثالث: المحافظة، الصف، الجنس، المسار الدراسي */}
                                {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثالث</h3>
                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required>
                                                {GOVERNORATE_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.governorate && <span className="error-message">{errors.governorate}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="academic_level">الصف الدراسي:</label>
                                            <select id="academic_level" name="academic_level" value={formData.academic_level} onChange={handleChange} required>
                                                {ACADEMIC_LEVEL_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.academic_level && <span className="error-message">{errors.academic_level}</span>}
                                        </div>
                                        {/* حقل المسار الدراسي (يظهر حسب الصف المختار) */}
                                        {formData.academic_level && ACADEMIC_TRACK_CHOICES_BY_LEVEL[formData.academic_level] && (
                                            <div className="form-group">
                                                <label htmlFor="academic_track">المسار الدراسي:</label>
                                                <select id="academic_track" name="academic_track" value={formData.academic_track} onChange={handleChange} required>
                                                    {ACADEMIC_TRACK_CHOICES_BY_LEVEL[formData.academic_level].map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                {errors.academic_track && <span className="error-message">{errors.academic_track}</span>}
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label htmlFor="gender">الجنس:</label>
                                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                                {GENDER_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: رفع المستندات (شهادة الميلاد أو البطاقة) */}
                                {currentSection === 4 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: رفع شهادة الميلاد أو البطاقة</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة شهادة الميلاد أو البطاقة:</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" onChange={handleChange} />
                                            {errors.personal_id_card && <span className="error-message">{errors.personal_id_card}</span>}
                                            {/* زر "رفع" بجانب حقل الملف */}
                                            <button type="button" className="btn upload-btn">رفع</button>
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" className="btn btn-primary submit-btn">طلب إنشاء حساب!</button>
                                    </div>
                                )}

                                {/* رابط لتسجيل الدخول إذا كان لديه حساب */}
                                <div className="has-account-link">
                                    هل لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default StudentRegistrationPage;