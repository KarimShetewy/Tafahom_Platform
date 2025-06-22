import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import DefaultUserImage from '../assets/images/default_user.png'; // صورة افتراضية للمستخدم
import academicStructure from '../constants/academicStructure'; // استيراد الهيكل الأكاديمي

// يمكنك إضافة أيقونات لروابط التواصل الاجتماعي إذا كانت لديك
// const INSTAGRAM_ICON = '📷';
// const FACEBOOK_ICON = '📘';
// const WEBSITE_ICON = '🌐';


function TeacherProfilePage() {
    const { teacherId } = useParams(); // ID المعلم من الـ URL
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // استخدام /api/users/teachers/<id>/ لجلب بيانات المعلم المحدد
                const response = await axios.get(`http://127.0.0.1:8000/api/users/teachers/${teacherId}/`); // تأكد أن هذا المسار موجود في Backend (users/urls.py)
                setTeacher(response.data);
            } catch (err) {
                console.error("Error fetching teacher profile:", err.response ? err.response.data : err.message);
                let errorMessage = "فشل تحميل ملف تعريف المعلم. يرجى المحاولة لاحقاً.";
                if (err.response && err.response.status === 404) {
                    errorMessage = "المعلم غير موجود.";
                } else if (err.response && err.response.data && err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, [teacherId]); // إعادة جلب البيانات إذا تغير ID المعلم

    if (loading) {
        return (
            <div className="teacher-profile-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل ملف تعريف المعلم...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teacher-profile-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/teachers-list" className="btn btn-primary">العودة لقائمة الأساتذة</Link> {/* مسار افتراضي */}
                    </div>
                </main>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="teacher-profile-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container">
                        <p className="no-data-message">لم يتم العثور على ملف تعريف المعلم.</p>
                        <Link to="/teachers-list" className="btn btn-primary">العودة لقائمة الأساتذة</Link>
                    </div>
                </main>
            </div>
        );
    }

    // جلب التسمية المعربة للمادة المتخصصة
    const specializedSubjectLabel = academicStructure.allSubjectsMap[teacher.specialized_subject_display] ? 
                                    academicStructure.allSubjectsMap[teacher.specialized_subject_display].label : 
                                    (teacher.specialized_subject_display || 'غير محدد');

    // جلب التسمية المعربة للمحافظة
    const governorateLabel = academicStructure.governorates[teacher.governorate] ?
                             academicStructure.governorates[teacher.governorate].label :
                             (teacher.governorate || 'غير محدد');

    return (
        <div className="teacher-profile-page">
            {/* REMOVED: Header/Navbar is now in App.js */}

            <main className="main-content">
                <section className="profile-header-section">
                    <div className="profile-image-container">
                        <img 
                            src={teacher.user_image || DefaultUserImage} /* استخدام user_image من الـ API */
                            alt={teacher.first_name} 
                            className="profile-image" 
                            onError={(e) => { e.target.onerror = null; e.target.src = DefaultUserImage; }} /* Fallback image */
                        />
                    </div>
                    <h1 className="profile-name">أ/ {teacher.first_name} {teacher.last_name}</h1>
                    <p className="profile-specialty">تخصص: {specializedSubjectLabel}</p>
                    {teacher.what_will_you_add && (
                        <p className="profile-bio">{teacher.what_will_you_add}</p>
                    )}
                    <div className="profile-social-links">
                        {teacher.instagram_link && <a href={teacher.instagram_link} target="_blank" rel="noopener noreferrer">📷</a>}
                        {teacher.facebook_link && <a href={teacher.facebook_link} target="_blank" rel="noopener noreferrer">📘</a>}
                        {teacher.website_link && <a href={teacher.website_link} target="_blank" rel="noopener noreferrer">🌐</a>}
                    </div>
                </section>

                <section className="profile-details-grid">
                    {teacher.qualifications && (
                        <div className="detail-card">
                            <h3>المؤهلات</h3>
                            <p>{teacher.qualifications}</p>
                        </div>
                    )}
                    {teacher.experience && (
                        <div className="detail-card">
                            <h3>الخبرة</h3>
                            <p>{teacher.experience}</p>
                        </div>
                    )}
                    <div className="detail-card">
                        <h3>معلومات الاتصال</h3>
                        <ul>
                            <li><strong>البريد الإلكتروني:</strong> {teacher.email}</li>
                            <li><strong>رقم الهاتف:</strong> {teacher.phone_number || 'غير متاح'}</li>
                            <li><strong>المحافظة:</strong> {governorateLabel}</li>
                            <li><strong>الجنس:</strong> {academicStructure.genders[teacher.gender]?.label || (teacher.gender || 'غير محدد')}</li>
                        </ul>
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

export default TeacherProfilePage;