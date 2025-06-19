from django.urls import path
from .views import (
    CourseListAPIView,
    CourseDetailAPIView,
    TeacherListAPIView,
    CourseCreateAPIView,
    CourseUpdateAPIView,
    CourseDestroyAPIView,
    TeacherMyCoursesListView,
    LectureListCreateAPIView,
    LectureRetrieveUpdateDestroyAPIView,
    MaterialListCreateAPIView,
    MaterialRetrieveUpdateDestroyAPIView,
    QuizOrAssignmentListCreateAPIView,
    QuizOrAssignmentRetrieveUpdateDestroyAPIView,
    QuestionListCreateAPIView,
    QuestionRetrieveUpdateDestroyAPIView,
    ChoiceListCreateAPIView,
    ChoiceRetrieveUpdateDestroyAPIView,
    SubmissionListCreateAPIView,
    SubmissionDetailAPIView,
    StudentAnswerListCreateAPIView,
    StudentAnswerRetrieveUpdateDestroyAPIView,
)

app_name = 'courses' # تعريف app_name بشكل صريح هنا

urlpatterns = [
    # مسار إنشاء كورس جديد (NEW: تم نقله للأعلى ليكون مباشرة تحت /api/courses/)
    path('create/', CourseCreateAPIView.as_view(), name='course-create'), 

    # مسارات عرض الكورسات العامة
    path('', CourseListAPIView.as_view(), name='course-list'), # /api/courses/
    path('<int:pk>/', CourseDetailAPIView.as_view(), name='course-detail'), # /api/courses/1/

    path('teachers/', TeacherListAPIView.as_view(), name='teacher-list-by-subject'), # /api/courses/teachers/

    # مسارات تعديل وحذف الكورسات (تبقى كما هي)
    path('<int:pk>/update/', CourseUpdateAPIView.as_view(), name='course-update'),
    path('<int:pk>/delete/', CourseDestroyAPIView.as_view(), name='course-delete'),

    path('my-courses/', TeacherMyCoursesListView.as_view(), name='teacher-my-courses'),

    # Lectures (تبقى كما هي)
    path('<int:course_id>/lectures/', LectureListCreateAPIView.as_view(), name='lecture-list-create'),
    path('lectures/<int:pk>/', LectureRetrieveUpdateDestroyAPIView.as_view(), name='lecture-detail-update-delete'),

    # Materials (تبقى كما هي)
    path('lectures/<int:lecture_id>/materials/', MaterialListCreateAPIView.as_view(), name='material-list-create'),
    path('materials/<int:pk>/', MaterialRetrieveUpdateDestroyAPIView.as_view(), name='material-detail-update-delete'),

    # Quizzes/Assignments (تبقى كما هي)
    path('lectures/<int:lecture_id>/quizzes-assignments/', QuizOrAssignmentListCreateAPIView.as_view(), name='quiz-assignment-list-create'),
    path('quizzes-assignments/<int:pk>/', QuizOrAssignmentRetrieveUpdateDestroyAPIView.as_view(), name='quiz-assignment-detail-update-delete'),

    # Questions (تبقى كما هي)
    path('quizzes-assignments/<int:quiz_id>/questions/', QuestionListCreateAPIView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionRetrieveUpdateDestroyAPIView.as_view(), name='question-detail-update-delete'),

    # Choices (تبقى كما هي)
    path('questions/<int:question_id>/choices/', ChoiceListCreateAPIView.as_view(), name='choice-list-create'),
    path('choices/<int:pk>/', ChoiceRetrieveUpdateDestroyAPIView.as_view(), name='choice-detail-update-delete'),

    # Submissions (تبقى كما هي)
    path('submissions/', SubmissionListCreateAPIView.as_view(), name='submission-list-create'),
    path('submissions/<int:pk>/', SubmissionDetailAPIView.as_view(), name='submission-detail'),
    path('quizzes-assignments/<int:quiz_id>/submissions/', SubmissionListCreateAPIView.as_view(), name='quiz-submissions-list'),

    # Student Answers (تبقى كما هي)
    path('submissions/<int:submission_id>/answers/', StudentAnswerListCreateAPIView.as_view(), name='student-answer-list-create'),
    path('student-answers/<int:pk>/', StudentAnswerRetrieveUpdateDestroyAPIView.as_view(), name='student-answer-detail-update-delete'),
]
