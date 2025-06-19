from django.contrib import admin
from .models import Course, Lecture, Material, QuizOrAssignment, Question, Choice, Submission, StudentAnswer

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'academic_level', 'academic_track', 'subject', 'course_type', 'is_published', 'created_at') # NEW: إضافة course_type
    list_filter = ('is_published', 'academic_level', 'academic_track', 'subject', 'course_type', 'teacher__user_type') # NEW: يمكن تصفية الكورسات حسب نوعها
    search_fields = ('title', 'description', 'teacher__first_name', 'teacher__last_name')

admin.site.register(Course, CourseAdmin)


class MaterialInline(admin.TabularInline):
    model = Material
    extra = 1
    fields = ('title', 'type', 'file', 'url', 'text_content', 'order', 'is_published', 'description')
    ordering = ('order',)


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4
    fields = ('choice_text', 'is_correct')


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ('question_text', 'points', 'order')
    inlines = [ChoiceInline]
    ordering = ('order',)


class QuizOrAssignmentInline(admin.TabularInline):
    model = QuizOrAssignment
    extra = 1
    fields = ('title', 'type', 'duration_minutes', 'passing_score_percentage')

class QuizOrAssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'lecture', 'type', 'duration_minutes', 'passing_score_percentage')
    list_filter = ('type', 'lecture__course__title', 'lecture__title')
    search_fields = ('title', 'lecture__title', 'lecture__course__title')
    inlines = [QuestionInline]

admin.site.register(QuizOrAssignment, QuizOrAssignmentAdmin)


class LectureAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_published', 'created_at')
    list_filter = ('course', 'is_published')
    search_fields = ('title', 'description', 'course__title')
    inlines = [MaterialInline, QuizOrAssignmentInline]
    fieldsets = (
        (None, {
            'fields': ('course', 'title', 'description', 'order', 'is_published')
        }),
    )

admin.site.register(Lecture, LectureAdmin)


class MaterialAdmin(admin.ModelAdmin):
    list_display = ('title', 'lecture', 'type', 'order', 'is_published', 'created_at')
    list_filter = ('type', 'lecture__course', 'lecture', 'is_published')
    search_fields = ('title', 'description', 'lecture__title', 'lecture__course__title')
    
admin.site.register(Material, MaterialAdmin)

class StudentAnswerInline(admin.TabularInline):
    model = StudentAnswer
    extra = 1
    fields = ('question', 'chosen_choice', 'is_correct')
    readonly_fields = ('is_correct',)

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'quiz_or_assignment', 'score', 'is_passed', 'submitted_at')
    list_filter = ('quiz_or_assignment__type', 'is_passed', 'submitted_at')
    search_fields = ('student__email', 'quiz_or_assignment__title')
    inlines = [StudentAnswerInline]
    readonly_fields = ('score', 'is_passed', 'submitted_at')

admin.site.register(Submission, SubmissionAdmin)

admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(StudentAnswer)
