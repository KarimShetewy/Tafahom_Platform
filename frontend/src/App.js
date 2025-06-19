import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import StudentRegistrationPage from './components/StudentRegistrationPage';
import TeacherRegistrationPage from './components/TeacherRegistrationPage';
import TeamRegistrationPage from './components/TeamRegistrationPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeamDashboard from './components/TeamDashboard';
import TeacherAddCoursePage from './components/TeacherAddCoursePage';
import TeacherMyCoursesPage from './components/TeacherMyCoursesPage';
import SubjectDetailPage from './components/SubjectDetailPage';
import TeacherManageCourseContentPage from './components/TeacherManageCourseContentPage';
import TeacherProfilePage from './components/TeacherProfilePage';
import CourseDetailPage from './components/CourseDetailPage'; // NEW IMPORT
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import './index.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    document.body.className = theme === 'dark' ? '' : 'light-theme';
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className="App">
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'الوضع النهاري ☀️' : 'الوضع الليلي 🌙'}
        </button>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/student" element={<StudentRegistrationPage />} />
          <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
          <Route path="/register/team" element={<TeamRegistrationPage />} />
          
          <Route path="/subjects/:levelKey/:subjectName" element={<SubjectDetailPage />} />
          <Route path="/teachers/:teacherId" element={<TeacherProfilePage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} /> {/* NEW ROUTE */}

          <Route element={<ProtectedRoute allowedUserTypes={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedUserTypes={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/add-course" element={<TeacherAddCoursePage />} />
            <Route path="/teacher/my-courses" element={<TeacherMyCoursesPage />} />
            <Route path="/teacher/courses/:courseId/manage-content" element={<TeacherManageCourseContentPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedUserTypes={['team_member']} />}>
            <Route path="/team/dashboard" element={<TeamDashboard />} />
          </Route>

          <Route path="/about" element={<p>About Page Content</p>} />
          <Route path="/teachers-list" element={<p>Teachers List Page Content</p>} />
          <Route path="/courses" element={<p>Courses List Page Content</p>} />
          <Route path="/contact" element={<p>Contact Page Content</p>} />

          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
