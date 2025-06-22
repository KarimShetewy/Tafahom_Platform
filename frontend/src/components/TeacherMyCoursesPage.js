import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import './TeacherMyCoursesPage.css'; // ملف الأنماط الخاص بصفحة كورساتي
import CoursePlaceholder from '../assets/images/course_placeholder.jpg'; // صورة Placeholder للكورسات
import academicStructure from '../constants/academicStructure'; // استيراد الهيكل الأكاديمي
import { AuthContext, ToastContext } from '../App'; // استيراد الـ Contexts


function TeacherMyCoursesPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // جلب user من AuthContext للتحقق من الصلاحيات
    const showGlobalToast = useContext(ToastContext); // جلب دالة التوست

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const userToken = sessionStorage.getItem('userToken'); // لم نعد نستخدمها مباشرة، بل user.token

    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن معلماً أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'teacher' || !user.token) {
            navigate('/login');
            return;
        }

        const fetchTeacherCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/courses/my-courses/', {
                    headers: { 'Authorization': `Token ${user.token}` } // استخدام user.token من الـ Context
                });
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching teacher courses:', err.response ? err.response.data : err.message);
                let errorMessage = 'فشل تحميل كورساتك. يرجى المحاولة لاحقاً.';
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        errorMessage = "غير مصرح لك بالوصول لهذه الصفحة. يرجى تسجيل الدخول كمعلم.";
                        navigate('/login');
                    } else if (err.response.data && err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    }
                }
                setError(errorMessage);
                showGlobalToast(errorMessage, "error");
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherCourses();
    }, [user, navigate, showGlobalToast]); // user, navigate, showGlobalToast كـ dependencies

    const handleDeleteCourse = async (courseIdToDelete) => {
        showGlobalToast(
            "هل أنت متأكد من حذف هذا الكورس؟ هذا الإجراء لا يمكن التراجع عنه.",
            "confirm", // نوع التوست: "تأكيد"
            async (confirmed) => { // دالة callback تنفذ بعد اختيار المستخدم في التوست
                if (confirmed) {
                    setLoading(true); // إعادة تفعيل التحميل بعد التأكيد
                    setError(null);
                    try {
                        await axios.delete(`http://127.0.0.1:8000/api/courses/${courseIdToDelete}/`, {
                            headers: { 'Authorization': `Token ${user.token}` } // استخدام user.token
                        });
                        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseIdToDelete));
                        showGlobalToast('تم حذف الكورس بنجاح!', 'success');
                    } catch (err) {
                        console.error('Error deleting course:', err.response ? err.response.data : err.message);
                        let errorMessage = 'فشل حذف الكورس. يرجى المحاولة لاحقاً.';
                        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.detail) {
                            errorMessage = err.response.data.detail;
                        }
                        setError(errorMessage);
                        showGlobalToast(errorMessage, 'error');
                    } finally {
                        setLoading(false);
                    }
                }
            }
        );
    };


    if (loading) {
        return (
            <div className="teacher-my-courses-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content dashboard-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل كورساتك...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teacher-my-courses-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content dashboard-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/teacher/dashboard" className="btn btn-primary">العودة للوحة التحكم</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="teacher-my-courses-page">
            {/* REMOVED: Header/Navbar is now in App.js */}
            <main className="main-content dashboard-content">
                <div className="container">
                    <h2 className="page-title">كورساتي</h2>
                    <p className="page-description">هذه قائمة بالكورسات التي أنشأتها. يمكنك إدارتها من هنا.</p>
                    
                    <div className="my-courses-grid">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course.id} className="course-card-manage">
                                    <div className="course-image-container-manage">
                                        <img 
                                            src={course.image ? `http://127.0.0.1:8000${course.image}` : CoursePlaceholder} 
                                            alt={course.title} 
                                            className="course-image-manage" 
                                            onError={(e) => { e.target.onerror = null; e.target.src = CoursePlaceholder; }} /* Fallback image */
                                        />
                                        <div className="course-status-badge">{course.is_published ? 'منشور' : 'غير منشور'}</div>
                                    </div>
                                    <div className="course-info-manage">
                                        <h3 title={course.title}>{course.title}</h3>
                                        {/* التأكد من وجود البيانات قبل الوصول إليها لتجنب الأخطاء */}
                                        <p className="course-level-subject">
                                            {academicStructure[course.academic_level]?.label || course.academic_level} - {academicStructure.allSubjectsMap[course.subject]?.label || course.subject}
                                        </p>
                                        <p className="course-price-manage">{course.price} جنيه</p>
                                        <div className="course-actions-manage">
                                            <Link to={`/teacher/courses/${course.id}/manage-content`} className="btn btn-primary btn-sm">إدارة المحتوى</Link>
                                            <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger btn-sm">حذف</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-courses-message">لم تقم بإضافة أي كورسات بعد. <Link to="/teacher/add-course">ابدأ بإضافة كورس جديد الآن!</Link></p>
                        )}
                    </div>

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