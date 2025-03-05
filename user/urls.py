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
    path("delete/", views.delete_account, name="delete_account"),
    path("telephone/", views.add_telephone, name="add_telephone"),
    path("password/", views.change_password, name="change_password"),
    path("edit/", views.edit_profile, name="edit_profile"),
    path('history-booking/', views.history_booking, name='history_booking'),
    path('receptionist/', views.receptionist, name='receptionist'),
    path('staff/', views.staff, name='staff'),
    path('status-booking/', views.status_booking, name='status_booking'),
    path('paid-approve/<int:item_id>/', views.paid_approve, name='approve_payment'),
    path('paid-decline/<int:item_id>/', views.paid_decline, name='decline_payment'),
    path('paid-decline/<int:item_id>/', views.paid_cancel, name='cancel_payment'),
]
