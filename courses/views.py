# courses/views.py

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice
from .serializers import (
    CourseSerializer, LectureSerializer, MaterialSerializer,
    QuizOrAssignmentSerializer, QuestionSerializer, ChoiceSerializer
)
from users.models import CustomUser # لاستخدام موديل CustomUser الخاص بك


# ViewSet لجلب وإنشاء الكورسات
class CourseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Course.objects.all().select_related('teacher') # جلب بيانات المعلم مع الكورس
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # السماح بالقراءة للجميع، الإنشاء للمسجلين

    def get_queryset(self):
        queryset = super().get_queryset()
        # تصفية الكورسات حسب الصف الدراسي والمادة إذا تم تمريرها في الـ query params
        academic_level = self.request.query_params.get('academic_level')
        subject = self.request.query_params.get('subject')

        if academic_level:
            queryset = queryset.filter(academic_level=academic_level)
        if subject:
            queryset = queryset.filter(subject=subject)
        
        # تصفية الكورسات المنشورة فقط للمستخدمين غير المصادقين
        # أو عرض كل الكورسات للمعلمين المسجلين
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_published=True)
        elif self.request.user.user_type == 'teacher':
            # المعلم يمكنه رؤية جميع كورساته (المنشورة وغير المنشورة)
            # ولكن هذه الـ View تجلب كل الكورسات، لذلك لا داعي لفلترة إضافية هنا
            pass 

        return queryset.order_by('-created_at') # ترتيب أحدث الكورسات أولاً

    def perform_create(self, serializer):
        # عند إنشاء كورس جديد، المعلم يجب أن يكون هو المنشئ
        if self.request.user.user_type == 'teacher':
            # تعيين مادة الكورس تلقائياً من تخصص المعلم (specialized_subject)
            # تأكد أن specialized_subject موجود في موديل CustomUser
            course_subject = self.request.user.specialized_subject 
            if not course_subject:
                raise serializers.ValidationError({"subject": "تخصص المعلم غير محدد. لا يمكن إنشاء كورس."})
            
            serializer.save(teacher=self.request.user, subject=course_subject)
        else:
            raise permissions.PermissionDenied("فقط المعلمون يمكنهم إنشاء الكورسات.")

# ViewSet للكورسات الخاصة بالمعلم الحالي (كورساتي)
class TeacherCourseListAPIView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated] # فقط المستخدمون المسجلون يمكنهم الوصول

    def get_queryset(self):
        # فقط المعلم يمكنه رؤية كورساته
        if self.request.user.user_type == 'teacher':
            return Course.objects.filter(teacher=self.request.user).order_by('-created_at')
        raise permissions.PermissionDenied("فقط المعلمون يمكنهم رؤية كورساتهم.")

# ViewSet لجلب وتعديل وحذف كورس معين
class CourseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all().select_related('teacher')
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # السماح لمالك الكورس (المعلم) فقط بالتعديل أو الحذف
        # والسماح بالقراءة للجميع
        if self.request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return obj # السماح بالقراءة للجميع (إذا كان منشوراً أو لديه صلاحيات)
        
        if obj.teacher == self.request.user and self.request.user.user_type == 'teacher':
            return obj
        raise permissions.PermissionDenied("ليس لديك صلاحية لتعديل أو حذف هذا الكورس.")

    def perform_update(self, serializer):
        # التأكد من أن subject لا يتغير إذا لم يتم تمريره، ويظل تخصص المعلم
        if 'subject' in serializer.validated_data and serializer.validated_data['subject'] != self.request.user.specialized_subject:
             raise serializers.ValidationError({"subject": "لا يمكنك تغيير مادة الكورس لتخصص مختلف عن تخصصك."})
        
        serializer.save(teacher=self.request.user) # التأكد من بقاء المعلم الحالي هو المالك

# ViewSet لجلب وإنشاء المحاضرات
class LectureListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        # التأكد من أن المستخدم الحالي هو معلم هذا الكورس
        course = generics.get_object_or_404(Course, id=course_id, teacher=self.request.user)
        return Lecture.objects.filter(course=course).order_by('order')

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        course = generics.get_object_or_404(Course, id=course_id, teacher=self.request.user)
        serializer.save(course=course)

# ViewSet لجلب وتعديل وحذف محاضرة معينة
class LectureRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = generics.get_object_or_404(Lecture, pk=self.kwargs['pk'])
        # التأكد من أن المستخدم الحالي هو معلم الكورس الذي تنتمي إليه المحاضرة
        if obj.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لهذه المحاضرة.")
        return obj

