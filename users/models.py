from django.db import models
from django.contrib.auth.models import AbstractUser
# NEW: استيراد الخيارات من ملف constants الجديد
from tafahom_project.constants import (
    JOB_POSITION_CHOICES, GENDER_CHOICES, ACADEMIC_LEVEL_CHOICES,
    ACADEMIC_TRACK_CHOICES, CATEGORY_CHOICES, GOVERNORATE_CHOICES,
    PARENT_PROFESSION_CHOICES
)


class CustomUser(AbstractUser):
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
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="custom_user_permissions_set",
        related_query_name="custom_user",
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم الهاتف')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True, verbose_name='الجنس')
    governorate = models.CharField(max_length=50, choices=GOVERNORATE_CHOICES, blank=True, null=True, verbose_name='المحافظة')

    first_name = models.CharField(max_length=150, blank=True, verbose_name="الاسم الأول")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="الاسم الأخير")

    specialized_subject = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        blank=True, 
        null=True, 
        verbose_name='المادة المتخصصة'
    )


    class Meta:
        verbose_name = 'مستخدم'
        verbose_name_plural = 'مستخدمين'


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
    password = models.CharField(max_length=128, verbose_name='كلمة المرور المشفرة')
    user_type = models.CharField(
        max_length=20,
        choices=REQUEST_USER_TYPE_CHOICES,
        verbose_name='نوع الحساب المطلوب'
    )
    first_name = models.CharField(max_length=100, verbose_name='الاسم الأول')
    last_name = models.CharField(max_length=100, verbose_name='الاسم الأخير')
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم الهاتف')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True, verbose_name='الجنس')
    governorate = models.CharField(max_length=50, choices=GOVERNORATE_CHOICES, blank=True, null=True, verbose_name='المحافظة')

    second_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='الاسم الثاني (الأب)')
    third_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='الاسم الثالث (الجد)')
    parent_father_phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم هاتف الأب')
    parent_mother_phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name='رقم هاتف الأم')
    school_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='اسم المدرسة')
    parent_profession = models.CharField(max_length=50, choices=PARENT_PROFESSION_CHOICES, blank=True, null=True, verbose_name='مهنة ولي الأمر')
    teacher_name_for_student = models.CharField(max_length=255, blank=True, null=True, verbose_name='اسم الأستاذ للطالب')
    academic_level = models.CharField(max_length=50, choices=ACADEMIC_LEVEL_CHOICES, blank=True, null=True, verbose_name='الصف الدراسي')
    academic_track = models.CharField(max_length=50, choices=ACADEMIC_TRACK_CHOICES, blank=True, null=True, verbose_name='المسار الدراسي')

    qualifications = models.TextField(blank=True, null=True, verbose_name='المؤهلات (للأستاذ)')
    experience = models.TextField(blank=True, null=True, verbose_name='الخبرة (للأستاذ)')
    category_type = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True, null=True, verbose_name='الفئة المطلوبة (للأستاذ)')
    what_will_you_add = models.TextField(blank=True, null=True, verbose_name='ما الذي ستضيفه للمنصة؟')

    job_position = models.CharField(max_length=50, choices=JOB_POSITION_CHOICES, blank=True, null=True, verbose_name='الوظيفة المطلوبة (لفريق العمل)')
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