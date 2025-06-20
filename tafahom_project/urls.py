from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# NEW: إزالة استيراد الـ views الفردية من users هنا، لأنها ليست ضرورية في هذا الملف
# from users.views import AccountRequestCreateAPIView, LoginAPIView, TeacherProfileAPIView

# استيراد home_page_view
from tafahom_project.views import home_page_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    # NEW: إزالة namespace='courses'
    path('api/courses/', include('courses.urls')),
    
    # مسار لخدمة صفحة HTML البسيطة عند الوصول للـ root URL
    path('', home_page_view, name='home'),
]

# هذا الجزء مهم جداً لخدمة ملفات الميديا والملفات الثابتة في وضع التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)