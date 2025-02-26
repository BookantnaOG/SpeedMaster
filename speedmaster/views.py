from django.contrib import admin
from django.urls import path,include
from django.contrib.auth import views as auth_views
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index(request):
    # Initialize the context dictionary
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}

    # Check if the user is authenticated
    if request.user.is_authenticated:
        # Add the username to the context
        context['username'] = request.user.username
    else:
        # Add a default message if the user is not logged in
        context['username'] = 'Guest'

    # Render the template with the context
    return render(request, 'index.html', context)

@login_required
def booking(request):
    return render(request, 'booking.html')

@login_required
def payment(request):
    # ถ้ามีการส่งคำขอแบบ POST
    if request.method == "POST":
        # รับข้อมูลจากฟอร์มที่ส่ง
        service = request.POST.get('service', 'ไม่ระบุ')
        date = request.POST.get('date', 'ไม่ระบุ')
        time = request.POST.get('time', 'ไม่ระบุ')

        # สร้าง context เพื่อส่งไปที่ template
        context = {
            'service': service,
            'date': date,
            'time': time
        }

        # ส่งข้อมูลไปยัง payment.html
        return render(request, 'payment.html', context)

    # กรณีที่ไม่ใช่ POST (เช่น GET), ให้แสดงฟอร์มปกติ
    return render(request, 'payment.html')

@login_required
def bookingdetail(request):
    return render(request, 'bookingDetail.html')