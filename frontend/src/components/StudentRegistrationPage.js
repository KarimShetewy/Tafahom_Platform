import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StudentRegistrationPage.css';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import RegisterStudentIllustration from '../assets/images/student_illustration.png'; // تأكد من مسار الصورة
import academicStructure from '../constants/academicStructure';

// استيراد خيارات ثابتة من users.models
const GENDER_CHOICES = [
    { value: '', label: 'اختر الجنس' },
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' },
];

const ALL_GOVERNORATES_FOR_SELECT = [
    { value: '', label: 'اختر المحافظة' },
    { value: 'cairo', label: 'القاهرة' }, { value: 'alexandria', label: 'الإسكندرية' }, { value: 'giza', label: 'الجيزة' }, { value: 'qalyubia', label: 'القليوبية' },
    { value: 'sharqia', label: 'الشرقية' }, { value: 'monufia', label: 'المنوفية' }, { value: 'beheira', label: 'البحيرة' }, { value: 'gharbia', label: 'الغربية' },
    { value: 'kafr_el_sheikh', label: 'كفر الشيخ' }, { value: 'fayoum', label: 'الفيوم' }, { value: 'beni_suef', label: 'بني سويف' }, { value: 'minya', label: 'المنيا' },
    { value: 'assiut', label: 'أسيوط' }, { value: 'sohag', label: 'سوهاج' }, { value: 'qena', label: 'قنا' }, { value: 'luxor', label: 'الأقصر' },
    { value: 'aswan', label: 'أسوان' }, { value: 'red_sea', label: 'البحر الأحمر' }, { value: 'new_valley', label: 'الوادي الجديد' }, { value: 'matrouh', label: 'مطروح' },
    { value: 'north_sinai', label: 'شمال سيناء' }, { value: 'south_sinai', label: 'جنوب سيناء' }, { value: 'suez', label: 'السويس' },
    { value: 'ismailia', label: 'الإسماعيلية' }, { value: 'port_said', label: 'بورسعيد' }, { value: 'damietta', label: 'دمياط' },
];

const PARENT_PROFESSION_CHOICES = [
    { value: '', label: 'اختر مهنة ولي الأمر' },
    { value: 'doctor', label: 'طبيب' }, { value: 'engineer', label: 'مهندس' }, { value: 'teacher', label: 'معلم' }, { value: 'accountant', label: 'محاسب' }, { value: 'other', label: 'أخرى' },
];

const TEACHER_NAME_CHOICES = [
    { value: '', label: 'اختر الأستاذ (اختياري)' },
    // هذا سيتطلب جلب قائمة المدرسين من API
    // مؤقتاً، يمكن إضافة بعض الأسماء الثابتة للاختبار
    { value: 'teacher_ahmed', label: 'أ. أحمد' },
    { value: 'teacher_mohamed', label: 'أ. محمد' },
];

function StudentRegistrationPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
        user_type: 'student', // نوع المستخدم ثابت هنا
        first_name: '',
        second_name: '',
        third_name: '',
        last_name: '',
        phone_number: '',
        gender: '',
        governorate: '',
        parent_father_phone_number: '',
        parent_mother_phone_number: '',
        school_name: '',
        parent_profession: '',
        teacher_name_for_student: '',
        academic_level: '',
        academic_track: '',
        personal_id_card: null,
    });

    const [currentSection, setCurrentSection] = useState(1);
    const totalSections = 3;
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files[0]
        }));
    };

    const validateSection = () => {
        let currentErrors = {};
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.second_name) currentErrors.second_name = 'الاسم الثاني مطلوب';
            if (!formData.third_name) currentErrors.third_name = 'الاسم الثالث مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
            if (!formData.academic_level) currentErrors.academic_level = 'الصف الدراسي مطلوب';
            if (!formData.academic_track) currentErrors.academic_track = 'المسار الدراسي مطلوب';
        } else if (currentSection === 2) {
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
            if (!formData.parent_father_phone_number) currentErrors.parent_father_phone_number = 'رقم هاتف الأب مطلوب';
            if (!formData.school_name) currentErrors.school_name = 'اسم المدرسة مطلوب';
            if (!formData.parent_profession) currentErrors.parent_profession = 'مهنة ولي الأمر مطلوبة';
        } else if (currentSection === 3) {
            if (!formData.personal_id_card) currentErrors.personal_id_card = 'صورة البطاقة/شهادة الميلاد مطلوبة';
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
        setLoading(true);
        setErrors({}); // مسح الأخطاء السابقة
        setSuccessMessage(null);

        if (!validateSection()) {
            alert('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.');
            setLoading(false);
            return;
        }
        
        // NEW: تصحيح الـ API Endpoint ليتطابق مع Backend
        const apiEndpoint = 'http://127.0.0.1:8000/api/users/register/'; // هذا هو المسار الصحيح
        const dataToSend = new FormData();

        for (const key in formData) {
            if (key === 'personal_id_card') {
                if (formData[key]) {
                    dataToSend.append(key, formData[key]);
                }
            } else if (formData[key] !== null && formData[key] !== '') {
                dataToSend.append(key, formData[key]);
            }
        }
        dataToSend.append('user_type', formData.user_type); // التأكد من إرسال user_type

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend,
            });

            const responseData = await response.json();

            if (response.ok) {
                setSuccessMessage(responseData.message || 'تم إرسال طلب الانضمام بنجاح. سيتم مراجعته قريباً.');
                setFormData({ // إعادة تعيين النموذج
                    email: '', password: '', password_confirm: '', user_type: 'student',
                    first_name: '', second_name: '', third_name: '', last_name: '',
                    phone_number: '', gender: '', governorate: '', parent_father_phone_number: '',
                    parent_mother_phone_number: '', school_name: '', parent_profession: '',
                    teacher_name_for_student: '', academic_level: '', academic_track: '',
                    personal_id_card: null,
                });
                setCurrentSection(1); // العودة للقسم الأول
                setErrors({}); // مسح الأخطاء
            } else {
                let errorMessage = 'فشل إرسال طلب الانضمام. يرجى التحقق من البيانات.';
                if (responseData) {
                    const apiErrors = Object.entries(responseData).map(([key, value]) => {
                        const fieldName = {
                            'email': 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                            'first_name': 'الاسم الأول', 'second_name': 'الاسم الثاني', 'third_name': 'الاسم الثالث',
                            'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف', 'gender': 'الجنس',
                            'governorate': 'المحافظة', 'parent_father_phone_number': 'رقم هاتف الأب',
                            'parent_mother_phone_number': 'رقم هاتف الأم', 'school_name': 'اسم المدرسة',
                            'parent_profession': 'مهنة ولي الأمر', 'teacher_name_for_student': 'اسم الأستاذ للطالب',
                            'academic_level': 'الصف الدراسي', 'academic_track': 'المسار الدراسي',
                            'personal_id_card': 'البطاقة الشخصية/شهادة الميلاد', 'non_field_errors': ''
                        }[key] || key;
                        return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
                    }).join('\n');
                    errorMessage = `فشل إرسال الطلب:\n${apiErrors}`;
                }
                setErrors({general: errorMessage}); // عرض رسالة الخطأ العامة
                console.error('API Error:', responseData);
            }
        } catch (error) {
            console.error('Network Error or other issue:', error);
            setErrors({general: 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-registration-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
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
                            <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد (طالب)</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="student-register-section">
                    <div className="container student-register-container">
                        <div className="student-register-image-wrapper">
                            <img src={RegisterStudentIllustration} alt="طلب إنشاء حساب طالب" className="student-illustration-img" />
                            <h3 className="image-title">طلب إنشاء حساب طالب</h3>
                        </div>
                        <div className="student-register-form-wrapper">
                            <h2>طلب إنشاء حساب الطالب</h2>
                            
                            {/* أزرار الأقسام */}
                            <div className="student-form-sections-nav">
                                <button type="button" onClick={() => setCurrentSection(1)} className={`section-nav-button ${currentSection === 1 ? 'active' : ''}`}>
                                    القسم الأول
                                </button>
                                <button type="button" onClick={() => setCurrentSection(2)} className={`section-nav-button ${currentSection === 2 ? 'active' : ''}`}>
                                    القسم الثاني
                                </button>
                                <button type="button" onClick={() => setCurrentSection(3)} className={`section-nav-button ${currentSection === 3 ? 'active' : ''}`}>
                                    القسم الأخير
                                </button>
                            </div>

                            {errors.general && <div className="error-message-box">{errors.general}</div>} {/* عرض الخطأ العام */}
                            {successMessage && <div className="success-message-box">{successMessage}</div>}

                            <form className="student-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات شخصية وعامة */}
                                {currentSection === 1 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأول: معلومات شخصية</h3>
                                        <div className="form-group">
                                            <label htmlFor="first_name">الاسم الأول:</label>
                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="second_name">الاسم الثاني (الأب):</label>
                                            <input type="text" id="second_name" name="second_name" value={formData.second_name} onChange={handleChange} required />
                                            {errors.second_name && <span className="error-message">{errors.second_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="third_name">الاسم الثالث (الجد):</label>
                                            <input type="text" id="third_name" name="third_name" value={formData.third_name} onChange={handleChange} required />
                                            {errors.third_name && <span className="error-message">{errors.third_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">الاسم الأخير:</label>
                                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                                            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone_number">رقم الهاتف:</label>
                                            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                                            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="gender">الجنس:</label>
                                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                                {GENDER_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required>
                                                {ALL_GOVERNORATES_FOR_SELECT.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.governorate && <span className="error-message">{errors.governorate}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="academic_level">الصف الدراسي:</label>
                                            <select id="academic_level" name="academic_level" value={formData.academic_level} onChange={handleChange} required>
                                                <option value="">اختر الصف</option>
                                                {Object.keys(academicStructure).map(levelKey => (
                                                    <option key={levelKey} value={levelKey}>
                                                        {academicStructure[levelKey].label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.academic_level && <span className="error-message">{errors.academic_level}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="academic_track">المسار الدراسي:</label>
                                            <select id="academic_track" name="academic_track" value={formData.academic_track} onChange={handleChange} required>
                                                <option value="">اختر المسار</option>
                                                {formData.academic_level && academicStructure[formData.academic_level]?.tracks &&
                                                    Object.keys(academicStructure[formData.academic_level].tracks).map(trackKey => (
                                                        <option key={trackKey} value={trackKey}>
                                                            {academicStructure[formData.academic_level].tracks[trackKey].label}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                            {errors.academic_track && <span className="error-message">{errors.academic_track}</span>}
                                        </div>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: معلومات ولي الأمر ومعلومات الدخول */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: معلومات ولي الأمر ومعلومات الدخول</h3>
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
                                        <div className="form-group">
                                            <label htmlFor="parent_father_phone_number">رقم هاتف الأب:</label>
                                            <input type="tel" id="parent_father_phone_number" name="parent_father_phone_number" value={formData.parent_father_phone_number} onChange={handleChange} required />
                                            {errors.parent_father_phone_number && <span className="error-message">{errors.parent_father_phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_mother_phone_number">رقم هاتف الأم (اختياري):</label>
                                            <input type="tel" id="parent_mother_phone_number" name="parent_mother_phone_number" value={formData.parent_mother_phone_number} onChange={handleChange} />
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
                                            <label htmlFor="teacher_name_for_student">اسم الأستاذ الذي تتابع معه (اختياري):</label>
                                            <select id="teacher_name_for_student" name="teacher_name_for_student" value={formData.teacher_name_for_student} onChange={handleChange}>
                                                {TEACHER_NAME_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: رفع المستندات */}
                                {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: رفع شهادة الميلاد أو البطاقة.</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة شهادة الميلاد أو البطاقة:</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" accept="image/*,.pdf" onChange={handleFileChange} required />
                                            {errors.personal_id_card && <span className="error-message">{errors.personal_id_card}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                                            {loading ? 'جاري الإرسال...' : 'طلب إنشاء حساب'}
                                        </button>
                                    </div>
                                )}
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

export default StudentRegistrationPage;
