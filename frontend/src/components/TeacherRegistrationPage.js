import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TeacherRegistrationPage.css';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import TeacherRegIllustration from '../assets/images/teacher_illustration.png'; 

import academicStructure from '../constants/academicStructure'; 

const GENDER_CHOICES = [
    { value: '', label: 'اختر الجنس' },
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' },
];

// ****** تم تعديل كيفية بناء ALL_CATEGORIES_FOR_SELECT هنا ******
// يجب أن تتطابق قيم الـ 'value' مع المفاتيح (keys) في CATEGORY_CHOICES في Django (users/models.py)
// وليس الـ labels. لذلك، سنقوم بإنشاء خريطة بسيطة من الـ labels إلى الـ values.
// أفضل طريقة هي استيراد CATEGORY_CHOICES مباشرة من ملف constants مشترك
// ولكن بما أنك لم ترسل ملف constants منفصل بعد، سنقوم بإنشاء قائمة بناءً على القيم المتوقعة في Django.
// هذا يتطلب معرفة كيف تم تعريف CATEGORY_CHOICES في users/models.py
// بناءً على users/models.py الذي أرسلته سابقاً، المفاتيح هي:
/*
CATEGORY_CHOICES = (
    ('arabic_lang', 'اللغة العربية'),
    ('english_lang', 'اللغة الإنجليزية'),
    ('french_lang', 'اللغة الفرنسية'),
    ('german_lang', 'اللغة الألمانية'),
    ('history', 'التاريخ'),
    ('math', 'الرياضيات'),
    ('physics', 'الفيزياء'),
    ('chemistry', 'الكيمياء'),
    ('biology', 'الأحياء'),
    ('philosophy_logic', 'الفلسفة والمنطق'),
    ('religious_edu', 'التربية الدينية'),
    ('programming_cs', 'البرمجة وعلوم الحاسب'),
    ('eg_national_edu', 'EG التربية الوطنية'),
    ('vocational_edu', 'التربية المهنية'),
    ('military_edu', 'التربية العسكرية'),
    ('psychology', 'علم النفس'),
    ('geography', 'الجغرافيا'),
    ('sociology', 'علم اجتماع'),
    ('geology', 'الجيولوجيا'),
    ('applied_math', 'الرياضيات التطبيقية'),
    ('solid_geometry', 'الهندسة الفراغية'),
    ('statistics', 'الإحصاء'),
    ('environmental_science', 'علوم البيئة'),
    ('economy', 'الاقتصاد'),
    ('philosophy', 'فلسفة'),
    ('logic', 'منطق'),
    ('civics', 'المواطنة'),
)
*/
// سنقوم بإنشاء هذه القائمة يدوياً هنا لتطابقها:
const TEACHER_CATEGORY_CHOICES = [
    { value: '', label: 'اختر التخصص/المادة' },
    { value: 'arabic_lang', label: 'اللغة العربية' },
    { value: 'english_lang', label: 'اللغة الإنجليزية' },
    { value: 'french_lang', label: 'اللغة الفرنسية' },
    { value: 'german_lang', label: 'اللغة الألمانية' },
    { value: 'history', label: 'التاريخ' },
    { value: 'math', label: 'الرياضيات' },
    { value: 'physics', label: 'الفيزياء' },
    { value: 'chemistry', label: 'الكيمياء' },
    { value: 'biology', label: 'الأحياء' },
    { value: 'philosophy_logic', label: 'الفلسفة والمنطق' },
    { value: 'religious_edu', label: 'التربية الدينية' },
    { value: 'programming_cs', label: 'البرمجة وعلوم الحاسب' },
    { value: 'eg_national_edu', label: 'EG التربية الوطنية' },
    { value: 'vocational_edu', label: 'التربية المهنية' },
    { value: 'military_edu', label: 'التربية العسكرية' },
    { value: 'psychology', label: 'علم النفس' },
    { value: 'geography', label: 'الجغرافيا' },
    { value: 'sociology', label: 'علم اجتماع' },
    { value: 'geology', label: 'الجيولوجيا' },
    { value: 'applied_math', label: 'الرياضيات التطبيقية' },
    { value: 'solid_geometry', label: 'الهندسة الفراغية' },
    { value: 'statistics', label: 'الإحصاء' },
    { value: 'environmental_science', label: 'علوم البيئة' },
    { value: 'economy', label: 'الاقتصاد' },
    { value: 'philosophy', label: 'فلسفة' },
    { value: 'logic', label: 'منطق' },
    { value: 'civics', label: 'المواطنة' },
];


