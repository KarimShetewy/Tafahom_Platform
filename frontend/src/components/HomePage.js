import academicStructure from '../constants/academicStructure'; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

import TafahomLogo from '../assets/images/tafahom_logo.png';
import StudentHeroImage from '../assets/images/student_hero.png';
import JoinUsIllustration from '../assets/images/join_us_illustration.png';

import Teacher1 from '../assets/images/teacher1.jpg';
import Teacher2 from '../assets/images/teacher2.jpg';
import Teacher3 from '../assets/images/teacher3.jpg';
import Course1 from '../assets/images/course1.jpg';
import Course2 from '../assets/images/course2.jpg';
import Course3 from '../assets/images/course3.jpg';

const teachersData = [
    { id: 1, name: 'أ/ مايكل ماهر', specialty: 'مدرس علوم متكاملة', image: Teacher1 },
    { id: 2, name: 'أ/ أحمد الشرقاوي', specialty: 'أستاذ اللغة الألمانية', image: Teacher2 },
    { id: 3, name: 'أ/ عبدالله حامد', specialty: 'أستاذ الجيولوجيا', image: Teacher3 },
];

const coursesData = [
    { id: 1, title: 'الشهر الثالث', description: 'الصف الثاني الثانوي', image: Course1 },
    { id: 2, title: 'البرنامج المراجعة', description: 'الصف الثالث الثانوي', image: Course2 },
    { id: 3, title: 'برنامج التحفيز', description: 'الصف الثالث الثانوي', image: Course3 },
];


function HomePage() {
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedTrack, setSelectedTrack] = useState('');
    const [showAllMaterialsForLevel, setShowAllMaterialsForLevel] = useState({});

    const handleLevelChange = (e) => {
        const level = e.target.value;
        setSelectedLevel(level);
        setSelectedTrack('');
    };

    const handleTrackChange = (e) => {
        const track = e.target.value;
        setSelectedTrack(track);
    };

    const toggleShowAllMaterials = (levelKey) => {
        setShowAllMaterialsForLevel(prevState => ({
            ...prevState,
            [levelKey]: !prevState[levelKey]
        }));
    };


    return (
        <div className="home-page">
            <header className="app-header">
                <div className="container">
                <nav className="navbar">
                    <div className="logo">
                    <Link to="/">
                        <img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" />
                    </Link>
                    </div>
                    <ul className="nav-links">
                    <li><Link to="/">الرئيسية</Link></li>
                    <li><Link to="/about">عن المنصة</Link></li>
                    <li><Link to="/teachers-list">الاساتذة</Link></li>
                    <li><Link to="/courses">الكورسات</Link></li>
                    <li><Link to="/contact">تواصل معنا</Link></li>
                    </ul>
                    <div className="auth-buttons">
                    <Link to="/login" className="btn btn-secondary">تسجيل الدخول</Link>
                    <Link to="/register/student" className="btn btn-primary">إنشاء حساب جديد</Link>
                    </div>
                </nav>
                </div>
            </header>

            <main className="main-content">
                <section className="hero-section homepage-section">
                    <div className="container hero-container">
                        <div className="hero-content">
                            <h1>منصة تفاهم</h1>
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

                            {selectedLevel && academicStructure[selectedLevel].tracks && Object.keys(academicStructure[selectedLevel].tracks).length > 0 && (
                                <select onChange={handleTrackChange} value={selectedTrack}>
                                    <option value="">اختر المسار</option>
                                    {Object.keys(academicStructure[selectedLevel].tracks).map(trackKey => (
                                        <option key={trackKey} value={trackKey}>
                                            {academicStructure[selectedLevel].tracks[trackKey].label}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button className="btn btn-secondary filter-btn">تصفية</button>
                        </div>
                        <div className="teachers-grid">
                            {teachersData.map(teacher => (
                                <div key={teacher.id} className="teacher-card">
                                    <img src={teacher.image} alt={teacher.name} className="teacher-image" />
                                    <h3>{teacher.name}</h3>
                                    <p>{teacher.specialty}</p>
                                    <button className="btn btn-primary">عرض الملف الشخصي</button>
                                </div>
                            ))}
                        </div>
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
                        <div className="courses-grid">
                            {coursesData.map(course => (
                                <div key={course.id} className="course-card">
                                    <img src={course.image} alt={course.title} className="course-image" />
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
                        <div className="view-more-container">
                            <Link to="/courses" className="btn btn-secondary view-more-btn">عرض المزيد من الكورسات</Link>
                        </div>
                    </div>
                </section>

                <section className="academic-levels-section homepage-section">
                    <div className="container">
                        <h2>مواد تفاهم</h2>
                        
                        <div className="all-levels-materials-grid">
                            {Object.keys(academicStructure).map(levelKey => (
                                <div key={levelKey} className="level-group-card">
                                    <h3>{academicStructure[levelKey].label}</h3>
                                    <div className={`level-materials-container ${showAllMaterialsForLevel[levelKey] ? 'show-all' : ''}`}>
                                        <ul className="subject-list">
                                            {(showAllMaterialsForLevel[levelKey] ? academicStructure[levelKey].all_materials : academicStructure[levelKey].all_materials.slice(0, 3)).map((item, itemIdx) => (
                                                <li key={itemIdx}>
                                                    <Link to={`/subjects/${levelKey}/${encodeURIComponent(item)}`}>
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {academicStructure[levelKey].all_materials.length > 3 && (
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