# users/urls.py
from django.urls import path
from . import views 

urlpatterns = [
    # مسارات التسجيل الخاصة بك (سوف تبقى هنا)
    path('register/student/', views.StudentRegistrationView.as_view(), name='student_register'),
    path('register/teacher/', views.TeacherRegistrationView.as_view(), name='teacher_register'),
    path('register/team/', views.TeamRegistrationView.as_view(), name='team_register'),

    # REMOVED: مسارات المصادقة (Auth) التي سيتم التعامل معها بواسطة djoser في tafahom_project/urls.py
    # path('auth/login/', views.LoginView.as_view(), name='login'), 
    # path('auth/logout/', views.LogoutView.as_view(), name='logout'), 

    # مسارات البروفايل المخصصة (إذا كانت موجودة ومختلفة عن djoser/users/me/)
    path('profile/', views.UserProfileView.as_view(), name='user_profile'), 
]