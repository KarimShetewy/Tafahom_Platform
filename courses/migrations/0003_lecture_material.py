# Generated by Django 5.2.3 on 2025-06-17 22:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_alter_course_subject'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='عنوان المحاضرة')),
                ('description', models.TextField(blank=True, null=True, verbose_name='وصف المحاضرة')),
                ('order', models.IntegerField(default=0, verbose_name='الترتيب')),
                ('is_published', models.BooleanField(default=True, verbose_name='منشورة؟')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lectures', to='courses.course', verbose_name='الكورس')),
            ],
            options={
                'verbose_name': 'محاضرة',
                'verbose_name_plural': 'محاضرات',
                'ordering': ['order', 'created_at'],
                'unique_together': {('course', 'order')},
            },
        ),
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='عنوان المادة التعليمية')),
                ('type', models.CharField(choices=[('video', 'فيديو'), ('pdf', 'ملف PDF'), ('quiz', 'اختبار'), ('assignment', 'واجب'), ('link', 'رابط خارجي'), ('text', 'نص/شرح')], max_length=20, verbose_name='نوع المادة')),
                ('file', models.FileField(blank=True, null=True, upload_to='materials_files/', verbose_name='الملف المرفق')),
                ('url', models.URLField(blank=True, null=True, verbose_name='الرابط الخارجي')),
                ('text_content', models.TextField(blank=True, null=True, verbose_name='المحتوى النصي')),
                ('description', models.TextField(blank=True, null=True, verbose_name='وصف المادة')),
                ('order', models.IntegerField(default=0, verbose_name='الترتيب')),
                ('is_published', models.BooleanField(default=True, verbose_name='منشور؟')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materials', to='courses.lecture', verbose_name='المحاضرة')),
            ],
            options={
                'verbose_name': 'مادة تعليمية',
                'verbose_name_plural': 'مواد تعليمية',
                'ordering': ['order', 'created_at'],
                'unique_together': {('lecture', 'order')},
            },
        ),
    ]
