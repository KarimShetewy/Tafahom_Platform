// frontend/src/constants/academicStructure.js

const academicStructure = {
    // مستويات أكاديمية
    'level1': {
        label: 'الصف الأول الإعدادي',
        tracks: {
            'general': { label: 'عام' },
        },
        all_materials: ['arabic', 'english', 'math', 'science'],
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

    // خيارات الجنس
    genders: {
        'male': { label: 'ذكر' },
        'female': { label: 'أنثى' },
    },

    // خيارات المحافظات
    governorates: {
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

    // مهن ولي الأمر
    parentProfessions: {
        'doctor': { label: 'طبيب' },
        'engineer': { label: 'مهندس' },
        'teacher': { label: 'معلم' },
        'accountant': { label: 'محاسب' },
        'business_owner': { label: 'صاحب عمل حر' },
        'employee': { label: 'موظف' },
        'other': { label: 'أخرى' },
    },

    // وظائف فريق العمل (لفورم تسجيل فريق العمل)
    jobPositions: {
        'developer': { label: 'مطور' },
        'designer': { label: 'مصمم' },
        'content_creator': { label: 'منشئ محتوى' },
        'marketing': { label: 'تسويق' },
        'support': { label: 'دعم فني' },
        'admin_assistant': { label: 'مساعد إداري' },
    },

    // أسماء المدرسين (هذه غالباً ستأتي من API في تطبيق حقيقي، لكن للاختبار)
    teacherNames: {
        'ahmed_ali': { label: 'أ. أحمد علي' },
        'mohamed_hassan': { label: 'أ. محمد حسن' },
        'fatma_zaki': { label: 'أ. فاطمة زكي' },
    },

    // خريطة لجميع المواد (للتخصصات أو العرض العام)
    allSubjectsMap: {
        'arabic': { label: 'اللغة العربية' },
        'english': { label: 'اللغة الإنجليزية' },
        'math': { label: 'الرياضيات (إعدادي)' },
        'math_sec': { label: 'الرياضيات (ثانوي عام)' },
        'math_3_science': { label: 'الرياضيات (علمي رياضة)'},
        'math_3_lit': { label: 'الرياضيات (أدبي)'},
        'science': { label: 'العلوم (إعدادي)' },
        'physics': { label: 'الفيزياء' },
        'chemistry': { label: 'الكيمياء' },
        'biology': { label: 'الأحياء' },
        'geology': { label: 'الجيولوجيا' },
        'history': { label: 'التاريخ' },
        'geography': { label: 'الجغرافيا' },
        'philosophy': { label: 'الفلسفة والمنطق' },
        'philosophy_3': { label: 'الفلسفة والمنطق (ثانوية عامة)'},
        // أضف أي مواد أخرى هنا
    },
};

export default academicStructure;