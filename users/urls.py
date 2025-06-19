from django.urls import path
from .views import AccountRequestCreateAPIView, LoginAPIView, TeacherProfileAPIView # تأكد من استيراد TeacherProfileAPIView
from .views import CustomUserRetrieveAPIView # NEW: استيراد View لـ retrieve user by ID

urlpatterns = [
    path('register/', AccountRequestCreateAPIView.as_view(), name='register-request'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/', TeacherProfileAPIView.as_view(), name='user-profile'),
    path('profile/<int:pk>/', CustomUserRetrieveAPIView.as_view(), name='user-profile-detail'), # NEW: مسار لملف تعريف المستخدم حسب ID
]
