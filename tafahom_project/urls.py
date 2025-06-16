from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import views as tafahom_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', tafahom_views.home_page_view, name='home'),
    path('api/users/', include('users.urls')),
    path('api/courses/', include('courses.urls')), # <--- أضف هذا السطر
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # تأكد من static files