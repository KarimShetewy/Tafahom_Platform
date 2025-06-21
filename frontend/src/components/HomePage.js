import academicStructure from '../constants/academicStructure';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

import StudentHeroImage from '../assets/images/student_hero.png';
import JoinUsIllustration from '../assets/images/join_us_illustration.png';

import Teacher1 from '../assets/images/teacher1.jpg';
import Course1 from '../assets/images/course1.jpg';


function HomePage() {
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [showAllMaterialsForLevel, setShowAllMaterialsForLevel] = useState({});
    const [teachersData, setTeachersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [teachersError, setTeachersError] = useState(null);
    const [coursesError, setCoursesError] = useState(null);

    const handleImageError = (e) => {
        console.error("Failed to load image:", e.target.src);
        e.target.src = 'https://via.placeholder.com/180/CCCCCC/808080?text=No+Image';
    };

    const fetchTeachers = async () => {
        setLoadingTeachers(true);
        setTeachersError(null);
        let apiUrl = 'http://127.0.0.1:8000/api/courses/teachers/';
        const params = new URLSearchParams();

        if (selectedLevel) {
            params.append('level', selectedLevel);
        }
        if (selectedSubject) {
            params.append('subject', selectedSubject);
        }
        
        if (params.toString()) {
            apiUrl += `?${params.toString()}`;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('فشل جلب بيانات المدرسين.');
            }
            const data = await response.json();
            setTeachersData(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeachersError('فشل تحميل المدرسين. يرجى المحاولة لاحقاً.');
        } finally {
            setLoadingTeachers(false);
        }
    };

    const fetchCourses = async () => {
        setLoadingCourses(true);
        setCoursesError(null);
        let apiUrl = 'http://127.0.0.1:8000/api/courses/';
        const params = new URLSearchParams();

        if (selectedLevel) {
            params.append('level', selectedLevel);
        }
        if (selectedSubject) {
            params.append('subject', selectedSubject);
        }

        if (params.toString()) {
            apiUrl += `?${params.toString()}`;
        }
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('فشل جلب بيانات الكورسات.');
            }
            const data = await response.json();
            setCoursesData(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCoursesError('فشل تحميل الكورسات. يرجى المحاولة لاحقاً.');
        } finally {
            setLoadingCourses(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchCourses();
    }, [selectedLevel, selectedSubject]);

    const handleLevelChange = (e) => {
        const level = e.target.value;
        setSelectedLevel(level);
        setSelectedSubject('');
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const toggleShowAllMaterials = (levelKey) => {
        setShowAllMaterialsForLevel(prevState => ({
            ...prevState,
            [levelKey]: !prevState[levelKey]
        }));
    };

    const getAvailableSubjects = () => {
        if (!selectedLevel) return [];
        const levelData = academicStructure[selectedLevel];
        return levelData ? levelData.all_materials : [];
    };

    return (
        <div className="home-page">
            {/* REMOVED: Header/Navbar is now in App.js */}

            <main className="main-content">
                <section className="hero-section homepage-section">
                    <div className="container hero-container">
                        <div className="hero-content">
                            <h1>منصة <span className="tafahom-highlight">تفاهم</span></h1>
                            <h3>منصة متكاملة بها كل ما يحتاجه الطالب ليتفوق</h3>
                            <div className="hero-cta">
                                <Link to="/register/student" className="btn btn-primary">ابدأ الآن</Link>
                                <Link to="/courses" className="btn btn-secondary">اكتشف الكورسات</Link>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src={StudentHeroImage} alt="طالب مبتسم" />
                        </div>
                    </div>
                </section>

                <section className="teachers-section homepage-section">
                    <div className="container">
                        <h2>اختر المدرسين</h2>
                        <div className="teachers-filter">
                            <select onChange={handleLevelChange} value={selectedLevel}>
                                <option value="">اختر الصف الدراسي</option>
                                {Object.keys(academicStructure).map(levelKey => (
                                    <option key={levelKey} value={levelKey}>
                                        {academicStructure[levelKey].label}
                                    </option>
                                ))}
                            </select>

                            {selectedLevel && (
                                <select onChange={handleSubjectChange} value={selectedSubject}>
                                    <option value="">اختر المادة</option>
                                    {getAvailableSubjects().map(subjectValue => (
                                        <option key={subjectValue} value={subjectValue}>
                                            {academicStructure.allSubjectsMap[subjectValue]?.label || subjectValue}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button className="btn btn-secondary filter-btn" onClick={() => { fetchTeachers(); fetchCourses(); }}>تصفية</button>
                        </div>

                        {loadingTeachers ? (
                            <p>جاري تحميل المدرسين...</p>
                        ) : teachersError ? (
                            <p className="error-message-box">{teachersError}</p>
                        ) : (
                            teachersData.length > 0 ? (
                                <div className="teachers-grid">
                                    {teachersData.map(teacher => (
                                        <div key={teacher.id} className="teacher-card">
                                            <Link to={`/teachers/${teacher.id}`}> 
                                                <div className="teacher-image-container">
                                                    <img 
                                                        src={Teacher1} 
                                                        alt={teacher.first_name || "صورة المدرس"} 
                                                        className="teacher-image" 
                                                        onError={handleImageError} 
                                                    />
                                                </div>
                                            </Link>
                                            <div className="teacher-info-content">
                                                <Link to={`/teachers/${teacher.id}`}>
                                                    <h3>أ/ {teacher.first_name} {teacher.last_name}</h3>
                                                </Link>
                                                <p>أستاذ {teacher.specialized_subject_display || 'تخصص غير محدد'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>لا يوجد مدرسون متاحون حالياً بالمعايير المختارة.</p>
                            )
                        )}
                        <div className="view-more-container">
                            <Link to="/teachers-list" className="btn btn-secondary view-more-btn">عرض المزيد من المدرسين</Link>
                        </div>
                        <div className="join-as-teacher-cta">
                            <h2>هل أنت أستاذ وتريد الانضمام؟</h2>
                            <Link to="/register/teacher" className="btn btn-primary">سجل كأستاذ الآن</Link>
                        </div>
                    </div>
                </section>

                <section className="courses-section homepage-section">
                    <div className="container">
                        <h2>كورساتنا المقترحة</h2>
                        <p className="section-description">
                            مجموعة مختارة من أفضل الكورسات التي تساعدك على فهم المنهج وتحقيق التفوق.
                        </p>
                        {loadingCourses ? (
                            <p>جاري تحميل الكورسات...</p>
                        ) : coursesError ? (
                            <p className="error-message-box">{coursesError}</p>
                        ) : (
                            coursesData.length > 0 ? (
                                <div className="courses-grid">
                                    {coursesData.map(course => (
                                        <div key={course.id} className="course-card">
                                            <div className="course-image-container-new">
                                                <img src={course.image || Course1} alt={course.title} className="course-image-new" />
                                                <div className="course-badge">كورس مثبت</div>
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
                                <p>لا توجد كورسات متاحة حالياً بالمعايير المختارة.</p>
                            )
                        )}
                        <div className="view-more-container">
                            <Link to="/courses" className="btn btn-secondary view-more-btn">عرض المزيد من الكورسات</Link>
                        </div>
                    </div>
                </section>

                <section className="academic-levels-section homepage-section">
                    <div className="container">
                        <h2>مواد تفاهم</h2>

                        <div className="all-levels-materials-grid">
                            {Object.keys(academicStructure).filter(key => key !== 'allSubjectsMap').map(levelKey => (
                                <div key={levelKey} className="level-group-card">
                                    <h3>{academicStructure[levelKey].label}</h3>
                                    <div className={`level-materials-container ${showAllMaterialsForLevel[levelKey] ? 'show-all' : ''}`}>
                                        <ul className="subject-list">
                                            {(academicStructure[levelKey] && academicStructure[levelKey].all_materials && Array.isArray(academicStructure[levelKey].all_materials) ? 
                                                (showAllMaterialsForLevel[levelKey] ? academicStructure[levelKey].all_materials : academicStructure[levelKey].all_materials.slice(0, 3)) : []
                                            ).map((subjectValue, itemIdx) => (
                                                <li key={itemIdx}>
                                                    <Link to={`/subjects/${levelKey}/${encodeURIComponent(subjectValue)}`}>
                                                        {academicStructure.allSubjectsMap[subjectValue]?.label || subjectValue}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {academicStructure[levelKey] && academicStructure[levelKey].all_materials && academicStructure[levelKey].all_materials.length > 3 && (
                                        <button
                                            onClick={() => toggleShowAllMaterials(levelKey)}
                                            className="btn btn-primary view-more-materials-btn"
                                        >
                                            {showAllMaterialsForLevel[levelKey] ? 'عرض أقل' : 'عرض المزيد'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="join-team-section homepage-section">
                <div className="container join-team-container">
                    <div className="join-team-content">
                    <h2>هل تريد الانضمام إلى فريق تفاهم؟</h2>
                    <p>
                        بصفتك فرداً من فريق تفاهم، يمكنك المساهمة في بناء المحتوى التعليمي،
                        والمشاركة في تدريس المناهج الصعبة، وتقديم الدعم الفني والإحصائي في تطوير المنصة والتعليم.
                        اطلق العنان لقدراتك!
                    </p>
                    <Link to="/register/team" className="btn join-team-btn">ابدأ رحلتك الآن!</Link>
                    </div>
                    <div className="join-team-image">
                    <img src={JoinUsIllustration} alt="Join Tafahom Team" />
                    </div>
                </div>
                </section>

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

            </main>
        </div>
    );
}

export default HomePage;