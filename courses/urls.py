# courses/urls.py

from django.urls import path
from . import views # استيراد Views من نفس التطبيق


urlpatterns = [
    # مسار لجلب جميع الكورسات أو تصفيتها
    path('', views.CourseListCreateAPIView.as_view(), name='course-list-create'),
    
    # مسارات خاصة بالكورسات التي يملكها المعلم الحالي
    path('my-courses/', views.TeacherCourseListAPIView.as_view(), name='my-courses-list'),

    # مسار لجلب وتعديل وحذف كورس معين بواسطة ID
    path('<int:pk>/', views.CourseRetrieveUpdateDestroyAPIView.as_view(), name='course-detail-update-delete'),
    
    # مسار لجلب وإنشاء المحاضرات لكورس معين
    path('<int:course_id>/lectures/', views.LectureListCreateAPIView.as_view(), name='lecture-list-create'),
    
    # مسار لجلب وتعديل وحذف محاضرة معينة بواسطة ID المحاضرة
    path('lectures/<int:pk>/', views.LectureRetrieveUpdateDestroyAPIView.as_view(), name='lecture-detail-update-delete'),
    
    # مسار لجلب وإنشاء المواد التعليمية لمحاضرة معينة
    path('lectures/<int:lecture_id>/materials/', views.MaterialListCreateAPIView.as_view(), name='material-list-create'),
    
    # مسار لجلب وتعديل وحذف مادة تعليمية معينة بواسطة ID المادة
    path('materials/<int:pk>/', views.MaterialRetrieveUpdateDestroyAPIView.as_view(), name='material-detail-update-delete'),
    
    # مسار لإدارة الواجبات/الامتحانات (للتحديث والحذف)
    # ملاحظة: الإنشاء يتم ضمن MaterialListCreateAPIView
    path('quizzes/<int:pk>/', views.QuizOrAssignmentRetrieveUpdateDestroyAPIView.as_view(), name='quiz-detail-update-delete'),
    
    # مسارات لإدارة الأسئلة والخيارات داخل الواجبات/الامتحانات
    path('quizzes/<int:quiz_id>/questions/', views.QuestionListCreateAPIView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', views.QuestionRetrieveUpdateDestroyAPIView.as_view(), name='question-detail-update-delete'),
    
    path('questions/<int:question_id>/choices/', views.ChoiceListCreateAPIView.as_view(), name='choice-list-create'),
    path('choices/<int:pk>/', views.ChoiceRetrieveUpdateDestroyAPIView.as_view(), name='choice-detail-update-delete'),
]