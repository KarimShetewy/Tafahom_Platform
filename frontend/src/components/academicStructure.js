// frontend/src/constants/academicStructure.js

const academicStructure = {
    // مستويات أكاديمية (Academic Levels)
    'level1': {
        label: 'الصف الأول الإعدادي',
        tracks: {
            'general': { label: 'عام' },
        },
        all_materials: ['arabic', 'english', 'math', 'science'], // المواد الفنية
    },
    'level2': {
        label: 'الصف الثاني الإعدادي',
        tracks: {
            'general': { label: 'عام' },
        },
        all_materials: ['arabic', 'english', 'math', 'science'],
    },
    'level3': {
        label: 'الصف الثالث الإعدادي',
        tracks: {
            'general': { label: 'عام' },
        },
        all_materials: ['arabic', 'english', 'math', 'science'],
    },
    'level_sec_1': {
        label: 'الصف الأول الثانوي',
        tracks: {
            'science': { label: 'علمي' },
            'literary': { label: 'أدبي' },
        },
        all_materials: ['arabic', 'english', 'math_sec', 'physics', 'chemistry', 'biology', 'history', 'geography', 'philosophy'],
    },
    'level_sec_2': {
        label: 'الصف الثاني الثانوي',
        tracks: {
            'science': { label: 'علمي' },
            'literary': { label: 'أدبي' },
        },
        all_materials: ['arabic', 'english', 'math_sec', 'physics', 'chemistry', 'biology', 'geology', 'history', 'geography', 'philosophy'],
    },
    'level_sec_3': {
        label: 'الصف الثالث الثانوي',
        tracks: {
            'science_math': { label: 'علمي رياضة' },
            'science_علوم': { label: 'علمي علوم' },
            'literary': { label: 'أدبي' },
        },
        all_materials: ['arabic', 'english', 'math_3_science', 'math_3_lit', 'physics', 'chemistry', 'biology', 'geology', 'history', 'geography', 'philosophy_3'],
    },

    // خيارات الجنس (Genders)
    genders: {
        '': { label: 'اختر الجنس' }, // الخيار الافتراضي
        'male': { label: 'ذكر' },
        'female': { label: 'أنثى' },
    },

    // خيارات المحافظات (Governorates)
    governorates: {
        '': { label: 'اختر المحافظة' }, // الخيار الافتراضي
        'cairo': { label: 'القاهرة' },
        'alexandria': { label: 'الإسكندرية' },
        'giza': { label: 'الجيزة' },
        'qalyubia': { label: 'القليوبية' },
        'sharqia': { label: 'الشرقية' },
        'monufia': { label: 'المنوفية' },
        'beheira': { label: 'البحيرة' },
        'gharbia': { label: 'الغربية' },
        'kafr_el_sheikh': { label: 'كفر الشيخ' },
        'fayoum': { label: 'الفيوم' },
        'beni_suef': { label: 'بني سويف' },
        'minya': { label: 'المنيا' },
        'assiut': { label: 'أسيوط' },
        'sohag': { label: 'سوهاج' },
        'qena': { label: 'قنا' },
        'luxor': { label: 'الأقصر' },
        'aswan': { label: 'أسوان' },
        'red_sea': { label: 'البحر الأحمر' },
        'new_valley': { label: 'الوادي الجديد' },
        'matrouh': { label: 'مطروح' },
        'north_sinai': { label: 'شمال سيناء' },
        'south_sinai': { label: 'جنوب سيناء' },
        'suez': { label: 'السويس' },
        'ismailia': { label: 'الإسماعيلية' },
        'port_said': { label: 'بورسعيد' },
        'damietta': { label: 'دمياط' },
    },

    // مهن ولي الأمر (Parent Professions)
    parentProfessions: {
        '': { label: 'اختر مهنة ولي الأمر' }, // الخيار الافتراضي
        'doctor': { label: 'طبيب' },
        'engineer': { label: 'مهندس' },
        'teacher': { label: 'معلم' },
        'accountant': { label: 'محاسب' },
        'business_owner': { label: 'صاحب عمل حر' },
        'employee': { label: 'موظف' },
        'other': { label: 'أخرى' },
    },

    // وظائف فريق العمل (Job Positions for team_member)
    jobPositions: {
        '': { label: 'اختر الوظيفة' }, // الخيار الافتراضي
        'developer': { label: 'مطور' },
        'designer': { label: 'مصمم' },
        'content_creator': { label: 'منشئ محتوى' },
        'marketing': { label: 'تسويق' },
        'support': { label: 'دعم فني' },
        'admin_assistant': { label: 'مساعد إداري' },
    },

    // أسماء المدرسين (Teacher Names - هذه غالباً ستأتي من API في تطبيق حقيقي، لكن للاختبار)
    teacherNames: {
        '': { label: 'اختر الأستاذ (اختياري)' }, // الخيار الافتراضي
        'teacher_ahmed': { label: 'أ. أحمد علي' },
        'teacher_mohamed': { label: 'أ. محمد حسن' },
        'teacher_fatma': { label: 'أ. فاطمة زكي' },
    },

    // خريطة لجميع المواد (All Subjects Map - للمواد الفنية في Django)
    allSubjectsMap: {
        'arabic': { label: 'اللغة العربية' },
        'english': { label: 'اللغة الإنجليزية' },
        'math': { label: 'الرياضيات (إعدادي)' },
        'math_sec': { label: 'الرياضيات (ثانوي عام)' },
        'math_3_science': { label: 'الرياضيات (علمي رياضة)'},
        'math_3_lit': { label: 'الرياضيات (أدبي)'},
        'physics': { label: 'الفيزياء' },
        'chemistry': { label: 'الكيمياء' },
        'biology': { label: 'الأحياء' },
        'geology': { label: 'الجيولوجيا' },
        'history': { label: 'التاريخ' },
        'geography': { label: 'الجغرافيا' },
        'philosophy_logic': { label: 'الفلسفة والمنطق' },
        'philosophy_3': { label: 'الفلسفة والمنطق (ثانوية عامة)'},
        'religious_edu': { label: 'التربية الدينية' },
        'programming_cs': { label: 'البرمجة وعلوم الحاسب' },
        'eg_national_edu': { label: 'التربية الوطنية' },
        'vocational_edu': { label: 'التربية المهنية' },
        'military_edu': { label: 'التربية العسكرية' },
        'psychology': { label: 'علم النفس' },
        'sociology': { label: 'علم اجتماع' },
        'applied_math': { label: 'الرياضيات التطبيقية' },
        'solid_geometry': { label: 'الهندسة الفراغية' },
        'statistics': { label: 'الإحصاء' },
        'environmental_science': { label: 'علوم البيئة' },
        'economy': { label: 'الاقتصاد' },
        'philosophy': { label: 'فلسفة' },
        'logic': { label: 'منطق' },
        'civics': { label: 'المواطنة' },
    },
};

export default academicStructure;