import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import academicStructure from '../constants/academicStructure'; 
import { ToastContext } from '../App';
import LoginIllustration from '../assets/images/login_illustration.png'; 


function TeamRegistrationPage() {
    const navigate = useNavigate();
    const showGlobalToast = useContext(ToastContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        job_position: '',
        expected_salary: '',
        what_will_you_add: '',
        governorate: '',
        address: '',
        previous_work_experience: '',
        user_type: 'team_member', 
    });

    const [currentSection, setCurrentSection] = useState(1);
    const totalSections = 2; 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (errors[name]) { 
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateSection = () => {
        let currentErrors = {};
        if (currentSection === 1) {
            if (!formData.first_name) currentErrors.first_name = 'الاسم الأول مطلوب';
            if (!formData.last_name) currentErrors.last_name = 'الاسم الأخير مطلوب';
            if (!formData.phone_number) currentErrors.phone_number = 'رقم الهاتف مطلوب';
            if (!formData.governorate) currentErrors.governorate = 'المحافظة مطلوبة';
            if (!formData.address) currentErrors.address = 'العنوان مطلوب';
            if (!formData.email) currentErrors.email = 'البريد الإلكتروني مطلوب';
            if (!formData.password) currentErrors.password = 'كلمة المرور مطلوبة';
            if (!formData.password_confirm) currentErrors.password_confirm = 'تأكيد كلمة المرور مطلوب';
            if (formData.password && formData.password_confirm && formData.password !== formData.password_confirm) {
                currentErrors.password_confirm = 'كلمتا المرور غير متطابقتين';
            }
        } else if (currentSection === 2) {
            if (!formData.job_position) currentErrors.job_position = 'الوظيفة المطلوبة مطلوبة';
            if (!formData.what_will_you_add) currentErrors.what_will_you_add = 'ماذا ستضيف مطلوب';
            if (!formData.previous_work_experience) currentErrors.previous_work_experience = 'خبرة العمل السابقة مطلوبة';
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
        
        if (!validateSection()) {
            showGlobalToast('الرجاء مراجعة جميع الحقول المطلوبة في الأقسام قبل الإرسال.', 'warning');
            setLoading(false);
            return;
        }

        const apiEndpoint = 'http://127.0.0.1:8000/api/register/team/';

        const dataToSend = new FormData();
        for (const key in formData) {
            // NEW: الآن نرسل password_confirm إلى الـ Backend
            // الـ Serializer في Backend هو من سيقوم بإزالته بعد التحقق
            if (key === 'password_confirm') {
                dataToSend.append(key, formData[key]);
            }
            // إرسال البيانات الأخرى غير الفارغة أو null
            else if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
                dataToSend.append(key, formData[key]);
            }
        }
        dataToSend.append('user_type', formData.user_type);

        try {
            const response = await axios.post(apiEndpoint, dataToSend, {
                headers: {
                    // إذا لم تكن هناك ملفات مرفوعة، يمكن أن يكون Content-Type: 'application/json'
                    // ولكن FormData آمنة وتتعامل مع كل شيء.
                    // 'Content-Type': 'multipart/form-data', // هذا هو الافتراضي لـ FormData
                },
            });

            showGlobalToast('تم إرسال طلب حساب عضو فريق العمل بنجاح. سيتم مراجعته قريباً.', 'success');
            navigate('/login');

        } catch (err) {
            console.error("Registration error details:", err);
            let errorMessage = 'حدث خطأ أثناء إرسال طلب التسجيل. يرجى التحقق من البيانات والمحاولة مرة أخرى.';

            if (axios.isAxiosError(err) && err.response) {
                if (err.response.data) {
                    if (err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    } else if (typeof err.response.data === 'object') {
                        const fieldErrors = Object.entries(err.response.data)
                            .map(([field, messages]) => {
                                const fieldName = {
                                    email: 'البريد الإلكتروني', 'password': 'كلمة المرور', 'password_confirm': 'تأكيد كلمة المرور',
                                    'first_name': 'الاسم الأول', 'last_name': 'الاسم الأخير', 'phone_number': 'رقم الهاتف',
                                    'job_position': 'الوظيفة المطلوبة', 'expected_salary': 'الراتب المتوقع',
                                    'what_will_you_add': 'ماذا ستضيف', 'governorate': 'المحافظة', 'address': 'العنوان',
                                    'previous_work_experience': 'خبرة العمل السابقة', 'non_field_errors': 'خطأ عام'
                                }[field] || field;
                                return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                            })
                            .join(' | ');
                        errorMessage = `خطأ في البيانات المدخلة:\n${fieldErrors}`;
                    } else {
                        errorMessage = `فشل التسجيل. استجابة غير متوقعة من الخادم (الحالة: ${err.response.status}).`;
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

    // const totalSections = 2; // غالباً فريق العمل يحتاج قسمين أو ثلاثة كحد أقصى (لا يتطلب ملفات دائماً)

    return (
        <div className="team-registration-page">
            {/* REMOVED: Header/Navbar is now in App.js */}
            <main className="main-content">
                <section className="registration-section">
                    <div className="container registration-container">
                        <div className="registration-image-wrapper">
                            <img src={LoginIllustration} alt="Registration Illustration" className="registration-illustration" />
                            <h3 className="image-title">طلب إنشاء حساب عضو فريق عمل</h3>
                        </div>
                        <div className="registration-form-wrapper">
                            <h2>طلب إنشاء حساب عضو فريق عمل</h2>

                            {/* أزرار الأقسام */}
                            <div className="team-form-sections-nav">
                                <button type="button" onClick={() => setCurrentSection(1)} className={`section-nav-button ${currentSection === 1 ? 'active' : ''}`}>
                                    القسم الأول
                                </button>
                                <button type="button" onClick={() => setCurrentSection(2)} className={`section-nav-button ${currentSection === 2 ? 'active' : ''}`}>
                                    القسم الثاني
                                </button>
                            </div>

                            {errors.general && <div className="error-message-box">{errors.general}</div>}

                            <form className="team-register-form" onSubmit={handleSubmit}>
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
                                            <label htmlFor="address">العنوان بالتفصيل:</label>
                                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea>
                                            {errors.address && <span className="error-message">{errors.address}</span>}
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

                                {/* القسم الثاني: معلومات الوظيفة والمساهمة */}
                                {currentSection === 2 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الثاني: معلومات الوظيفة والمساهمة</h3>
                                        <div className="form-group">
                                            <label htmlFor="job_position">الوظيفة المطلوبة:</label>
                                            <select id="job_position" name="job_position" value={formData.job_position} onChange={handleChange} required>
                                                <option value="">اختر الوظيفة</option>
                                                {academicStructure.jobPositions && Object.keys(academicStructure.jobPositions).map(key => (
                                                    <option key={key} value={key}>{academicStructure.jobPositions[key].label}</option>
                                                ))}
                                            </select>
                                            {errors.job_position && <span className="error-message">{errors.job_position}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="expected_salary">الراتب المتوقع (اختياري):</label>
                                            <input type="number" id="expected_salary" name="expected_salary" value={formData.expected_salary} onChange={handleChange} step="0.01" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="what_will_you_add">ما الذي ستضيفه للمنصة؟</label>
                                            <textarea id="what_will_you_add" name="what_will_you_add" value={formData.what_will_you_add} onChange={handleChange} required></textarea>
                                            {errors.what_will_you_add && <span className="error-message">{errors.what_will_you_add}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="previous_work_experience">خبرة العمل السابقة:</label>
                                            <textarea id="previous_work_experience" name="previous_work_experience" value={formData.previous_work_experience} onChange={handleChange} required></textarea>
                                            {errors.previous_work_experience && <span className="error-message">{errors.previous_work_experience}</span>}
                                        </div>
                                        
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                                            {loading ? 'جاري الإرسال...' : 'تقديم طلب الانضمام!'}
                                        </button>
                                    </div>
                                )}
                                
                                {/* ملاحظة: يمكن إضافة قسم ثالث هنا لرفع ملفات (CV أو غيره) إذا كان مطلوباً */}
                                {/* {currentSection === 3 && (
                                    <div className="form-section-content active-section">
                                        <h3>القسم الأخير: المستندات (اختياري)</h3>
                                        <div className="form-group upload-group">
                                            <label htmlFor="personal_id_card">صورة البطاقة الشخصية (صورة من الأمام والخلف) (اختياري):</label>
                                            <input type="file" id="personal_id_card" name="personal_id_card" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                        <div className="form-group upload-group">
                                            <label htmlFor="cv_file">ملف السيرة الذاتية (CV) (اختياري):</label>
                                            <input type="file" id="cv_file" name="cv_file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                        </div>
                                        <button type="button" onClick={handlePrevSection} className="btn btn-secondary form-nav-btn">السابق</button>
                                        <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                                            {loading ? 'جاري الإرسال...' : 'تقديم طلب الانضمام!'}
                                        </button>
                                    </div>
                                )} */}

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

export default TeamRegistrationPage;