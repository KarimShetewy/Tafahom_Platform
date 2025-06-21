# users/models.py
from django.db import models
# يجب أن تستخدم AbstractUser إذا كنت تريد الحفاظ على حقول مثل username, first_name, last_name من Django
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# ملاحظة: إذا كنت تستخدم AbstractUser، فلست بحاجة لتعريف حقول مثل email, first_name, last_name, is_active, is_staff, date_joined
# لأنها تأتي مع AbstractUser. فقط عليك تجاوز USERNAME_FIELD إذا كنت تستخدم البريد الإلكتروني كاسم مستخدم.

# إذا كان لديك CustomUserManager معرفاً لدعم create_user / create_superuser، احتفظ به
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', 'admin') # نوع المستخدم الافتراضي للأدمن
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


# تغيير CustomUser ليرث من AbstractUser
class CustomUser(AbstractUser): # NEW: يرث من AbstractUser
    # AbstractUser يحتوي بالفعل على username, first_name, last_name, email, is_staff, is_active, date_joined
    # لذا لا داعي لإعادة تعريفها هنا إلا إذا كنت تريد تغيير خصائصها.
    email = models.EmailField(unique=True) # إعادة تعريف لضمان unique
    
    # إزالة first_name و last_name إذا كنت تستخدمهما من AbstractUser
    # إذا كنت لا تستخدم username وحذفْتَه، فعليك تعيين USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'user_type'] # هذا سيظل مطلوباً لتغيير AbstractUser

    USER_TYPE_CHOICES = (
        ('student', 'طالب'),
        ('teacher', 'أستاذ'),
        ('team_member', 'عضو فريق عمل'),
        ('admin', 'مسؤول'),
    )
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='student',
        verbose_name='نوع المستخدم'
    )
    
    # حقول إضافية
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True, verbose_name='الصورة الشخصية') 
    gender = models.CharField(max_length=10, choices=[('male', 'ذكر'), ('female', 'أنثى')], blank=True, null=True, verbose_name='الجنس')
    governorate = models.CharField(max_length=50, blank=True, null=True, verbose_name='المحافظة')
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم الهاتف')
    specialized_subject = models.CharField(max_length=100, blank=True, null=True, verbose_name='المادة المتخصصة') # للمدرسين

    # ملاحظة: AbstractUser يأتي مع groups و user_permissions جاهزة، لا داعي لإعادة تعريفها هنا
    # إذا كانت لديك تعريفات مكررة لها، قم بإزالتها.

    objects = CustomUserManager() # استخدام الـ Manager الخاص بك

    class Meta:
        verbose_name = 'مستخدم'
        verbose_name_plural = 'مستخدمين'

    def __str__(self):
        return self.email
    
    # يمكنك الاحتفاظ بـ get_full_name و get_short_name إذا كنت تستخدمهما
    # AbstractUser يوفر أيضاً get_full_name و get_short_name بشكل افتراضي

class AccountRequest(models.Model):
    REQUEST_STATUS_CHOICES = (
        ('pending', 'قيد المراجعة'),
        ('approved', 'مقبول'),
        ('rejected', 'مرفوض'),
    )
    REQUEST_USER_TYPE_CHOICES = (
        ('student', 'طالب'),
        ('teacher', 'أستاذ'),
        ('team_member', 'عضو فريق عمل'),
    )

    email = models.EmailField(unique=True, verbose_name='البريد الإلكتروني')
    password = models.CharField(max_length=128, verbose_name='كلمة المرور المشفرة') # سيتم تشفيرها قبل الحفظ
    user_type = models.CharField(
        max_length=20,
        choices=REQUEST_USER_TYPE_CHOICES,
        verbose_name='نوع الحساب المطلوب'
    )
    first_name = models.CharField(max_length=100, verbose_name='الاسم الأول')
    last_name = models.CharField(max_length=100, verbose_name='الاسم الأخير')
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم الهاتف')
    gender = models.CharField(max_length=10, choices=[('male', 'ذكر'), ('female', 'أنثى')], blank=True, null=True, verbose_name='الجنس')
    governorate = models.CharField(max_length=50, blank=True, null=True, verbose_name='المحافظة')

    # حقول خاصة بالطلاب
    second_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='الاسم الثاني (الأب)')
    third_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='الاسم الثالث (الجد)')
    parent_father_phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم هاتف الأب')
    parent_mother_phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم هاتف الأم')
    school_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='اسم المدرسة')
    parent_profession = models.CharField(max_length=50, blank=True, null=True, verbose_name='مهنة ولي الأمر') # يجب أن تكون choices=PARENT_PROFESSION_CHOICES
    teacher_name_for_student = models.CharField(max_length=255, blank=True, null=True, verbose_name='اسم الأستاذ للطالب')
    academic_level = models.CharField(max_length=50, blank=True, null=True, verbose_name='الصف الدراسي') # يجب أن تكون choices=ACADEMIC_LEVEL_CHOICES
    academic_track = models.CharField(max_length=50, blank=True, null=True, verbose_name='المسار الدراسي') # يجب أن تكون choices=ACADEMIC_TRACK_CHOICES

    # حقول خاصة بالأساتذة
    qualifications = models.TextField(blank=True, null=True, verbose_name='المؤهلات (للأستاذ)')
    experience = models.TextField(blank=True, null=True, verbose_name='الخبرة (للأستاذ)')
    category_type = models.CharField(max_length=50, blank=True, null=True, verbose_name='الفئة المطلوبة (للأستاذ)') # يجب أن تكون choices=CATEGORY_CHOICES
    what_will_you_add = models.TextField(blank=True, null=True, verbose_name='ما الذي ستضيفه للمنصة؟')

    # حقول خاصة بفريق العمل
    job_position = models.CharField(max_length=50, blank=True, null=True, verbose_name='الوظيفة المطلوبة (لفريق العمل)') # يجب أن تكون choices=JOB_POSITION_CHOICES
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='الراتب المتوقع')
    address = models.TextField(blank=True, null=True, verbose_name='العنوان بالتفصيل')
    previous_work_experience = models.TextField(blank=True, null=True, verbose_name='خبرة العمل السابقة (لفريق العمل)')
    instagram_link = models.URLField(max_length=200, blank=True, null=True, verbose_name='رابط انستجرام (اختياري)')
    facebook_link = models.URLField(max_length=200, blank=True, null=True, verbose_name='رابط فيسبوك (اختياري)')
    website_link = models.URLField(max_length=200, blank=True, null=True, verbose_name='رابط الموقع الإلكتروني (اختياري)')

    personal_id_card = models.FileField(upload_to='account_requests/personal_ids/', blank=True, null=True, verbose_name='صورة البطاقة الشخصية')
    cv_file = models.FileField(upload_to='account_requests/cvs/', blank=True, null=True, verbose_name='ملف السيرة الذاتية (CV)')

    status = models.CharField(
        max_length=10,
        choices=REQUEST_STATUS_CHOICES,
        default='pending',
        verbose_name='حالة الطلب'
    )
    rejection_reason = models.TextField(blank=True, null=True, verbose_name='سبب الرفض (إن وجد)')
    request_date = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ الطلب')

    def __str__(self):
        return f"طلب {self.get_user_type_display()} من {self.first_name} {self.last_name} ({self.status})"

    class Meta:
        verbose_name = 'طلب إنشاء حساب'
        verbose_name_plural = 'طلبات إنشاء الحساب'