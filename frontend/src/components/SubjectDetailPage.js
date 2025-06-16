import academicStructure from '../constants/academicStructure';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './SubjectDetailPage.css';
import TeacherPlaceholder from '../assets/images/teacher_placeholder.jpg';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';

// بيانات هيكلية الصفوف والأقسام والمواد بناءً على النظام الجديد (تم نسخها من HomePage.js لضمان التطابق التام)
// هذه المفاتيح يجب أن تتطابق تماماً مع ما هو موجود في HomePage.js
function SubjectDetailPage() {
    const { levelKey, subjectName } = useParams();
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // استخدام label الصف الدراسي هنا ليظهر الاسم كاملاً
    // تأكد من أن levelKey يطابق تماماً المفاتيح في academicStructure
    const levelLabel = academicStructure[levelKey] ? academicStructure[levelKey].label : 'صف دراسي غير محدد';

    useEffect(() => {
        const fetchSubjectData = async () => {
            setLoading(true);
            setError(null);
            try {
                const teachersResponse = await fetch(`http://127.0.0.1:8000/api/courses/teachers/?subject=<span class="math-inline">\{encodeURIComponent\(subjectName\)\}&level\=</span>{levelKey}`);
                const teachersData = await teachersResponse.json();
                if (teachersResponse.ok) {
                    setTeachers(teachersData);
                } else {
                    throw new Error(teachersData.detail || `فشل جلب المدرسين: ${teachersResponse.statusText}`);
                }

                const coursesResponse = await fetch(`http://127.0.0.1:8000/api/courses/courses/?subject=<span class="math-inline">\{encodeURIComponent\(subjectName\)\}&level\=</span>{levelKey}`);
                const coursesData = await coursesResponse.json();
                if (coursesResponse.ok) {
                    setCourses(coursesData);
                } else {
                    throw new Error(coursesData.detail || `فشل جلب الكورسات: ${coursesResponse.statusText}`);
                }

            } catch (err) {
                console.error("Error fetching subject data:", err);
                setError('حدث خطأ أثناء جلب بيانات المادة: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjectData();
    }, [levelKey, subjectName]);


    if (loading) {
        return (
            <div className="subject-detail-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo">
                                <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                            </div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content dashboard-content">
                    <div className="container">
                        <h2>جاري تحميل بيانات {subjectName} للصف {levelLabel}...</h2>
                        <p>الرجاء الانتظار.</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="subject-detail-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo">
                                <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                            </div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content dashboard-content">
                    <div className="container">
                        <h2>خطأ في تحميل بيانات المادة</h2>
                        <p className="error-message">{error}</p>
                        <Link to="/" className="btn btn-primary">العودة للصفحة الرئيسية</Link>
                    </div>
                </main>
            </div>
        );
    }

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
                            <h1>{subjectName} للصف {levelLabel}</h1>
                            <p>كل ما يخص مادة {subjectName} من مدرسين وكورسات في {levelLabel}.</p>
                        </div>
                    </section>
    
                    <section className="teachers-for-subject-section">
                        <div className="container">
                            <h2>المدرسون المتاحون لمادة {subjectName} للصف {levelLabel}</h2>
                            {teachers.length > 0 ? (
                                <div className="teachers-grid">
                                    {teachers.map(teacher => (
                                        <div key={teacher.id} className="teacher-card">
                                            <img src={TeacherPlaceholder} alt={teacher.first_name} className="teacher-image" />
                                            <h3>أ/ {teacher.first_name} {teacher.last_name}</h3>
                                            <p>{teacher.email}</p>
                                            <button className="btn btn-primary">تفاصيل المدرس</button>
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
                            <h2>كورسات مادة {subjectName} للصف {levelLabel}</h2>
                            {courses.length > 0 ? (
                                <div className="courses-grid">
                                    {courses.map(course => (
                                        <div key={course.id} className="course-card">
                                            <img src={course.image || CoursePlaceholder} alt={course.title} className="course-image" />
                                            <div className="course-info">
                                                <h3>{course.title}</h3>
                                                <p>{course.description}</p>
                                                <p className="course-teacher">الأستاذ: {course.teacher_name} {course.teacher_last_name}</p>
                                                <p className="course-price">السعر: {course.price} جنيه</p>
                                                <button className="btn btn-primary">اشترك الآن</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>لا توجد كورسات متاحة لهذه المادة حالياً في هذا الصف.</p>
                            )}
                        </div>
                    </section>
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