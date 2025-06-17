import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // لتنسيقات الـ header والـ navbar المشتركة

// استيراد جميع المكونات (الصفحات) التي تم إنشاؤها
import HomePage from './components/HomePage';
import StudentRegistrationPage from './components/StudentRegistrationPage';
import TeacherRegistrationPage from './components/TeacherRegistrationPage';
import TeamRegistrationPage from './components/TeamRegistrationPage';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import TeamDashboard from './components/TeamDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // استيراد مكون الحماية
import SubjectDetailPage from './components/SubjectDetailPage'; // لتفاصيل المواد
import TeacherAddCoursePage from './components/TeacherAddCoursePage'; // استيراد المكون الجديد لإضافة الكورس

function App() {
  // حالة الثيم: 'dark' أو 'light'
  const [theme, setTheme] = useState(() => {
    // جلب الثيم من localStorage عند تحميل التطبيق، أو استخدام 'dark' كافتراضي
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme || 'dark'; // الوضع الليلي هو الافتراضي
  });

  // تأثير لاستخدام الثيم على عنصر <body> في الـ HTML
  useEffect(() => {
    document.body.className = theme === 'dark' ? '' : 'light-theme';
    localStorage.setItem('appTheme', theme); // حفظ الثيم في localStorage
  }, [theme]);

  // دالة التبديل بين الثيمات
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className="App">
        {/* زر التبديل للثيم - يمكن وضعه في أي مكان يناسبك في الـ Header أو Footer */}
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'الوضع النهاري ☀️' : 'الوضع الليلي 🌙'}
        </button>

        <Routes>
          {/* المسارات العامة (غير المحمية) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register/student" element={<StudentRegistrationPage />} />
          <Route path="/register/team" element={<TeamRegistrationPage />} />
          <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* مسار صفحة تفاصيل المادة - تم تصحيح ":level" إلى ":levelKey" */}
          <Route path="/subjects/:levelKey/:subjectName" element={<SubjectDetailPage />} />

          {/* مسارات لوحات التحكم المحمية */}
          {/* مسارات الطلاب وأعضاء الفريق */}
          <Route element={<ProtectedRoute allowedUserTypes={['student', 'team_member']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/team/dashboard" element={<TeamDashboard />} />
          </Route>
          
          {/* مسارات الأستاذ المحمية */}
          <Route element={<ProtectedRoute allowedUserTypes={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/add-course" element={<TeacherAddCoursePage />} /> {/* المسار الجديد لإضافة الكورس */}
          </Route>

          {/* يمكن إضافة مسار fallback لأي صفحات غير موجودة (مثل صفحة 404) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;