const ALL_GOVERNORATES_FOR_SELECT = [
    { value: '', label: 'اختر المحافظة' },
    // هذا الجزء تم نسخه من users/models.py
    { value: 'cairo', label: 'القاهرة' }, { value: 'alexandria', 'label': 'الإسكندرية' }, { value: 'giza', 'label': 'الجيزة' }, { value: 'qalyubia', 'label': 'القليوبية' },
    { value: 'sharqia', 'label': 'الشرقية' }, { value: 'monufia', 'label': 'المنوفية' }, { value: 'beheira', 'label': 'البحيرة' }, { value: 'gharbia', 'label': 'الغربية' },
    { value: 'kafr_el_sheikh', 'label': 'كفر الشيخ' }, { value: 'fayoum', 'label': 'الفيوم' }, { value: 'beni_suef', 'label': 'بني سويف' }, { value: 'minya', 'label': 'المنيا' },
    { value: 'assiut', 'label': 'أسيوط' }, { value: 'sohag', 'label': 'سوهاج' }, { value: 'qena', 'label': 'قنا' }, { value: 'luxor', 'label': 'الأقصر' },
    { value: 'aswan', 'label': 'أسوان' }, { value: 'red_sea', 'label': 'البحر الأحمر' }, { value: 'new_valley', 'label': 'الوادي الجديد' }, { value: 'matrouh', 'label': 'مطروح' },
    { value: 'north_sinai', 'label': 'شمال سيناء' }, { value: 'south_sinai', 'label': 'جنوب سيناء' }, { value: 'suez', 'label': 'السويس' },
    { value: 'ismailia', 'label': 'الإسماعيلية' }, { value: 'port_said', 'label': 'بورسعيد' }, { value: 'damietta', 'label': 'دمياط' },
];


