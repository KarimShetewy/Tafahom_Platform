# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin 
from .models import CustomUser, AccountRequest 
# ليس هناك حاجة لاستيراد make_password هنا لأن CustomUser.objects.create_user يهيش تلقائياً
# from django.contrib.auth.hashers import make_password 


# CustomUserAdmin لتخصيص عرض موديل CustomUser في لوحة الإدارة
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'user_type', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('user_type', 'is_staff', 'is_active')
    ordering = ('email',) # تم تغيير 'username' إلى 'email'
    
    # تعريف fieldsets لتنظيم الحقول في مجموعات في صفحة تعديل المستخدم
    fieldsets = (
        (None, {'fields': ('email', 'password')}), 
        ('معلومات شخصية', {'fields': ('first_name', 'last_name', 'user_type', 'image', 'gender', 'governorate', 'phone_number', 'specialized_subject')}), 
        ('الصلاحيات', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}), 
        ('تواريخ مهمة', {'fields': ('last_login', 'date_joined')}), 
    )
    # تعريف add_fieldsets لتخصيص الحقول عند إنشاء مستخدم جديد من لوحة الإدارة
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # التأكد من أن 'password_confirm' موجود هنا ولكن ليس في النموذج الفعلي
            'fields': ('email', 'password', 'first_name', 'last_name', 'user_type', 'image', 'gender', 'governorate', 'phone_number', 'specialized_subject'),
        }),
    )
    # add_form_fields ليس جزءًا من UserAdmin، تم حذفه من الكود الأصلي

# تسجيل موديل CustomUser مع CustomUserAdmin
admin.site.register(CustomUser, CustomUserAdmin)

# تسجيل موديل AccountRequest لإدارة طلبات إنشاء الحساب
@admin.register(AccountRequest)
class AccountRequestAdmin(admin.ModelAdmin):
    list_display = ('email', 'user_type', 'first_name', 'last_name', 'status', 'request_date')
    list_filter = ('user_type', 'status', 'request_date')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'user_type', 'first_name', 'last_name', 'phone_number', 'gender', 'governorate')}),
        ('معلومات الطالب (إذا كان نوع الحساب طالب)', {'fields': ('second_name', 'third_name', 'parent_father_phone_number', 'parent_mother_phone_number', 'school_name', 'parent_profession', 'teacher_name_for_student', 'academic_level', 'academic_track'), 'classes': ('collapse',)}),
        ('معلومات الأستاذ (إذا كان نوع الحساب أستاذ)', {'fields': ('qualifications', 'experience', 'category_type', 'what_will_you_add'), 'classes': ('collapse',)}),
        ('معلومات فريق العمل (إذا كان نوع الحساب عضو فريق)', {'fields': ('job_position', 'expected_salary', 'address', 'previous_work_experience'), 'classes': ('collapse',)}),
        ('روابط التواصل وملفات مرفقة', {'fields': ('instagram_link', 'facebook_link', 'website_link', 'personal_id_card', 'cv_file'), 'classes': ('collapse',)}),
        ('حالة الطلب', {'fields': ('status', 'rejection_reason', 'request_date')}),
    )
    readonly_fields = ('request_date',)
    actions = ['approve_requests', 'reject_requests']

    def approve_requests(self, request, queryset):
        for req in queryset:
            if req.status == 'pending':
                try:
                    # هذه هي النقطة الحاسمة:
                    # بما أن AccountRequestSerializer لم يعد يهيش كلمة المرور،
                    # فإن req.password هنا هي كلمة المرور الخام (غير المشفرة)
                    # لذلك، نستخدم CustomUser.objects.create_user الذي سيقوم بتشفيرها تلقائياً.
                    user = CustomUser.objects.create_user(
                        email=req.email,
                        password=req.password, # كلمة المرور الخام
                        first_name=req.first_name,
                        last_name=req.last_name,
                        user_type=req.user_type,
                        is_active=True, # مهم جداً: تفعيل المستخدم ليتمكن من تسجيل الدخول
                        gender=req.gender if req.gender else None,
                        governorate=req.governorate if req.governorate else None,
                        phone_number=req.phone_number if req.phone_number else None,
                        specialized_subject=req.category_type if req.user_type == 'teacher' else None, 
                        # يجب نسخ باقي الحقول الإضافية هنا أيضاً من req إلى user
                        # مثال:
                        # school_name=req.school_name if req.user_type == 'student' else None,
                        # academic_level=req.academic_level if req.user_type == 'student' else None,
                        # academic_track=req.academic_track if req.user_type == 'student' else None,
                        # qualifications=req.qualifications if req.user_type == 'teacher' else None,
                        # experience=req.experience if req.user_type == 'teacher' else None,
                        # what_will_you_add=req.what_will_you_add if req.user_type in ['teacher', 'team_member'] else None,
                        # job_position=req.job_position if req.user_type == 'team_member' else None,
                        # expected_salary=req.expected_salary if req.user_type == 'team_member' else None,
                        # address=req.address if req.user_type == 'team_member' else None,
                        # previous_work_experience=req.previous_work_experience if req.user_type == 'team_member' else None,
                        # instagram_link=req.instagram_link if req.instagram_link else None,
                        # facebook_link=req.facebook_link if req.facebook_link else None,
                        # website_link=req.website_link if req.website_link else None,
                    )
                    
                    # ملاحظة: نسخ FileField (مثل personal_id_card, cv_file) يتطلب منطقاً خاصاً لنسخ الملفات نفسها
                    # لا يمكن نسخها مباشرة بتمريرها كحقل، بل يجب فتح الملف القديم وحفظه في الحقل الجديد
                    # هذا أمر يتجاوز نطاق الإصلاح السريع هنا، ولكن إذا كنت بحاجة إليه، يجب تطبيقه يدوياً.
                    # if req.personal_id_card:
                    #     user.image.save(req.personal_id_card.name, req.personal_id_card.file)
                    #     user.save() # حفظ المستخدم بعد تحديث الصورة

                    req.status = 'approved'
                    req.save() 
                    self.message_user(request, f"تمت الموافقة على طلب {req.email} وإنشاء الحساب.")
                except Exception as e:
                    self.message_user(request, f"فشل إنشاء حساب لـ {req.email}: {e}", level='ERROR')
                    print(f"Error details: {e}") # لطباعة تفاصيل الخطأ في الطرفية
            else:
                self.message_user(request, f"الطلب لـ {req.email} ليس في حالة 'قيد المراجعة'.", level='WARNING')
    approve_requests.short_description = "الموافقة على الطلبات المختارة"

    def reject_requests(self, request, queryset):
        queryset.update(status='rejected', rejection_reason="تم الرفض بواسطة المسؤول.") 
        self.message_user(request, "تم رفض الطلبات المختارة.")
    reject_requests.short_description = "رفض الطلبات المختارة"