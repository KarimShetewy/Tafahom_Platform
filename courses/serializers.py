from rest_framework import serializers
from .models import Course
from users.models import CustomUser # لاستيراد CustomUser للحصول على بيانات المدرس


class CourseSerializer(serializers.ModelSerializer):
    # لعرض اسم الأستاذ بدلاً من الـ ID فقط
    teacher_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    teacher_email = serializers.EmailField(source='teacher.email', read_only=True)
    teacher_id = serializers.IntegerField(source='teacher.id', read_only=True) # لإمكانية الربط بصفحة المدرس

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'price', 'image',
            'teacher', 'teacher_name', 'teacher_last_name', 'teacher_email', 'teacher_id',
            'academic_level', 'academic_track', 'subject',
            'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')