function TeacherRegistrationPage() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirm: '',
        user_type: 'teacher',
        gender: '',
        phone_number: '',
        governorate: '', // تم إضافة حقل المحافظة هنا
        qualifications: '',
        experience: '',
        category_type: '',
        what_will_you_add: '',
        personal_id_card: null,
        cv_file: null,
    });

    const [currentSection, setCurrentSection] = useState(1);
    const totalSections = 3;
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const validateSection = () => {
        let currentErrors = {};
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب'; // الجنس مطلوب
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة'; // المحافظة مطلوبة الآن
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
        } else if (currentSection === 2) {
            if (!formData.qualifications) currentErrors.qualifications = 'المؤهلات مطلوبة';
            if (!formData.experience) currentErrors.experience = 'الخبرة مطلوبة';
            if (!formData.category_type) currentErrors.category_type = 'التخصص مطلوب';
            if (!formData.what_will_you_add) currentErrors.what_will_you_add = 'ماذا ستضيف مطلوب';
        } else if (currentSection === 3) {
            // يمكن جعل personal_id_card أو cv_file مطلوبين هنا إذا أردت
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
        if (!validateSection()) {
            alert('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.');
            return;
        }

        const apiEndpoint = 'http://127.0.0.1:8000/api/users/account-requests/create/';
        const dataToSend = new FormData();

        for (const key in formData) {
            // *** تم حذف 'password_confirm' من الاستثناء هنا ***
            // يجب أن يتم إرسالها إلى الـ Backend ليتم التحقق من مطابقتها
            if (formData[key] !== null && formData[key] !== '' && key !== 'personal_id_card' && key !== 'cv_file') {
                 dataToSend.append(key, formData[key]);
            }
        }

        if (formData.personal_id_card) {
            dataToSend.append('personal_id_card', formData.personal_id_card);
        }
        if (formData.cv_file) {
            dataToSend.append('cv_file', formData.cv_file);
        }
        dataToSend.append('user_type', 'teacher');

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend,
            });

            const responseData = await response.json();

            if (response.ok) {
                alert(responseData.message || 'تم إرسال طلب إنشاء حساب الأستاذ بنجاح. سيتم مراجعته قريباً.');
                setFormData({ // إعادة تعيين النموذج
                    first_name: '', last_name: '', email: '', password: '', password_confirm: '',
                    user_type: 'teacher', gender: '', phone_number: '', governorate: '',
                    qualifications: '', experience: '', category_type: '', what_will_you_add: '',
                    personal_id_card: null, cv_file: null,
                });
                setCurrentSection(1);
                setErrors({});
            } else {
                let errorMessage = 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
                if (responseData) {
                    const apiErrors = Object.entries(responseData).map(([key, value]) => {
                        const fieldName = {
                            'first_name': 'الاسم الأول', 'last_name': 'الاسم الأخير', 'email': 'البريد الإلكتروني',
                            'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور', 'user_type': 'نوع المستخدم',
                            'gender': 'الجنس', 'phone_number': 'رقم الهاتف', 'governorate': 'المحافظة',
                            'qualifications': 'المؤهلات', 'experience': 'الخبرة', 'category_type': 'التخصص',
                            'what_will_you_add': 'ماذا ستضيف', 'personal_id_card': 'البطاقة الشخصية', 'cv_file': 'ملف السيرة الذاتية',
                            'non_field_errors': ''
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
        <div className="teacher-register-page">
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
                            <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد (طالب)</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="teacher-register-section">
                    <div className="container teacher-register-container">
                        <div className="teacher-register-image-wrapper">
                            <img src={TeacherRegIllustration} alt="طلب إنشاء حساب أستاذ" className="teacher-illustration-img" />
                            <h3 className="image-title">طلب إنشاء حساب أستاذ</h3>
                        </div>
                        <div className="teacher-register-form-wrapper">
                            <h2>طلب إنشاء حساب أستاذ</h2>

                            {/* أزرار الأقسام */}
                            <div className="teacher-form-sections-nav">
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

                            <form className="teacher-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات شخصية ومعلومات الدخول */}
                                {currentSection === 1 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأول: معلومات شخصية</h3>
                                        <div className="form-group">
                                            <label htmlFor="first_name">الاسم الأول:</label>
                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
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

                                        {/* *** تم إضافة حقل المحافظة هنا *** */}
                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required> {/* جعلتها مطلوبة هنا */}
                                                {ALL_GOVERNORATES_FOR_SELECT.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.governorate && <span className="error-message">{errors.governorate}</span>}
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

                                {/* القسم الثاني: المؤهلات والخبرة والتخصص والمساهمة */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: المؤهلات والخبرة</h3>
                                        <div className="form-group">
                                            <label htmlFor="qualifications">المؤهلات:</label>
                                            <textarea id="qualifications" name="qualifications" value={formData.qualifications} onChange={handleChange} required></textarea>
                                            {errors.qualifications && <span className="error-message">{errors.qualifications}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="experience">الخبرة:</label>
                                            <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} required></textarea>
                                            {errors.experience && <span className="error-message">{errors.experience}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="category_type">الفئة المطلوبة (التخصص/المادة):</label>
                                            <select id="category_type" name="category_type" value={formData.category_type} onChange={handleChange} required>
                                                {TEACHER_CATEGORY_CHOICES.map(option => ( // *** استخدام القائمة الصحيحة للتخصصات ***
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.category_type && <span className="error-message">{errors.category_type}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="what_will_you_add">ما الذي ستضيفه لمنصة تفاهم؟</label>
                                            <textarea id="what_will_you_add" name="what_will_you_add" value={formData.what_will_you_add} onChange={handleChange} required></textarea>
                                            {errors.what_will_you_add && <span className="error-message">{errors.what_will_you_add}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: رفع المستندات */}
                                {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: المستندات</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية (اختياري):</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" onChange={handleChange} />
                                            {errors.personal_id_card && <span className="error-message">{errors.personal_id_card}</span>}
                                            <button type="button" className="btn upload-btn">رفع</button>
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="cv_file">ملف السيرة الذاتية (CV) (اختياري):</label>
                                            <input type="file" id="cv_file" name="cv_file" onChange={handleChange} />
                                            {errors.cv_file && <span className="error-message">{errors.cv_file}</span>}
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

export default TeacherRegistrationPage;