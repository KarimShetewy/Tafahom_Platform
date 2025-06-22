import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import academicStructure from '../constants/academicStructure'; 
import CoursePlaceholder from '../assets/images/course_placeholder.jpg'; // صورة Placeholder للكورسات (إذا كانت مستخدمة في أي مكان)
import AddCourseHeroImage from '../assets/images/add_course_hero.png'; // صورة خلفية الهيرو سكشن (يجب توفيرها)
import { AuthContext, ToastContext } from '../App'; // استيراد AuthContext و ToastContext


function TeacherAddCoursePage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // جلب user من AuthContext
    const showGlobalToast = useContext(ToastContext); // جلب دالة التوست

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image: null, // File
        academic_level: '',
        // specialized_subject: '', // هذا الحقل لا يجب أن يكون هنا، يتم تعيينه تلقائيا من Backend
        course_type: 'regular',
        is_published: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [successMessage, setSuccessMessage] = useState(null); // لم نعد نستخدمها بشكل مباشر، التوست يتولى الأمر

    // هذه الحالات ستُملأ من بيانات الأستاذ من الـ Backend
    const [teacherSpecializedSubject, setTeacherSpecializedSubject] = useState(null); 
    const [specializedSubjectLabelDisplay, setSpecializedSubjectLabelDisplay] = useState(null);


    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن معلماً أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'teacher' || !user.token) {
            navigate('/login');
            return;
        }
        
        // جلب تخصص الأستاذ من الـ Backend عند تحميل الصفحة
        const fetchTeacherProfile = async () => {
            try {
                // استخدام /api/auth/users/me/ لجلب بيانات المستخدم المسجل دخوله
                const profileResponse = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', { 
                    headers: { 'Authorization': `Token ${user.token}` } // استخدام user.token من الـ Context
                });
                
                // التأكد من وجود specialized_subject_display في الاستجابة
                if (profileResponse.data.specialized_subject) { // djoser يرجع specialized_subject مباشرة (القيمة الفنية)
                    const specializedSubjectValue = profileResponse.data.specialized_subject;
                    // البحث عن التسمية المعربة من academicStructure
                    const specializedSubjectLabel = academicStructure.allSubjectsMap[specializedSubjectValue]?.label || specializedSubjectValue;

                    setSpecializedSubjectLabelDisplay(specializedSubjectLabel);
                    setTeacherSpecializedSubject(specializedSubjectValue); // حفظ القيمة الفنية للتخصص

                } else {
                    setError("لا يوجد تخصص محدد لحسابك. يرجى الاتصال بالمسؤول.");
                    showGlobalToast("لا يوجد تخصص محدد لحسابك.", "error");
                }
            } catch (err) {
                console.error("Error fetching teacher's specialized subject:", err.response ? err.response.data : err.message);
                setError("فشل جلب تخصص الأستاذ. يرجى إعادة تسجيل الدخول.");
                showGlobalToast("فشل جلب تخصص الأستاذ. يرجى إعادة تسجيل الدخول.", "error");
            }
        };
        fetchTeacherProfile();
    }, [user, navigate, showGlobalToast]); // user, navigate, showGlobalToast كـ dependencies

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // setSuccessMessage(null); // لا نستخدمها هنا

        // تحققات أساسية في الـ Frontend
        if (!formData.title || !formData.description || !formData.price || !formData.academic_level || !formData.image) {
            setError("الرجاء ملء جميع الحقول المطلوبة (العنوان، الوصف، السعر، الصف الدراسي، الصورة).");
            showGlobalToast("الرجاء ملء جميع الحقول المطلوبة (العنوان، الوصف، السعر، الصف الدراسي، الصورة).", "warning");
            setLoading(false);
            return;
        }

        // التأكد من أن الأستاذ لديه تخصص قبل محاولة إنشاء الكورس
        if (!teacherSpecializedSubject) {
            setError("لا يمكن إضافة كورس بدون تخصص محدد للأستاذ. يرجى مراجعة ملفك الشخصي.");
            showGlobalToast("لا يمكن إضافة كورس بدون تخصص محدد للأستاذ. يرجى مراجعة ملفك الشخصي.", "error");
            setLoading(false);
            return;
        }

        const data = new FormData();
        // إضافة الحقول النصية والرقمية
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('academic_level', formData.academic_level);
        data.append('course_type', formData.course_type);
        data.append('is_published', formData.is_published);
        
        // إضافة specialized_subject من تخصص الأستاذ الذي تم جلبه
        data.append('subject', teacherSpecializedSubject); // هذا هو اسم الحقل الذي يتوقعه Backend (courses.models.Course.subject)

        // إضافة الصورة (إذا كانت موجودة)
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/courses/create/', // مسار API لإنشاء الكورس
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // ضروري لرفع الملفات والصور
                        'Authorization': `Token ${user.token}`, // استخدام user.token من الـ Context
                    },
                }
            );
            // setSuccessMessage('تم إضافة الكورس بنجاح!'); // لم نعد نستخدمها
            showGlobalToast('تم إضافة الكورس بنجاح!', 'success'); // رسالة نجاح بالتوست

            const newCourseId = response.data.id;
            navigate(`/teacher/courses/${newCourseId}/manage-content`); // توجيه لصفحة إدارة محتوى الكورس الجديد

        } catch (err) {
            console.error('Error adding course:', err.response ? err.response.data : err.message);
            let errorMessage = 'حدث خطأ أثناء إضافة الكورس. يرجى التحقق من البيانات والمحاولة مرة أخرى.';

            if (axios.isAxiosError(err) && err.response) {
                if (err.response.data) {
                    if (err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    } else if (typeof err.response.data === 'object') {
                        const fieldErrors = Object.entries(err.response.data)
                            .map(([field, messages]) => {
                                const fieldName = {
                                    title: 'العنوان',
                                    description: 'الوصف',
                                    price: 'السعر',
                                    image: 'الصورة',
                                    academic_level: 'الصف الدراسي',
                                    subject: 'المادة', // قد يظهر هذا الخطأ إذا لم يتم إرسال specialized_subject بشكل صحيح
                                    course_type: 'نوع الكورس',
                                    is_published: 'حالة النشر',
                                    non_field_errors: '',
                                }[field] || field;
                                return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
                            })
                            .join('\n');
                        errorMessage = `فشل إضافة الكورس:\n${fieldErrors}`;
                    } else {
                        errorMessage = `خطأ غير معروف من الخادم (الحالة: ${err.response.status}).`;
                    }
                } else {
                    errorMessage = `خطأ في الخادم (الحالة: ${err.response.status}). يرجى المحاولة لاحقاً.`;
                }
            } else if (err.request) {
                errorMessage = 'لا يوجد استجابة من الخادم. يرجى التحقق من اتصالك بالإنترنت وأن الخادم يعمل.';
            } else {
                errorMessage = 'حدث خطأ غير متوقع أثناء إرسال الطلب.';
            }
            
            setError(errorMessage);
            showGlobalToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };


    if (!user || user.userType !== 'teacher') {
        return <p>جاري إعادة التوجيه... (غير مصرح)</p>;
    }

    return (
        <div className="teacher-add-course-page">
            {/* REMOVED: Header/Navbar is now in App.js */}

            <main className="main-content">
                {/* قسم Hero Section لصفحة إضافة كورس جديد */}
                <section className="add-course-hero-section">
                    <div className="container add-course-hero-container">
                        <div className="add-course-hero-content">
                            <h1 className="add-course-title">إضافة كورس جديد</h1>
                            <p className="add-course-intro">
                                هنا يمكنك إنشاء كورس جديد وربطه بتخصصك: 
                                <span className="add-course-subject-display"> {specializedSubjectLabelDisplay || 'لا يوجد تخصص محدد'}</span>
                            </p>
                        </div>
                    </div>
                    {/* طبقة شفافة وتأثير الجزيئات كما في CourseDetailPage */}
                    <div className="add-course-hero-overlay" style={{ backgroundImage: `url(${AddCourseHeroImage})` }}></div>
                </section>

                <div className="container course-form-wrapper">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {/* لا نستخدم successMessage هنا */}

                    <form onSubmit={handleSubmit} className="course-form">
                        <div className="form-group">
                            <label htmlFor="title">عنوان الكورس:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">وصف الكورس:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">سعر الكورس (جنيه):</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            ></input>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">صورة الكورس:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                required /* جعل الصورة مطلوبة هنا إذا أردت */
                            />
                            {formData.image && <p>الملف المحدد: {formData.image.name}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="academic_level">الصف الدراسي:</label>
                            <select
                                id="academic_level"
                                name="academic_level"
                                value={formData.academic_level}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">اختر الصف</option>
                                {Object.keys(academicStructure).filter(key => key.startsWith('level')).map(levelKey => (
                                    <option key={levelKey} value={levelKey}>
                                        {academicStructure[levelKey].label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {specializedSubjectLabelDisplay && (
                            <div className="form-group">
                                <label htmlFor="subject-auto">المادة (تخصصك):</label>
                                <input
                                    type="text"
                                    id="subject-auto"
                                    value={specializedSubjectLabelDisplay}
                                    readOnly
                                    className="read-only-field"
                                />
                                <p className="subject-restriction-message">
                                    <small>سيتم إنشاء الكورس تلقائياً في مادة <strong>{specializedSubjectLabelDisplay}</strong>.</small>
                                </p>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="course_type">نوع الكورس:</label>
                            <select
                                id="course_type"
                                name="course_type"
                                value={formData.course_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="regular">كورس عادي</option>
                                <option value="separate">كورس منفصل (مراجعة/برنامج خاص)</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="is_published"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="is_published">نشر الكورس فوراً؟</label>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'جاري الإضافة...' : 'إضافة الكورس'}
                        </button>
                    </form>
                </div>
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default TeacherAddCoursePage;