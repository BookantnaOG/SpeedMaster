from django.contrib import admin
from django.urls import path
from . import views
import user.views as user 

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", views.index, name="home"),  
    path("booking/", views.booking, name="booking"),  
    path('payment/', views.payment, name='payment'),
    path('user/', user.user, name='user_dashboard'),
]

