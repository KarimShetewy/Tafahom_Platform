import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedUserTypes }) {
  const userToken = localStorage.getItem('userToken');
  const userType = localStorage.getItem('userType');

  // إذا لم يكن هناك توكن، قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان هناك توكن ولكن نوع المستخدم غير مسموح به لهذه الصفحة
  // (إذا كان `allowedUserTypes` محدداً)
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    // يمكنك توجيهه لصفحة خطأ 403 أو لوحة تحكم افتراضية
    alert('ليس لديك الصلاحية الكافية للوصول إلى هذه الصفحة.');
    // هنا يمكن أن توجيه لـ /dashboard بناءً على الـ userType أو إلى /
    return <Navigate to="/" replace />; // توجيه لصفحة رئيسية أو صفحة غير مصرح بها
  }

  // إذا كان كل شيء على ما يرام، قم بعرض المكونات الفرعية (الصفحة المحمية)
  return <Outlet />;
}

export default ProtectedRoute;