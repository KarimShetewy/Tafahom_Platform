import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import academicStructure from '../constants/academicStructure';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';

function SubjectDetailPage() {
    const { levelKey, subjectName } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userToken = sessionStorage.getItem('userToken');

    useEffect(() => {
        const fetchCoursesBySubject = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!academicStructure[levelKey]) {
                    setError("الصف الدراسي غير صالح.");
                    setLoading(false);
                    return;
                }
                const subjectValue = academicStructure.allSubjectsMap[decodeURIComponent(subjectName)] ? decodeURIComponent(subjectName) : null;
                if (!subjectValue) {
                    setError("المادة الدراسية غير صالحة.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/courses/?academic_level=${levelKey}&subject=${subjectValue}`, {
                    headers: {
                        'Authorization': userToken ? `Token ${userToken}` : ''
                    }
                });
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses by subject:", err.response ? err.response.data : err.message);
                setError("فشل تحميل الكورسات لهذه المادة. يرجى المحاولة لاحقاً.");
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesBySubject();
    }, [levelKey, subjectName, userToken]);

    const academicLevelLabel = academicStructure[levelKey]?.label || 'غير معروف';
    const subjectLabel = academicStructure.allSubjectsMap[decodeURIComponent(subjectName)]?.label || 'غير معروف';


    if (loading) {
        return (
            <div className="subject-detail-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل كورسات مادة {subjectLabel} لـ {academicLevelLabel}...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="subject-detail-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/" className="btn btn-primary">العودة للصفحة الرئيسية</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="subject-detail-page">
            {/* REMOVED: Header/Navbar is now in App.js */}

            <main className="main-content">
                <section className="subject-hero-section">
                    <div className="container subject-hero-container">
                        <div className="subject-hero-content">
                            <h1 className="subject-title">كورسات مادة <span className="subject-highlight">{subjectLabel}</span></h1>
                            <p className="subject-meta">الصف الدراسي: {academicLevelLabel}</p>
                            <p className="subject-description">
                                استكشف مجموعة متنوعة من الكورسات المتاحة لمادة {subjectLabel} في الصف {academicLevelLabel}.
                                ابحث عن الكورس المناسب الذي يلبي احتياجاتك التعليمية.
                            </p>
                        </div>
                    </div>
                    <div className="subject-hero-overlay"></div>
                </section>

                <div className="container courses-list-section">
                    <h2 className="section-heading">الكورسات المتاحة</h2>
                    {courses.length > 0 ? (
                        <div className="courses-grid">
                            {courses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="course-image-container-new">
                                        <img 
                                            src={course.image ? `http://127.0.0.1:8000${course.image}` : CoursePlaceholder} 
                                            alt={course.title} 
                                            className="course-image-new" 
                                        />
                                        <div className="course-badge">{course.course_type_display}</div>
                                    </div>
                                    <div className="course-info-new">
                                        <h3 title={course.title}>{course.title}</h3>
                                        <p className="course-note">{course.description ? course.description.substring(0, 100) + '...' : 'لا يوجد وصف.'}</p>
                                        <div className="course-meta">
                                            <span className="course-price-new">{course.price} جنيه</span>
                                            <span className="course-teacher-name">أ/ {course.teacher_name}</span>
                                        </div>
                                        <div className="course-actions-new">
                                            {(course.is_enrolled || course.is_teacher_owner) ? (
                                                <Link to={`/course/${course.id}`} className="btn btn-primary course-action-btn">الدخول للكورس</Link>
                                            ) : (
                                                <>
                                                    <Link to={`/course/${course.id}`} className="btn btn-secondary course-action-btn-outline">الدخول للكورس</Link>
                                                    <button className="btn btn-primary subscribe-btn">اشترك الآن</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-courses-message">لا توجد كورسات متاحة لهذه المادة حتى الآن.</p>
                    )}
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

export default SubjectDetailPage;