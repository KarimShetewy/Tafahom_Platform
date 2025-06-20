from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from tafahom_project.views import home_page_view # تأكد أن هذا الاستيراد موجود

# لا نحتاج لاستيراد الـ views الفردية هنا، فقط الـ include
# from users.views import AccountRequestCreateAPIView, LoginAPIView, TeacherProfileAPIView
# from users.views import CustomUserRetrieveAPIView

urlpatterns = [
    path('admin/', admin.site.urls), # <--- أزل التعليق عن هذا السطر
    path('api/users/', include('users.urls')), # <--- أزل التعليق عن هذا السطر
    path('api/courses/', include('courses.urls', namespace='courses')), # <--- أزل التعليق عن هذا السطر

    # مسار لخدمة صفحة HTML البسيطة عند الوصول للـ root URL في وضع التطوير
    path('', home_page_view, name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)