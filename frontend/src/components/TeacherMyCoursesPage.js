import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './TeacherMyCoursesPage.css';
import academicStructure from '../constants/academicStructure';
import CoursePlaceholder from '../assets/images/course_placeholder.jpg'; // صورة Placeholder

function TeacherMyCoursesPage() {
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState([]); // لتخزين قائمة الكورسات
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userToken = sessionStorage.getItem('userToken');
    const userType = sessionStorage.getItem('userType');

    // لست بحاجة إلى useParams هنا لأن هذه الصفحة تعرض جميع الكورسات
    // const { courseId } = useParams(); 

    useEffect(() => {
        if (!userToken || userType !== 'teacher') {
            navigate('/login');
            return;
        }

        const fetchMyCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                // جلب قائمة الكورسات الخاصة بالمدرس من API
                const response = await axios.get('http://127.0.0.1:8000/api/courses/my-courses/', {
                    headers: { 'Authorization': `Token ${userToken}` }
                });
                setMyCourses(response.data);
            } catch (err) {
                console.error("Error fetching my courses:", err.response ? err.response.data : err.message);
                setError("فشل تحميل كورساتي. يرجى المحاولة لاحقاً.");
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [userToken, userType, navigate]);


    const handleImageError = (e) => {
        e.target.src = CoursePlaceholder; // استخدام صورة Placeholder عند الفشل
    };

    const handleDeleteCourse = async (courseIdToDelete) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا الكورس؟ هذا الإجراء لا يمكن التراجع عنه وسيحذف جميع المحاضرات والمواد المرتبطة به.")) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/courses/${courseIdToDelete}/delete/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setMyCourses(prevCourses => prevCourses.filter(course => course.id !== courseIdToDelete));
            // يمكن عرض رسالة نجاح هنا إذا أردت
            alert("تم حذف الكورس بنجاح!");
        } catch (err) {
            console.error("Error deleting course:", err.response ? err.response.data : err.message);
            setError("فشل حذف الكورس. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="my-courses-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/teacher/dashboard">لوحة التحكم</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل كورساتك...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-courses-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/teacher/dashboard">لوحة التحكم</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/teacher/dashboard" className="btn btn-primary">العودة للوحة التحكم</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="my-courses-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/teacher/dashboard">لوحة التحكم</Link></li>
                            <li><Link to="/teacher/add-course">إضافة كورس جديد</Link></li>
                            <li><Link to="/teacher/my-courses">إدارة كورساتي</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            {/* يمكن إضافة زر تسجيل خروج هنا */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <h2>إدارة كورساتي</h2>
                    <p>هنا يمكنك عرض وإدارة جميع الكورسات التي قمت بإنشائها.</p>

                    {myCourses.length === 0 ? (
                        <p>لم تقم بإنشاء أي كورسات بعد. <Link to="/teacher/add-course">اضغط هنا لإضافة كورس جديد</Link>.</p>
                    ) : (
                        <div className="my-courses-grid">
                            {myCourses.map(course => (
                                <div key={course.id} className="my-course-card">
                                    <img 
                                        src={course.image || CoursePlaceholder} 
                                        alt={course.title} 
                                        className="my-course-image" 
                                        onError={handleImageError}
                                    />
                                    <div className="my-course-info">
                                        <h3>{course.title}</h3>
                                        <p>المادة: {academicStructure.allSubjectsMap[course.subject]?.label || course.subject}</p>
                                        <p>الصف: {academicStructure[course.academic_level]?.label || course.academic_level}</p>
                                        <p className="course-price">السعر: {course.price} جنيه</p>
                                        <p>الحالة: {course.is_published ? 'منشور' : 'غير منشور'}</p>
                                        <div className="course-actions">
                                            <Link to={`/teacher/courses/${course.id}/manage-content`} className="btn btn-primary">إدارة المحتوى</Link>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger">حذف</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default TeacherMyCoursesPage;