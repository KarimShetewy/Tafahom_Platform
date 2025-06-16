from django.http import HttpResponse

def home_page_view(request):
    return HttpResponse("مرحباً بك في منصة تفاهم! الواجهة الخلفية تعمل بنجاح.")