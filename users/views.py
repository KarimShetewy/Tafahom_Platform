from rest_framework import generics, status
from rest_framework.response import Response
# REMOVED: from rest_framework.views import APIView # لم نعد بحاجة لـ APIView لـ Login
from rest_framework.permissions import IsAuthenticated, AllowAny
# تأكد من استيراد موديلاتك
from .models import AccountRequest, CustomUser
# تأكد من استيراد serializers الصحيحة
from .serializers import AccountRequestSerializer, TeacherProfileSerializer, CustomUserSerializer
# REMOVED: from .serializers import LoginSerializer # لم نعد بحاجة لـ LoginSerializer المخصصة
# REMOVED: from rest_framework.authtoken.models import Token # لم نعد بحاجة لها هنا إذا djoser يتعامل مع التوكن


# Viewsets لطلبات إنشاء الحساب (للطلاب، الأساتذة، أعضاء الفريق)
# هذه Views ستستقبل طلبات التسجيل وتحفظها كـ AccountRequest
class StudentRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] # يمكن لأي شخص غير مسجل طلب حساب طالب

    def perform_create(self, serializer):
        # قبل الحفظ، تأكد من تعيين user_type بشكل صحيح للطلب
        serializer.save(user_type='student')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب طالب بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED
        )

class TeacherRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] # يمكن لأي شخص غير مسجل طلب حساب أستاذ

    def perform_create(self, serializer):
        serializer.save(user_type='teacher')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب أستاذ بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED
        )

class TeamRegistrationView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer
    permission_classes = [AllowAny] # يمكن لأي شخص غير مسجل طلب حساب عضو فريق

    def perform_create(self, serializer):
        serializer.save(user_type='team_member')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "تم إرسال طلب إنشاء حساب عضو فريق بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED
        )

# REMOVED: LoginAPIView المخصصة لم تعد ضرورية، حيث djoser يتولى المصادقة
# class LoginAPIView(APIView):
#     permission_classes = ()
#     def post(self, request, *args, **kwargs):
#         serializer = LoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         token = serializer.validated_data['token']
#         user_type = serializer.validated_data['user_type']
#         first_name = serializer.validated_data['first_name']
#         specialized_subject = serializer.validated_data.get('specialized_subject')
#         response_data = {
#             'token': token,
#             'user_type': user_type,
#             'first_name': first_name,
#             'message': 'تم تسجيل الدخول بنجاح!'
#         }
#         if specialized_subject:
#             response_data['specialized_subject'] = specialized_subject
#         return Response(response_data, status=status.HTTP_200_OK)


# View لجلب بيانات بروفايل المستخدم الحالي (المسجل دخوله)
# djoser يوفر بالفعل مسار /api/auth/users/me/ لهذا الغرض
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer # استخدم CustomUserSerializer ليعرض جميع الحقول المخصصة
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# View لجلب بيانات مستخدم واحد بواسطة ID (مثل ملف تعريف المدرس لصفحته العامة)
class CustomUserRetrieveAPIView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer # استخدم CustomUserSerializer ليعرض جميع الحقول المخصصة
    permission_classes = [AllowAny] # يمكن لأي شخص رؤية الملف الشخصي العام للمدرس
    lookup_field = 'pk' # لجلب المستخدم باستخدام ID (primary key)

    def get_queryset(self):
        # إذا كنت تريد أن يكون هذا الـ View فقط للمدرسين، احتفظ بهذا الفلتر
        # وإلا، أزله للسماح بجلب أي نوع مستخدم
        return CustomUser.objects.filter(user_type='teacher')