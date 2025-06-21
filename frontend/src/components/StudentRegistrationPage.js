import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import academicStructure from '../constants/academicStructure'; // استيراد الهيكل الأكاديمي
import { ToastContext } from '../App'; // استيراد ToastContext
import LoginIllustration from '../assets/images/login_illustration.png'; // صورة توضيحية (أو صورة تسجيل الطالب)

// لم نعد نحتاج لتعريف هذه الثوابت هنا، بل سنستوردها من academicStructure.js
// const GENDER_CHOICES = [...];
// const ALL_GOVERNORATES_FOR_SELECT = [...];
// const PARENT_PROFESSION_CHOICES = [...];
// const TEACHER_NAME_CHOICES = [...];

function StudentRegistrationPage() {
    const navigate = useNavigate();
    const showGlobalToast = useContext(ToastContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
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
        user_type: 'student', // هذا يجب أن يكون ثابتًا لصفحة تسجيل الطالب
    });

    const [errors, setErrors] = useState({}); // أخطاء التحقق من الصحة في الـ Frontend
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
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
        // التحقق من القسم الأول
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.gender) currentErrors.gender = 'الجنس مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
            if (!formData.academic_level) currentErrors.academic_level = 'الصف الدراسي مطلوب';
            // academic_track اختياري في الموديل، ولكن قد يكون مطلوباً لبعض المستويات
            if (formData.academic_level && academicStructure[formData.academic_level]?.tracks && Object.keys(academicStructure[formData.academic_level].tracks).length > 0 && !formData.academic_track) {
                 currentErrors.academic_track = 'المسار الدراسي مطلوب لهذا الصف.';
            }

        } 
        // التحقق من القسم الثاني
        else if (currentSection === 2) {
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
            if (!formData.parent_father_phone_number) currentErrors.parent_father_phone_number = 'رقم هاتف الأب مطلوب';
            if (!formData.school_name) currentErrors.school_name = 'اسم المدرسة مطلوب';
            if (!formData.parent_profession) currentErrors.parent_profession = 'مهنة ولي الأمر مطلوبة';
        } 
        // التحقق من القسم الثالث
        else if (currentSection === 3) {
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
            showGlobalToast('الرجاء ملء جميع الحقول المطلوبة في هذا القسم قبل المتابعة.', 'warning');
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
        // setSuccessMessage(null); // لا نستخدم successMessage هنا لأن التوست سيتولى الأمر

        if (!validateSection()) { // التحقق من القسم الحالي
            showGlobalToast('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.', 'warning');
            setLoading(false);
            return;
        }
        
        // NEW: تصحيح الـ API Endpoint ليتطابق مع Backend
        // المسار الصحيح هو /api/register/student/
        const apiEndpoint = 'http://127.0.0.1:8000/api/register/student/'; 
        
        const dataToSend = new FormData();
        // إضافة جميع بيانات النموذج إلى FormData
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
                // التعامل مع الملفات بشكل خاص
                if (key === 'personal_id_card') {
                    if (formData[key]) {
                        dataToSend.append(key, formData[key]);
                    }
                } else if (key === 'password_confirm') {
                    // لا نرسل password_confirm إلى الـ backend
                    continue; 
                }
                else {
                    dataToSend.append(key, formData[key]);
                }
            }
        }
        // تأكد من إرسال user_type بشكل صريح
        dataToSend.append('user_type', formData.user_type); 

        try {
            const response = await axios.post(apiEndpoint, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // ضروري لرفع الملفات
                },
            });

            showGlobalToast('تم إرسال طلب حساب الطالب بنجاح. سيتم مراجعته قريباً.', 'success');
            navigate('/login'); // توجيه لصفحة تسجيل الدخول بعد النجاح

        } catch (err) {
            console.error("Registration error details:", err);
            let errorMessage = 'حدث خطأ أثناء إرسال طلب التسجيل. يرجى التحقق من البيانات والمحاولة مرة أخرى.';

            if (err.response) {
                if (err.response.data) {
                    if (err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    } else if (typeof err.response.data === 'object') {
                        // جمع كل رسائل الخطأ من الحقول المختلفة
                        const fieldErrors = Object.entries(err.response.data)
                            .map(([field, messages]) => {
                                const fieldName = {
                                    email: 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                                    'first_name': 'الاسم الأول', 'second_name': 'الاسم الثاني', 'third_name': 'الاسم الثالث',
                                    'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف', 'gender': 'الجنس',
                                    'governorate': 'المحافظة', 'parent_father_phone_number': 'رقم هاتف الأب',
                                    'parent_mother_phone_number': 'رقم هاتف الأم', 'school_name': 'اسم المدرسة',
                                    'parent_profession': 'مهنة ولي الأمر', 'teacher_name_for_student': 'اسم الأستاذ للطالب',
                                    'academic_level': 'الصف الدراسي', 'academic_track': 'المسار الدراسي',
                                    'personal_id_card': 'البطاقة الشخصية/شهادة الميلاد', 'non_field_errors': ''
                                }[field] || field;
                                return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                            })
                            .join(' | ');
                        errorMessage = `خطأ في البيانات المدخلة: ${fieldErrors}`;
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
            
            setErrors({general: errorMessage}); // عرض رسالة الخطأ العامة
            showGlobalToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const [currentSection, setCurrentSection] = useState(1); // حالة لتتبع القسم الحالي
    const totalSections = 3; // إجمالي عدد الأقسام

    // دالة مساعدة لجلب المسارات الدراسية بناءً على الصف المختار
    const getAcademicTracks = () => {
        if (!formData.academic_level) return [];
        const levelData = academicStructure[formData.academic_level];
        return levelData && levelData.tracks ? Object.keys(levelData.tracks) : [];
    };

    return (
        <div className="student-registration-page">
            {/* REMOVED: Header/Navbar is now in App.js and is handled globally. */}
            <main className="main-content">
                <section className="registration-section">
                    <div className="container registration-container">
                        <div className="registration-image-wrapper">
                            <img src={LoginIllustration} alt="Registration Illustration" className="registration-illustration" />
                            <h3 className="image-title">طلب إنشاء حساب طالب</h3>
                        </div>
                        <div className="registration-form-wrapper">
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

                            {errors.general && <div className="error-message-box">{errors.general}</div>}
                            {/* لا نستخدم successMessage هنا لأن التوست سيتولى الأمر */}

                            <form className="student-register-form" onSubmit={handleSubmit}>
                                {/* القسم الأول: معلومات شخصية وعامة */}
                                {currentSection === 1 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأول: معلومات شخصية</h3>
                                        <div className="form-group">
                                            <label htmlFor="first_name">الاسم الأول:</label>
                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                                            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="second_name">الاسم الثاني (الأب):</label>
                                            <input type="text" id="second_name" name="second_name" value={formData.second_name} onChange={handleInputChange} required />
                                            {errors.second_name && <span className="error-message">{errors.second_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="third_name">الاسم الثالث (الجد):</label>
                                            <input type="text" id="third_name" name="third_name" value={formData.third_name} onChange={handleInputChange} required />
                                            {errors.third_name && <span className="error-message">{errors.third_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">الاسم الأخير:</label>
                                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                                            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone_number">رقم الهاتف:</label>
                                            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required />
                                            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="gender">الجنس:</label>
                                            <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required>
                                                {academicStructure.genders && Object.keys(academicStructure.genders).map(key => (
                                                    <option key={key} value={key}>{academicStructure.genders[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="governorate">المحافظة:</label>
                                            <select id="governorate" name="governorate" value={formData.governorate} onChange={handleInputChange} required>
                                                <option value="">اختر المحافظة</option>
                                                {academicStructure.governorates && Object.keys(academicStructure.governorates).map(key => (
                                                    <option key={key} value={key}>{academicStructure.governorates[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.governorate && <span className="error-message">{errors.governorate}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="academic_level">الصف الدراسي:</label>
                                            <select id="academic_level" name="academic_level" value={formData.academic_level} onChange={handleInputChange} required>
                                                <option value="">اختر الصف</option>
                                                {Object.keys(academicStructure).filter(key => key.startsWith('level')).map(levelKey => (
                                                    <option key={levelKey} value={levelKey}>
                                                        {academicStructure[levelKey].label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.academic_level && <span className="error-message">{errors.academic_level}</span>}
                                        </div>
                                        {formData.academic_level && getAcademicTracks().length > 0 && (
                                            <div className="form-group">
                                                <label htmlFor="academic_track">المسار الدراسي:</label>
                                                <select id="academic_track" name="academic_track" value={formData.academic_track} onChange={handleInputChange} required>
                                                    <option value="">اختر المسار</option>
                                                    {getAcademicTracks().map(trackKey => (
                                                        <option key={trackKey} value={trackKey}>{academicStructure[formData.academic_level].tracks[trackKey].label}</option>
                                                    ))}
                                                </select>
                                                {errors.academic_track && <span className="error-message">{errors.academic_track}</span>}
                                            </div>
                                        )}
                                        <button type="button" onClick={handleNextSection} className="btn btn-primary form-nav-btn">التالي</button>
                                    </div>
                                )}

                                {/* القسم الثاني: معلومات ولي الأمر ومعلومات الدخول */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: معلومات ولي الأمر ومعلومات الدخول</h3>
                                        <div className="form-group">
                                            <label htmlFor="email">البريد الإلكتروني:</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">كلمة المرور:</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                                            {errors.password && <span className="error-message">{errors.password}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password_confirm">تأكيد كلمة المرور:</label>
                                            <input type="password" id="password_confirm" name="password_confirm" value={formData.password_confirm} onChange={handleInputChange} required />
                                            {errors.password_confirm && <span className="error-message">{errors.password_confirm}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_father_phone_number">رقم هاتف الأب:</label>
                                            <input type="tel" id="parent_father_phone_number" name="parent_father_phone_number" value={formData.parent_father_phone_number} onChange={handleInputChange} required />
                                            {errors.parent_father_phone_number && <span className="error-message">{errors.parent_father_phone_number}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_mother_phone_number">رقم هاتف الأم (اختياري):</label>
                                            <input type="tel" id="parent_mother_phone_number" name="parent_mother_phone_number" value={formData.parent_mother_phone_number} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="school_name">اسم المدرسة:</label>
                                            <input type="text" id="school_name" name="school_name" value={formData.school_name} onChange={handleInputChange} required />
                                            {errors.school_name && <span className="error-message">{errors.school_name}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="parent_profession">مهنة ولي الأمر:</label>
                                            <select id="parent_profession" name="parent_profession" value={formData.parent_profession} onChange={handleInputChange} required>
                                                <option value="">اختر المهنة</option>
                                                {academicStructure.parentProfessions && Object.keys(academicStructure.parentProfessions).map(key => (
                                                    <option key={key} value={key}>{academicStructure.parentProfessions[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.parent_profession && <span className="error-message">{errors.parent_profession}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="teacher_name_for_student">اسم الأستاذ الذي تتابع معه (اختياري):</label>
                                            <select id="teacher_name_for_student" name="teacher_name_for_student" value={formData.teacher_name_for_student} onChange={handleInputChange}>
                                                <option value="">اختر الأستاذ (اختياري)</option>
                                                {academicStructure.teacherNames && Object.keys(academicStructure.teacherNames).map(key => (
                                                    <option key={key} value={key}>{academicStructure.teacherNames[key].label}</option>
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