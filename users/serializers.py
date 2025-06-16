from rest_framework import serializers
from .models import AccountRequest, CustomUser # تأكد من استيراد CustomUser
from django.contrib.auth.hashers import make_password # لاستخدام تشفير كلمة المرور
from rest_framework.authtoken.models import Token # لاستيراد Token

class AccountRequestSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='تأكيد كلمة المرور'
    )

    class Meta:
        model = AccountRequest
        fields = '__all__' # نستخدم __all__ لسهولة التعامل مع كل الحقول
        read_only_fields = ('status', 'request_date',)
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            
            # كل الحقول دي بنخليها اختيارية في Serializer عشان الـ database ما تسألش عن قيم افتراضية
            # والتحقق إذا كانت مطلوبة بالفعل هيكون في دالة validate
            'second_name': {'required': False}, 'third_name': {'required': False},
            'phone_number': {'required': False}, 'parent_father_phone_number': {'required': False},
            'parent_mother_phone_number': {'required': False}, 'school_name': {'required': False},
            'parent_profession': {'required': False}, 'teacher_name_for_student': {'required': False},
            'gender': {'required': False}, 'governorate': {'required': False},
            'academic_level': {'required': False}, 'academic_track': {'required': False},
            'category_type': {'required': False}, 'what_will_you_add': {'required': False},
            'job_position': {'required': False}, 'expected_salary': {'required': False},
            'address': {'required': False}, 'previous_work_experience': {'required': False},
            'instagram_link': {'required': False}, 'facebook_link': {'required': False},
            'website_link': {'required': False}, 'personal_id_card': {'required': False},
            'cv_file': {'required': False},
        }

    def validate(self, data):
        # التحقق من تطابق كلمتي المرور
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "كلمتا المرور غير متطابقتين."})
        
        # منطق التحقق من الحقول المطلوبة بناءً على 'user_type'
        user_type = data.get('user_type')

        if user_type == 'student':
            if not data.get('first_name'): raise serializers.ValidationError({"first_name": "الاسم الأول للطالب مطلوب."})
            if not data.get('last_name'): raise serializers.ValidationError({"last_name": "الاسم الأخير للطالب مطلوب."})
            if not data.get('phone_number'): raise serializers.ValidationError({"phone_number": "رقم هاتف الطالب مطلوب."})
            if not data.get('parent_father_phone_number'): raise serializers.ValidationError({"parent_father_phone_number": "رقم هاتف الأب مطلوب."})
            if not data.get('school_name'): raise serializers.ValidationError({"school_name": "اسم المدرسة مطلوب."})
            if not data.get('parent_profession'): raise serializers.ValidationError({"parent_profession": "مهنة ولي الأمر مطلوبة."})
            if not data.get('governorate'): raise serializers.ValidationError({"governorate": "المحافظة مطلوبة."})
            if not data.get('academic_level'): raise serializers.ValidationError({"academic_level": "الصف الدراسي مطلوب."})
            if not data.get('academic_track'): raise serializers.ValidationError({"academic_track": "المسار الدراسي مطلوب للطالب."})
            if not data.get('gender'): raise serializers.ValidationError({"gender": "الجنس مطلوب."})
        elif user_type == 'teacher':
            if not data.get('first_name'): raise serializers.ValidationError({"first_name": "الاسم الأول للأستاذ مطلوب."})
            if not data.get('last_name'): raise serializers.ValidationError({"last_name": "الاسم الأخير للأستاذ مطلوب."})
            if not data.get('phone_number'): raise serializers.ValidationError({"phone_number": "رقم هاتف الأستاذ مطلوب."})
            if not data.get('qualifications'): raise serializers.ValidationError({"qualifications": "المؤهلات مطلوبة للأستاذ."})
            if not data.get('experience'): raise serializers.ValidationError({"experience": "الخبرة مطلوبة للأستاذ."})
            if not data.get('category_type'): raise serializers.ValidationError({"category_type": "الفئة المطلوبة (التخصص) مطلوبة للأستاذ."})
            if not data.get('what_will_you_add'): raise serializers.ValidationError({"what_will_you_add": "ماذا ستضيف لمنصة تفاهم مطلوب للأستاذ."})
        elif user_type == 'team_member':
            if not data.get('first_name'): raise serializers.ValidationError({"first_name": "الاسم الأول مطلوب."})
            if not data.get('last_name'): raise serializers.ValidationError({"last_name": "الاسم الأخير مطلوب."})
            if not data.get('phone_number'): raise serializers.ValidationError({"phone_number": "رقم الهاتف مطلوب."})
            if not data.get('job_position'): raise serializers.ValidationError({"job_position": "الوظيفة المطلوبة مطلوبة."})
            if not data.get('expected_salary'): raise serializers.ValidationError({"expected_salary": "الراتب المتوقع مطلوب."})
            if not data.get('what_will_you_add'): raise serializers.ValidationError({"what_will_you_add": "ماذا ستضيف لمنصة تفاهم مطلوب."})
            if not data.get('governorate'): raise serializers.ValidationError({"governorate": "المحافظة مطلوبة."})
            if not data.get('address'): raise serializers.ValidationError({"address": "العنوان بالتفصيل مطلوب."})
            if not data.get('previous_work_experience'): raise serializers.ValidationError({"previous_work_experience": "خبرة العمل السابقة مطلوبة."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data['password'] = make_password(validated_data['password'])
        account_request = AccountRequest.objects.create(**validated_data)
        return account_request

#--------------------------------------------------------------------------------------
# Serializer for Login API
#--------------------------------------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    token = serializers.CharField(read_only=True)
    user_type = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)

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
                return data
            else:
                raise serializers.ValidationError('بيانات الاعتماد غير صحيحة.')
        else:
            raise serializers.ValidationError('يجب توفير البريد الإلكتروني وكلمة المرور.')

#--------------------------------------------------------------------------------------
# Serializer لملف المدرس (جديد) - هذا هو الذي تسبب في المشكلة
#--------------------------------------------------------------------------------------
class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser # هذا Serializer لنموذج CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'user_type']