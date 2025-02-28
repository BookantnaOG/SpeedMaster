from django.urls import path 
from .views import get_qr_code
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/edit/', views.edit_profile, name='update_profile'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('payment/', views.payment_view, name='payment'),
    path('membership/',views.membership_view, name='membership'),
    path("get_qr_code/", get_qr_code, name="get_qr_code"),
]
