from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from users.views import AccountRequestCreateAPIView, LoginAPIView, TeacherProfileAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    # NEW: استخدام الطريقة المباشرة لتضمين مسارات التطبيق لتجنب أي مشاكل في namespace
    path('api/courses/', include('courses.urls', namespace='courses')), # تم تغيير اسم namespace إلى 'courses' ليكون أقصر وأكثر وضوحاً
    
    # لا نربط مسار الـ '/' هنا، سيتولى React التوجيه للصفحة الرئيسية على localhost:3000
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
