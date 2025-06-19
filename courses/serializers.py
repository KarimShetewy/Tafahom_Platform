from rest_framework import serializers
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice, Submission, StudentAnswer
from users.models import CustomUser

# Serializer للخيارات
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = '__all__'

# Serializer للأسئلة، يتضمن الخيارات (nested)
class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True) # لعرض الخيارات مع السؤال

    class Meta:
        model = Question
        fields = '__all__'

# Serializer للواجبات/الاختبارات، يتضمن الأسئلة (nested)
class QuizOrAssignmentSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True) # لعرض الأسئلة مع الواجب/الاختبار

    class Meta:
        model = QuizOrAssignment
        fields = '__all__'


# Serializer للمواد التعليمية
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'
        extra_kwargs = {
            'file': {'required': False},
            'url': {'required': False},
            'text_content': {'required': False},
            'description': {'required': False},
        }

# Serializer للمحاضرات، يتضمن المواد التعليمية (nested)
class LectureSerializer(serializers.ModelSerializer):
    materials = MaterialSerializer(many=True, read_only=True)

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
            'is_enrolled', # تم تضمينه بالفعل
            'is_teacher_owner' # تم تضمينه بالفعل
        ]
        read_only_fields = ('created_at', 'updated_at')

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.user_type == 'student':
            # هذا Placeholder: في التطبيق الحقيقي، ستحتاج للتحقق من نموذج Enrollment
            return True
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
            'title', 'description', 'price', 'image',
            'academic_level', 'academic_track', 'subject',
            'course_type',
            'is_published'
        ]
        extra_kwargs = {
            'image': {'required': False},
            'academic_track': {'required': False},
            'is_published': {'required': False},
            'course_type': {'required': False},
        }

    def validate(self, data):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated and request.user.user_type == 'teacher':
            if request.user.specialized_subject and data.get('subject') != request.user.specialized_subject:
                specialized_subject_label = request.user.get_specialized_subject_display()
                raise serializers.ValidationError({
                    "subject": f"لا يمكنك إنشاء كورس في هذه المادة. تخصصك هو {specialized_subject_label}."
                })
        return data


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'
