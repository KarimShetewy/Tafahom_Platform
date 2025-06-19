import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedUserTypes }) {
  const userToken = sessionStorage.getItem('userToken'); // تم التوحيد إلى sessionStorage
  const userType = sessionStorage.getItem('userType'); // تم التوحيد إلى sessionStorage

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    alert('ليس لديك الصلاحية الكافية للوصول إلى هذه الصفحة.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
