import academicStructure from '../constants/academicStructure';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './SubjectDetailPage.css';
import TeacherPlaceholder from '../assets/images/teacher_placeholder.jpg';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg';

function SubjectDetailPage() {
    const { levelKey, subjectName } = useParams();
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // استخدام label الصف الدراسي هنا ليظهر الاسم كاملاً
    // تأكد من أن levelKey يطابق تماماً المفاتيح في academicStructure
    const rawLevelLabel = academicStructure[levelKey] ? academicStructure[levelKey].label : 'صف دراسي غير محدد';
    // إزالة كلمة "الصف" من بداية الـ label إذا كانت موجودة لتجنب التكرار
    const levelLabel = rawLevelLabel.startsWith('الصف ') ? rawLevelLabel.replace('الصف ', '') : rawLevelLabel;

    useEffect(() => {
        // *** إضافة console.log هنا للتشخيص ***
        console.log("levelKey from useParams:", levelKey);
        console.log("subjectName from useParams:", subjectName);
        console.log("Raw Level Label:", rawLevelLabel); // لمعرفة القيمة الأصلية
        console.log("Processed Level Label:", levelLabel); // لمعرفة القيمة بعد المعالجة
        // التحقق من وجود levelKey في academicStructure
        if (!academicStructure[levelKey]) {
            console.warn(`levelKey '${levelKey}' not found in academicStructure.`);
        }

        const fetchSubjectData = async () => {
            setLoading(true);
            setError(null);
            try {
                const encodedSubjectName = encodeURIComponent(subjectName);
                // تصحيح بناء URL هنا
                const teachersResponse = await fetch(`http://127.0.0.1:8000/api/courses/teachers/?subject=${encodedSubjectName}&level=${levelKey}`);
                const teachersData = await teachersResponse.json();
                if (teachersResponse.ok) {
                    setTeachers(teachersData);
                } else {
                    throw new Error(teachersData.detail || `فشل جلب المدرسين: ${teachersResponse.statusText}`);
                }

                // تصحيح بناء URL هنا أيضاً
                const coursesResponse = await fetch(`http://127.0.0.1:8000/api/courses/courses/?subject=${encodedSubjectName}&level=${levelKey}`);
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
    }, [levelKey, subjectName, levelLabel, rawLevelLabel]); // تم إضافة rawLevelLabel للتأكد من إعادة الجلب إذا تغير بطريقة ما

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
                        {/* استخدام decodeURIComponent لعرض اسم المادة بشكل صحيح، وإضافة "للصف" */}
                        <h2>جاري تحميل بيانات {decodeURIComponent(subjectName)} للصف {levelLabel}...</h2> 
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
                        {/* استخدام decodeURIComponent لعرض اسم المادة بشكل صحيح، وإضافة "للصف" */}
                        <h1>{decodeURIComponent(subjectName)} للصف {levelLabel}</h1>
                        <p>كل ما يخص مادة {decodeURIComponent(subjectName)} من مدرسين وكورسات في {levelLabel}.</p>
                    </div>
                </section>

                <section className="teachers-for-subject-section">
                    <div className="container">
                        {/* استخدام decodeURIComponent لعرض اسم المادة بشكل صحيح، وإضافة "للصف" */}
                        <h2>المدرسون المتاحون لمادة {decodeURIComponent(subjectName)} للصف {levelLabel}</h2>
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
                        {/* استخدام decodeURIComponent لعرض اسم المادة بشكل صحيح، وإضافة "للصف" */}
                        <h2>كورسات مادة {decodeURIComponent(subjectName)} للصف {levelLabel}</h2>
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