import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // سنستخدم axios لإرسال الطلبات إلى الـ API
import TafahomLogo from '../assets/images/tafahom_logo.png'; // للتصميم
import academicStructure from '../constants/academicStructure'; // لاستيراد الهيكل الأكاديمي
import './TeacherAddCoursePage.css'; // لملف التنسيقات الخاص بهذه الصفحة (سننشئه لاحقاً)

function TeacherAddCoursePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image: null, // للتعامل مع ملف الصورة
        academic_level: '',
        academic_track: '',
        subject: '',
        is_published: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // حالة تخزين بيانات المستخدم (مثل التوكن ونوع المستخدم) من Local Storage
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);
    const [userType, setUserType] = useState(localStorage.getItem('userType') || null);

    // التحقق من أن المستخدم مسجل دخوله وأنه أستاذ
    useEffect(() => {
        if (!userToken || userType !== 'teacher') {
            // إذا لم يكن المستخدم مسجلاً أو ليس أستاذاً، قم بإعادة توجيهه
            navigate('/login'); // أو إلى صفحة غير مصرح بها
        }
    }, [userToken, userType, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0], // لتخزين ملف الصورة
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // إنشاء FormData object لإرسال البيانات، خاصة ملف الصورة
        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) { // لا تضيف الحقول null إلى FormData
                data.append(key, formData[key]);
            }
        }

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/courses/create/',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // مهم لرفع الملفات
                        'Authorization': `Bearer ${userToken}`, // إرسال التوكن للمصادقة
                    },
                }
            );
            setSuccessMessage('تم إضافة الكورس بنجاح!');
            // يمكنك إعادة تعيين النموذج أو إعادة توجيه المستخدم
            setFormData({
                title: '',
                description: '',
                price: '',
                image: null,
                academic_level: '',
                academic_track: '',
                subject: '',
                is_published: false,
            });
            // إذا أردت إعادة التوجيه بعد النجاح
            // navigate('/teacher/dashboard');
        } catch (err) {
            console.error('Error adding course:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.detail || err.response?.data?.message || 'حدث خطأ أثناء إضافة الكورس.');
            // إذا كانت هناك أخطاء في حقول معينة من الـ API
            if (err.response && err.response.data) {
                const apiErrors = err.response.data;
                let errorMessage = '';
                for (const field in apiErrors) {
                    errorMessage += `${field}: ${apiErrors[field].join(', ')}\n`;
                }
                setError(errorMessage || 'حدث خطأ أثناء إضافة الكورس.');
            }
        } finally {
            setLoading(false);
        }
    };

    // إذا لم يكن المستخدم أستاذاً أو غير مسجل، لا تعرض النموذج
    if (!userToken || userType !== 'teacher') {
        return <p>جاري إعادة التوجيه...</p>; // أو يمكنك عرض رسالة "غير مصرح لك"
    }

    return (
        <div className="teacher-add-course-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/teacher/dashboard">لوحة تحكم الأستاذ</Link></li>
                            {/* يمكن إضافة روابط أخرى هنا */}
                        </ul>
                        <div className="auth-buttons">
                            {/* يمكنك إضافة زر تسجيل خروج هنا */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <h2>إضافة كورس جديد</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">صورة الكورس:</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
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
                                {Object.keys(academicStructure).map(levelKey => (
                                    <option key={levelKey} value={levelKey}>
                                        {academicStructure[levelKey].label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="academic_track">المسار الدراسي (اختياري):</label>
                            <select
                                id="academic_track"
                                name="academic_track"
                                value={formData.academic_track}
                                onChange={handleInputChange}
                            >
                                <option value="">اختر المسار (إن وجد)</option>
                                {formData.academic_level && academicStructure[formData.academic_level]?.tracks &&
                                    Object.keys(academicStructure[formData.academic_level].tracks).map(trackKey => (
                                        <option key={trackKey} value={trackKey}>
                                            {academicStructure[formData.academic_level].tracks[trackKey].label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">المادة:</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">اختر المادة</option>
                                {/* هنا نحتاج إلى جلب المواد بناءً على الصف أو من مكان آخر */}
                                {/* حالياً، academicStructure لا تحتوي على مواد لكل مستوى، بل all_materials */}
                                {formData.academic_level && academicStructure[formData.academic_level]?.all_materials &&
                                    academicStructure[formData.academic_level].all_materials.map((sub, index) => (
                                        <option key={index} value={sub}>
                                            {sub}
                                        </option>
                                    ))
                                }
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