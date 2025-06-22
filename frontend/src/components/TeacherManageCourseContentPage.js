import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// REMOVED: import TafahomLogo from '../assets/images/tafahom_logo.png'; // لم يعد ضروريا هنا بعد نقل Navbar
import academicStructure from '../constants/academicStructure'; 
import CoursePlaceholder from '../assets/images/course_placeholder.jpg'; // صورة Placeholder للكورسات (إذا كانت مستخدمة في أي مكان)
import { AuthContext, ToastContext } from '../App'; // استيراد AuthContext و ToastContext


function TeacherManageCourseContentPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // جلب user من AuthContext للتحقق من الصلاحيات
    const showGlobalToast = useContext(ToastContext); // جلب دالة التوست

    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [numLecturesInput, setNumLecturesInput] = useState(1); // لعدد المحاضرات في حقل الإدخال
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [successMessage, setSuccessMessage] = useState(null); // لم نعد نستخدمها بشكل مباشر

    // حالة مؤقتة لنماذج إضافة المواد الجديدة لكل محاضرة
    const [newMaterialForms, setNewMaterialForms] = useState({});
    const [expandedLecture, setExpandedLecture] = useState(null);

    // خيارات أنواع المواد (لـ select input)
    const materialTypeOptions = [
        { value: '', label: 'اختر نوع المادة' },
        { value: 'video', label: 'فيديو شرح' },
        { value: 'pdf', label: 'ملف PDF' },
        { value: 'quiz', label: 'واجب' },
        { value: 'exam', label: 'امتحان' },
        { value: 'link', label: 'رابط خارجي' },
        { value: 'text', label: 'نص/شرح' },
        // { value: 'branch', label: 'إضافة فرع' }, // إذا كان "فرع" يعتبر مادة مستقلة
    ];

    useEffect(() => {
        // التحقق من صلاحيات المستخدم: إذا لم يكن معلماً أو غير مسجل الدخول، يتم توجيهه لصفحة تسجيل الدخول
        if (!user || user.userType !== 'teacher' || !user.token) {
            navigate('/login');
            return;
        }

        // التحقق من وجود courseId في الـ URL
        if (!courseId || courseId === 'undefined') {
            setError("لم يتم تحديد الكورس. يرجى العودة لصفحة إضافة الكورس أو لوحة التحكم.");
            setLoading(false);
            showGlobalToast("لم يتم تحديد الكورس.", "error");
            return;
        }

        const fetchCourseAndLectures = async () => {
            setLoading(true);
            setError(null);
            try {
                // جلب تفاصيل الكورس
                const courseResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`, {
                    headers: { 'Authorization': `Token ${user.token}` } // استخدام user.token من الـ Context
                });
                setCourse(courseResponse.data);

                // جلب المحاضرات المتعلقة بهذا الكورس
                const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                    headers: { 'Authorization': `Token ${user.token}` }
                });
                // فرز المحاضرات حسب الترتيب
                const sortedLectures = lecturesResponse.data.sort((a, b) => a.order - b.order);
                setLectures(sortedLectures);
                setNumLecturesInput(sortedLectures.length); // تحديث حقل الإدخال بعدد المحاضرات الحالي

            } catch (err) {
                console.error("Error fetching course or lectures:", err.response ? err.response.data : err.message);
                let errorMessage = "فشل تحميل تفاصيل الكورس أو المحاضرات. يرجى المحاولة لاحقاً.";
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        errorMessage = "غير مصرح لك بالوصول لهذا الكورس. يرجى تسجيل الدخول بحساب معلم صحيح.";
                        navigate('/login'); // توجيه لصفحة تسجيل الدخول
                    } else if (err.response.status === 404) {
                        errorMessage = "الكورس غير موجود أو لا تملك صلاحية الوصول إليه.";
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

        fetchCourseAndLectures();
    }, [courseId, user, navigate, showGlobalToast]); // user, navigate, showGlobalToast كـ dependencies

    // دالة لتحديث عدد المحاضرات (إضافة أو حذف محاضرات فارغة)
    const handleUpdateLecturesCount = async () => {
        setLoading(true);
        setError(null);
        try {
            const currentLecturesCount = lectures.length;
            const targetLecturesCount = parseInt(numLecturesInput);

            if (isNaN(targetLecturesCount) || targetLecturesCount < 0) {
                setError("يرجى إدخال عدد صحيح موجب للمحاضرات.");
                showGlobalToast("يرجى إدخال عدد صحيح موجب للمحاضرات.", "error");
                setLoading(false);
                return;
            }

            if (targetLecturesCount > currentLecturesCount) {
                // إضافة محاضرات جديدة
                for (let i = currentLecturesCount; i < targetLecturesCount; i++) {
                    const newLectureOrder = i + 1;
                    await axios.post(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                        course: courseId,
                        title: `المحاضرة ${newLectureOrder}`,
                        order: newLectureOrder,
                        is_published: false
                    }, {
                        headers: { 'Authorization': `Token ${user.token}` }
                    });
                }
            }
            else if (targetLecturesCount < currentLecturesCount) {
                // حذف محاضرات زائدة
                showGlobalToast(
                    `هل أنت متأكد من رغبتك في حذف ${currentLecturesCount - targetLecturesCount} محاضرة؟ هذا سيؤدي إلى حذف جميع محتواها.`,
                    'confirm',
                    async (confirmed) => {
                        if (confirmed) {
                            setLoading(true); // إعادة تفعيل التحميل بعد التأكيد
                            try {
                                for (let i = currentLecturesCount - 1; i >= targetLecturesCount; i--) {
                                    const lectureToDelete = lectures[i];
                                    await axios.delete(`http://127.0.0.1:8000/api/courses/lectures/${lectureToDelete.id}/`, {
                                        headers: { 'Authorization': `Token ${user.token}` }
                                    });
                                }
                                // إعادة جلب المحاضرات بعد التعديل
                                const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                                    headers: { 'Authorization': `Token ${user.token}` }
                                });
                                setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
                                showGlobalToast("تم تحديث عدد المحاضرات بنجاح.", "success");
                            } catch (err) {
                                console.error("Error deleting lectures:", err.response ? err.response.data : err.message);
                                setError("فشل حذف المحاضرات.");
                                showGlobalToast("فشل حذف المحاضرات.", "error");
                            } finally {
                                setLoading(false);
                            }
                        } else {
                            setNumLecturesInput(currentLecturesCount); // العودة للعدد الأصلي إذا تم الإلغاء
                            setLoading(false);
                        }
                    }
                );
                return; // الخروج من الدالة لأن التأكيد سيتم معالجته عبر الـ callback
            }
            
            // إذا لم يتم حذف أي محاضرات (أو تم الإضافة فقط)
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
            showGlobalToast("تم تحديث عدد المحاضرات بنجاح.", "success");

        } catch (err) {
            console.error("Error updating lectures count:", err.response ? err.response.data : err.message);
            setError("فشل تحديث عدد المحاضرات. يرجى المحاولة لاحقاً.");
            showGlobalToast("فشل تحديث عدد المحاضرات.", "error");
        } finally {
            setLoading(false);
        }
    };

    // دالة لحفظ تحديثات المحاضرة أو المواد الموجودة
    const handleSaveLecture = async (lectureId, updatedLectureData) => { // Removed materialsToAdd as they are handled by handleCreateNewMaterial
        setLoading(true);
        setError(null);
        try {
            const dataToUpdate = { 
                ...updatedLectureData, 
                course: courseId 
            };

            await axios.put(`http://127.0.0.1:8000/api/courses/lectures/${lectureId}/`, dataToUpdate, {
                headers: { 'Authorization': `Token ${user.token}` }
            });

            showGlobalToast("تم حفظ المحاضرة بنجاح!", "success");
            // إعادة جلب المحاضرات لتحديث الواجهة بالكامل بعد التغييرات
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));

        } catch (err) {
            console.error("Error saving lecture content:", err.response ? err.response.data : err.message);
            setError("فشل حفظ المحاضرة. يرجى المحاولة لاحقاً.");
            showGlobalToast("فشل حفظ المحاضرة.", "error");
        } finally {
            setLoading(false);
        }
    };

    // دالة لفتح/إغلاق تفاصيل المحاضرة
    const handleToggleLecture = (lectureId) => {
        setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
    };

    // دالة لتعديل بيانات مادة موجودة (مثل العنوان أو النشر)
    const handleMaterialChange = (lectureIndex, materialIndex, field, value) => {
        const updatedLectures = [...lectures];
        updatedLectures[lectureIndex].materials[materialIndex][field] = value;
        setLectures(updatedLectures);
    };

    // دالة لحذف مادة تعليمية موجودة
    const handleDeleteMaterial = async (materialId, lectureIndex) => {
        showGlobalToast(
            "هل أنت متأكد من حذف هذه المادة؟",
            "confirm",
            async (confirmed) => {
                if (confirmed) {
                    setLoading(true);
                    try {
                        await axios.delete(`http://127.0.0.1:8000/api/courses/materials/${materialId}/`, {
                            headers: { 'Authorization': `Token ${user.token}` }
                        });
                        // تحديث قائمة المواد في الـ state بعد الحذف
                        const updatedLectures = [...lectures];
                        updatedLectures[lectureIndex].materials = updatedLectures[lectureIndex].materials.filter(m => m.id !== materialId);
                        setLectures(updatedLectures);
                        showGlobalToast("تم حذف المادة بنجاح.", "success");
                    } catch (err) {
                        console.error("Error deleting material:", err.response ? err.response.data : err.message);
                        setError("فشل حذف المادة.");
                        showGlobalToast("فشل حذف المادة.", "error");
                    } finally {
                        setLoading(false);
                    }
                }
            }
        );
    };

    // دالة لتحديث مادة تعليمية موجودة (إرسال التغييرات إلى الـ backend)
    const handleUpdateMaterial = async (materialId, updatedData, lectureIndex) => {
        setLoading(true);
        setError(null);
        try {
            // تحضير البيانات للإرسال (خاصة File fields)
            const formDataToSubmit = new FormData();
            for (const key in updatedData) {
                if (updatedData[key] instanceof File) {
                    formDataToSubmit.append(key, updatedData[key]);
                } else if (updatedData[key] !== null && updatedData[key] !== undefined) {
                    formDataToSubmit.append(key, updatedData[key]);
                }
            }

            await axios.put(`http://127.0.0.1:8000/api/courses/materials/${materialId}/`, formDataToSubmit, { 
                headers: { 
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data', // مهم عند تحديث الملفات
                }
            });
            showGlobalToast("تم تحديث المادة بنجاح.", "success");
            // إعادة جلب المحاضرات لتحديث الواجهة بالكامل بعد التغييرات
            const lecturesResponse = await axios.get(`http://127.00.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error("Error updating material:", err.response ? err.response.data : err.message);
            setError("فشل تحديث المادة.");
            showGlobalToast("فشل تحديث المادة.", "error");
        } finally {
            setLoading(false);
        }
    };

    // دالة لإعداد نموذج جديد لإضافة مادة لمحاضرة معينة
    const handleAddNewMaterialForm = (lectureId) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { 
                type: '', 
                title: '', 
                url: '', 
                text_content: '', 
                is_published: false, 
                file: null, 
                order: (lectures.find(l => l.id === lectureId)?.materials?.length || 0) + 1,
                quiz_details: { 
                    questions: [{ question_text: '', points: 1, choices: [{ choice_text: '', is_correct: false }] }] ,
                    duration_minutes: null, 
                    passing_score_percentage: null,
                }
            }
        }));
    };

    // دالة لتغيير حقول نموذج إضافة مادة جديدة
    const handleNewMaterialInputChange = (lectureId, field, value) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { ...prevForms[lectureId], [field]: value }
        }));
    };

    // دالة لتغيير حقل الملف في نموذج إضافة مادة جديدة
    const handleNewMaterialFileChange = (lectureId, file) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: { ...prevForms[lectureId], file: file }
        }));
    };

    // NEW: التعامل مع تغييرات حقول الواجب/الامتحان في نموذج إضافة مادة جديدة
    const handleQuizDetailChange = (lectureId, field, value) => {
        setNewMaterialForms(prevForms => ({
            ...prevForms,
            [lectureId]: {
                ...prevForms[lectureId],
                quiz_details: {
                    ...prevForms[lectureId].quiz_details,
                    [field]: value
                }
            }
        }));
    };

    // NEW: إضافة سؤال جديد للواجب/الامتحان في نموذج إضافة مادة جديدة
    const handleAddQuestion = (lectureId) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: [
                            ...currentQuizDetails.questions,
                            { question_text: '', points: 1, choices: [{ choice_text: '', is_correct: false }] }
                        ]
                    }
                }
            };
        });
    };

    // NEW: حذف سؤال من الواجب/الامتحان في نموذج إضافة مادة جديدة
    const handleRemoveQuestion = (lectureId, qIndex) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            const newQuestions = currentQuizDetails.questions.filter((_, i) => i !== qIndex);
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: newQuestions
                    }
                }
            };
        });
    };

    // NEW: تغيير نص السؤال أو درجاته في نموذج إضافة مادة جديدة
    const handleQuestionChange = (lectureId, qIndex, field, value) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            const newQuestions = [...currentQuizDetails.questions];
            newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: newQuestions
                    }
                }
            };
        });
    };

    // NEW: إضافة خيار جديد لسؤال في نموذج إضافة مادة جديدة
    const handleAddChoice = (lectureId, qIndex) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            const newQuestions = [...currentQuizDetails.questions];
            newQuestions[qIndex] = {
                ...newQuestions[qIndex],
                choices: [...newQuestions[qIndex].choices, { choice_text: '', is_correct: false }]
            };
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: newQuestions
                    }
                }
            };
        });
    };

    // NEW: حذف خيار من سؤال في نموذج إضافة مادة جديدة
    const handleRemoveChoice = (lectureId, qIndex, cIndex) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            const newQuestions = [...currentQuizDetails.questions];
            newQuestions[qIndex] = {
                ...newQuestions[qIndex],
                choices: newQuestions[qIndex].choices.filter((_, i) => i !== cIndex)
            };
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: newQuestions
                    }
                }
            };
        });
    };

    // NEW: تغيير نص الخيار أو تحديد إذا ما كان صحيحاً في نموذج إضافة مادة جديدة
    const handleChoiceChange = (lectureId, qIndex, cIndex, field, value) => {
        setNewMaterialForms(prevForms => {
            const currentQuizDetails = prevForms[lectureId].quiz_details;
            const newQuestions = [...currentQuizDetails.questions];
            const newChoices = [...newQuestions[qIndex].choices];

            if (field === 'is_correct') {
                newChoices.forEach((choice, idx) => {
                    newChoices[idx] = { ...choice, is_correct: (idx === cIndex ? value : false) };
                });
            } else {
                newChoices[cIndex] = { ...newChoices[cIndex], [field]: value };
            }
            
            newQuestions[qIndex] = { ...newQuestions[qIndex], choices: newChoices };
            return {
                ...prevForms,
                [lectureId]: {
                    ...prevForms[lectureId],
                    quiz_details: {
                        ...currentQuizDetails,
                        questions: newQuestions
                    }
                }
            };
        });
    };


    // دالة لإنشاء مادة تعليمية جديدة للمحاضرة
    const handleCreateNewMaterial = async (lectureId) => {
        setLoading(true);
        setError(null);
        try {
            const newMaterialData = newMaterialForms[lectureId];
            if (!newMaterialData || !newMaterialData.type || !newMaterialData.title) {
                setError("نوع وعنوان المادة مطلوبان.");
                showGlobalToast("نوع وعنوان المادة مطلوبان.", "error");
                setLoading(false);
                return;
            }

            const formDataToSubmit = new FormData();
            formDataToSubmit.append('lecture', lectureId);
            formDataToSubmit.append('title', newMaterialData.title);
            formDataToSubmit.append('type', newMaterialData.type);
            formDataToSubmit.append('order', newMaterialData.order);
            formDataToSubmit.append('is_published', newMaterialData.is_published);
            
            // إضافة الحقول بناءً على النوع
            if (newMaterialData.type === 'video' || newMaterialData.type === 'pdf') { 
                if (newMaterialData.file) {
                    formDataToSubmit.append('file', newMaterialData.file);
                } else {
                    setError("ملف المادة مطلوب للفيديو أو الـ PDF.");
                    showGlobalToast("ملف المادة مطلوب للفيديو أو الـ PDF.", "error");
                    setLoading(false);
                    return;
                }
            } else if (newMaterialData.type === 'link') { 
                if (newMaterialData.url) {
                    formDataToSubmit.append('url', newMaterialData.url);
                } else {
                    setError("رابط المادة مطلوب.");
                    showGlobalToast("رابط المادة مطلوب.", "error");
                    setLoading(false);
                    return;
                }
            } else if (newMaterialData.type === 'text') { 
                if (newMaterialData.text_content) {
                    formDataToSubmit.append('text_content', newMaterialData.text_content);
                } else {
                    setError("محتوى المادة النصي مطلوب.");
                    showGlobalToast("محتوى المادة النصي مطلوب.", "error");
                    setLoading(false);
                    return;
                }
            } else if (newMaterialData.type === 'quiz' || newMaterialData.type === 'exam') {
                // هنا نرسل بيانات الواجب/الامتحان المتداخلة كـ JSON string
                // الـ Backend سيتولى إنشاء QuizOrAssignment والأسئلة والخيارات
                if (newMaterialData.quiz_details && newMaterialData.quiz_details.questions.length > 0) {
                    formDataToSubmit.append('quiz_details', JSON.stringify(newMaterialData.quiz_details));
                } else {
                    setError("يجب إضافة سؤال واحد على الأقل للواجب/الامتحان.");
                    showGlobalToast("يجب إضافة سؤال واحد على الأقل للواجب/الامتحان.", "error");
                    setLoading(false);
                    return;
                }
            }
            // بقية الأنواع (branch) لا تحتاج حقول إضافية هنا لإنشائها مبدئياً

            await axios.post(`http://127.0.0.1:8000/api/courses/lectures/${lectureId}/materials/`, formDataToSubmit, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data', // ضروري لإرسال FormData
                }
            });
            showGlobalToast("تم إضافة المادة بنجاح!", "success");
            setNewMaterialForms(prevForms => {
                const newForms = { ...prevForms };
                delete newForms[lectureId]; // مسح نموذج المادة الجديدة بعد الإضافة
                return newForms;
            });
            // إعادة جلب المحاضرات لتحديث الواجهة بالكامل
            const lecturesResponse = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/lectures/`, {
                headers: { 'Authorization': `Token ${user.token}` }
            });
            setLectures(lecturesResponse.data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.error("Error creating new material:", err.response ? err.response.data : err.message);
            let errorMessage = "فشل إضافة المادة.";
            if (axios.isAxiosError(err) && err.response && err.response.data) {
                const apiErrors = err.response.data;
                if (typeof apiErrors === 'object') {
                    const detailed = Object.entries(apiErrors).map(([key, value]) => {
                        return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
                    }).join('\n');
                    errorMessage += `\n${detailed}`;
                } else if (apiErrors.detail) {
                    errorMessage += `\n${apiErrors.detail}`;
                } else {
                    errorMessage += `\n${JSON.stringify(apiErrors)}`;
                }
            }
            setError(errorMessage);
            showGlobalToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="teacher-manage-course-content-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
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
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
                    <div className="container error-message-container">
                        <p className="error-message-box">{error}</p>
                        <Link to="/teacher/my-courses" className="btn btn-primary">العودة لإدارة كورساتي</Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!courseId || courseId === 'undefined' || !course) {
        return (
            <div className="teacher-manage-course-content-page">
                {/* REMOVED: Header/Navbar is now in App.js */}
                <main className="main-content">
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
            {/* REMOVED: Header/Navbar is now in App.js */}

            <main className="main-content dashboard-content">
                <div className="container">
                    <h2 className="page-title">إدارة محتوى الكورس: "{course.title}"</h2>
                    <p className="course-subtitle">المادة: {courseSubjectLabel} | الصف: {academicStructure[course.academic_level]?.label}</p>
                    <p className="course-status">الحالة: {course.is_published ? 'منشور' : 'غير منشور'}</p>

                    {/* لا نستخدم successMessage هنا */}
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
                                                    required
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
                                                                    required /* جعل العنوان مطلوباً هنا */
                                                                />
                                                            </div>
                                                        )}

                                                        {newMaterialForms[lecture.id].type === 'video' && (
                                                            <div className="form-group">
                                                                <label>ملف الفيديو (MP4, MOV, etc.):</label>
                                                                <input
                                                                    type="file"
                                                                    accept="video/*"
                                                                    onChange={(e) => handleNewMaterialFileChange(lecture.id, e.target.files[0])}
                                                                    required /* جعل الملف مطلوباً هنا */
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
                                                                    required /* جعل الملف مطلوباً هنا */
                                                                />
                                                            </div>
                                                        )}
                                                        {newMaterialForms[lecture.id].type === 'text' && (
                                                            <div className="form-group">
                                                                <label>المحتوى النصي:</label>
                                                                <textarea
                                                                    value={newMaterialForms[lecture.id].text_content}
                                                                    onChange={(e) => handleNewMaterialInputChange(lecture.id, 'text_content', e.target.value)}
                                                                    required /* جعل النص مطلوباً هنا */
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
                                                                    required /* جعل الرابط مطلوباً هنا */
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
                                                                    required /* جعل العنوان مطلوباً هنا */
                                                                />
                                                            </div>
                                                        )}
                                                        {(newMaterialForms[lecture.id].type === 'quiz' || newMaterialForms[lecture.id].type === 'exam') && (
                                                            <div className="form-group">
                                                                <p className="note-message">
                                                                    ملاحظة: لإنشاء أسئلة الواجب/الامتحان، يرجى حفظ المادة أولاً، ثم تعديلها من لوحة الإدارة.
                                                                    أو سنقوم ببناء واجهة مخصصة لذلك لاحقاً.
                                                                </p>
                                                                {/* يمكنك إضافة حقول لـ duration_minutes و passing_score_percentage هنا */}
                                                                <div className="form-group">
                                                                    <label>مدة الواجب/الامتحان (بالدقائق):</label>
                                                                    <input
                                                                        type="number"
                                                                        value={newMaterialForms[lecture.id].quiz_details.duration_minutes || ''}
                                                                        onChange={(e) => handleQuizDetailChange(lecture.id, 'duration_minutes', e.target.value)}
                                                                        min="1"
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>نسبة النجاح (%):</label>
                                                                    <input
                                                                        type="number"
                                                                        value={newMaterialForms[lecture.id].quiz_details.passing_score_percentage || ''}
                                                                        onChange={(e) => handleQuizDetailChange(lecture.id, 'passing_score_percentage', e.target.value)}
                                                                        min="0"
                                                                        max="100"
                                                                    />
                                                                </div>

                                                                {/* قسم الأسئلة */}
                                                                <div className="quiz-questions-section">
                                                                    <h6>الأسئلة:</h6>
                                                                    {newMaterialForms[lecture.id].quiz_details.questions.map((question, qIndex) => (
                                                                        <div key={qIndex} className="quiz-question-item">
                                                                            <div className="form-group">
                                                                                <label>نص السؤال {qIndex + 1}:</label>
                                                                                <textarea
                                                                                    value={question.question_text}
                                                                                    onChange={(e) => handleQuestionChange(lecture.id, qIndex, 'question_text', e.target.value)}
                                                                                    required
                                                                                ></textarea>
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label>الدرجة:</label>
                                                                                <input
                                                                                    type="number"
                                                                                    value={question.points}
                                                                                    onChange={(e) => handleQuestionChange(lecture.id, qIndex, 'points', e.target.value)}
                                                                                    min="1"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <h6>الخيارات:</h6>
                                                                            {question.choices.map((choice, cIndex) => (
                                                                                <div key={cIndex} className="quiz-choice-item">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={choice.choice_text}
                                                                                        onChange={(e) => handleChoiceChange(lecture.id, qIndex, cIndex, 'choice_text', e.target.value)}
                                                                                        required
                                                                                    />
                                                                                    <label>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`correct_choice_q${qIndex}`}
                                                                                            checked={choice.is_correct}
                                                                                            onChange={(e) => handleChoiceChange(lecture.id, qIndex, cIndex, 'is_correct', e.target.checked)}
                                                                                        />
                                                                                        صحيح
                                                                                    </label>
                                                                                    <button type="button" onClick={() => handleRemoveChoice(lecture.id, qIndex, cIndex)} className="btn btn-danger btn-sm">X</button>
                                                                                </div>
                                                                            ))}
                                                                            <button type="button" onClick={() => handleAddChoice(lecture.id, qIndex)} className="btn btn-secondary btn-sm">
                                                                                + خيار
                                                                            </button>
                                                                            {question.choices.length < 2 && <span className="error-message">يجب إضافة خيارين على الأقل.</span>}
                                                                            {question.choices.filter(c => c.is_correct).length === 0 && <span className="error-message">يجب تحديد إجابة صحيحة واحدة على الأقل.</span>}

                                                                            <button type="button" onClick={() => handleRemoveQuestion(lecture.id, qIndex)} className="btn btn-danger btn-sm">حذف سؤال</button>
                                                                        </div>
                                                                    ))}
                                                                    <button type="button" onClick={() => handleAddQuestion(lecture.id)} className="btn btn-primary btn-sm">
                                                                        + سؤال جديد
                                                                    </button>
                                                                </div>
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
                                                                delete newForms[lecture.id]; // مسح نموذج المادة الجديدة بعد الإلغاء
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
                                                    { title: lecture.title, description: lecture.description, is_published: lecture.is_published, order: lecture.order }
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