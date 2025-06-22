# users/urls.py

from django.urls import path
from . import views 


urlpatterns = [
    # مسارات لتقديم طلبات إنشاء الحساب لأنواع المستخدمين المختلفة
    path('register/student/', views.StudentRegistrationView.as_view(), name='student_register'),
    path('register/teacher/', views.TeacherRegistrationView.as_view(), name='teacher_register'),
    path('register/team/', views.TeamRegistrationView.as_view(), name='team_register'),

    # REMOVED: مسارات المصادقة (Auth) مثل login و logout لم تعد معرفة هنا،
    # بل يتم التعامل معها بواسطة Djoser مباشرة من tafahom_project/urls.py
    # path('auth/login/', views.LoginView.as_view(), name='login'), 
    # path('auth/logout/', views.LogoutView.as_view(), name='logout'), 

    # مسار لجلب وتعديل بروفايل المستخدم الحالي (المسجل دخوله)
    # ملاحظة: djoser يوفر أيضاً /api/auth/users/me/ لنفس الغرض
    path('profile/', views.UserProfileView.as_view(), name='user_profile'), 
    
    # مسار لجلب تفاصيل معلم معين بواسطة ID (يمكن لأي شخص رؤيته)
    path('teachers/<int:pk>/', views.CustomUserRetrieveAPIView.as_view(), name='teacher_detail'),
    
    # مسار لجلب قائمة بجميع المدرسين (المشكلة كانت هنا)
    path('teachers/', views.TeacherListAPIView.as_view(), name='teacher_list'), 
]