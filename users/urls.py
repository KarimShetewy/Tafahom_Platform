from django.urls import path
from .views import AccountRequestCreateAPIView, LoginAPIView

urlpatterns = [
    # مسار لإنشاء طلبات الحساب الجديدة (للطلاب أو فريق العمل أو الأساتذة)
    path('account-requests/create/', AccountRequestCreateAPIView.as_view(), name='create-account-request'),

    # مسار لتسجيل دخول المستخدمين
    path('login/', LoginAPIView.as_view(), name='login'),

    # يمكن إضافة مسار عام لـ "تسجيل الأستاذ" هنا إذا أردت نقطة نهاية API مختلفة للأستاذ
    # ولكننا سنستخدم نفس AccountRequestCreateAPIView من الـ frontend بتحديد user_type = 'teacher'
]