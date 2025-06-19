import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg'; // صورة placeholder للكورس
import academicStructure from '../constants/academicStructure';

// أيقونات (يمكن استبدالها لاحقاً بـ Lucide React أو FontAwesome)
const VIDEO_ICON = '▶️';
const PDF_ICON = '📄';
const QUIZ_ICON = '📝';
const EXAM_ICON = '🏅';
const LINK_ICON = '🔗';
const TEXT_ICON = '📖';
const BRANCH_ICON = '📁';
const LOCKED_ICON = '🔒'; // أيقونة المحتوى المقفل
const UNLOCKED_ICON = '🔓'; // أيقونة المحتوى المفتوح

function CourseDetailPage() {
    const { id } = useParams(); // لجلب ID الكورس من الـ URL (مثلاً /course/123)
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedLecture, setExpandedLecture] = useState(null); // لتحديد المحاضرة المفتوحة حالياً
    const [expandedMaterial, setExpandedMaterial] = useState(null); // لتحديد المادة المفتوحة حالياً

    // جلب معلومات المستخدم الحالي (للتأكد من حالة الاشتراك/الأستاذية)
    const userToken = sessionStorage.getItem('userToken');
    const userType = sessionStorage.getItem('userType');
    const isStudent = userType === 'student';
    const isTeacher = userType === 'teacher';

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
                    headers: {
                        'Authorization': userToken ? `Token ${userToken}` : '' // إرسال التوكن إذا كان موجوداً
                    }
                });
                setCourse(response.data);
            } catch (err) {
                console.error("Error fetching course details:", err.response ? err.response.data : err.message);
                setError("فشل تحميل تفاصيل الكورس. يرجى المحاولة لاحقاً.");
                if (err.response && err.response.status === 404) {
                    setError("لم يتم العثور على هذا الكورس.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, userToken]); // أعد جلب البيانات إذا تغير ID الكورس أو التوكن (حالة المستخدم)

    const handleToggleLecture = (lectureId) => {
        setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
        setExpandedMaterial(null); // إغلاق أي مادة مفتوحة عند طي/فتح محاضرة
    };

    const handleToggleMaterial = (materialId) => {
        setExpandedMaterial(expandedMaterial === materialId ? null : materialId);
    };

    const handleAccessMaterial = (material) => {
        // التحقق من صلاحيات الوصول للمادة
        // إذا كان المستخدم هو الأستاذ صاحب الكورس، أو طالب ومشترك
        if (course.is_teacher_owner || (isStudent && course.is_enrolled)) {
            // فتح تفاصيل المادة فقط عند النقر (ستظهر تفاصيل إضافية أسفل المادة)
            handleToggleMaterial(material.id); 

            // إذا كان نوع المادة يمكن تشغيله مباشرة، يمكنك إضافة منطق لفتحه في نافذة جديدة
            // حالياً، سنعتمد على عرض التفاصيل أسفل المادة.
            /*
            if (material.type === 'video' && material.url) {
                window.open(material.url, '_blank');
            } else if (material.type === 'pdf' && material.file) {
                window.open(material.file, '_blank');
            } else if (material.type === 'link' && material.url) {
                window.open(material.url, '_blank');
            }
            */
        } else {
            alert('يجب الاشتراك في الكورس للوصول إلى هذا المحتوى.');
            // يمكنك توجيه المستخدم لصفحة الاشتراك أو إظهار Modal
        }
    };

    const getMaterialIcon = (type) => {
        switch (type) {
            case 'video': return VIDEO_ICON;
            case 'pdf': return PDF_ICON;
            case 'quiz': return QUIZ_ICON;
            case 'exam': return EXAM_ICON;
            case 'link': return LINK_ICON;
            case 'text': return TEXT_ICON;
            case 'branch': return BRANCH_ICON;
            default: return '❓';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'غير متاح';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options); // التنسيق العربي
    };


    if (loading) {
        return <p className="loading-message">جاري تحميل تفاصيل الكورس...</p>;
    }

    if (error) {
        return <p className="error-message-box">{error}</p>;
    }

    if (!course) {
        return <p>لم يتم العثور على الكورس.</p>;
    }

    // معلومات الكورس للعرض
    const courseSubjectLabel = academicStructure.allSubjectsMap[course.subject]?.label || course.subject;
    const courseAcademicLevelLabel = academicStructure[course.academic_level]?.label || course.academic_level;

    // حالة الوصول للمحتوى (أستاذ الكورس أو طالب مشترك)
    const canAccessFullContent = course.is_teacher_owner || (isStudent && course.is_enrolled);


    return (
        <div className="course-detail-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/courses">الكورسات</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            {/* أزرار تسجيل الدخول/الخروج هنا */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content course-detail-content">
                {/* Hero Section لصفحة الكورس */}
                <section className="course-hero-section" style={{ backgroundImage: `url(${course.image || CoursePlaceholder})` }}>
                    <div className="container">
                        <div className="course-hero-overlay"></div> {/* طبقة شفافة فوق الصورة */}
                        <div className="course-hero-content">
                            <div className="course-hero-badge">{course.course_type_display}</div>
                            <h1 className="course-hero-title">{course.title}</h1>
                            <p className="course-hero-teacher">أ/ {course.teacher_name} {course.teacher_last_name}</p>
                            <p className="course-hero-meta">
                                {courseAcademicLevelLabel} | {courseSubjectLabel}
                            </p>
                            <div className="course-hero-actions">
                                <span className="course-hero-price">{course.price} جنيه</span>
                                {/* الزر الذي يظهر في الـ Hero Section */}
                                {canAccessFullContent ? (
                                     <Link to={`/course/${course.id}/content`} className="btn btn-primary course-hero-action-btn">الدخول للكورس</Link>
                                ) : (
                                    <button className="btn btn-primary course-hero-subscribe-btn">اشترك الآن</button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* قسم معلومات إضافية تحت الـ Hero (التاريخ، التحديث) */}
                <section className="course-meta-details-section">
                    <div className="container">
                        <div className="meta-item">
                            <span className="meta-icon">🗓️</span>
                            <span className="meta-label">تاريخ إنشاء الكورس:</span>
                            <span className="meta-value">{formatDate(course.created_at)}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-icon">🔄</span>
                            <span className="meta-label">آخر تحديث للكورس:</span>
                            <span className="meta-value">{formatDate(course.updated_at)}</span>
                        </div>
                    </div>
                </section>


                {/* قسم محتوى الكورس */}
                <section className="course-content-section">
                    <div className="container">
                        <h2 className="section-title">محتوى الكورس</h2>
                        {course.lectures && course.lectures.length > 0 ? (
                            <div className="lectures-accordion">
                                {course.lectures.map((lecture) => (
                                    <div key={lecture.id} className={`lecture-item ${expandedLecture === lecture.id ? 'expanded' : ''}`}>
                                        <div className="lecture-header" onClick={() => handleToggleLecture(lecture.id)}>
                                            <h4>{lecture.order}. {lecture.title}</h4>
                                            <span className="lecture-toggle-icon">{expandedLecture === lecture.id ? '▲' : '▼'}</span>
                                        </div>
                                        {expandedLecture === lecture.id && (
                                            <div className="lecture-materials-list">
                                                {lecture.materials && lecture.materials.length > 0 ? (
                                                    lecture.materials.map(material => (
                                                        <React.Fragment key={material.id}>
                                                            <div 
                                                                className={`material-item ${!canAccessFullContent && material.type !== 'branch' ? 'locked-content' : ''}`}
                                                                onClick={() => handleAccessMaterial(material)}
                                                            >
                                                                <span className="material-icon">{getMaterialIcon(material.type)}</span>
                                                                <span className="material-title">{material.title}</span>
                                                                {!canAccessFullContent && material.type !== 'branch' && (
                                                                    <span className="lock-icon">{LOCKED_ICON}</span>
                                                                )}
                                                            </div>
                                                            {/* تفاصيل المادة الموسعة تظهر هنا عند النقر عليها */}
                                                            {expandedMaterial === material.id && (
                                                                <div className="material-details-expanded">
                                                                    {material.description && <p className="material-description-text">الوصف: {material.description}</p>}
                                                                    {material.type === 'video' && material.url && (
                                                                        <p className="material-detail-info">رابط الفيديو: <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p>
                                                                    )}
                                                                    {material.type === 'pdf' && material.file && (
                                                                        <p className="material-detail-info">رابط الملف: <a href={material.file} target="_blank" rel="noopener noreferrer">تحميل الملف</a></p>
                                                                    )}
                                                                    {material.type === 'text' && material.text_content && (
                                                                        <div className="material-detail-info">المحتوى النصي: <pre>{material.text_content}</pre></div>
                                                                    )}
                                                                    {/* أضف تفاصيل إضافية لأنواع المواد الأخرى مثل الواجبات والامتحانات هنا */}
                                                                    {/* <p className="material-detail-info">عدد المشاهدات: 100 مشاهدة</p> */}
                                                                    {/* <p className="material-detail-info">مدة الفيديو: 30 دقيقة</p> */}
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <p>لا توجد مواد تعليمية في هذه المحاضرة.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>لا توجد محاضرات لهذا الكورس بعد.</p>
                        )}
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

export default CourseDetailPage;
