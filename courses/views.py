import json # NEW: لاستيراد json
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice, Submission, StudentAnswer
from .serializers import (
    CourseSerializer, CourseCreateUpdateSerializer,
    LectureSerializer, MaterialSerializer,
    QuizOrAssignmentSerializer, QuestionSerializer, ChoiceSerializer,
    SubmissionSerializer, StudentAnswerSerializer,
    # NEW: استيراد السيريالايزر المتداخل للإنشاء
    QuizOrAssignmentCreateSerializer 
)
from django.db.models import Q
from users.models import CustomUser
from users.serializers import TeacherProfileSerializer 


class IsTeacherOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        if request.user and request.user.is_authenticated:
            if request.user.is_staff or (hasattr(request.user, 'user_type') and request.user.user_type == 'admin'):
                return True
            if isinstance(obj, Course):
                return obj.teacher == request.user
            elif isinstance(obj, Lecture):
                return obj.course.teacher == request.user
            elif isinstance(obj, Material):
                # إذا كانت المادة مرتبطة بواجب/امتحان، تحقق من ملكية الكورس الأصلية
                if obj.quiz_assignment:
                    return obj.quiz_assignment.lecture.course.teacher == request.user
                return obj.lecture.course.teacher == request.user
            elif isinstance(obj, QuizOrAssignment):
                return obj.lecture.course.teacher == request.user
            elif isinstance(obj, Question):
                return obj.quiz_or_assignment.lecture.course.teacher == request.user
            elif isinstance(obj, Choice):
                return obj.question.quiz_or_assignment.lecture.course.teacher == request.user
        return False

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.user_type == 'teacher'
        return False

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_level = self.request.query_params.get('level')
        subject = self.request.query_params.get('subject')
        teacher_id = self.request.query_params.get('teacher_id')
        course_type = self.request.query_params.get('course_type')

        if academic_level:
            queryset = queryset.filter(academic_level=academic_level)
        if subject:
            queryset = queryset.filter(subject=subject)
        if teacher_id:
            queryset = queryset.filter(teacher__id=teacher_id)
        if course_type:
            queryset = queryset.filter(course_type=course_type)
        
        return queryset

class CourseDetailAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'

    def get_serializer_context(self):
        return {'request': self.request}

class CourseCreateAPIView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        if self.request.user.user_type == 'teacher' and self.request.user.specialized_subject:
            serializer.save(
                teacher=self.request.user,
                subject=self.request.user.specialized_subject,
                academic_track=None 
            )
        else:
            return Response({"detail": "تخصص المدرس غير محدد."}, status=status.HTTP_400_BAD_REQUEST)


class CourseUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    lookup_field = 'pk'

    def get_serializer_context(self):
        return {'request': self.request}


class CourseDestroyAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    lookup_field = 'pk'

class TeacherMyCoursesListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Course.objects.filter(teacher=self.request.user)
        academic_level = self.request.query_params.get('level')
        subject = self.request.query_params.get('subject')
        course_type = self.request.query_params.get('course_type')
        
        if academic_level:
            queryset = queryset.filter(academic_level=academic_level)
        if subject:
            queryset = queryset.filter(subject=subject)
        if course_type:
            queryset = queryset.filter(course_type=course_type)
            
        return queryset

class TeacherListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='teacher')
    serializer_class = TeacherProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_level = self.request.query_params.get('level')
        subject = self.request.query_params.get('subject')

        if academic_level:
            queryset = queryset.filter(courses__academic_level=academic_level, courses__is_published=True).distinct()
        if subject:
            queryset = queryset.filter(courses__subject=subject, courses__is_published=True).distinct()
        
        return queryset


class LectureListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LectureSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Lecture.objects.filter(course_id=course_id, course__teacher=self.request.user).order_by('order')

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        try:
            course = Course.objects.get(id=course_id, teacher=self.request.user)
        except Course.DoesNotExist:
            return Response({"detail": "الكورس غير موجود أو لا تملكه."}, status=status.HTTP_404_NOT_FOUND)
        serializer.save(course=course)

class LectureRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LectureSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    queryset = Lecture.objects.all()
    lookup_field = 'pk'


class MaterialListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        lecture_id = self.kwargs['lecture_id']
        return Material.objects.filter(lecture_id=lecture_id, lecture__course__teacher=self.request.user).order_by('order')

    def create(self, request, *args, **kwargs):
        material_type = request.data.get('type')
        lecture_id = self.kwargs['lecture_id']

        try:
            lecture = Lecture.objects.get(id=lecture_id, course__teacher=request.user)
        except Lecture.DoesNotExist:
            return Response({"detail": "المحاضرة غير موجودة أو لا تملك صلاحية الوصول إليها."}, status=status.HTTP_404_NOT_FOUND)

        if material_type in ['quiz', 'exam']:
            # إذا كان نوع المادة واجب أو امتحان، سننشئ QuizOrAssignment أولاً
            quiz_details_str = request.data.get('quiz_details')
            if not quiz_details_str:
                return Response({"quiz_details": "تفاصيل الواجب/الامتحان مطلوبة لهذا النوع من المواد."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                quiz_details = json.loads(quiz_details_str) # تحليل الـ JSON string
            except json.JSONDecodeError:
                return Response({"quiz_details": "صيغة تفاصيل الواجب/الامتحان غير صحيحة."}, status=status.HTTP_400_BAD_REQUEST)

            # تحضير بيانات QuizOrAssignment
            quiz_data = {
                'lecture': lecture.id,
                'title': quiz_details.get('title', f"{material_type} جديد"), # يمكن أن يكون العنوان من المادة
                'type': material_type, # نوع الواجب/الامتحان
                'duration_minutes': quiz_details.get('duration_minutes'),
                'passing_score_percentage': quiz_details.get('passing_score_percentage'),
                'questions': quiz_details.get('questions', []) # الأسئلة والخيارات
            }
            
            # استخدام QuizOrAssignmentCreateSerializer لإنشاء الواجب/الامتحان والأسئلة والخيارات
            quiz_serializer = QuizOrAssignmentCreateSerializer(data=quiz_data, context={'request': request})
            if quiz_serializer.is_valid():
                quiz_instance = quiz_serializer.save(lecture=lecture) # حفظ الواجب/الامتحان

                # الآن ننشئ المادة Material ونربطها بالواجب/الامتحان الذي تم إنشاؤه
                material_data = {
                    'lecture': lecture.id,
                    'title': request.data.get('title'),
                    'type': material_type,
                    'order': request.data.get('order', 0),
                    'is_published': request.data.get('is_published', False),
                    'description': request.data.get('description'),
                    'quiz_assignment': quiz_instance.id # ربط المادة بالواجب/الامتحان الذي تم إنشاؤه
                }
                material_serializer = self.get_serializer(data=material_data)
                material_serializer.is_valid(raise_exception=True)
                material_serializer.save(lecture=lecture) # حفظ المادة

                # إذا كانت المحاضرة ستُقفل بهذا الواجب/الامتحان
                if quiz_details.get('locks_next_lecture'):
                    lecture.is_locked = True
                    lecture.required_quiz_or_exam = quiz_instance
                    lecture.save()

                return Response(material_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(quiz_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # للأنواع الأخرى من المواد (فيديو، PDF، نص، رابط)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(lecture=lecture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    queryset = Material.objects.all()
    lookup_field = 'pk'


class QuizOrAssignmentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = QuizOrAssignmentSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        lecture_id = self.kwargs['lecture_id']
        return QuizOrAssignment.objects.filter(lecture_id=lecture_id, lecture__course__teacher=self.request.user)

    def perform_create(self, serializer):
        lecture_id = self.kwargs['lecture_id']
        lecture = Lecture.objects.get(id=lecture_id, course__teacher=self.request.user)
        serializer.save(lecture=lecture)

class QuizOrAssignmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuizOrAssignmentSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    queryset = QuizOrAssignment.objects.all()
    lookup_field = 'pk'


class QuestionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_or_assignment_id=quiz_id, quiz_or_assignment__lecture__course__teacher=self.request.user).order_by('order')

    def perform_create(self, serializer):
        quiz_id = self.kwargs['quiz_id']
        quiz_or_assignment = QuizOrAssignment.objects.get(id=quiz_id, lecture__course__teacher=self.request.user)
        serializer.save(quiz_or_assignment=quiz_or_assignment)


class QuestionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    queryset = Question.objects.all()
    lookup_field = 'pk'

class ChoiceListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Choice.objects.filter(question_id=question_id, question__quiz_or_assignment__lecture__course__teacher=self.request.user)

    def perform_create(self, serializer):
        question_id = self.kwargs['question_id']
        question = Question.objects.get(id=question_id, quiz_or_assignment__lecture__course__teacher=self.request.user)
        serializer.save(question=question)

class ChoiceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChoiceSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin]
    queryset = Choice.objects.all()
    lookup_field = 'pk'


class SubmissionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type == 'student':
            return Submission.objects.filter(student=self.request.user).order_by('-submitted_at')
        elif self.request.user.user_type == 'teacher':
            quiz_id = self.kwargs.get('quiz_id')
            if quiz_id:
                return Submission.objects.filter(
                    quiz_or_assignment_id=quiz_id,
                    quiz_or_assignment__lecture__course__teacher=self.request.user
                ).order_by('-submitted_at')
            return Submission.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class SubmissionDetailAPIView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Submission.objects.all()

    def get_queryset(self):
        if self.request.user.user_type == 'student':
            return Submission.objects.filter(quiz_or_assignment__lecture__course__students_enrolled=self.request.user) # Placeholder
        elif self.request.user.user_type == 'teacher':
            return Submission.objects.filter(quiz_or_assignment__lecture__course__teacher=self.request.user)
        return Submission.objects.none()

class StudentAnswerListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StudentAnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        submission_id = self.kwargs['submission_id']
        return StudentAnswer.objects.filter(submission_id=submission_id, submission__student=self.request.user)

    def perform_create(self, serializer):
        submission_id = self.kwargs['submission_id']
        submission = Submission.objects.get(id=submission_id, student=self.request.user)
        serializer.save(submission=submission)

class StudentAnswerRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentAnswerSerializer
    permission_classes = [IsAuthenticated]
    queryset = StudentAnswer.objects.all()