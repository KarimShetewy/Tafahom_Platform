from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,
    TeacherListAPIView,
    CourseCreateAPIView,      # New
    CourseUpdateAPIView,      # New
    CourseDestroyAPIView      # New
)

urlpatterns = [
    # مسارات عرض الكورسات والمدرسين (موجودة سابقاً)
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view(), name='course-detail'),
    path('teachers/', TeacherListAPIView.as_view(), name='teacher-list-by-subject'),

    # مسارات CRUD الجديدة للكورسات
    path('courses/create/', CourseCreateAPIView.as_view(), name='course-create'), # لإنشاء كورس جديد (POST)
    path('courses/<int:pk>/update/', CourseUpdateAPIView.as_view(), name='course-update'), # لتعديل كورس (PUT/PATCH)
    path('courses/<int:pk>/delete/', CourseDestroyAPIView.as_view(), name='course-delete'), # لحذف كورس (DELETE)
]