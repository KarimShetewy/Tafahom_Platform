import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import './TeacherManageCourseContentPage.css';
import academicStructure from '../constants/academicStructure';

function TeacherManageCourseContentPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [numLecturesInput, setNumLecturesInput] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userToken = sessionStorage.getItem('userToken');
    const userType = sessionStorage.getItem('userType');

    const [expandedLecture, setExpandedLecture] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null);

    const materialTypeOptions = [
        { value: 'video', label: 'فيديو شرح' },
        { value: 'pdf', label: 'ملف PDF' },
        { value: 'quiz', label: 'واجب' },
        { value: 'exam', label: 'امتحان' },
        { value: 'link', label: 'رابط خارجي' },
        { value: 'text', label: 'نص/شرح' },
        { value: 'branch', label: 'إضافة فرع' },
    ];

    useEffect(() => {
        if (!userToken || userType !== 'teacher') {
            navigate('/login');
            return;
        }

        // NEW: إضافة فحص لـ courseId
        if (!courseId || courseId === 'undefined') {
            setError("لم يتم تحديد الكورس. يرجى العودة لصفحة إضافة الكورس أو لوحة التحكم.");
            setLoading(false);
            return;
        }


        const fetchCourseAndLectures = async () => {
            setLoading(true);
            setError(null);
            try {
                // جلب تفاصيل الكورس (للعرض في رأس الصفحة)
                const courseResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`, {
                    headers: { 'Authorization': `Token ${userToken}` }
                });
                setCourse(courseResponse.data);

                // جلب المحاضرات الموجودة لهذا الكورس
                const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                    headers: { 'Authorization': `Token ${userToken}` }
                });
                const sortedLectures = lecturesResponse.data.sort((a, b) => a.order - b.order);
                setLectures(sortedLectures);
                setNumLecturesInput(sortedLectures.length);

            } catch (err) {
                console.error("Error fetching course or lectures:", err.response ? err.response.data : err.message);
                setError("فشل تحميل تفاصيل الكورس أو المحاضرات. يرجى المحاولة لاحقاً.");
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                } else if (err.response && err.response.status === 404) {
                    setError("الكورس غير موجود أو لا تملك صلاحية الوصول إليه.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndLectures();
    }, [courseId, userToken, userType, navigate]);


    const handleUpdateLecturesCount = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentLecturesCount = lectures.length;
            const targetLecturesCount = parseInt(numLecturesInput);

            if (isNaN(targetLecturesCount) || targetLecturesCount < 0) {
                setError("يرجى إدخال عدد صحيح موجب للمحاضرات.");
                setLoading(false);
                return;
            }

            if (targetLecturesCount > currentLecturesCount) {
                for (let i = currentLecturesCount; i < targetLecturesCount; i++) {
                    const newLectureOrder = i + 1;
                    await axios.post(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                        course: courseId,
                        title: `المحاضرة ${newLectureOrder}`,
                        order: newLectureOrder,
                        is_published: false
                    }, {
                        headers: { 'Authorization': `Token ${userToken}` }
                    });
                }
            }
            else if (targetLecturesCount < currentLecturesCount) {
                if (!window.confirm(`هل أنت متأكد من رغبتك في حذف ${currentLecturesCount - targetLecturesCount} محاضرة؟ هذا سيؤدي إلى حذف جميع محتواها.`)) {
                     setLoading(false);
                     setNumLecturesInput(currentLecturesCount);
                     return;
                }
                for (let i = currentLecturesCount - 1; i >= targetLecturesCount; i--) {
                    const lectureToDelete = lectures[i];
                    await axios.delete(`http://127.0.0.1:8000/api/lectures/${lectureToDelete.id}/`, {
                        headers: { 'Authorization': `Token ${userToken}` }
                    });
                }
            }
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
            setSuccessMessage("تم تحديث عدد المحاضرات بنجاح.");

        } catch (err) {
            console.error("Error updating lectures count:", err.response ? err.response.data : err.message);
            setError("فشل تحديث عدد المحاضرات. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };


    const handleSaveLecture = async (lectureId, updatedLectureData, materialsToAdd) => {
        setLoading(true);
        setError(null);
        try {
            await axios.put(`http://127.0.0.1:8000/api/lectures/${lectureId}/`, updatedLectureData, {
                headers: { 'Authorization': `Token ${userToken}` }
            });

            for (const materialData of materialsToAdd) {
                await axios.post(`http://127.0.0.1:8000/api/lectures/${lectureId}/materials/`, {
                    lecture: lectureId,
                    title: materialData.title,
                    type: materialData.type,
                    url: materialData.url,
                    text_content: materialData.text_content,
                    order: materialData.order || 0,
                    is_published: materialData.is_published || false,
                }, {
                    headers: { 'Authorization': `Token ${userToken}` }
                });
            }

            setSuccessMessage("تم حفظ المحاضرة ومحتواها بنجاح!");
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));

        } catch (err) {
            console.error("Error saving lecture content:", err.response ? err.response.data : err.message);
            setError("فشل حفظ المحاضرة ومحتواها. يرجى المحاولة لاحقاً.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLecture = (lectureId) => {
        setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
    };

    const handleMaterialChange = (lectureIndex, materialIndex, field, value) => {
        const updatedLectures = [...lectures];
        updatedLectures[lectureIndex].materials[materialIndex][field] = value;
        setLectures(updatedLectures);
    };

    const handleDeleteMaterial = async (materialId, lectureIndex) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه المادة؟")) return;
        setLoading(true);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/materials/${materialId}/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            const updatedLectures = [...lectures];
            updatedLectures[lectureIndex].materials = updatedLectures[lectureIndex].materials.filter(m => m.id !== materialId);
            setLectures(updatedLectures);
            setSuccessMessage("تم حذف المادة بنجاح.");
        } catch (err) {
            console.error("Error deleting material:", err.response ? err.response.data : err.message);
            setError("فشل حذف المادة.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMaterial = async (materialId, updatedData, lectureIndex) => {
        setLoading(true);
        try {
            await axios.put(`http://127.0.0.1:8000/api/materials/${materialId}/`, updatedData, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setSuccessMessage("تم تحديث المادة بنجاح.");
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error("Error updating material:", err.response ? err.response.data : err.message);
            setError("فشل تحديث المادة.");
        } finally {
            setLoading(false);
        }
    };

    const [newMaterialForms, setNewMaterialForms] = useState({});

    const handleAddNewMaterialForm = (lectureId) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { type: '', title: '', url: '', text_content: '', is_published: false, file: null, order: (lectures.find(l => l.id === lectureId)?.materials?.length || 0) + 1 }
        }));
    };

    const handleNewMaterialInputChange = (lectureId, field, value) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { ...prevForms[lectureId], [field]: value }
        }));
    };

    const handleNewMaterialFileChange = (lectureId, file) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { ...prevForms[lectureId], file: file }
        }));
    };

    const handleCreateNewMaterial = async (lectureId) => {
        setLoading(true);
        setError(null);
        try {
            const newMaterialData = newMaterialForms[lectureId];
            if (!newMaterialData.type || !newMaterialData.title) {
                setError("نوع وعنوان المادة مطلوبان.");
                setLoading(false);
                return;
            }

            const formDataToSubmit = new FormData();
            formDataToSubmit.append('lecture', lectureId);
            formDataToSubmit.append('title', newMaterialData.title);
            formDataToSubmit.append('type', newMaterialData.type);
            formDataToSubmit.append('order', newMaterialData.order);
            formDataToSubmit.append('is_published', newMaterialData.is_published);
            if (newMaterialData.url) formDataToSubmit.append('url', newMaterialData.url);
            if (newMaterialData.text_content) formDataToSubmit.append('text_content', newMaterialData.text_content);
            if (newMaterialData.file) formDataToSubmit.append('file', newMaterialData.file);

            await axios.post(`http://127.0.0.1:8000/api/lectures/${lectureId}/materials/`, formDataToSubmit, {
                headers: {
                    'Authorization': `Token ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setSuccessMessage("تم إضافة المادة بنجاح!");
            setNewMaterialForms(prevForms => {
                const newForms = { ...prevForms };
                delete newForms[lectureId];
                return newForms;
            });
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${userToken}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error("Error creating new material:", err.response ? err.response.data : err.message);
            setError("فشل إضافة المادة.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="teacher-manage-course-content-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content dashboard-content">
                    <div className="container loading-message-container">
                        <p>جاري تحميل الكورس ومحتواه...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teacher-manage-course-content-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content dashboard-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/" className="btn btn-primary">العودة للصفحة الرئيسية</Link>
                    </div>
                </main>
            </div>
        );
    }

    // NEW: إذا كان courseId غير صالح، لا تعرض بقية الصفحة
    if (!courseId || courseId === 'undefined' || !course) {
        return (
            <div className="teacher-manage-course-content-page">
                <header className="app-header">
                    <div className="container">
                        <nav className="navbar">
                            <div className="logo"><Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link></div>
                            <ul className="nav-links"><li><Link to="/">الرئيسية</Link></li></ul>
                        </nav>
                    </div>
                </header>
                <main className="main-content dashboard-content">
                    <div className="container">
                        <p className="error-message-box">الكورس غير موجود أو غير محدد. يرجى العودة لصفحة إدارة الكورسات.</p>
                        <Link to="/teacher/my-courses" className="btn btn-primary">العودة لإدارة كورساتي</Link>
                    </div>
                </main>
            </div>
        );
    }

    const courseSubjectLabel = academicStructure.allSubjectsMap[course.subject] ? academicStructure.allSubjectsMap[course.subject].label : course.subject;

    return (
        <div className="teacher-manage-course-content-page">
            <header className="app-header">
                <div className="container">
                    <nav className="navbar">
                        <div className="logo">
                            <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/teacher/dashboard">لوحة التحكم</Link></li>
                            <li><Link to="/teacher/my-courses">إدارة كورساتي</Link></li>
                            <li><Link to="/teacher/add-course">إضافة كورس جديد</Link></li>
                        </ul>
                        <div className="auth-buttons">
                            {/* زر تسجيل خروج يمكن إضافته هنا */}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="main-content dashboard-content">
                <div className="container">
                    <h2 className="page-title">إدارة محتوى الكورس: "{course.title}"</h2>
                    <p className="course-subtitle">المادة: {courseSubjectLabel} | الصف: {academicStructure[course.academic_level]?.label}</p>
                    <p className="course-status">الحالة: {course.is_published ? 'منشور' : 'غير منشور'}</p>

                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* قسم تحديد عدد المحاضرات */}
                    <div className="manage-lectures-count-section course-section-card">
                        <h3>تحديد عدد المحاضرات في الكورس</h3>
                        <div className="form-group">
                            <label htmlFor="numLecturesInput">عدد المحاضرات:</label>
                            <input
                                type="number"
                                id="numLecturesInput"
                                value={numLecturesInput}
                                onChange={(e) => setNumLecturesInput(e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                        <button onClick={handleUpdateLecturesCount} className="btn btn-primary" disabled={loading}>
                            {loading ? 'جاري التحديث...' : 'تحديث عدد المحاضرات'}
                        </button>
                    </div>

                    {/* قائمة المحاضرات لإدارة المحتوى */}
                    <div className="lectures-list-section">
                        <h3>المحاضرات</h3>
                        {lectures.length === 0 ? (
                            <p>لم يتم إضافة محاضرات لهذا الكورس بعد. يرجى تحديد عدد المحاضرات أعلاه.</p>
                        ) : (
                            lectures.map((lecture, index) => (
                                <div key={lecture.id} className={`lecture-card ${expandedLecture === lecture.id ? 'expanded' : ''}`}>
                                    <div className="lecture-header" onClick={() => handleToggleLecture(lecture.id)}>
                                        <h4>المحاضرة {lecture.order}: {lecture.title || 'عنوان المحاضرة'}</h4>
                                        <span className="expand-icon">{expandedLecture === lecture.id ? '▲' : '▼'}</span>
                                    </div>
                                    {expandedLecture === lecture.id && (
                                        <div className="lecture-content">
                                            {/* نموذج لتعديل بيانات المحاضرة الأساسية */}
                                            <div className="form-group">
                                                <label htmlFor={`lecture-title-${lecture.id}`}>عنوان المحاضرة:</label>
                                                <input
                                                    type="text"
                                                    id={`lecture-title-${lecture.id}`}
                                                    value={lecture.title || ''}
                                                    onChange={(e) => {
                                                        const updatedLectures = [...lectures];
                                                        updatedLectures[index].title = e.target.value;
                                                        setLectures(updatedLectures);
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`lecture-description-${lecture.id}`}>وصف المحاضرة (اختياري):</label>
                                                <textarea
                                                    id={`lecture-description-${lecture.id}`}
                                                    value={lecture.description || ''}
                                                    onChange={(e) => {
                                                        const updatedLectures = [...lectures];
                                                        updatedLectures[index].description = e.target.value;
                                                        setLectures(updatedLectures);
                                                    }}
                                                ></textarea>
                                            </div>
                                            <div className="form-group checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    id={`lecture-published-${lecture.id}`}
                                                    checked={lecture.is_published}
                                                    onChange={(e) => {
                                                        const updatedLectures = [...lectures];
                                                        updatedLectures[index].is_published = e.target.checked;
                                                        setLectures(updatedLectures);
                                                    }}
                                                />
                                                <label htmlFor={`lecture-published-${lecture.id}`}>منشورة؟</label>
                                            </div>

                                            {/* قسم إضافة المواد التعليمية للمحاضرة */}
                                            <div className="lecture-materials-section">
                                                <h5>المواد التعليمية في هذه المحاضرة:</h5>
                                                {lecture.materials && lecture.materials.length > 0 ? (
                                                    <div className="materials-list">
                                                        {lecture.materials.map(material => (
                                                            <div key={material.id} className="material-item">
                                                                <span>{material.title} ({materialTypeOptions.find(opt => opt.value === material.type)?.label || material.type})</span>
                                                                <div className="material-actions">
                                                                    <button className="btn btn-sm btn-primary" onClick={() => handleUpdateMaterial(material.id, material, index)}>تعديل</button>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMaterial(material.id, index)}>حذف</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>لا توجد مواد تعليمية في هذه المحاضرة بعد.</p>
                                                )}

                                                <button 
                                                    onClick={() => handleAddNewMaterialForm(lecture.id)} 
                                                    className="btn btn-secondary add-material-btn"
                                                >
                                                    + إضافة مادة جديدة
                                                </button>

                                                {/* نموذج إضافة مادة جديد يظهر عند النقر على الزر */}
                                                {newMaterialForms[lecture.id] && (
                                                    <div className="new-material-form-card">
                                                        <h6>إضافة مادة جديدة للمحاضرة {lecture.order}:</h6>
                                                        <div className="form-group">
                                                            <label>نوع المادة:</label>
                                                            <select
                                                                value={newMaterialForms[lecture.id].type}
                                                                onChange={(e) => handleNewMaterialInputChange(lecture.id, 'type', e.target.value)}
                                                            >
                                                                <option value="">اختر نوع المادة</option>
                                                                {materialTypeOptions.map(option => (
                                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        
                                                        {newMaterialForms[lecture.id].type && newMaterialForms[lecture.id].type !== 'branch' && (
                                                            <div className="form-group">
                                                                <label>عنوان المادة:</label>
                                                                <input
                                                                    type="text"
                                                                    value={newMaterialForms[lecture.id].title}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                        )}

                                                        {/* حقول خاصة بأنواع مواد معينة */}
                                                        {newMaterialForms[lecture.id].type === 'video' && (
                                                            <div className="form-group">
                                                                <label>رابط الفيديو (URL):</label>
                                                                <input
                                                                    type="url"
                                                                    value={newMaterialForms[lecture.id].url}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'url', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        {newMaterialForms[lecture.id].type === 'pdf' && (
                                                            <div className="form-group">
                                                                <label>ملف PDF:</label>
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    onChange={(e) => handleNewMaterialFileChange(lecture.id, e.target.files[0])}
                                                                />
                                                            </div>
                                                        )}
                                                        {newMaterialForms[lecture.id].type === 'text' && (
                                                            <div className="form-group">
                                                                <label>المحتوى النصي:</label>
                                                                <textarea
                                                                    value={newMaterialForms[lecture.id].text_content}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'text_content', e.target.value)}
                                                                ></textarea>
                                                            </div>
                                                        )}
                                                        {newMaterialForms[lecture.id].type === 'link' && (
                                                            <div className="form-group">
                                                                <label>الرابط الخارجي (URL):</label>
                                                                <input
                                                                    type="url"
                                                                    value={newMaterialForms[lecture.id].url}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'url', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        {newMaterialForms[lecture.id].type === 'branch' && (
                                                            <div className="form-group">
                                                                <label>عنوان الفرع:</label>
                                                                <input
                                                                    type="text"
                                                                    value={newMaterialForms[lecture.id].title}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'title', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        {/* الواجبات والامتحانات ستكون أكثر تعقيداً هنا */}
                                                        {(newMaterialForms[lecture.id].type === 'quiz' || newMaterialForms[lecture.id].type === 'exam') && (
                                                            <div className="form-group">
                                                                <p className="note-message">
                                                                    ملاحظة: لإنشاء أسئلة الواجب/الامتحان، يرجى حفظ المادة أولاً، ثم تعديلها من لوحة الإدارة.
                                                                    أو سنقوم ببناء واجهة مخصصة لذلك لاحقاً.
                                                                </p>
                                                            </div>
                                                        )}


                                                        <button 
                                                            onClick={() => handleCreateNewMaterial(lecture.id)} 
                                                            className="btn btn-primary btn-sm"
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'جاري الإضافة...' : 'إضافة المادة'}
                                                        </button>
                                                        <button 
                                                            onClick={() => setNewMaterialForms(prevForms => {
                                                                const newForms = { ...prevForms };
                                                                delete newForms[lecture.id];
                                                                return newForms;
                                                            })} 
                                                            className="btn btn-secondary btn-sm"
                                                            disabled={loading}
                                                        >
                                                            إلغاء
                                                        </button>
                                                    </div>
                                                )}

                                            </div>

                                            <button 
                                                onClick={() => handleSaveLecture(lecture.id, 
                                                    { title: lecture.title, description: lecture.description, is_published: lecture.is_published, order: lecture.order }, 
                                                    [] // المواد الجديدة تم التعامل معها في handleCreateNewMaterial
                                                )} 
                                                className="btn btn-primary save-lecture-btn"
                                                disabled={loading}
                                            >
                                                {loading ? 'جاري الحفظ...' : 'حفظ المحاضرة'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
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

export default TeacherManageCourseContentPage;
