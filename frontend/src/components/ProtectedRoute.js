import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../App'; // استيراد AuthContext

// ProtectedRoute component
// يتحقق مما إذا كان المستخدم مسجلاً دخوله ولديه الصلاحيات المطلوبة
// إذا كان كذلك، يعرض المحتوى (Outlet)، وإلا يعيد التوجيه (Navigate) لصفحة تسجيل الدخول.
function ProtectedRoute({ allowedUserTypes }) {
    const { user } = useContext(AuthContext); // جلب معلومات المستخدم من الـ Context

    // إذا لم يكن هناك مستخدم مسجل دخوله، أو لم يكن لديه توكن، قم بإعادة التوجيه لصفحة تسجيل الدخول
    if (!user || !user.token) {
        return <Navigate to="/login" replace />;
    }

    // إذا تم تحديد أنواع مستخدمين مسموح بها ولم يكن نوع المستخدم الحالي ضمنها، قم بإعادة التوجيه لصفحة غير مصرح بها أو الرئيسية
    if (allowedUserTypes && allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
        // يمكنك هنا التوجيه لصفحة "غير مصرح لك" بدلاً من الرئيسية أو تسجيل الدخول
        return <Navigate to="/" replace />; // توجيه للصفحة الرئيسية مثلاً
    }

    // إذا كان المستخدم مسجلاً دخوله ولديه الصلاحيات، اعرض المكونات الفرعية
    return <Outlet />;
}

export default ProtectedRoute;