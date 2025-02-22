from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="home"),  
    path("booking/", views.booking, name="booking"),  
    path('payment/', views.payment, name='payment'),
    path('bookingdetail/',views.bookingdetail, name='bookingdetail'),
    path('', include('user.urls')), 
]

