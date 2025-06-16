from django.db import models
# استيراد الاختيارات من users.models
from users.models import CustomUser, ACADEMIC_LEVEL_CHOICES, ACADEMIC_TRACK_CHOICES, CATEGORY_CHOICES

class Course(models.Model):
    # معلومات الكورس الأساسية
    title = models.CharField(max_length=255, verbose_name='عنوان الكورس')
    description = models.TextField(verbose_name='وصف الكورس التفصيلي')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='سعر الكورس')
    image = models.ImageField(upload_to='course_images/', blank=True, null=True, verbose_name='صورة الكورس')
    
    # ربط الكورس بالأستاذ
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses', verbose_name='الأستاذ')

    # ربط الكورس بالهيكل التعليمي الجديد
    academic_level = models.CharField(max_length=50, choices=ACADEMIC_LEVEL_CHOICES, verbose_name='الصف الدراسي')
    academic_track = models.CharField(max_length=50, choices=ACADEMIC_TRACK_CHOICES, blank=True, null=True, verbose_name='المسار الدراسي')
    subject = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name='المادة')

    # معلومات إضافية
    is_published = models.BooleanField(default=False, verbose_name='منشور؟')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.get_subject_display()}) - {self.teacher.first_name}"

    class Meta:
        verbose_name = 'كورس'
        verbose_name_plural = 'كورسات'
        # لضمان عدم وجود كورسين بنفس الصف والمسار والمادة من نفس الأستاذ
        unique_together = ('academic_level', 'academic_track', 'subject', 'teacher')