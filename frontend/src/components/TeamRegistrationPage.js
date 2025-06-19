import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TeamRegistrationPage.css';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import RegisterTeamIllustration from '../assets/images/team_illustration.png'; // تأكد من مسار الصورة
import academicStructure from '../constants/academicStructure'; // للحقول المشتركة

// استيراد خيارات ثابتة من users.models
const JOB_POSITION_CHOICES = [
    { value: '', label: 'اختر الوظيفة المطلوبة' },
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

const GENDER_CHOICES = [
    { value: '', label: 'اختر الجنس' },
    { value: 'male', label: 'ذكر' },
    { value: 'female', label: 'أنثى' },
];


function TeamRegistrationPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
        user_type: 'team_member', // نوع المستخدم ثابت هنا
        first_name: '',
        last_name: '',
        phone_number: '',
        gender: '',
        governorate: '',
        job_position: '',
        expected_salary: '',
        address: '',
        previous_work_experience: '',
        what_will_you_add: '',
        instagram_link: '',
        facebook_link: '',
        website_link: '',
        personal_id_card: null,
        cv_file: null,
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
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
        } else if (currentSection === 2) {
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
            if (!formData.job_position) currentErrors.job_position = 'الوظيفة مطلوبة';
            if (!formData.expected_salary) currentErrors.expected_salary = 'الراتب المتوقع مطلوب';
            if (!formData.address) currentErrors.address = 'العنوان مطلوب';
            if (!formData.previous_work_experience) currentErrors.previous_work_experience = 'خبرة العمل السابقة مطلوبة';
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
        setLoading(true);
        setErrors({});
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
            if (key === 'personal_id_card' || key === 'cv_file') {
                if (formData[key]) {
                    dataToSend.append(key, formData[key]);
                }
            } else if (formData[key] !== null && formData[key] !== '') {
                dataToSend.append(key, formData[key]);
            }
        }
        dataToSend.append('user_type', formData.user_type);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                body: dataToSend,
            });

            const responseData = await response.json();

            if (response.ok) {
                setSuccessMessage(responseData.message || 'تم إرسال طلب الانضمام بنجاح. سيتم مراجعته قريباً.');
                setFormData({ // إعادة تعيين النموذج
                    email: '', password: '', password_confirm: '', user_type: 'team_member',
                    first_name: '', last_name: '', phone_number: '', gender: '', governorate: '',
                    job_position: '', expected_salary: '', address: '', previous_work_experience: '',
                    what_will_you_add: '', instagram_link: '', facebook_link: '', website_link: '',
                    personal_id_card: null, cv_file: null,
                });
                setCurrentSection(1);
                setErrors({});
            } else {
                let errorMessage = 'فشل إرسال طلب الانضمام. يرجى التحقق من البيانات.';
                if (responseData) {
                    const apiErrors = Object.entries(responseData).map(([key, value]) => {
                        const fieldName = {
                            'email': 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                            'first_name': 'الاسم الأول', 'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف',
                            'gender': 'الجنس', 'governorate': 'المحافظة', 'job_position': 'الوظيفة المطلوبة',
                            'expected_salary': 'الراتب المتوقع', 'address': 'العنوان', 'previous_work_experience': 'خبرة العمل السابقة',
                            'what_will_you_add': 'ماذا ستضيف', 'personal_id_card': 'البطاقة الشخصية', 'cv_file': 'ملف السيرة الذاتية',
                            'non_field_errors': ''
                        }[key] || key;
                        return `${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}`;
                    }).join('\n');
                    errorMessage = `فشل إرسال الطلب:\n${apiErrors}`;
                }
                setErrors({general: errorMessage});
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
        <div className="team-registration-page">
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
                <section className="team-register-section">
                    <div className="container team-register-container">
                        <div className="team-register-image-wrapper">
                            <img src={RegisterTeamIllustration} alt="طلب انضمام فريق" className="team-illustration-img" />
                            <h3 className="image-title">طلب انضمام فريق تفاهم</h3>
                        </div>
                        <div className="team-register-form-wrapper">
                            <h2>طلب انضمام فريق تفاهم</h2>
                            
                            {/* أزرار الأقسام */}
                            <div className="team-form-sections-nav">
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

                            {errors.general && <div className="error-message-box">{errors.general}</div>}
                            {successMessage && <div className="success-message-box">{successMessage}</div>}

                            <form className="team-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات شخصية */}
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
                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required>
                                                {ALL_GOVERNORATES_FOR_SELECT.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.governorate && <span className="error-message">{errors.governorate}</span>}
                                        </div>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: معلومات الوظيفة والدخول */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: معلومات الوظيفة والدخول</h3>
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
                                            <label htmlFor="job_position">الوظيفة المطلوبة:</label>
                                            <select id="job_position" name="job_position" value={formData.job_position} onChange={handleChange} required>
                                                {JOB_POSITION_CHOICES.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {errors.job_position && <span className="error-message">{errors.job_position}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="expected_salary">الراتب المتوقع:</label>
                                            <input type="number" id="expected_salary" name="expected_salary" value={formData.expected_salary} onChange={handleChange} required />
                                            {errors.expected_salary && <span className="error-message">{errors.expected_salary}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">العنوان بالتفصيل:</label>
                                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea>
                                            {errors.address && <span className="error-message">{errors.address}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="previous_work_experience">خبرة العمل السابقة:</label>
                                            <textarea id="previous_work_experience" name="previous_work_experience" value={formData.previous_work_experience} onChange={handleChange} required></textarea>
                                            {errors.previous_work_experience && <span className="error-message">{errors.previous_work_experience}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="what_will_you_add">ما الذي ستضيفه للمنصة؟</label>
                                            <textarea id="what_will_you_add" name="what_will_you_add" value={formData.what_will_you_add} onChange={handleChange} required></textarea>
                                            {errors.what_will_you_add && <span className="error-message">{errors.what_will_you_add}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الأخير: روابط التواصل الاجتماعي والمستندات */}
                                {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: المستندات وروابط التواصل</h3>
                                        <div className="form-group">
                                            <label htmlFor="instagram_link">رابط صفحة الانستجرام (اختياري):</label>
                                            <input type="url" id="instagram_link" name="instagram_link" value={formData.instagram_link} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="facebook_link">رابط صفحة الفيسبوك (اختياري):</label>
                                            <input type="url" id="facebook_link" name="facebook_link" value={formData.facebook_link} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="website_link">موقعك الإلكتروني (اختياري):</label>
                                            <input type="url" id="website_link" name="website_link" value={formData.website_link} onChange={handleChange} />
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية (اختياري):</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" onChange={handleFileChange} />
                                            <button type="button" className="btn upload-btn">رفع</button>
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="cv_file">ملف السيرة الذاتية (CV) (اختياري):</label>
                                            <input type="file" id="cv_file" name="cv_file" onChange={handleFileChange} />
                                            <button type="button" className="btn upload-btn">رفع</button>
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

export default TeamRegistrationPage;
