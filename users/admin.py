from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, AccountRequest

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'user_type', 'is_staff', 'specialized_subject')
    list_filter = ('user_type', 'is_staff', 'is_active', 'specialized_subject')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('email',)

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('user_type', 'phone_number', 'gender', 'governorate', 'specialized_subject')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('user_type', 'phone_number', 'gender', 'governorate', 'specialized_subject')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)


class AccountRequestAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'user_type',
        'email',
        'status',
        'request_date',
        'governorate',
        'academic_level',
        'academic_track',
        'job_position',
        'category_type',
    )
    list_filter = ('user_type', 'status', 'governorate', 'academic_level', 'academic_track', 'job_position', 'category_type')
    search_fields = (
        'first_name', 'last_name', 'email', 'phone_number',
        'school_name', 'teacher_name_for_student', 'parent_profession',
        'job_position', 'previous_work_experience', 'address',
        'qualifications', 'experience', 'what_will_you_add',
    )
    readonly_fields = ('request_date',)

    fieldsets = (
        ('معلومات الحساب الأساسية', {
            'fields': ('user_type', 'email', 'password',
                       'first_name', 'second_name', 'third_name', 'last_name',
                       'phone_number', 'gender', 'governorate')
        }),
        ('معلومات الطالب (إذا كان نوع المستخدم طالب)', {
            'fields': ('parent_father_phone_number', 'parent_mother_phone_number', 'school_name',
                       'parent_profession', 'teacher_name_for_student', 'academic_level', 'academic_track'),
            'classes': ('collapse',),
        }),
        ('معلومات الأستاذ (إذا كان نوع المستخدم أستاذ)', {
            'fields': ('qualifications', 'experience', 'category_type'),
            'classes': ('collapse',),
        }),
        ('معلومات عضو فريق العمل (إذا كان نوع المستخدم فريق عمل)', {
            'fields': ('job_position', 'expected_salary', 'address', 'previous_work_experience',
                       'instagram_link', 'facebook_link', 'website_link'),
            'classes': ('collapse',),
        }),
        ('المساهمة في المنصة (للأستاذ وعضو فريق العمل)', {
            'fields': ('what_will_you_add',),
            'classes': ('collapse',),
        }),
        ('المستندات المرفقة', {
            'fields': ('personal_id_card', 'cv_file'),
            'classes': ('collapse',),
        }),
        ('حالة الطلب', {
            'fields': ('status', 'rejection_reason'),
        }),
    )

    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        updated_count = 0
        users_created_count = 0
        for req in queryset:
            if req.status == 'pending':
                try:
                    username = req.email.split('@')[0]
                    base_username = username
                    counter = 1
                    while CustomUser.objects.filter(username=username).exists():
                        username = f"{base_username}_{counter}"
                        counter += 1

                    user = CustomUser.objects.create(
                        username=username,
                        email=req.email,
                        password=req.password,
                        first_name=req.first_name,
                        last_name=req.last_name,
                        user_type=req.user_type,
                        gender=req.gender,
                        phone_number=req.phone_number,
                        governorate=req.governorate,
                        specialized_subject=req.category_type if req.user_type == 'teacher' else None,
                    )
                    req.status = 'approved'
                    req.save()
                    updated_count += 1
                    users_created_count += 1
                    self.message_user(request, f"تم إنشاء حساب للمستخدم {user.email} بنجاح.")
                except Exception as e:
                    self.message_user(request, f"فشل إنشاء حساب لـ {req.email}: {e}", level='error')
            else:
                self.message_user(request, f"الطلب لـ {req.email} ليس في حالة 'قيد المراجعة'.", level='warning')

        self.message_user(request, f"تم الموافقة على {updated_count} طلب وإنشاء {users_created_count} مستخدم بنجاح.")
    approve_requests.short_description = "الموافقة على الطلبات المحددة وإنشاء المستخدمين"

    def reject_requests(self, request, queryset):
        updated_count = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f"{updated_count} طلب تم رفضه بنجاح.")
    reject_requests.short_description = "رفض الطلبات المحددة"

admin.site.register(AccountRequest, AccountRequestAdmin)
