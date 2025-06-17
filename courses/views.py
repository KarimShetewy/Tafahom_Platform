from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission # Import BasePermission for custom permissions
from .models import Course
from .serializers import CourseSerializer, CourseCreateUpdateSerializer # Import the new serializer
from django.db.models import Q # لاستخدام OR queries
from users.models import CustomUser # لاستيراد CustomUser
from users.serializers import TeacherProfileSerializer # استيراد TeacherProfileSerializer

# Custom Permission to ensure only the teacher who owns the course can edit/delete it, or an admin
class IsTeacherOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object (teachers) or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request, so we'll always allow GET, HEAD, or OPTIONS requests.
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions are only allowed to the owner of the snippet or an admin.
        # Check if the user is authenticated
        if request.user and request.user.is_authenticated:
            # If the user is a staff member (Django admin) or has 'admin' user_type, they can do anything
            if request.user.is_staff or (hasattr(request.user, 'user_type') and request.user.user_type == 'admin'):
                return True
            # Otherwise, check if the user is the teacher owner of the course
            return obj.teacher == request.user
        return False

# Also, a permission for creating courses, only teachers can create
class IsTeacher(BasePermission):
    """
    Custom permission to only allow users with user_type 'teacher' to perform actions.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return request.user.user_type == 'teacher'
        return False


class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.filter(is_published=True)
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

# New Views for CRUD operations (Create, Update, Delete)
class CourseCreateAPIView(generics.CreateAPIView):
    queryset = Course.objects.all() # Not strictly needed for CreateAPIView, but good practice
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTeacher] # Only authenticated teachers can create

    def perform_create(self, serializer):
        # Automatically assign the authenticated user (who must be a teacher) as the course teacher
        serializer.save(teacher=self.request.user)

class CourseUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all() # Queryset for fetching the object to update
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin] # Only owner teacher or admin can update
    lookup_field = 'pk'

class CourseDestroyAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all() # Queryset for fetching the object to destroy
    serializer_class = CourseSerializer # Serializer class is less critical for destroy, but good to include
    permission_classes = [IsAuthenticated, IsTeacherOwnerOrAdmin] # Only owner teacher or admin can delete
    lookup_field = 'pk'


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