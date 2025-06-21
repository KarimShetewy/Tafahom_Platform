import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';
import academicStructure from '../constants/academicStructure';
import { ToastContext } from '../App';
// REMOVED: import { AuthContext } from '../App'; // لم يعد ضروريا هنا بشكل مباشر للـ Navbar

// Icons
const VIDEO_ICON = '▶️';
const PDF_ICON = '📄';
const QUIZ_ICON = '📝';
const EXAM_ICON = '🏅';
const LINK_ICON = '🔗';
const TEXT_ICON = '📖';
const BRANCH_ICON = '📂';
const LOCKED_ICON = '🔒';
const UNLOCKED_ICON = '🔓';

function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedLecture, setExpandedLecture] = useState(null);
    const [expandedMaterial, setExpandedMaterial] = useState(null);

    const showGlobalToast = useContext(ToastContext);

    // جلب بيانات المستخدم من sessionStorage مباشرةً لأن الـ context غير متاح هنا بشكل مباشر للوصول للـ user object
    // ويمكنك تمرير user من App.js كـ prop لـ CourseDetailPage إذا أردت استخدام AuthContext مباشرة هنا.
    const userToken = sessionStorage.getItem('userToken');
    const userType = sessionStorage.getItem('userType');
    const isStudent = userType === 'student';
    const isTeacher = userType === 'teacher';
    const currentUserId = parseInt(sessionStorage.getItem('userId'));


    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
                    headers: {
                        'Authorization': userToken ? `Token ${userToken}` : ''
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
    }, [id, userToken]);

    const handleToggleLecture = (lectureId) => {
        setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
        setExpandedMaterial(null);
    };

    const handleToggleMaterial = (materialId) => {
        setExpandedMaterial(expandedMaterial === materialId ? null : materialId);
    };

    const handleAccessMaterial = (material) => {
        if (course.is_teacher_owner || (isStudent && course.is_enrolled)) {
            handleToggleMaterial(material.id);
        } else {
            showGlobalToast('يجب الاشتراك في الكورس للوصول إلى هذا المحتوى.', 'warning');
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
        return new Date(dateString).toLocaleDateString('ar-EG', options);
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

    const courseSubjectLabel = academicStructure.allSubjectsMap[course.subject]?.label || course.subject;
    const courseAcademicLevelLabel = academicStructure[course.academic_level]?.label || course.academic_level;

    const isCourseOwner = isTeacher && course.teacher_id === currentUserId;

    const canAccessFullContent = isCourseOwner || (isStudent && course.is_enrolled);


    return (
        <div className="course-detail-page">
            {/* REMOVED: Header/Navbar is now in App.js */}
            {/* <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/courses">الكورسات</Link></li>
                        </ul>
                        <div className="auth-buttons">
                        </div>
                    </nav>
                </div>
            </header> */}

            <main className="main-content course-detail-content">
                <section className="course-hero-section">
                    <div className="container course-hero-container">
                        <div className="course-image-wrapper">
                            <img 
                                src={course.image ? `http://127.0.0.1:8000${course.image}` : CoursePlaceholder} 
                                alt={course.title} 
                                className="course-hero-image"
                                onError={(e) => { e.target.onerror = null; e.target.src = CoursePlaceholder; }}
                            />
                        </div>
                        
                        <div className="course-hero-content">
                            <div className="course-hero-badge">{course.course_type_display}</div>
                            <h1 className="course-hero-title">{course.title}</h1>
                            <p className="course-hero-teacher">أ/ {course.teacher_name} {course.teacher_last_name}</p>
                            <div className="course-hero-meta">
                                <span className="meta-item-detail"><span className="icon">📚</span>{courseAcademicLevelLabel}</span>
                                <span className="meta-item-detail"><span className="icon">🎯</span>{courseSubjectLabel}</span>
                            </div>
                            <p className="course-hero-description">
                                {course.description}
                            </p>
                            <div className="course-hero-actions">
                                <span className="course-hero-price">{course.price} جنيه</span>
                                {isCourseOwner ? (
                                    <Link to={`/teacher/courses/${course.id}/manage-content`} className="btn btn-primary course-hero-action-btn">إدارة الكورس</Link>
                                ) : (isStudent && course.is_enrolled) ? (
                                    <Link to={`/student/courses/${course.id}/view-content`} className="btn btn-primary course-hero-action-btn">الدخول للكورس</Link>
                                ) : (
                                    <button className="btn btn-primary course-hero-subscribe-btn">اشترك الآن</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="course-hero-overlay"></div>
                </section>

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

                <section className="course-content-section">
                    <div className="container">
                        <h2 className="section-title">محتوى الكورس</h2>
                        {course.lectures && course.lectures.length > 0 ? (
                            <div className="lectures-accordion">
                                {course.lectures.map((lecture) => (
                                    <div key={lecture.id} className={`lecture-item ${expandedLecture === lecture.id ? 'expanded' : ''}`}>
                                        <div className="lecture-header" onClick={() => handleToggleLecture(lecture.id)}>
                                            <h4>{lecture.order}. {lecture.title}</h4>
                                            <span className="lecture-toggle-icon">
                                                {expandedLecture === lecture.id ? '▲' : '▼'}
                                            </span>
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
                                                                    <span className="lock-icon">🔒</span>
                                                                )}
                                                            </div>
                                                            {expandedMaterial === material.id && (
                                                                <div className="material-details-expanded">
                                                                    {material.description && <p className="material-description-text">الوصف: {material.description}</p>}
                                                                    {(material.type === 'video' || material.type === 'pdf') && material.file && (
                                                                        <p className="material-detail-info">الملف: <a href={`http://127.0.0.1:8000${material.file}`} target="_blank" rel="noopener noreferrer">عرض/تحميل الملف</a></p>
                                                                    )}
                                                                    {material.type === 'text' && material.text_content && (
                                                                        <div className="material-detail-info">المحتوى النصي: <pre>{material.text_content}</pre></div>
                                                                    )}
                                                                    {material.type === 'link' && material.url && (
                                                                        <p className="material-detail-info">الرابط: <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p>
                                                                    )}
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