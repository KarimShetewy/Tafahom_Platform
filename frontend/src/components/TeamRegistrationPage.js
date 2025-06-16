import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TeamRegistrationPage.css'; // لتطبيق التنسيقات الخاصة بالصفحة
import TafahomLogo from '../assets/images/tafahom_logo.png';
import TeamRegIllustration from '../assets/images/join_us_illustration.png'; // استخدم نفس صورة الانضمام للفريق أو صورة جديدة

// خيارات الوظيفة كما في الـ Backend models
const JOB_POSITION_CHOICES = [
    { value: '', label: 'اختر الوظيفة' },
    { value: 'it_specialist', label: 'IT Specialist' },
    { value: 'developer', label: 'Developer' },
    { value: 'videographer_editor', label: 'Videographer/Editor' },
    { value: 'social_media_specialist', label: 'Social Media Specialist' },
    { value: 'print_designer', label: 'Print Designer' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'arabic_english_translator', label: 'مترجم عربي/إنجليزي' },
    { value: 'accountant', label: 'محاسب' },
    { value: 'story_teller', label: 'راوي قصص' },
    { value: 'content_creator', label: 'صانع محتوى' },
    { value: 'sales_admin_assistant', label: 'مساعد مبيعات/إدارة' },
    { value: 'other', label: 'أخرى' },
];

// خيارات المحافظات المصرية (نفس الموجودة في StudentRegistrationPage)
const GOVERNORATE_CHOICES = [
    { value: '', label: 'اختر المحافظة' },
    { value: 'cairo', label: 'القاهرة' },
    { value: 'alexandria', label: 'الإسكندرية' },
    // ... أضف كل المحافظات
    { value: 'ismailia', label: 'الإسماعيلية' },
    { value: 'suez', label: 'السويس' },
    { value: 'port_said', label: 'بورسعيد' },
    { value: 'damietta', label: 'دمياط' },
    // لتوفير الكود بشكل كامل، يمكنك نسخ باقي المحافظات من كود StudentRegistrationPage.js
    { value: 'giza', label: 'الجيزة' }, { value: 'qalyubia', label: 'القليوبية' },
    { value: 'sharqia', label: 'الشرقية' }, { value: 'monufia', label: 'المنوفية' },
    { value: 'beheira', label: 'البحيرة' }, { value: 'gharbia', label: 'الغربية' },
    { value: 'kafr_el_sheikh', label: 'كفر الشيخ' }, { value: 'fayoum', label: 'الفيوم' },
    { value: 'beni_suef', label: 'بني سويف' }, { value: 'minya', label: 'المنيا' },
    { value: 'assiut', label: 'أسيوط' }, { value: 'sohag', label: 'سوهاج' },
    { value: 'qena', label: 'قنا' }, { value: 'luxor', label: 'الأقصر' },
    { value: 'aswan', label: 'أسوان' }, { value: 'red_sea', label: 'البحر الأحمر' },
    { value: 'new_valley', label: 'الوادي الجديد' }, { value: 'matrouh', label: 'مطروح' },
    { value: 'north_sinai', label: 'شمال سيناء' }, { value: 'south_sinai', label: 'جنوب سيناء' },
];


