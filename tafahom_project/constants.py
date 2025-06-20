# tafahom_project/constants.py

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

# المسارات الأكاديمية
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