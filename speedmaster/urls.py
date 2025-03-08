from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler404, handler500, handler403, handler400
from speedmaster import views  # import views จากแอปของคุณ
from django.conf import settings
from django.conf.urls.static import static

from . import views

# Error Handlers
handler404 = 'speedmaster.views.custom_404'
handler500 = 'speedmaster.views.custom_500'
handler403 = 'speedmaster.views.custom_403'
handler400 = 'speedmaster.views.custom_400'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='home'),  
    path('booking/', views.booking, name='booking'),  
    path('payment/', views.payment, name='payment'),
    path('bookingdetail/', views.bookingdetail, name='bookingdetail'),
    path('', include('user.urls')),  # Include user app URLs
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