function TeamRegistrationPage() {
    const [formData, setFormData] = useState({
        job_position: '',
        first_name: '',
        second_name: '',
        third_name: '',
        last_name: '',
        phone_number: '',
        expected_salary: '',
        what_will_you_add: '',
        governorate: '',
        address: '',
        email: '',
        password: '',
        password_confirm: '',
        previous_work_experience: '',
        personal_id_card: null,
        cv_file: null,
        instagram_link: '',
        facebook_link: '',
        website_link: '',
        user_type: 'team_member', // دايماً 'team_member' لهذه الفورم
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3; // مثلاً: معلومات شخصية، خبرة/تواصل، مستندات/تأكيد
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const validateStep = () => {
        let currentErrors = {};
        // Add validation logic for each step here
        if (currentStep === 1) {
            if (!formData.job_position) currentErrors.job_position = 'الوظيفة مطلوبة';
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
        } else if (currentStep === 2) {
            if (!formData.expected_salary) currentErrors.expected_salary = 'الراتب المتوقع مطلوب';
            if (!formData.what_will_you_add) currentErrors.what_will_you_add = 'ماذا ستضيف مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
            if (!formData.address) currentErrors.address = 'العنوان مطلوب';
            if (!formData.previous_work_experience) currentErrors.previous_work_experience = 'الخبرة السابقة مطلوبة';
        } else if (currentStep === 3) {
            // Optional: make files required if needed for submission
            // if (!formData.personal_id_card) currentErrors.personal_id_card = 'صورة البطاقة مطلوبة';
            // if (!formData.cv_file) currentErrors.cv_file = 'ملف السيرة الذاتية مطلوب';
        }

        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };


    const handleNextStep = () => {
        if (validateStep()) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            alert('الرجاء ملء جميع الحقول المطلوبة في هذا القسم قبل المتابعة.');
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) {
            alert('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.');
            return;
        }

        const apiEndpoint = 'http://127.0.0.1:8000/api/users/account-requests/create/';
        const dataToSend = new FormData();

        for (const key in formData) {
            if (formData[key] !== null && key !== 'personal_id_card' && key !== 'cv_file') {
                dataToSend.append(key, formData[key]);
            }
        }

        if (formData.personal_id_card) {
            dataToSend.append('personal_id_card', formData.personal_id_card);
        }
        if (formData.cv_file) {
            dataToSend.append('cv_file', formData.cv_file);
        }
        dataToSend.append('user_type', 'team_member'); // تأكيد user_type

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend,
            });

            const responseData = await response.json();

            if (response.ok) {
                alert(responseData.message || 'تم إرسال طلب الانضمام للفريق بنجاح. سيتم مراجعته قريباً.');
                setFormData({ // إعادة تعيين النموذج
                    job_position: '', first_name: '', second_name: '', third_name: '', last_name: '',
                    phone_number: '', expected_salary: '', what_will_you_add: '', governorate: '',
                    address: '', email: '', password: '', password_confirm: '',
                    previous_work_experience: '', personal_id_card: null, cv_file: null,
                    instagram_link: '', facebook_link: '', website_link: '', user_type: 'team_member',
                });
                setCurrentStep(1);
                setErrors({});
            } else {
                let errorMessage = 'حدث خطأ ما. يرجى المحاولة مرة أخرى.';
                if (responseData) {
                    const apiErrors = Object.entries(responseData).map(([key, value]) => {
                        const fieldName = {
                            'job_position': 'الوظيفة', 'first_name': 'الاسم الأول', 'second_name': 'الاسم الثاني', 'third_name': 'الاسم الثالث',
                            'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف', 'expected_salary': 'الراتب المتوقع',
                            'what_will_you_add': 'ماذا ستضيف', 'governorate': 'المحافظة', 'address': 'العنوان',
                            'email': 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                            'previous_work_experience': 'خبرة العمل السابقة', 'personal_id_card': 'البطاقة الشخصية', 'cv_file': 'السيرة الذاتية',
                            'instagram_link': 'رابط انستجرام', 'facebook_link': 'رابط فيسبوك', 'website_link': 'الموقع الإلكتروني',
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
        <div className="team-register-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" />
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
                <section className="team-register-section">
                    <div className="container team-register-container">
                        <div className="team-register-image-wrapper">
                            <img src={TeamRegIllustration} alt="انضم إلى فريق تفاهم" className="team-illustration-img" />
                            <h3 className="image-title">انضم إلى فريق تفاهم</h3>
                        </div>
                        <div className="team-register-form-wrapper">
                            <h2>طلب الانضمام لفريق العمل</h2>

                            {/* أزرار الأقسام */}
                            <div className="team-form-sections-nav">
                                <button type="button" onClick={() => setCurrentStep(1)} className={`section-nav-button ${currentStep === 1 ? 'active' : ''}`}>
                                    القسم الأول
                                </button>
                                <button type="button" onClick={() => setCurrentStep(2)} className={`section-nav-button ${currentStep === 2 ? 'active' : ''}`}>
                                    القسم الثاني
                                </button>
                                <button type="button" onClick={() => setCurrentStep(3)} className={`section-nav-button ${currentStep === 3 ? 'active' : ''}`}>
                                    القسم الأخير
                                </button>
                            </div>

                            <form className="team-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات شخصية ووظيفة */}
                                {currentStep === 1 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأول: معلومات شخصية ووظيفية</h3>
                                        <div className="form-group">
                                            <label htmlFor="job_position">الوظيفة المطلوبة:</label>
                                            <select id="job_position" name="job_position" value={formData.job_position} onChange={handleChange} required>
                                                {JOB_POSITION_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.job_position && <span className="error-message">{errors.job_position}</span>}
                                        </div>
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
                                            <label htmlFor="phone_number">رقم الهاتف:</label>
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
                                        <button type="button" onClick={handleNextStep} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: تفاصيل الخبرة والتواصل */}
                                {currentStep === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: الخبرة والتواصل</h3>
                                        <div className="form-group">
                                            <label htmlFor="expected_salary">الراتب المتوقع:</label>
                                            <input type="number" id="expected_salary" name="expected_salary" value={formData.expected_salary} onChange={handleChange} required />
                                            {errors.expected_salary && <span className="error-message">{errors.expected_salary}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="what_will_you_add">ماذا ستضيف لمنصة تفاهم؟</label>
                                            <textarea id="what_will_you_add" name="what_will_you_add" value={formData.what_will_you_add} onChange={handleChange} required></textarea>
                                            {errors.what_will_you_add && <span className="error-message">{errors.what_will_you_add}</span>}
                                        </div>
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
                                            <label htmlFor="address">العنوان بالتفصيل:</label>
                                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea>
                                            {errors.address && <span className="error-message">{errors.address}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="previous_work_experience">هل يوجد لديك خبرة عمل سابقة؟ ولو يوجد فما هي؟</label>
                                            <textarea id="previous_work_experience" name="previous_work_experience" value={formData.previous_work_experience} onChange={handleChange}></textarea>
                                            {errors.previous_work_experience && <span className="error-message">{errors.previous_work_experience}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevStep} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextStep} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: رفع المستندات وروابط التواصل الاجتماعي */}
                                {currentStep === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: المستندات وروابط التواصل</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية:</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" onChange={handleChange} />
                                            {errors.personal_id_card && <span className="error-message">{errors.personal_id_card}</span>}
                                            <button type="button" className="btn upload-btn">رفع</button>
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="cv_file">ملف السيرة الذاتية (CV):</label>
                                            <input type="file" id="cv_file" name="cv_file" onChange={handleChange} />
                                            {errors.cv_file && <span className="error-message">{errors.cv_file}</span>}
                                            <button type="button" className="btn upload-btn">رفع</button>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="instagram_link">رابط صفحة الانستجرام (اختياري):</label>
                                            <input type="url" id="instagram_link" name="instagram_link" value={formData.instagram_link} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="facebook_link">رابط صفحة الفيسبوك (اختياري):</label>
                                            <input type="url" id="facebook_link" name="facebook_link" value={formData.facebook_link} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="website_link">موقعك الالكتروني (اختياري):</label>
                                            <input type="url" id="website_link" name="website_link" value={formData.website_link} onChange={handleChange} />
                                        </div>
                                        <button type="button" onClick={handlePrevStep} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" className="btn btn-primary submit-btn">تقديم طلب الانضمام!</button>
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

export default TeamRegistrationPage;