from django.db import models
# NEW: استيراد الخيارات من ملف constants
from tafahom_project.constants import (
    ACADEMIC_LEVEL_CHOICES, ACADEMIC_TRACK_CHOICES, CATEGORY_CHOICES
)
from users.models import CustomUser # تأكد من استيراد CustomUser فقط

class Course(models.Model):
    COURSE_TYPE_CHOICES = (
        ('regular', 'كورس عادي'),
        ('separate', 'كورس منفصل'), # للمراجعات أو البرامج الخاصة
    )

    title = models.CharField(max_length=255, verbose_name='عنوان الكورس')
    description = models.TextField(verbose_name='وصف الكورس التفصيلي')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='سعر الكورس')
    image = models.ImageField(upload_to='course_images/', blank=True, null=True, verbose_name='صورة الكورس')

    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses', verbose_name='الأستاذ')

    academic_level = models.CharField(max_length=50, choices=ACADEMIC_LEVEL_CHOICES, verbose_name='الصف الدراسي')
    academic_track = models.CharField(max_length=50, choices=ACADEMIC_TRACK_CHOICES, blank=True, null=True, verbose_name='المسار الدراسي')
    subject = models.CharField(max_length=50, choices=CATEGORY_CHOICES, blank=True, null=True, verbose_name='المادة')

    course_type = models.CharField(max_length=20, choices=COURSE_TYPE_CHOICES, default='regular', verbose_name='نوع الكورس')

    is_published = models.BooleanField(default=False, verbose_name='منشور؟')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        subject_display = self.get_subject_display() if self.subject else "مادة غير محددة"
        return f"{self.title} ({subject_display}) - {self.teacher.first_name}"

    class Meta:
        verbose_name = 'كورس'
        verbose_name_plural = 'كورسات'
        # NEW: قم بإزالة سطر unique_together بالكامل
        # unique_together = ('academic_level', 'academic_track', 'subject', 'teacher') # <--- احذف هذا السطر

class Lecture(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lectures', verbose_name='الكورس')
    title = models.CharField(max_length=255, verbose_name='عنوان المحاضرة')
    description = models.TextField(blank=True, null=True, verbose_name='وصف المحاضرة')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    is_published = models.BooleanField(default=True, verbose_name='منشورة؟')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'محاضرة'
        verbose_name_plural = 'محاضرات'
        ordering = ['order', 'created_at']
        unique_together = ('course', 'order')

    def __str__(self):
        return f"{self.course.title} - المحاضرة {self.order}: {self.title}"


class Material(models.Model):
    MATERIAL_TYPE_CHOICES = (
        ('video', 'فيديو'),
        ('pdf', 'ملف PDF'),
        ('quiz', 'واجب'),
        ('exam', 'امتحان'),
        ('link', 'رابط خارجي'),
        ('text', 'نص/شرح'),
        ('branch', 'فرع رئيسي'),
    )

    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='materials', verbose_name='المحاضرة')
    title = models.CharField(max_length=255, verbose_name='عنوان المادة التعليمية')
    type = models.CharField(max_length=20, choices=MATERIAL_TYPE_CHOICES, verbose_name='نوع المادة')
    file = models.FileField(upload_to='materials_files/', blank=True, null=True, verbose_name='الملف المرفق')
    url = models.URLField(blank=True, null=True, verbose_name='الرابط الخارجي')
    text_content = models.TextField(blank=True, null=True, verbose_name='المحتوى النصي')
    description = models.TextField(blank=True, null=True, verbose_name='وصف المادة')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    is_published = models.BooleanField(default=True, verbose_name='منشور؟')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'مادة تعليمية'
        verbose_name_plural = 'مواد تعليمية'
        ordering = ['order', 'created_at']
        unique_together = ('lecture', 'order')

    def __str__(self):
        return f"{self.lecture.title} - {self.title} ({self.get_type_display()})"


class QuizOrAssignment(models.Model):
    MATERIAL_CHOICES = (
        ('quiz', 'اختبار'),
        ('assignment', 'واجب'),
    )
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE, related_name='quizzes_assignments', verbose_name='المحاضرة')
    title = models.CharField(max_length=255, verbose_name='العنوان')
    type = models.CharField(max_length=20, choices=MATERIAL_CHOICES, verbose_name='النوع')
    duration_minutes = models.IntegerField(blank=True, null=True, verbose_name='مدة الاختبار بالدقائق')
    passing_score_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name='نسبة النجاح المطلوبة (%)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'اختبار/واجب'
        verbose_name_plural = 'اختبارات/واجبات'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.type} {self.title} - {self.lecture.title}"

class Question(models.Model):
    quiz_or_assignment = models.ForeignKey(QuizOrAssignment, on_delete=models.CASCADE, related_name='questions', verbose_name='الاختبار/الواجب')
    question_text = models.TextField(verbose_name='نص السؤال')
    points = models.DecimalField(max_digits=5, decimal_places=2, default=1.0, verbose_name='الدرجة')
    order = models.IntegerField(default=0, verbose_name='الترتيب')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'سؤال'
        verbose_name_plural = 'أسئلة'
        ordering = ['order']
        unique_together = ('quiz_or_assignment', 'order')

    def __str__(self):
        return f"سؤال {self.order}: {self.question_text[:50]}..."

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices', verbose_name='السؤال')
    choice_text = models.CharField(max_length=255, verbose_name='نص الخيار')
    is_correct = models.BooleanField(default=False, verbose_name='هل هو الإجابة الصحيحة؟')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'خيار إجابة'
        verbose_name_plural = 'خيارات الإجابة'
        ordering = ['created_at']

    def __str__(self):
        return f"خيار: {self.choice_text} ({'صحيح' if self.is_correct else 'خطأ'})"

class Submission(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='submissions', verbose_name='الطالب')
    quiz_or_assignment = models.ForeignKey(QuizOrAssignment, on_delete=models.CASCADE, related_name='submissions', verbose_name='الاختبار/الواجب')
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name='الدرجة')
    is_passed = models.BooleanField(default=False, verbose_name='هل تم الاجتياز؟')
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name='تاريخ التسليم')

    class Meta:
        verbose_name = 'تسليم'
        verbose_name_plural = 'تسليمات'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"تسليم {self.quiz_or_assignment.title} بواسطة {self.student.email}"

class StudentAnswer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers', verbose_name='التسليم')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, verbose_name='السؤال')
    chosen_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, blank=True, null=True, verbose_name='الخيار المختار')
    is_correct = models.BooleanField(default=False, verbose_name='هل الإجابة صحيحة؟')

    class Meta:
        verbose_name = 'إجابة طالب'
        verbose_name_plural = 'إجابات الطلاب'
        unique_together = ('submission', 'question')

    def __str__(self):
        return f"إجابة الطالب على: {self.question.question_text[:30]}..."