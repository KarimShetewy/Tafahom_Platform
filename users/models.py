from django.db import models
from django.contrib.auth.models import AbstractUser

# خيارات الوظائف لفريق العمل
JOB_POSITION_CHOICES = (
    ('it_specialist', 'IT Specialist'),
    ('developer', 'Developer'),
    ('videographer_editor', 'Videographer/Editor'),
    ('social_media_specialist', 'Social Media Specialist'),
    ('print_designer', 'Print Designer'),
    ('moderator', 'Moderator'),
    ('arabic_english_translator', 'مترجم عربي/إنجليزي'),
    ('accountant', 'محاسب'),
    ('story_teller', 'راوي قصص'),
    ('content_creator', 'صانع محتوى'),
    ('sales_admin_assistant', 'مساعد مبيعات/إدارة'),
    ('other', 'أخرى'),
)

GENDER_CHOICES = (
    ('male', 'ذكر'),
    ('female', 'أنثى'),
)

# الصفوف الدراسية (مرحلة الثانوي فقط)
ACADEMIC_LEVEL_CHOICES = (
    ('first_secondary', 'الصف الأول الثانوي'),
    ('second_secondary', 'الصف الثاني الثانوي'),
    ('third_secondary', 'الصف الثالث الثانوي'),
)

# المسارات الأكاديمية (مستخدمة حالياً في طلبات التسجيل ولكن ليس للفلترة العامة)
ACADEMIC_TRACK_CHOICES = (
    ('general', 'عام (الصف الأول الثانوي)'),
    ('scientific_sec_2', 'علمي (الصف الثاني الثانوي)'),
    ('literary_sec_2', 'أدبي (الصف الثاني الثانوي)'),
    ('science_sec_3', 'علمي علوم (الصف الثالث الثانوي)'),
    ('math_sec_3', 'علمي رياضة (الصف الثالث الثانوي)'),
    ('literary_sec_3', 'أدبي (الصف الثالث الثانوي)'),
)

# جميع المواد (CATEGORY_CHOICES) بناءً على النظام الجديد
CATEGORY_CHOICES = (
    ('arabic_lang', 'اللغة العربية'),
    ('english_lang', 'اللغة الإنجليزية'),
    ('french_lang', 'اللغة الفرنسية'),
    ('german_lang', 'اللغة الألمانية'),
    ('history', 'التاريخ'),
    ('math', 'الرياضيات'),
    ('physics', 'الفيزياء'),
    ('chemistry', 'الكيمياء'),
    ('biology', 'الأحياء'),
    ('philosophy_logic', 'الفلسفة والمنطق'),
    ('religious_edu', 'التربية الدينية'),
    ('programming_cs', 'البرمجة وعلوم الحاسب'),
    ('eg_national_edu', 'EG التربية الوطنية'),
    ('vocational_edu', 'التربية المهنية'),
    ('military_edu', 'التربية العسكرية'),
    ('psychology', 'علم النفس'),
    ('geography', 'الجغرافيا'),
    ('sociology', 'علم اجتماع'),
    ('geology', 'الجيولوجيا'),
    ('applied_math', 'الرياضيات التطبيقية'),
    ('solid_geometry', 'الهندسة الفراغية'),
    ('statistics', 'الإحصاء'),
    ('environmental_science', 'علوم البيئة'),
    ('economy', 'الاقتصاد'),
    ('philosophy', 'فلسفة'),
    ('logic', 'منطق'),
    ('civics', 'المواطنة'),
)

# المحافظات المصرية
GOVERNORATE_CHOICES = (
    ('cairo', 'القاهرة'), ('alexandria', 'الإسكندرية'), ('giza', 'الجيزة'), ('qalyubia', 'القليوبية'),
    ('sharqia', 'الشرقية'), ('monufia', 'المنوفية'), ('beheira', 'البحيرة'), ('gharbia', 'الغربية'),
    ('kafr_el_sheikh', 'كفر الشيخ'), ('fayoum', 'الفيوم'), ('beni_suef', 'بني سويف'), ('minya', 'المنيا'),
    ('assiut', 'أسيوط'), ('sohag', 'سوهاج'), ('qena', 'قنا'), ('luxor', 'الأقصر'),
    ('aswan', 'أسوان'), ('red_sea', 'البحر الأحمر'), ('new_valley', 'الوادي الجديد'), ('matrouh', 'مطروح'),
    ('north_sinai', 'شمال سيناء'), ('south_sinai', 'جنوب سيناء'), ('suez', 'السويس'),
    ('ismailia', 'الإسماعيلية'), ('port_said', 'بورسعيد'), ('damietta', 'دمياط'),
)

# مهنة ولي الأمر
PARENT_PROFESSION_CHOICES = (
    ('doctor', 'طبيب'), ('engineer', 'مهندس'), ('teacher', 'معلم'), ('accountant', 'محاسب'), ('other', 'أخرى'),
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
