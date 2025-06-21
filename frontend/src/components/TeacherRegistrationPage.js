import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import academicStructure from '../constants/academicStructure'; // استيراد الهيكل الأكاديمي
import { ToastContext } from '../App'; // استيراد ToastContext
import LoginIllustration from '../assets/images/login_illustration.png'; // صورة توضيحية لصفحة تسجيل الدخول (استخدمتها كبديل لـ RegisterTeacherIllustration)


function TeacherRegistrationPage() {
    const navigate = useNavigate();
    const showGlobalToast = useContext(ToastContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
        user_type: 'teacher', // نوع المستخدم ثابت هنا
        first_name: '',
        last_name: '',
        phone_number: '',
        gender: '',
        governorate: '',
        qualifications: '',
        experience: '',
        category_type: '', // هذا يرسل كـ specialized_subject للـ Backend
        what_will_you_add: '',
        personal_id_card: null, // File
        cv_file: null, // File
        instagram_link: '',
        facebook_link: '',
        website_link: '',
    });

    const [currentSection, setCurrentSection] = useState(1);
    const totalSections = 3;
    const [errors, setErrors] = useState({}); // لتخزين أخطاء التحقق من الصحة للحقول
    const [loading, setLoading] = useState(false);
    // const [successMessage, setSuccessMessage] = useState(null); // لم نعد نستخدمها بشكل مباشر، التوست يتولى الأمر

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // مسح خطأ الحقل المحدد عند تغييره
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // دالة مخصصة لـ handleFileChange (لضمان تخزين الملف الفعلي)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData(prevData => ({
                ...prevData,
                [name]: files[0] // تخزين الملف الفعلي (files[0])
            }));
            if (errors[name]) { // مسح خطأ الحقل عند اختيار ملف
                setErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        } else {
            setFormData(prevData => ({ // مسح الملف من formData إذا لم يتم اختيار شيء
                ...prevData,
                [name]: null
            }));
        }
    };


    const validateSection = () => {
        let currentErrors = {};
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
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
            // قم بتعيين 'required' في JSX إذا كان الحقل مطلوباً
            if (!formData.personal_id_card) currentErrors.personal_id_card = 'صورة البطاقة الشخصية مطلوبة';
            // if (!formData.cv_file) currentErrors.cv_file = 'ملف السيرة الذاتية مطلوب'; // إذا كان مطلوباً
        }

        setErrors(currentErrors); 
        return Object.keys(currentErrors).length === 0; 
    };


    const handleNextSection = () => {
        if (validateSection()) {
            if (currentSection < totalSections) {
                setCurrentSection(currentSection + 1);
                setErrors({}); 
            }
        } else {
            showGlobalToast('الرجاء ملء جميع الحقول المطلوبة في هذا القسم قبل المتابعة.', 'warning');
        }
    };

    const handlePrevSection = () => {
        if (currentSection > 1) {
            setCurrentSection(currentSection - 1);
            setErrors({}); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); 
        // setSuccessMessage(null);

        if (!validateSection()) { 
            showGlobalToast('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.', 'warning');
            setLoading(false);
            return;
        }
        
        // NEW: تصحيح الـ API Endpoint ليتطابق مع Backend
        // المسار الصحيح هو /api/register/teacher/
        const apiEndpoint = 'http://127.0.0.1:8000/api/register/teacher/'; 
        
        const dataToSend = new FormData();
        for (const key in formData) {
            // التعامل مع حقول الملفات بشكل خاص
            if (key === 'personal_id_card' || key === 'cv_file') {
                if (formData[key] instanceof File) { 
                    dataToSend.append(key, formData[key]);
                }
            } 
            // إرسال category_type كـ specialized_subject إلى الـ Backend
            else if (key === 'category_type') {
                dataToSend.append('specialized_subject', formData.category_type);
            }
            // لا نرسل password_confirm إلى الـ backend
            else if (key === 'password_confirm') {
                continue;
            }
            // إرسال البيانات الأخرى غير الفارغة أو null
            else if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
                dataToSend.append(key, formData[key]);
            }
        }
        // التأكد من إرسال user_type بشكل صريح (مهم جداً للـ Backend)
        dataToSend.append('user_type', formData.user_type);

        try {
            // هنا نستخدم axios.post مع FormData مباشرة
            const response = await axios.post(apiEndpoint, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ضروري لرفع الملفات
                },
            });

            showGlobalToast('تم إرسال طلب حساب الأستاذ بنجاح. سيتم مراجعته قريباً.', 'success');
            navigate('/login'); 

        } catch (err) {
            console.error("Registration error details:", err);
            let errorMessage = 'حدث خطأ أثناء إرسال طلب التسجيل. يرجى التحقق من البيانات والمحاولة مرة أخرى.';

            if (err.response) {
                if (err.response.data) {
                    if (err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    } else if (typeof err.response.data === 'object') {
                        const fieldErrors = Object.entries(err.response.data)
                            .map(([field, messages]) => {
                                const fieldName = {
                                    email: 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                                    'first_name': 'الاسم الأول', 'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف',
                                    'gender': 'الجنس', 'governorate': 'المحافظة',
                                    'qualifications': 'المؤهلات', 'experience': 'الخبرة', 'category_type': 'التخصص',
                                    'what_will_you_add': 'ماذا ستضيف', 'personal_id_card': 'البطاقة الشخصية', 'cv_file': 'ملف السيرة الذاتية',
                                    'non_field_errors': ''
                                }[field] || field;
                                return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                            })
                            .join(' | ');
                        errorMessage = `خطأ في البيانات المدخلة:\n${fieldErrors}`; // عرض الأخطاء في سطر جديد
                    } else {
                        errorMessage = 'فشل التسجيل. استجابة غير متوقعة من الخادم.';
                    }
                } else {
                    errorMessage = `خطأ في الخادم (الحالة: ${err.response.status}). يرجى المحاولة لاحقاً.`;
                }
            } else if (err.request) {
                errorMessage = 'لا يوجد استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت.';
            } else {
                errorMessage = 'حدث خطأ غير متوقع أثناء إرسال الطلب.';
            }
            
            setErrors({general: errorMessage}); 
            showGlobalToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="teacher-register-page">
            {/* REMOVED: Header/Navbar is now in App.js */}
            <main className="main-content">
                <section className="registration-section">
                    <div className="container registration-container">
                        <div className="registration-image-wrapper">
                            <img src={LoginIllustration} alt="Registration Illustration" className="registration-illustration" /> {/* استخدام LoginIllustration إذا كان هذا هو الشائع */}
                            <h3 className="image-title">طلب إنشاء حساب أستاذ</h3>
                        </div>
                        <div className="registration-form-wrapper">
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

                            {errors.general && <div className="error-message-box">{errors.general}</div>}
                            {/* لا نستخدم successMessage هنا لأن التوست سيتولى الأمر */}

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
                                                <option value="">اختر الجنس</option>
                                                {academicStructure.genders && Object.keys(academicStructure.genders).map(key => (
                                                    <option key={key} value={key}>{academicStructure.genders[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleChange} required>
                                                <option value="">اختر المحافظة</option>
                                                {academicStructure.governorates && Object.keys(academicStructure.governorates).map(key => (
                                                    <option key={key} value={key}>{academicStructure.governorates[key].label}</option>
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
                                            <label htmlFor="category_type">المادة المتخصصة (التخصص):</label>
                                            <select id="category_type" name="category_type" value={formData.category_type} onChange={handleChange} required>
                                                <option value="">اختر التخصص/المادة</option>
                                                {academicStructure.allSubjectsMap && Object.keys(academicStructure.allSubjectsMap).map(key => (
                                                    <option key={key} value={key}>{academicStructure.allSubjectsMap[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.category_type && <span className="error-message">{errors.category_type}</span>}
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

                                {/* القسم الأخير: رفع المستندات */}
                                {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: المستندات</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية (صورة من الأمام والخلف):</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" accept="image/*" onChange={handleFileChange} required />
                                            {errors.personal_id_card && <span className="error-message">{errors.personal_id_card}</span>}
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="cv_file">ملف السيرة الذاتية (CV) (اختياري):</label>
                                            <input type="file" id="cv_file" name="cv_file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                            {errors.cv_file && <span className="error-message">{errors.cv_file}</span>}
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                                            {loading ? 'جاري الإرسال...' : 'تقديم طلب الانضمام!'}
                                        </button>
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

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default TeacherRegistrationPage;