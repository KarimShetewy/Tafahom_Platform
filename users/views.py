# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny # استيراد AllowAny و IsAuthenticated

# استيراد موديلاتك
from .models import AccountRequest, CustomUser
# استيراد serializers الصحيحة
from .serializers import AccountRequestSerializer, CustomUserSerializer, TeacherProfileSerializer
# import json # لا يبدو أنه مستخدم هنا حالياً

# Views لتقديم طلبات إنشاء الحساب لأنواع المستخدمين المختلفة
class StudentRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] 

    def perform_create(self, serializer):
        serializer.save(user_type='student')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب طالب بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class TeacherRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] 

    def perform_create(self, serializer):
        serializer.save(user_type='teacher')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب أستاذ بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class TeamRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] 

    def perform_create(self, serializer):
        serializer.save(user_type='team_member')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب عضو فريق بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )


# View لجلب بيانات بروفايل المستخدم الحالي (المسجل دخوله)
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return self.request.user

# View لجلب بيانات مستخدم واحد بواسطة ID (خاصة لملف تعريف المدرس لصفحته العامة)
class CustomUserRetrieveAPIView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = TeacherProfileSerializer
    permission_classes = [AllowAny] 
    lookup_field = 'pk'

    def get_queryset(self):
        return CustomUser.objects.filter(user_type='teacher')

# View لجلب قائمة بجميع المدرسين
class TeacherListAPIView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(user_type='teacher', is_active=True)
    serializer_class = TeacherProfileSerializer 
    permission_classes = [AllowAny] 

    # يمكنك إضافة تصفية هنا لاحقاً إذا أردت (مثل تصفية حسب المادة أو الصف)
    # def get_queryset(self):
    #     queryset = super().get_queryset()
    #     academic_level = self.request.query_params.get('academic_level')
    #     specialized_subject = self.request.query_params.get('specialized_subject')
    #     if academic_level:
    #         queryset = queryset.filter(academic_level=academic_level)
    #     if specialized_subject:
    #         queryset = queryset.filter(specialized_subject=specialized_subject)
    #     return queryset