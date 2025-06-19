import academicStructure from '../constants/academicStructure';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import TeacherPlaceholder from '../assets/images/teacher_placeholder.jpg';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';
import axios from 'axios';

function SubjectDetailPage() {
    const { levelKey, subjectName } = useParams();
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rawLevelLabel = academicStructure[levelKey] ? academicStructure[levelKey].label : 'صف دراسي غير محدد';
    const levelLabel = rawLevelLabel.startsWith('الصف ') ? rawLevelLabel.replace('الصف ', '') : rawLevelLabel;
    const subjectLabel = academicStructure.allSubjectsMap[subjectName]?.label || decodeURIComponent(subjectName);


    useEffect(() => {
        if (!academicStructure[levelKey]) {
            console.warn(`levelKey '${levelKey}' not found in academicStructure.`);
            setError('الصف الدراسي غير صالح.');
            setLoading(false);
            return;
        }

        const fetchSubjectData = async () => {
            setLoading(true);
            setError(null);
            try {
                const encodedSubjectName = encodeURIComponent(subjectName);

                // مسار API للمدرسين
                const teachersResponse = await axios.get(
                    `http://127.0.0.1:8000/api/courses/teachers/?subject=${encodedSubjectName}&level=${levelKey}`
                );
                setTeachers(teachersResponse.data);

                // مسار API للكورسات: /api/courses/
                const coursesResponse = await axios.get(
                    `http://127.0.0.1:8000/api/courses/?subject=${encodedSubjectName}&level=${levelKey}` // <--- مسار API الصحيح
                );
                setCourses(coursesResponse.data);

            } catch (err) {
                console.error("Error fetching subject data:", err.response ? err.response.data : err.message);
                setError('حدث خطأ أثناء جلب بيانات المادة: ' + (err.response?.data?.detail || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchSubjectData();
    }, [levelKey, subjectName]); 

    return (
        <div className="subject-detail-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/">
                                <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
                            <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد</Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content subject-detail-content">
                <section className="subject-hero-section">
                    <div className="container">
                        <h1>{subjectLabel} للصف {levelLabel}</h1>
                        <p>كل ما يخص مادة {subjectLabel} من مدرسين وكورسات في {levelLabel}.</p>
                    </div>
                </section>

                {loading ? (
                    <p className="loading-message">جاري تحميل بيانات {subjectLabel} للصف {levelLabel}...</p>
                ) : error ? (
                    <p className="error-message-box">{error}</p>
                ) : (
                    <>
                        <section className="teachers-for-subject-section">
                            <div className="container">
                                <h2>المدرسون المتاحون لمادة {subjectLabel} للصف {levelLabel}</h2>
                                {teachers.length > 0 ? (
                                    <div className="teachers-grid">
                                        {teachers.map(teacher => (
                                            <div key={teacher.id} className="teacher-card">
                                                <div className="teacher-image-container">
                                                    <img src={TeacherPlaceholder} alt={teacher.first_name || "صورة المدرس"} className="teacher-image" />
                                                </div>
                                                <div className="teacher-info-content">
                                                    <h3>أ/ {teacher.first_name} {teacher.last_name}</h3>
                                                    <p>أستاذ {teacher.specialized_subject_display || 'تخصص غير محدد'}</p>
                                                    <button className="btn btn-primary">تفاصيل المدرس</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>لا يوجد مدرسون متاحون لهذه المادة حالياً في هذا الصف.</p>
                                )}
                            </div>
                        </section>

                        <section className="courses-for-subject-section">
                            <div className="container">
                                <h2>كورسات مادة {subjectLabel} للصف {levelLabel}</h2>
                                {courses.length > 0 ? (
                                    <div className="courses-grid">
                                        {courses.map(course => (
                                            <div key={course.id} className="course-card">
                                                <img src={course.image || CoursePlaceholder} alt={course.title} className="course-image-new" />
                                                <div className="course-info-new">
                                                    <h3 title={course.title}>{course.title}</h3>
                                                    <p className="course-note">{course.description ? course.description.substring(0, 100) + '...' : 'لا يوجد وصف.'}</p>
                                                    <div className="course-meta">
                                                        <span className="course-price-new">{course.price} جنيه</span>
                                                        <span className="course-teacher-name">أ/ {course.teacher_name}</span>
                                                    </div>
                                                    <div className="course-actions-new">
                                                        <Link to={`/course/${course.id}`} className="btn btn-primary course-action-btn">الدخول للكورس</Link>
                                                        <button className="btn btn-primary subscribe-btn">اشترك الآن</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>لا توجد كورسات متاحة لهذه المادة حالياً في هذا الصف.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                    <ul className="footer-links">
                        <li><a href="#">سياسة الخصوصية</a></li>
                        <li><a href="#">شروط الاستخدام</a></li>
                        <li><a href="#">تواصل معنا</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default SubjectDetailPage;
