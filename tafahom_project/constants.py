# tafahom_project/constants.py

# خيارات الجنس
GENDER_CHOICES = [
    ('male', 'ذكر'),
    ('female', 'أنثى'),
]

# خيارات المحافظات (استخدم القيم الفنية هنا، وليس التسميات المعربة)
GOVERNORATE_CHOICES = [
    ('cairo', 'القاهرة'),
    ('alexandria', 'الإسكندرية'),
    ('giza', 'الجيزة'),
    ('qalyubia', 'القليوبية'),
    ('sharqia', 'الشرقية'),
    ('monufia', 'المنوفية'),
    ('beheira', 'البحيرة'),
    ('gharbia', 'الغربية'),
    ('kafr_el_sheikh', 'كفر الشيخ'),
    ('fayoum', 'الفيوم'),
    ('beni_suef', 'بني سويف'),
    ('minya', 'المنيا'),
    ('assiut', 'أسيوط'),
    ('sohag', 'سوهاج'),
    ('qena', 'قنا'),
    ('luxor', 'الأقصر'),
    ('aswan', 'أسوان'),
    ('red_sea', 'البحر الأحمر'),
    ('new_valley', 'الوادي الجديد'),
    ('matrouh', 'مطروح'),
    ('north_sinai', 'شمال سيناء'),
    ('south_sinai', 'جنوب سيناء'),
    ('suez', 'السويس'),
    ('ismailia', 'الإسماعيلية'),
    ('port_said', 'بورسعيد'),
    ('damietta', 'دمياط'),
]

# مهن ولي الأمر
PARENT_PROFESSION_CHOICES = [
    ('doctor', 'طبيب'),
    ('engineer', 'مهندس'),
    ('teacher', 'معلم'),
    ('accountant', 'محاسب'),
    ('business_owner', 'صاحب عمل حر'),
    ('employee', 'موظف'),
    ('other', 'أخرى'),
]

# وظائف فريق العمل
JOB_POSITION_CHOICES = [
    ('developer', 'مطور'),
    ('designer', 'مصمم'),
    ('content_creator', 'منشئ محتوى'),
    ('marketing', 'تسويق'),
    ('support', 'دعم فني'),
    ('admin_assistant', 'مساعد إداري'),
]

# مستويات أكاديمية (الثانوية العامة فقط)
ACADEMIC_LEVEL_CHOICES = [
    ('level_sec_1', 'الصف الأول الثانوي'),
    ('level_sec_2', 'الصف الثاني الثانوي'),
    ('level_sec_3', 'الصف الثالث الثانوي'),
]

# مسارات أكاديمية (إذا كانت موجودة في موديل المستخدم أو الكورس)
# بناءً على رغبتك في إزالة "علمي وأدبي"، يمكن أن يكون هذا ببساطة 'general'
ACADEMIC_TRACK_CHOICES = [
    ('general', 'عام'),
    # لا توجد مسارات علمي/أدبي هنا إذا كنت قد أزلتها
]

# خيارات المواد الدراسية (SUBJECT_CHOICES)
SUBJECT_CHOICES = [
    ('arabic', 'اللغة العربية'),
    ('english', 'اللغة الإنجليزية'),
    # 'math' للإعدادي تم إزالته
    ('math_sec', 'الرياضيات (ثانوي عام)'),
    ('math_3_science', 'الرياضيات (علمي رياضة)'),
    ('math_3_lit', 'الرياضيات (أدبي)'),
    ('physics', 'الفيزياء'),
    ('chemistry', 'الكيمياء'),
    ('biology', 'الأحياء'),
    ('geology', 'الجيولوجيا'),
    ('history', 'التاريخ'),
    ('geography', 'الجغرافيا'),
    ('philosophy_logic', 'الفلسفة والمنطق'),
    ('philosophy_3', 'الفلسفة والمنطق (ثانوية عامة)'),
    ('religious_edu', 'التربية الدينية'),
    ('programming_cs', 'البرمجة وعلوم الحاسب'),
    ('eg_national_edu', 'التربية الوطنية'),
    ('vocational_edu', 'التربية المهنية'),
    ('military_edu', 'التربية العسكرية'),
    ('psychology', 'علم النفس'),
    ('sociology', 'علم اجتماع'),
    ('applied_math', 'الرياضيات التطبيقية'),
    ('solid_geometry', 'الهندسة الفراغية'),
    ('statistics', 'الإحصاء'),
    ('environmental_science', 'علوم البيئة'),
    ('economy', 'الاقتصاد'),
    ('philosophy', 'فلسفة'),
    ('logic', 'منطق'),
    ('civics', 'المواطنة'),
]

# أنواع الكورسات
COURSE_TYPE_CHOICES = [
    ('regular', 'كورس عادي'),
    ('separate', 'كورس منفصل (مراجعة/برنامج خاص)'),
]

# أنواع المواد التعليمية
MATERIAL_TYPE_CHOICES = [
    ('video', 'فيديو شرح'),
    ('pdf', 'ملف PDF'),
    ('quiz', 'واجب'),
    ('exam', 'امتحان'),
    ('link', 'رابط خارجي'),
    ('text', 'نص/شرح'),
    # 'branch' (فرع) يمكن إضافته هنا إذا كان نوعاً من المواد وليس فقط مؤشراً
    ('branch', 'فرع'),
]