from rest_framework import serializers
from .models import AccountRequest, CustomUser
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token

class AccountRequestSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='تأكيد كلمة المرور'
    )
    # NEW: إضافة specialized_subject كـ write_only ليتم استقباله من الفورم
    # وسيتم تعيينه في AccountRequest.category_type
    specialized_subject = serializers.CharField(write_only=True, required=False) # جعله غير مطلوب في Serializer هنا


    class Meta:
        model = AccountRequest
        fields = '__all__'
        read_only_fields = ('status', 'request_date',)
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'second_name': {'required': False}, 'third_name': {'required': False},
            'phone_number': {'required': False}, 'parent_father_phone_number': {'required': False},
            'parent_mother_phone_number': {'required': False}, 'school_name': {'required': False},
            'parent_profession': {'required': False}, 'teacher_name_for_student': {'required': False},
            'gender': {'required': False}, 'governorate': {'required': False},
            'academic_level': {'required': False}, 'academic_track': {'required': False},
            'category_type': {'required': False}, # هذا الحقل ما زال موجوداً
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
            # NEW: التأكد من أن specialized_subject (القيمة الفنية) موجودة
            if not data.get('specialized_subject'):
                 raise serializers.ValidationError({"specialized_subject": "المادة المتخصصة (specialized_subject) مطلوبة للأستاذ."})
            
            # NEW: تعيين category_type من specialized_subject قبل الإنشاء
            # هذا يضمن أن قيمة specialized_subject من الـ frontend تذهب إلى category_type في AccountRequest
            data['category_type'] = data.get('specialized_subject')

            required_fields = ['first_name', 'last_name', 'phone_number', 'qualifications',
                               'experience', 'category_type', 'what_will_you_add']
            for field in required_fields:
                if not data.get(field):
                    # هذا سيظهر إذا لم يتم تعيين specialized_subject من الـ frontend بشكل صحيح
                    # أو إذا كان category_type غير موجود بعد تعيينه
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
        # NEW: إزالة specialized_subject من validated_data قبل create
        # لأنه ليس حقلاً مباشراً في AccountRequest Model (بل يذهب إلى category_type)
        specialized_subject_data = validated_data.pop('specialized_subject', None)

        validated_data['password'] = make_password(validated_data['password'])
        account_request = AccountRequest.objects.create(**validated_data)
        return account_request

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    token = serializers.CharField(read_only=True)
    user_type = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
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
                if user.user_type == 'teacher':
                    data['specialized_subject'] = user.specialized_subject
                return data
            else:
                raise serializers.ValidationError('بيانات الاعتماد غير صحيحة.')
        else:
            raise serializers.ValidationError('يجب توفير البريد الإلكتروني وكلمة المرور.')

class TeacherProfileSerializer(serializers.ModelSerializer):
    specialized_subject_display = serializers.CharField(source='get_specialized_subject_display', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type', 'specialized_subject_display']
