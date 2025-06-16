from django.urls import path
from .views import CourseListAPIView, CourseDetailAPIView, TeacherListAPIView

urlpatterns = [
    path('courses/', CourseListAPIView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view(), name='course-detail'),
    path('teachers/', TeacherListAPIView.as_view(), name='teacher-list-by-subject'), # يمكن فلترتها بـ subject/level/track
]