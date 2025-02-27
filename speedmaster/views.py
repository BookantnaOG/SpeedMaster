from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Booking, CarInfo, Service
from django.contrib.auth import get_user_model

def username(request):
    # Initialize the context dictionary
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}

    # Check if the user is authenticated
    if request.user.is_authenticated:
        # Add the username to the context
        context['username'] = request.user.username
    else:
        # Add a default message if the user is not logged in
        context['username'] = 'Guest'
    return context


def index(request):
    context = username(request)
    services = Service.objects.all()
    # Render the template with the context
    return render(request, 'index.html', {"context":context, "services":services})

@login_required
def booking(request):
    services = Service.objects.all()
    context = username(request)
    return render(request, 'booking.html', {"services":services, "context":context})

@login_required
def payment(request):
    # ถ้ามีการส่งคำขอแบบ POST
    if request.method == "POST":
        # รับข้อมูลจากฟอร์มที่ส่ง
        service = request.POST.get('service', 'ไม่ระบุ')
        date = request.POST.get('date', 'ไม่ระบุ')
        time = request.POST.get('time', 'ไม่ระบุ')

        context = username(request)
        # สร้าง context เพื่อส่งไปที่ template
        context.update({'service': service,'date': date, 'time': time})
            

        # ส่งข้อมูลไปยัง payment.html
        return render(request, 'payment.html', context, context)

    # กรณีที่ไม่ใช่ POST (เช่น GET), ให้แสดงฟอร์มปกติ
    return render(request, 'payment.html')

def process_payment_qr(request):
    user = get_user_model().objects.get(id=request.user.id)

    return redirect('home') 
@login_required
def bookingdetail(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            select_car_brand = request.POST.get('car-brand') # car brand
            car_plate = request.POST.get('car-reg') # car plate
            user = request.user # user 
            status = "Waiting for Payment" # processing status

            booking = Booking(status_on=status,
                    user=user,
                    )
            booking.save() # save booking to database

            carinfo = CarInfo(user=user, 
                    car_license_plate=car_plate,
                    car_brand = select_car_brand)
  
            carinfo.save() # save carinfo to database
            
            context = username(request)
            price = request.POST.get("final-price")
            if price:
                print(f"Price: {price}")  # Check in the console to see if it prints the price
            else:
                print("No price found")

            context.update({
                "price":request.POST.get("final-price")
            })
            return render(request, "payment.html", context)
    return render(request, 'bookingDetail.html')