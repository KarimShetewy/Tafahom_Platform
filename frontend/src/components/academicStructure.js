// frontend/src/constants/academicStructure.js
const academicStructure = {
    'first_secondary': {
        label: 'الصف الأول الثانوي',
        all_materials: [
            'arabic_lang', 'english_lang', 'history', 'math',
            'physics', 'chemistry', 'biology', 'philosophy_logic', 'religious_edu',
            'french_lang', 'german_lang', 'programming_cs', 'eg_national_edu',
            'vocational_edu', 'military_edu'
        ]
    },
    'second_secondary': {
        label: 'الصف الثاني الثانوي',
        all_materials: [
            'arabic_lang', 'english_lang', 'french_lang', 'german_lang',
            'physics', 'chemistry', 'biology', 'math', 'history', 'psychology',
            'philosophy', 'geography', 'sociology'
        ]
    },
    'third_secondary': {
        label: 'الصف الثالث الثانوي',
        all_materials: [
            'arabic_lang', 'english_lang', 'french_lang', 'german_lang',
            'biology', 'geology', 'chemistry', 'physics', 'applied_math', 'solid_geometry',
            'statistics', 'psychology', 'sociology', 'philosophy', 'logic', 'geography',
            'economy', 'civics'
        ]
    }
};

// Map لسهولة جلب الاسم المعروض للمادة من قيمتها (التي تستخدم في الـ API)
academicStructure.allSubjectsMap = {
    'arabic_lang': { value: 'arabic_lang', label: 'اللغة العربية' },
    'english_lang': { value: 'english_lang', label: 'اللغة الإنجليزية' },
    'french_lang': { value: 'french_lang', label: 'اللغة الفرنسية' },
    'german_lang': { value: 'german_lang', label: 'اللغة الألمانية' },
    'history': { value: 'history', label: 'التاريخ' },
    'math': { value: 'math', label: 'الرياضيات' },
    'physics': { value: 'physics', label: 'الفيزياء' },
    'chemistry': { value: 'chemistry', label: 'الكيمياء' },
    'biology': { value: 'biology', label: 'الأحياء' },
    'philosophy_logic': { value: 'philosophy_logic', label: 'الفلسفة والمنطق' },
    'religious_edu': { value: 'religious_edu', label: 'التربية الدينية' },
    'programming_cs': { value: 'programming_cs', label: 'البرمجة وعلوم الحاسب' },
    'eg_national_edu': { value: 'eg_national_edu', label: 'EG التربية الوطنية' },
    'vocational_edu': { value: 'vocational_edu', label: 'التربية المهنية' },
    'military_edu': { value: 'military_edu', label: 'التربية العسكرية' },
    'psychology': { value: 'psychology', label: 'علم النفس' },
    'geography': { value: 'geography', label: 'الجغرافيا' },
    'sociology': { value: 'sociology', label: 'علم اجتماع' },
    'geology': { value: 'geology', label: 'الجيولوجيا' },
    'applied_math': { value: 'applied_math', label: 'الرياضيات التطبيقية' },
    'solid_geometry': { value: 'solid_geometry', label: 'الهندسة الفراغية' },
    'statistics': { value: 'statistics', label: 'الإحصاء' },
    'environmental_science': { value: 'environmental_science', label: 'علوم البيئة' },
    'economy': { value: 'economy', label: 'الاقتصاد' },
    'philosophy': { value: 'philosophy', label: 'فلسفة' },
    'logic': { value: 'logic', label: 'منطق' },
    'civics': { value: 'civics', label: 'المواطنة' },
};

// تحويل all_materials في كل صف إلى استخدام قيم المواد بدلاً من الـ labels مباشرةً
// هذا يضمن أن القيم المرسلة للـ API هي القيم الصحيحة في `CATEGORY_CHOICES`
for (const levelKey in academicStructure) {
    if (academicStructure.hasOwnProperty(levelKey) && levelKey !== 'allSubjectsMap') {
        academicStructure[levelKey].all_materials = academicStructure[levelKey].all_materials.map(
            (materialValue) => academicStructure.allSubjectsMap[materialValue] ? academicStructure.allSubjectsMap[materialValue].value : materialValue
        );
    }
}


export default academicStructure;
