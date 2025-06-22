# tafahom_project/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
# استيراد دالة serve الصحيحة لخدمة الملفات الثابتة (من django.views.static)
from django.views.static import serve as static_serve 
# لاستيراد TemplateView لخدمة ملف index.html
from django.views.generic import TemplateView 


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # مسارات djoser للمصادقة وإدارة المستخدمين
    # هذا يضيف مسارات مثل /api/auth/users/, /api/auth/token/login/, /api/auth/token/logout/, etc.
    path('api/auth/', include('djoser.urls')), 
    path('api/auth/', include('djoser.urls.authtoken')), 
    # إذا كنت تستخدم JWT بدلاً من Token Authentication، استخدم هذا:
    # path('api/auth/', include('djoser.urls.jwt')), 

    # مسارات تطبيقات Django المخصصة
    path('api/', include('users.urls')),  
    path('api/courses/', include('courses.urls')), 

    # مسار لخدمة ملفات Static الخاصة بـ React (بعد npm run build)
    # هذا المسار يستخدم فقط في وضع التطوير (DEBUG=True)
    # ويجب أن يتطابق مع STATIC_URL الذي يطلبه React في ملف index.html المولد.
    # يتم استخدام static_serve لتقديم الملفات مباشرة.
    re_path(r'^static/(?P<path>.*)$', static_serve, {'document_root': settings.STATIC_ROOT}),
    
    # مسار شامل لتقديم ملف index.html الخاص بـ React
    # هذا المسار يجب أن يكون آخر مسار في urlpatterns ليتلقى جميع الـ URLs الأخرى
    # التي لا تتطابق مع أي من مسارات الـ API أو الـ Admin.
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')), 
]

# لخدمة الملفات المرفوعة (مثل صور الكورسات وصور البروفايل) في وضع التطوير
# هذا أيضاً يعمل فقط عندما يكون DEBUG = True
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)