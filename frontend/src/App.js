import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; 

// استيراد جميع مكونات الصفحات
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import StudentRegistrationPage from './components/StudentRegistrationPage';
import TeacherRegistrationPage from './components/TeacherRegistrationPage';
import TeamRegistrationPage from './components/TeamRegistrationPage';
import RegisterPage from './components/RegisterPage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import TeamDashboard from './components/TeamDashboard';
import TeacherAddCoursePage from './components/TeacherAddCoursePage';
import TeacherMyCoursesPage from './components/TeacherMyCoursesPage';
import SubjectDetailPage from './components/SubjectDetailPage';
import TeacherManageCourseContentPage from './components/TeacherManageCourseContentPage';
import TeacherProfilePage from './components/TeacherProfilePage';
import CourseDetailPage from './components/CourseDetailPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/Navbar'; 

// استيراد جميع ملفات CSS الخاصة بالمكونات لضمان تحميلها
import './App.css'; 
import './index.css'; 
import './components/CourseDetailPage.css';
import './components/Dashboard.css'; 
import './components/TeacherAddCoursePage.css';
import './components/LoginPage.css'; 
import './components/SubjectDetailPage.css'; 
import './components/TeacherMyCoursesPage.css';
import './components/TeacherProfilePage.css';
import './components/StudentDashboard.css'; 
import './components/TeamDashboard.css'; 
import './components/RegisterPage.css'; 
import './components/StudentRegistrationPage.css'; 
import './components/TeacherRegistrationPage.css'; 
import './components/TeamRegistrationPage.css'; 


import Toast from './components/Toast'; 

// تعريف Contexts لـ React
export const ToastContext = createContext(null); 
export const AuthContext = createContext(null); 

function App() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('appTheme');
        return savedTheme || 'dark'; 
    });

    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('info');
    const [currentToastCallback, setCurrentToastCallback] = useState(null); 

    const [user, setUser] = useState(() => {
        const storedToken = sessionStorage.getItem('userToken');
        const storedUserType = sessionStorage.getItem('userType');
        const storedFirstName = sessionStorage.getItem('firstName');
        const storedLastName = sessionStorage.getItem('lastName'); 
        const storedUserImage = sessionStorage.getItem('userImage');
        const storedUserId = sessionStorage.getItem('userId');

        if (storedToken && storedUserType) {
            return {
                token: storedToken,
                userType: storedUserType,
                firstName: storedFirstName,
                lastName: storedLastName, 
                userImage: storedUserImage,
                userId: storedUserId,
            };
        }
        return null; 
    });

    // إعداد Axios للتعامل مع CSRF Token
    useEffect(() => {
        axios.defaults.xsrfCookieName = 'csrftoken';
        axios.defaults.xsrfHeaderName = 'X-CSRFToken';
        axios.defaults.withCredentials = true; 

        const getCookie = (name) => {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        };

        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
            axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
        } else {
            console.warn("CSRFToken cookie not found. This might lead to 403 Forbidden errors for POST requests.");
        }

        document.body.className = theme === 'dark' ? '' : 'light-theme';
        localStorage.setItem('appTheme', theme);

    }, [theme]); 

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const showGlobalToast = (message, type = 'info', callback = null) => {
        setToastMessage(message);
        setToastType(type);
        setCurrentToastCallback(() => callback); 
    };

    const dismissGlobalToast = () => {
        setToastMessage(null);
        setCurrentToastCallback(null);
    };

    const login = (userData) => {
        sessionStorage.setItem('userToken', userData.token);
        sessionStorage.setItem('userType', userData.userType);
        sessionStorage.setItem('firstName', userData.firstName);
        sessionStorage.setItem('lastName', userData.lastName);
        sessionStorage.setItem('userImage', userData.userImage || '');
        sessionStorage.setItem('userId', userData.userId);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.clear(); 
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout }}> 
            <ToastContext.Provider value={showGlobalToast}> 
                <Router>
                    <div className="App">
                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            {theme === 'dark' ? 'الوضع النهاري ☀️' : 'الوضع الليلي 🌙'}
                        </button>

                        <Navbar /> 

                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} /> 
                            <Route path="/register/student" element={<StudentRegistrationPage />} />
                            <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
                            <Route path="/register/team" element={<TeamRegistrationPage />} />
                            
                            <Route path="/subjects/:levelKey/:subjectName" element={<SubjectDetailPage />} />
                            <Route path="/teachers/:teacherId" element={<TeacherProfilePage />} />
                            <Route path="/course/:id" element={<CourseDetailPage />} />

                            <Route element={<ProtectedRoute allowedUserTypes={['student']} />}>
                                <Route path="/student/dashboard" element={<StudentDashboard />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedUserTypes={['teacher']} />}>
                                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                                <Route path="/teacher/add-course" element={<TeacherAddCoursePage />} />
                                <Route path="/teacher/my-courses" element={<TeacherMyCoursesPage />} />
                                <Route path="/teacher/courses/:courseId/manage-content" element={<TeacherManageCourseContentPage />} />
                                <Route path="/teacher/profile" element={<TeacherProfilePage />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedUserTypes={['team_member', 'admin']} />}> 
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
                <Toast message={toastMessage} type={toastType} onDismiss={dismissGlobalToast} toastCallback={currentToastCallback} />
            </ToastContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;