# ViewSet لجلب وإنشاء المواد التعليمية
class MaterialListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        lecture_id = self.kwargs['lecture_id']
        lecture = generics.get_object_or_404(Lecture, id=lecture_id)
        # التأكد من أن المستخدم الحالي هو معلم الكورس الذي تنتمي إليه المحاضرة
        if lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لمواد هذه المحاضرة.")
        return Material.objects.filter(lecture=lecture).order_by('order')

    def perform_create(self, serializer):
        lecture_id = self.kwargs['lecture_id']
        lecture = generics.get_object_or_404(Lecture, id=lecture_id)
        if lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية لإضافة مواد لهذه المحاضرة.")
        
        # إذا كان نوع المادة QuizOrAssignment، يتم إنشاء QuizOrAssignment تلقائياً
        material_type = serializer.validated_data.get('type')
        if material_type == 'quiz' or material_type == 'exam':
            quiz_details = self.request.data.get('quiz_details') # يتم إرسالها كـ JSON string من Frontend
            if quiz_details:
                quiz_details_dict = json.loads(quiz_details) # تحويل JSON string إلى Python dict
                material_instance = serializer.save(lecture=lecture)
                QuizOrAssignment.objects.create(material=material_instance, **quiz_details_dict)
            else:
                raise serializers.ValidationError({"quiz_details": "بيانات الواجب/الامتحان مطلوبة."})
        else:
            serializer.save(lecture=lecture)

# ViewSet لجلب وتعديل وحذف مادة تعليمية معينة
class MaterialRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = generics.get_object_or_404(Material, pk=self.kwargs['pk'])
        # التأكد من أن المستخدم الحالي هو معلم الكورس الذي تنتمي إليه المادة
        if obj.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لهذه المادة.")
        return obj

    def perform_update(self, serializer):
        # إذا تم تحديث مادة من نوع Quiz/Exam، يجب تحديث QuizOrAssignment المرتبط بها
        material_type = serializer.validated_data.get('type', self.get_object().type)
        if material_type == 'quiz' or material_type == 'exam':
            quiz_details = self.request.data.get('quiz_details') # قد تكون موجودة في request.data
            if quiz_details:
                # تحديث تفاصيل الواجب/الامتحان المرتبطة
                quiz_details_dict = json.loads(quiz_details)
                quiz_instance, created = QuizOrAssignment.objects.get_or_create(material=self.get_object())
                quiz_serializer = QuizOrAssignmentSerializer(quiz_instance, data=quiz_details_dict, partial=True)
                quiz_serializer.is_valid(raise_exception=True)
                quiz_serializer.save()
            elif hasattr(self.get_object(), 'quiz_details'): # إذا كانت Quiz/Exam وتم إزالة تفاصيلها
                self.get_object().quiz_details.delete()

        serializer.save()


# ViewSets للواجبات/الامتحانات والأسئلة والخيارات
class QuizOrAssignmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuizOrAssignment.objects.all()
    serializer_class = QuizOrAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = generics.get_object_or_404(QuizOrAssignment, pk=self.kwargs['pk'])
        # التأكد من أن المستخدم الحالي هو معلم الكورس الذي تنتمي إليه المادة المرتبطة بالواجب/الامتحان
        if obj.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لهذا الواجب/الامتحان.")
        return obj

class QuestionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        quiz_or_assignment = generics.get_object_or_404(QuizOrAssignment, id=quiz_id)
        # التأكد من صلاحية المعلم
        if quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية لإدارة أسئلة هذا الاختبار.")
        return Question.objects.filter(quiz_or_assignment=quiz_or_assignment)

    def perform_create(self, serializer):
        quiz_id = self.kwargs['quiz_id']
        quiz_or_assignment = generics.get_object_or_404(QuizOrAssignment, id=quiz_id)
        if quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية لإضافة أسئلة لهذا الاختبار.")
        serializer.save(quiz_or_assignment=quiz_or_assignment)

class QuestionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = generics.get_object_or_404(Question, pk=self.kwargs['pk'])
        # التأكد من صلاحية المعلم
        if obj.quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لهذا السؤال.")
        return obj

class ChoiceListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        question = generics.get_object_or_404(Question, id=question_id)
        # التأكد من صلاحية المعلم
        if question.quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية لإدارة خيارات هذا السؤال.")
        return Choice.objects.filter(question=question)

    def perform_create(self, serializer):
        question_id = self.kwargs['question_id']
        question = generics.get_object_or_404(Question, id=question_id)
        if question.quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية لإضافة خيارات لهذا السؤال.")
        serializer.save(question=question)

class ChoiceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = generics.get_object_or_404(Choice, pk=self.kwargs['pk'])
        # التأكد من صلاحية المعلم
        if obj.question.quiz_or_assignment.material.lecture.course.teacher != self.request.user or self.request.user.user_type != 'teacher':
            raise permissions.PermissionDenied("ليس لديك صلاحية للوصول لهذا الخيار.")
        return obj

# يجب استيراد json إذا كنت تستخدمه لتحويل الـ json string
import json # NEW: إضافة استيراد json هنا