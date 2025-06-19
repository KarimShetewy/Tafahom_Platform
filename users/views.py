from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AccountRequest, CustomUser
from .serializers import AccountRequestSerializer, LoginSerializer, TeacherProfileSerializer
from rest_framework.authtoken.models import Token


class AccountRequestCreateAPIView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "تم إرسال طلب إنشاء الحساب بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class LoginAPIView(APIView):
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        user_type = serializer.validated_data['user_type']
        first_name = serializer.validated_data['first_name']
        specialized_subject = serializer.validated_data.get('specialized_subject')

        response_data = {
            'token': token,
            'user_type': user_type,
            'first_name': first_name,
            'message': 'تم تسجيل الدخول بنجاح!'
        }
        if specialized_subject:
            response_data['specialized_subject'] = specialized_subject

        return Response(response_data, status=status.HTTP_200_OK)


class TeacherProfileAPIView(generics.RetrieveAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# NEW: View لجلب بيانات مستخدم واحد (مثل ملف تعريف المدرس) بواسطة ID
class CustomUserRetrieveAPIView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = TeacherProfileSerializer # يمكن استخدام TeacherProfileSerializer لأنه يغطي بيانات المدرس
    permission_classes = [AllowAny] # يمكن لأي شخص رؤية الملف الشخصي للمدرس
    lookup_field = 'pk' # لجلب المستخدم باستخدام ID (primary key)

    def get_queryset(self):
        # التأكد من أن المستخدم الذي يتم جلبه هو 'teacher' فقط إذا كانت هذه نقطة نهاية مخصصة للمدرسين
        # إذا كنت تريد أن يكون ملف تعريف المستخدم عاماً، يمكنك إزالة هذا الفلتر
        return CustomUser.objects.filter(user_type='teacher')
