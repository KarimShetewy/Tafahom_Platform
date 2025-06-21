# tafahom_project/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
# NEW: استيراد دالة serve الصحيحة لخدمة الملفات الثابتة
from django.views.static import serve as static_serve # إضافة as static_serve لتجنب التعارض
# لاستيراد View لخدمة ملف index.html
from django.views.generic import TemplateView 


urlpatterns = [
    path('admin/', admin.site.urls),
    
    # مسارات djoser للمصادقة وإدارة المستخدمين
    path('api/auth/', include('djoser.urls')), 
    path('api/auth/', include('djoser.urls.authtoken')), 

    path('api/', include('users.urls')),  
    path('api/courses/', include('courses.urls')), 

    # NEW: مسار لخدمة ملفات Static بعد بناء React
    # هذا سيخدم الملفات الموجودة في مجلد frontend/build/static
    # تأكد من أن settings.STATIC_ROOT مضبوط بشكل صحيح في settings.py
    re_path(r'^static/(?P<path>.*)$', static_serve, {'document_root': settings.STATIC_ROOT}),
    
    # مسار شامل لتقديم ملف index.html الخاص بـ React
    # هذا يجب أن يكون آخر مسار في urlpatterns ليتلقى جميع الـ URLs الأخرى
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')), 
]

# لخدمة الملفات المرفوعة (مثل صور الكورسات وصور البروفايل) في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)