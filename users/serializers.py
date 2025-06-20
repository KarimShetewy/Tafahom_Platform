from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import CustomUser, AccountRequest 
from rest_framework.authtoken.models import Token 
from django.contrib.auth.hashers import make_password 


class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Serializer لإنشاء مستخدم جديد (عند التسجيل).
    يوسع Djoser's UserCreateSerializer لإضافة حقول مخصصة.
    """
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        # تأكد من تضمين جميع الحقول المخصصة التي تريدها عند إنشاء المستخدم
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'user_type', 'gender', 'governorate', 'specialized_subject', 'phone_number') 
        # أضفت phone_number هنا بناءً على موديلك

        # إذا كنت تسمح برفع user_image عند التسجيل، أضفها هنا أيضاً
        # fields = ('id', 'email', 'first_name', 'last_name', 'password', 'user_type', 'gender', 'governorate', 'specialized_subject', 'image')


class CustomUserSerializer(UserSerializer):
    """
    Serializer لعرض تفاصيل المستخدم الحالي (مثل عند الوصول إلى /api/auth/users/me/).
    يوسع Djoser's UserSerializer لإضافة حقول مخصصة.
    """
    # هذا الحقل سيقوم ببناء الـ URL الكامل لصورة المستخدم
    user_image = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        model = CustomUser
        # الحقول التي سيتم إرجاعها عند جلب بيانات المستخدم
        fields = ('id', 'email', 'first_name', 'last_name', 'user_type', 'user_image', 'specialized_subject', 'gender', 'governorate', 'phone_number')
        read_only_fields = ('email',) 

    def get_user_image(self, obj):
        """
        دالة مساعدة لبناء الـ URL الكامل لصورة المستخدم.
        تتطلب أن يكون حقل 'image' موجوداً في موديل CustomUser وأن تكون STATIC_URL و MEDIA_URL/ROOT مضبوطة.
        """
        if obj.image and hasattr(obj.image, 'url'): 
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url 
        return None 

# LoginSerializer الخاص بك:
# هذا Serializer لم يعد مستخدماً في الـ LoginView إذا كنت تستخدم Djoser's TokenCreateView/TokenCreateSerializer.
# سأتركه هنا فقط إذا كنت ما زلت تستخدمه في مكان آخر، لكن تأكد أنك لا تستخدمه للمصادقة الرئيسية.
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    token = serializers.CharField(read_only=True)
    user_type = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True) 
    user_image = serializers.CharField(read_only=True) 
    specialized_subject = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError('بيانات الاعتماد غير صحيحة.')

            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                data['token'] = token.key
                data['user_type'] = user.user_type
                data['first_name'] = user.first_name
                data['last_name'] = user.last_name 
                
                request = self.context.get('request')
                if user.image and hasattr(user.image, 'url'):
                    if request is not None:
                        data['user_image'] = request.build_absolute_uri(user.image.url)
                    else:
                        data['user_image'] = user.image.url
                else:
                    data['user_image'] = None 

                if user.user_type == 'teacher':
                    data['specialized_subject'] = user.specialized_subject
                return data
            else:
                raise serializers.ValidationError('بيانات الاعتماد غير صحيحة.')
        else:
            raise serializers.ValidationError('يجب توفير البريد الإلكتروني وكلمة المرور.')

# AccountRequestSerializer الخاص بك (لا علاقة له بالمصادقة المباشرة، بل بطلبات التسجيل)
class AccountRequestSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='تأكيد كلمة المرور'
    )
    specialized_subject = serializers.CharField(write_only=True, required=False) 

    class Meta:
        model = AccountRequest
        fields = '__all__'
        read_only_fields = ('status', 'request_date',)
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            # ... (باقي extra_kwargs) ...
            # تأكد أن هذه الحقول لها نفس الأسماء في موديل AccountRequest
            'second_name': {'required': False}, 'third_name': {'required': False},
            'phone_number': {'required': False}, 'parent_father_phone_number': {'required': False},
            'parent_mother_phone_number': {'required': False}, 'school_name': {'required': False},
            'parent_profession': {'required': False}, 'teacher_name_for_student': {'required': False},
            'gender': {'required': False}, 'governorate': {'required': False},
            'academic_level': {'required': False}, 'academic_track': {'required': False},
            'category_type': {'required': False}, 
            'what_will_you_add': {'required': False},
            'job_position': {'required': False}, 'expected_salary': {'required': False},
            'address': {'required': False}, 'previous_work_experience': {'required': False},
            'instagram_link': {'required': False}, 'facebook_link': {'required': False},
            'website_link': {'required': False}, 'personal_id_card': {'required': False},
            'cv_file': {'required': False},
            'qualifications': {'required': False},
            'experience': {'required': False},
        }

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "كلمتا المرور غير متطابقتين."})
        
        user_type = data.get('user_type')

        if user_type == 'student':
            required_fields = ['first_name', 'last_name', 'phone_number', 'parent_father_phone_number',
                             'school_name', 'parent_profession', 'governorate', 'academic_level',
                             'academic_track', 'gender']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"هذا الحقل مطلوب للطالب."})

        elif user_type == 'teacher':
            if not data.get('specialized_subject'):
                raise serializers.ValidationError({"specialized_subject": "المادة المتخصصة (specialized_subject) مطلوبة للأستاذ."})
            
            data['category_type'] = data.get('specialized_subject') # تعيين category_type من specialized_subject

            required_fields = ['first_name', 'last_name', 'phone_number', 'qualifications',
                             'experience', 'category_type', 'what_will_you_add']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"هذا الحقل مطلوب للأستاذ."})

        elif user_type == 'team_member':
            required_fields = ['first_name', 'last_name', 'phone_number', 'job_position',
                             'expected_salary', 'what_will_you_add', 'governorate', 'address',
                             'previous_work_experience']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: f"هذا الحقل مطلوب لعضو فريق العمل."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        specialized_subject_data = validated_data.pop('specialized_subject', None) # إزالة specialized_subject

        validated_data['password'] = make_password(validated_data['password'])
        account_request = AccountRequest.objects.create(**validated_data)
        return account_request

# TeacherProfileSerializer الخاص بك
class TeacherProfileSerializer(serializers.ModelSerializer):
    specialized_subject_display = serializers.CharField(source='get_specialized_subject_display', read_only=True)
    user_image = serializers.SerializerMethodField() # إضافة user_image هنا أيضاً للبروفايل

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type', 'specialized_subject_display', 'user_image']
    
    def get_user_image(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None