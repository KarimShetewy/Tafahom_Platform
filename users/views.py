from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AccountRequest, CustomUser # تأكد من استيراد CustomUser
from .serializers import AccountRequestSerializer, LoginSerializer # تأكد من استيراد كلا السيريالايزر
from rest_framework.authtoken.models import Token # لاستيراد Token (للتسجيل الدخول)
# no need for authenticate here as we use user.check_password directly


#--------------------------------------------------------------------------------------
# API View for Account Request Creation (Registration)
#--------------------------------------------------------------------------------------
class AccountRequestCreateAPIView(generics.CreateAPIView):
    queryset = AccountRequest.objects.all()
    serializer_class = AccountRequestSerializer

    # تخصيص طريقة الـ POST لرفع الملفات والتأكد من حفظها
    def perform_create(self, serializer):
        serializer.save()

    # تخصيص استجابة الـ POST
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # لو فيه أخطاء validation هترجع الأخطاء
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "تم إرسال طلب إنشاء الحساب بنجاح. سيتم مراجعته قريباً."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

#--------------------------------------------------------------------------------------
# API View for User Login
#--------------------------------------------------------------------------------------
class LoginAPIView(APIView):
    # السماح بالوصول للكل لهذه النقطة (لأن المستخدم غير مسجل الدخول بعد)
    permission_classes = () 
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) # تحقق من صحة البيانات (البريد وكلمة المرور)

        # إذا كان الـ serializer صالح، البيانات المطلوبة (email, password, token, user_type, first_name) ستكون موجودة
        token = serializer.validated_data['token']
        user_type = serializer.validated_data['user_type']
        first_name = serializer.validated_data['first_name'] # <--- هنا يتم استخراج الاسم الأول
        
        return Response({
            'token': token,
            'user_type': user_type,
            'first_name': first_name, # <--- هنا يتم إرجاع الاسم الأول في الاستجابة
            'message': 'تم تسجيل الدخول بنجاح!'
        }, status=status.HTTP_200_OK)