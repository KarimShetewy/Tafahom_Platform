from rest_framework import serializers
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice, Submission, StudentAnswer
from users.models import CustomUser

# Serializer للخيارات (للقراءة فقط عند عرض السؤال)
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = '__all__'

# Serializer للأسئلة، يتضمن الخيارات (للقراءة فقط عند عرض الواجب/الامتحان)
class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'

# Serializer للواجبات/الاختبارات (للقراءة فقط)
class QuizOrAssignmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizOrAssignment
        fields = '__all__'

# NEW: Nested Serializers for Quiz/Exam Creation
# هذا Serializer سيكون لكتابة (إنشاء) الواجب/الامتحان مع أسئلته وخياراته
class ChoiceNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['choice_text', 'is_correct']

class QuestionNestedSerializer(serializers.ModelSerializer):
    choices = ChoiceNestedSerializer(many=True) # يسمح بإنشاء خيارات متعددة مع السؤال

    class Meta:
        model = Question
        fields = ['question_text', 'points', 'order', 'choices'] # 'order' سيكون مطلوباً أو يمكن توليده تلقائياً
        extra_kwargs = {
            'order': {'required': False} # يمكن جعل الترتيب اختياري و التعامل معه في الـ view أو الكلاينت
        }

class QuizOrAssignmentCreateSerializer(serializers.ModelSerializer):
    questions = QuestionNestedSerializer(many=True) # يسمح بإنشاء أسئلة متعددة مع الواجب/الامتحان

    class Meta:
        model = QuizOrAssignment
        fields = ['id', 'title', 'type', 'duration_minutes', 'passing_score_percentage', 'questions']
        extra_kwargs = {
            'duration_minutes': {'required': False}, # المؤقت اختياري (للامتحانات فقط)
            'passing_score_percentage': {'required': False}, # نسبة النجاح اختيارية
        }

    # Custom create method to handle nested questions and choices
    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz_assignment = QuizOrAssignment.objects.create(**validated_data)

        for q_data in questions_data:
            choices_data = q_data.pop('choices')
            question = Question.objects.create(quiz_or_assignment=quiz_assignment, **q_data)
            for c_data in choices_data:
                Choice.objects.create(question=question, **c_data)
        return quiz_assignment

    # Custom update method (إذا أردت السماح بتعديل الأسئلة والخيارات من هنا)
    # هذا سيكون أكثر تعقيداً، ويمكننا تركه لاحقاً إذا أردت تعديل الأسئلة من لوحة الإدارة فقط
    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions', [])
        
        # تحديث حقول QuizOrAssignment الأساسية
        instance.title = validated_data.get('title', instance.title)
        instance.type = validated_data.get('type', instance.type)
        instance.duration_minutes = validated_data.get('duration_minutes', instance.duration_minutes)
        instance.passing_score_percentage = validated_data.get('passing_score_percentage', instance.passing_score_percentage)
        instance.save()

        # التعامل مع تحديث/إنشاء/حذف الأسئلة والخيارات
        # هذا الجزء يمكن أن يكون معقداً وقد يتطلب منطقاً إضافياً
        # حالياً، سنبسطه أو نعتبر أن التعديل يتم من لوحة الإدارة
        # (أو سنبنيه لاحقاً في الواجهة الأمامية)

        # مثال بسيط: حذف الأسئلة القديمة وإعادة إنشاء الجديدة (ليس مثالياً لكنه يعمل)
        instance.questions.all().delete() # حذف كل الأسئلة القديمة
        for q_data in questions_data:
            choices_data = q_data.pop('choices')
            question = Question.objects.create(quiz_or_assignment=instance, **q_data)
            for c_data in choices_data:
                Choice.objects.create(question=question, **c_data)

        return instance


# Serializer للمواد التعليمية
class MaterialSerializer(serializers.ModelSerializer):
    # NEW: إضافة QuizOrAssignmentSerializer كـ nested serializer للقراءة
    # لكي يعود الواجب/الامتحان كاملاً مع أسئلته وخياراته عند جلب المادة
    quiz_assignment = QuizOrAssignmentSerializer(read_only=True) 

    class Meta:
        model = Material
        fields = '__all__'
        extra_kwargs = {
            'file': {'required': False},
            'url': {'required': False},
            'text_content': {'required': False},
            'description': {'required': False},
            'quiz_assignment': {'required': False}, # Quiz assignment سيكون اختياري عند الإنشاء/التعديل
        }


class LectureSerializer(serializers.ModelSerializer):
    materials = MaterialSerializer(many=True, read_only=True) # لعرض المواد مع المحاضرة
    # NEW: لجلب تفاصيل الواجب/الامتحان المطلوب لفتح المحاضرة
    required_quiz_or_exam = QuizOrAssignmentSerializer(read_only=True) 

    class Meta:
        model = Lecture
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    teacher_email = serializers.EmailField(source='teacher.email', read_only=True)
    teacher_id = serializers.IntegerField(source='teacher.id', read_only=True)
    teacher_specialized_subject_display = serializers.CharField(source='teacher.get_specialized_subject_display', read_only=True)

    lectures = LectureSerializer(many=True, read_only=True)

    is_enrolled = serializers.SerializerMethodField()
    is_teacher_owner = serializers.SerializerMethodField()
    course_type_display = serializers.CharField(source='get_course_type_display', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'price', 'image',
            'teacher', 'teacher_name', 'teacher_last_name', 'teacher_email', 'teacher_id',
            'teacher_specialized_subject_display',
            'academic_level', 'academic_track', 'subject',
            'course_type', 
            'course_type_display', 
            'is_published', 'created_at', 'updated_at',
            'lectures',
            'is_enrolled', 
            'is_teacher_owner' 
        ]
        read_only_fields = ('created_at', 'updated_at')

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'student':
            # هذا Placeholder: في التطبيق الحقيقي، ستحتاج للتحقق من نموذج Enrollment
            # مؤقتاً، يمكننا افتراض أن الطالب مسجل إذا كان لديه أي Submissions
            # أو إذا كان ID الطالب موجوداً في السياق
            # لتبسيط الاختبار حالياً:
            return True # افتراض أن الطالب مسجل
        return False

    def get_is_teacher_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'teacher':
            return obj.teacher == request.user
        return False


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id', 
            'title', 'description', 'price', 'image',
            'academic_level', 
            # 'academic_track', 'subject', # تم إزالة هذه الحقول سابقاً من الفورم
            'course_type',
            'is_published'
        ]
        extra_kwargs = {
            'image': {'required': False},
            'academic_track': {'required': False}, 
            'subject': {'required': False}, 
            'is_published': {'required': False},
            'course_type': {'required': False},
        }

    # دالة validate فارغة لأننا نتعامل مع subject في الـ View
    pass 


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'