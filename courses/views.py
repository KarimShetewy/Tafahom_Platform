from rest_framework import generics
from rest_framework.response import Response
from .models import Course
from .serializers import CourseSerializer
from rest_framework.permissions import AllowAny
from django.db.models import Q # لاستخدام OR queries
from users.models import CustomUser # لاستيراد CustomUser
from users.serializers import TeacherProfileSerializer # استيراد TeacherProfileSerializer

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True) # عرض الكورسات المنشورة فقط
    serializer_class = CourseSerializer
    permission_classes = [AllowAny] # يمكن لأي شخص رؤية قائمة الكورسات

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_level = self.request.query_params.get('level')
        academic_track = self.request.query_params.get('track')
        subject = self.request.query_params.get('subject')
        teacher_id = self.request.query_params.get('teacher_id')

        if academic_level:
            queryset = queryset.filter(academic_level=academic_level)
        if academic_track:
            queryset = queryset.filter(academic_track=academic_track)
        if subject:
            queryset = queryset.filter(subject=subject)
        if teacher_id:
            queryset = queryset.filter(teacher__id=teacher_id)
        
        return queryset

class CourseDetailAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [AllowAny] # يمكن لأي شخص رؤية تفاصيل كورس
    lookup_field = 'pk' # للبحث باستخدام الـ ID (Primary Key)

# API لعرض المدرسين
class TeacherListAPIView(generics.ListAPIView):
    # جلب المستخدمين الذين نوعهم 'teacher'
    queryset = CustomUser.objects.filter(user_type='teacher')
    serializer_class = TeacherProfileSerializer # <--- استخدم Serializer المخصص للمدرسين هنا
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_level = self.request.query_params.get('level')
        academic_track = self.request.query_params.get('track')
        subject = self.request.query_params.get('subject')

        # فلترة المدرسين بناءً على المواد/المستويات التي يدرسونها في الكورسات المنشورة
        # `courses__` يستخدم للوصول إلى الحقول المتعلقة من خلال الـ `related_name` في الفورن كي
        if academic_level:
            queryset = queryset.filter(courses__academic_level=academic_level, courses__is_published=True).distinct()
        if academic_track:
            queryset = queryset.filter(courses__academic_track=academic_track, courses__is_published=True).distinct()
        if subject:
            queryset = queryset.filter(courses__subject=subject, courses__is_published=True).distinct()
        
        return queryset