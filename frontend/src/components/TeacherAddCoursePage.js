import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TafahomLogo from '../assets/images/tafahom_logo.png';
import academicStructure from '../constants/academicStructure'; 

// يمكنك إزالة هذه الثوابت إذا لم تعد تستخدمها في هذه الصفحة
// const GENDER_CHOICES = [ ... ];
// const ALL_GOVERNORATES_FOR_SELECT = [ ... ];
// const TEACHER_CATEGORY_CHOICES = [ ... ];

function TeacherAddCoursePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    academic_level: '',
    // NEW: أزل academic_track و subject من الحالة الأولية للنموذج
    course_type: 'regular',
    is_published: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [userToken] = useState(sessionStorage.getItem('userToken') || null);
  const [userType] = useState(sessionStorage.getItem('userType') || null);
  const [teacherSpecializedSubject, setTeacherSpecializedSubject] = useState(null); 
  const [specializedSubjectLabelDisplay, setSpecializedSubjectLabelDisplay] = useState(null);


  useEffect(() => {
      if (!userToken || userType !== 'teacher') {
          navigate('/login');
          return;
      }
      const fetchTeacherProfile = async () => {
          try {
              const profileResponse = await axios.get('http://127.0.0.1:8000/api/users/profile/', { 
                  headers: { 'Authorization': `Token ${userToken}` }
              });
              if (profileResponse.data.specialized_subject_display) {
                  const specializedSubjectLabel = profileResponse.data.specialized_subject_display;
                  const specializedSubjectValue = Object.keys(academicStructure.allSubjectsMap).find(
                      key => academicStructure.allSubjectsMap[key].label === specializedSubjectLabel
                  );

                  if (specializedSubjectValue) {
                      setSpecializedSubjectLabelDisplay(specializedSubjectLabel);
                      setTeacherSpecializedSubject(specializedSubjectValue);
                      
                      // NEW: لم نعد نعين subject في formData هنا لأنها ستأتي من Backend
                      // setFormData(prevData => ({
                      //     ...prevData,
                      //     subject: specializedSubjectValue
                      // }));
                  } else {
                      setError("تخصص الأستاذ غير معروف في الهيكل الأكاديمي. يرجى الاتصال بالمسؤول.");
                  }
              } else {
                  setError("لا يوجد تخصص محدد لحسابك. يرجى الاتصال بالمسؤول.");
              }
          } catch (err) {
              console.error("Error fetching teacher's specialized subject:", err.response ? err.response.data : err.message);
              setError("فشل جلب تخصص الأستاذ. يرجى إعادة تسجيل الدخول.");
          }
      };
      fetchTeacherProfile();
  }, [userToken, userType, navigate]);


  const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prevData => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,
      }));
  };

  const handleFileChange = (e) => {
      const { name, files } = e.target;
      setFormData(prevData => ({
          ...prevData,
          [name]: files[0],
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // NEW: لم نعد بحاجة للتحقق من teacherSpecializedSubject هنا، لأن الـ Backend سيتولى التعيين
    // if (!teacherSpecializedSubject) { ... }

    // NEW: أزل هذا التحقق بالكامل
    // if (formData.subject !== teacherSpecializedSubject) { ... }

    const data = new FormData();
    for (const key in formData) {
         if (key === 'image') {
            if (formData.image) {
                data.append('image', formData.image);
            }
        } else if (formData[key] !== null && formData[key] !== '') {
            data.append(key, formData[key]);
        }
    }
    // NEW: ليس هناك حاجة لإضافة academic_track فارغاً هنا، لأن الـ Backend سيتولى تعيينه None
    // if (!formData.academic_track) { data.append('academic_track', ''); }


    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/courses/create/',
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${userToken}`,
                },
            }
        );
        setSuccessMessage('تم إضافة الكورس بنجاح!');
        const newCourseId = response.data.id;

        navigate(`/teacher/courses/${newCourseId}/manage-content`);

    } catch (err) {
        console.error('Error adding course:', err.response ? err.response.data : err.message);
        let errorMessage = 'حدث خطأ أثناء إضافة الكورس. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
        if (err.response && err.response.data) {
            const apiErrors = err.response.data;
            let detailedErrors = [];
            for (const field in apiErrors) {
                const errorMessages = apiErrors[field];
                if (Array.isArray(errorMessages)) {
                    detailedErrors.push(`${field}: ${errorMessages.join(', ')}`);
                } else {
                    detailedErrors.push(`${field}: ${errorMessages}`);
                }
            }
            if (detailedErrors.length > 0) {
                errorMessage = `فشل إضافة الكورس:\n${detailedErrors.join('\n')}`;
            } else if (apiErrors.detail) {
                errorMessage = `خطأ: ${apiErrors.detail}`;
            }
        }
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  if (!userToken || userType !== 'teacher') {
      return <p>جاري إعادة التوجيه... (غير مصرح)</p>;
  }

  return (
      <div className="teacher-add-course-page">
          <header className="app-header">
              <div className="container">
                  <nav className="navbar">
                      <div className="logo">
                          <Link to="/"><img src={TafahomLogo} alt="Tafahom Logo" className="navbar-logo" /></Link>
                      </div>
                      <ul className="nav-links">
                          <li><Link to="/teacher/dashboard">لوحة التحكم</Link></li>
                          <li><Link to="/teacher/my-courses">إدارة كورساتي</Link></li>
                      </ul>
                      <div className="auth-buttons">
                          {/* زر تسجيل خروج يمكن إضافته هنا */}
                      </div>
                  </nav>
              </div>
          </header>

          <main className="main-content">
              <div className="container">
                  <h2>إضافة كورس جديد</h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}

                  <form onSubmit={handleSubmit} className="course-form">
                      <div className="form-group">
                          <label htmlFor="title">عنوان الكورس:</label>
                          <input
                              type="text"
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                          />
                      </div>

                      <div className="form-group">
                          <label htmlFor="description">وصف الكورس:</label>
                          <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              required
                          ></textarea>
                      </div>

                      <div className="form-group">
                          <label htmlFor="price">سعر الكورس (جنيه):</label>
                          <input
                              type="number"
                              id="price"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              step="0.01"
                              required
                          ></input>
                      </div>

                      <div className="form-group">
                          <label htmlFor="image">صورة الكورس:</label>
                          <input
                              type="file"
                              id="image"
                              name="image"
                              accept="image/*"
                              onChange={handleFileChange}
                          />
                          {formData.image && <p>الملف المحدد: {formData.image.name}</p>}
                      </div>

                      <div className="form-group">
                          <label htmlFor="academic_level">الصف الدراسي:</label>
                          <select
                              id="academic_level"
                              name="academic_level"
                              value={formData.academic_level}
                              onChange={handleInputChange}
                              required
                          >
                              <option value="">اختر الصف</option>
                              {Object.keys(academicStructure).map(levelKey => (
                                  <option key={levelKey} value={levelKey}>
                                      {academicStructure[levelKey].label}
                                  </option>
                              ))}
                          </select>
                      </div>

                      {/* NEW: تم إزالة حقل المسار الدراسي */}
                      {/*
                      <div className="form-group">
                          <label htmlFor="academic_track">المسار الدراسي (اختياري):</label>
                          <select
                              id="academic_track"
                              name="academic_track"
                              value={formData.academic_track}
                              onChange={handleInputChange}
                          >
                              <option value="">اختر المسار (إن وجد)</option>
                              {formData.academic_level && academicStructure[formData.academic_level] && academicStructure[formData.academic_level].tracks &&
                                  Object.keys(academicStructure[formData.academic_level].tracks).map(trackKey => (
                                      <option key={trackKey} value={trackKey}>
                                          {academicStructure[formData.academic_level].tracks[trackKey].label}
                                      </option>
                                  ))
                              }
                          </select>
                      </div>
                      */}

                      {/* حقل المادة للقراءة فقط (معروض لتوضيح التخصص) */}
                      {specializedSubjectLabelDisplay && (
                          <div className="form-group">
                              <label htmlFor="subject-auto">المادة (تخصصك):</label>
                              <input
                                  type="text"
                                  id="subject-auto"
                                  value={specializedSubjectLabelDisplay}
                                  readOnly
                                  className="read-only-field"
                              />
                              {/* NEW: لم نعد نرسل حقل hidden باسم 'subject' من هنا، لأن الـ Backend سيتولى تعيينه */}
                              {/*
                              <input
                                  type="hidden"
                                  name="subject"
                                  value={teacherSpecializedSubject}
                              />
                              */}
                              <p className="subject-restriction-message">
                                  <small>سيتم إنشاء الكورس تلقائياً في مادة <strong>{specializedSubjectLabelDisplay}</strong>.</small>
                              </p>
                          </div>
                      )}

                      <div className="form-group">
                          <label htmlFor="course_type">نوع الكورس:</label>
                          <select
                              id="course_type"
                              name="course_type"
                              value={formData.course_type}
                              onChange={handleInputChange}
                              required
                          >
                              <option value="regular">كورس عادي</option>
                              <option value="separate">كورس منفصل (مراجعة/برنامج خاص)</option>
                          </select>
                      </div>

                      <div className="form-group checkbox-group">
                          <input
                              type="checkbox"
                              id="is_published"
                              name="is_published"
                              checked={formData.is_published}
                              onChange={handleInputChange}
                          />
                          <label htmlFor="is_published">نشر الكورس فوراً؟</label>
                      </div>

                      <button type="submit" disabled={loading} className="btn btn-primary">
                          {loading ? 'جاري الإضافة...' : 'إضافة الكورس'}
                      </button>
                  </form>
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

export default TeacherAddCoursePage;