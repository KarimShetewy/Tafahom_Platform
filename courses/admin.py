# courses/admin.py

from django.contrib import admin
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice, Submission, StudentAnswer # NEW: استيراد الموديلات الجديدة

# تسجيل موديل الكورس
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'academic_level', 'subject', 'price', 'is_published', 'created_at')
    list_filter = ('is_published', 'academic_level', 'subject', 'course_type', 'teacher__user_type') # إضافة تصفية حسب نوع المعلم
    search_fields = ('title', 'description', 'teacher__first_name', 'teacher__last_name')
    raw_id_fields = ('teacher',) # لتحسين أداء اختيار المعلم في لوحة الإدارة
    actions = ['make_published', 'make_unpublished']

    def make_published(self, request, queryset):
        queryset.update(is_published=True)
        self.message_user(request, "تم نشر الكورسات المختارة بنجاح.")
    make_published.short_description = "نشر الكورسات المختارة"

    def make_unpublished(self, request, queryset):
        queryset.update(is_published=False)
        self.message_user(request, "تم إلغاء نشر الكورسات المختارة بنجاح.")
    make_unpublished.short_description = "إلغاء نشر الكورسات المختارة"

# تسجيل موديل المحاضرة
@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_published', 'is_locked', 'required_quiz_or_exam')
    list_filter = ('is_published', 'is_locked', 'course__academic_level', 'course__subject')
    search_fields = ('title', 'description', 'course__title')
    raw_id_fields = ('course', 'required_quiz_or_exam') # لتحسين أداء اختيار الكورس والواجب/الامتحان

# تسجيل موديل المواد التعليمية
@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'lecture', 'type', 'order', 'is_published')
    list_filter = ('type', 'is_published', 'lecture__course__academic_level', 'lecture__course__subject')
    search_fields = ('title', 'text_content', 'lecture__title')
    raw_id_fields = ('lecture',)

# Inline لخيارات السؤال (لإضافتها مباشرة عند تعديل السؤال)
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1 # عدد الخيارات الإضافية الفارغة تلقائياً

# Inline لأسئلة الواجب/الامتحان (لإضافتها مباشرة عند تعديل الواجب/الامتحان)
class QuestionInline(admin.TabularInline):
    model = Question
    inlines = [ChoiceInline] # تضمين الخيارات داخل الأسئلة
    extra = 1

# تسجيل موديل الواجب/الامتحان
@admin.register(QuizOrAssignment)
class QuizOrAssignmentAdmin(admin.ModelAdmin):
    list_display = ('material', 'duration_minutes', 'passing_score_percentage')
    search_fields = ('material__title',)
    raw_id_fields = ('material',)
    inlines = [QuestionInline] # تضمين الأسئلة مباشرة

# Inline لإجابات الطالب (لإضافتها مباشرة عند تعديل التقديم)
class StudentAnswerInline(admin.TabularInline):
    model = StudentAnswer
    extra = 0 # لا يوجد خيارات إضافية فارغة تلقائياً
    readonly_fields = ('question', 'chosen_choice', 'answer_text', 'is_correct') # للقراءة فقط

# تسجيل موديل تقديمات الواجبات/الامتحانات
@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('quiz_or_assignment', 'student', 'submitted_at', 'score', 'is_graded', 'passed')
    list_filter = ('is_graded', 'passed', 'quiz_or_assignment__material__lecture__course__academic_level', 'student__user_type')
    search_fields = ('quiz_or_assignment__material__title', 'student__first_name', 'student__last_name')
    raw_id_fields = ('quiz_or_assignment', 'student')
    inlines = [StudentAnswerInline] # تضمين إجابات الطلاب
    actions = ['mark_as_graded', 'mark_as_passed', 'mark_as_failed']

    def mark_as_graded(self, request, queryset):
        queryset.update(is_graded=True)
        self.message_user(request, "تم تعليم التقديمات المختارة كمصححة.")
    mark_as_graded.short_description = "تعليم التقديمات كمصححة"

    def mark_as_passed(self, request, queryset):
        queryset.update(passed=True, is_graded=True)
        self.message_user(request, "تم تعليم التقديمات المختارة كـ ناجحة.")
    mark_as_passed.short_description = "تعليم التقديمات كـ ناجحة"

    def mark_as_failed(self, request, queryset):
        queryset.update(passed=False, is_graded=True)
        self.message_user(request, "تم تعليم التقديمات المختارة كـ راسبة.")
    mark_as_failed.short_description = "تعليم التقديمات كـ راسبة"


# تسجيل موديل إجابات الطلاب (غالباً لا يتم إدارته بشكل مباشر، بل من خلال SubmissionInline)
# admin.site.register(StudentAnswer) # يمكن تسجيله إذا أردت إدارة فردية