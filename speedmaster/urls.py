from django.contrib import admin
from django.urls import path, include
from django.conf.urls import handler404, handler500, handler403, handler400
from speedmaster import views  # import views จากแอปของคุณ


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
    path('process-qr-payment/', views.process_payment_qr, name='process-qr-payment'),
    path('', include('user.urls')),  # Include user app URLs
]
