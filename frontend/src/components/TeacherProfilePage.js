import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import TeacherPlaceholder from '../assets/images/teacher_placeholder.jpg';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';
import academicStructure from '../constants/academicStructure';

import './TeacherProfilePage.css';

function TeacherProfilePage() {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [teacherOwnedCourses, setTeacherOwnedCourses] = useState([]); // كورسات يملكها المدرس
    const [separateCourses, setSeparateCourses] = useState([]); // كورسات منفصلة/إضافية
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // جلب بيانات ملف تعريف المدرس
                const teacherProfileResponse = await axios.get(`http://127.0.0.1:8000/api/users/profile/${teacherId}/`); 
                setTeacher(teacherProfileResponse.data);

                // مسار API للكورسات: /api/courses/
                // جلب الكورسات التي يملكها هذا المدرس (النوع العادي)
                const ownedCoursesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/?teacher_id=${teacherId}&course_type=regular`); // <--- مسار API الصحيح
                setTeacherOwnedCourses(ownedCoursesResponse.data);

                // جلب الكورسات المنفصلة لهذا المدرس
                const separateCoursesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/?teacher_id=${teacherId}&course_type=separate`); // <--- مسار API الصحيح
                setSeparateCourses(separateCoursesResponse.data);


            } catch (err) {
                console.error("Error fetching teacher profile or courses:", err.response ? err.response.data : err.message);
                setError("فشل تحميل ملف تعريف المدرس أو كورساته. يرجى المحاولة لاحقاً.");
                if (err.response && err.response.status === 404) {
                    setError("لم يتم العثور على المدرس.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, [teacherId]);


    if (loading) {
        return (
            <div className="teacher-profile-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content teacher-profile-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل ملف تعريف المدرس...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teacher-profile-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content teacher-profile-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/" className="btn btn-primary">العودة للصفحة الرئيسية</Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!teacher) {
        return (
             <div className="teacher-profile-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content teacher-profile-content">
                    <div className="container">
                        <p>لم يتم العثور على بيانات المدرس.</p>
                    </div>
                </main>
            </div>
        );
    }

    const teacherSpecialtyLabel = teacher.specialized_subject_display || 'تخصص غير محدد';


    return (
        <div className="teacher-profile-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/">الرئيسية</Link></li>
                            <li><Link to="/teachers-list">الاساتذة</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            {/* يمكنك إضافة أزرار تسجيل الدخول/الخروج هنا */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content teacher-profile-content">
                <section className="teacher-profile-hero-section">
                    <div className="container teacher-profile-hero-container">
                        <div className="profile-image-section">
                            <img src={TeacherPlaceholder} alt={teacher.first_name} className="teacher-profile-image" />
                        </div>
                        <div className="profile-details-section">
                            <h1>أ/ {teacher.first_name} {teacher.last_name}</h1>
                            <p className="teacher-specialty">أستاذ {teacherSpecialtyLabel}</p>
                        </div>
                    </div>
                </section>

                <section className="teacher-courses-section">
                    <div className="container">
                        <h2>كورسات الأستاذ {teacher.first_name}</h2>
                        {teacherOwnedCourses.length > 0 ? (
                            <div className="courses-grid">
                                {teacherOwnedCourses.map(course => (
                                    <div key={course.id} className="course-card">
                                        <div className="course-image-container-new">
                                            <img src={course.image || CoursePlaceholder} alt={course.title} className="course-image-new" />
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
                                                <Link to={`/course/${course.id}`} className="btn btn-primary course-action-btn">الدخول للكورس</Link>
                                                <button className="btn btn-primary subscribe-btn">اشترك الآن</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>لا يوجد كورسات أنشأها هذا المدرس حالياً.</p>
                        )}
                    </div>
                </section>

                {separateCourses.length > 0 && (
                    <section className="separate-courses-section">
                        <div className="container">
                            <h2>كورسات منفصلة للمدرس</h2>
                            <div className="courses-grid">
                                {separateCourses.map(course => (
                                    <div key={course.id} className="course-card">
                                        <div className="course-image-container-new">
                                            <img src={course.image || CoursePlaceholder} alt={course.title} className="course-image-new" />
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
                                                <Link to={`/course/${course.id}`} className="btn btn-primary course-action-btn">الدخول للكورس</Link>
                                                <button className="btn btn-primary subscribe-btn">اشترك الآن</button>
                                            </div>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer>
                <div className="container">
                    <p>&copy; 2025 تفاهم. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}

export default TeacherProfilePage;
