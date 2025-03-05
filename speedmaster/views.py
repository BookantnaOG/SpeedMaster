from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Booking, Service, Payment, BookingDetail, CarDetailingService
from django.contrib.auth import get_user_model
from django.http import HttpResponseNotFound, HttpResponseServerError
from django.http import Http404
from django.utils import timezone
from django.http import HttpResponseBadRequest
import pytz
from datetime import datetime




# ฟังก์ชันสำหรับจัดการข้อผิดพลาด 404
def custom_404(request, exception):
    return render(request, 'Error.html', {'error_code': 404}, status=404)

# ฟังก์ชันสำหรับจัดการข้อผิดพลาด 500
def custom_500(request):
    return render(request, 'Error.html', {'error_code': 500}, status=500)

# ฟังก์ชันสำหรับจัดการข้อผิดพลาด 403
def custom_403(request, exception):
    return render(request, 'Error.html', {'error_code': 403}, status=403)

# ฟังก์ชันสำหรับจัดการข้อผิดพลาด 400
def custom_400(request, exception):
    return render(request, 'Error.html', {'error_code': 400}, status=400)

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
    user = request.user
    context = username(request)

    # กำหนดเวลาในโซนประเทศไทย
    thailand_tz = pytz.timezone('Asia/Bangkok')
    context.update({
        'today': timezone.now().astimezone(thailand_tz).date().strftime('%Y-%m-%d'),
    })

    if request.method == "POST":
        # ดึงข้อมูลบริการที่เลือกจาก POST
        services_selected = request.POST.getlist("service")  # รายการของบริการที่เลือก
        
        if not services_selected:
            return HttpResponseBadRequest("กรุณาเลือกบริการอย่างน้อยหนึ่งรายการ.")
        
        # สมมติว่า บริการถูกส่งเป็นสตริงที่คั่นด้วยเครื่องหมายจุลภาค
        services = services_selected[0].split(",") if services_selected else []

        try:
            # ดึงข้อมูลบริการที่เลือก
            selected_services = []
            for service_id in services:
                if service_id.isdigit():  # ตรวจสอบว่า service_id เป็นตัวเลขหรือไม่
                    selected_services.append(get_object_or_404(Service, service_id=int(service_id)))
                else:
                    return HttpResponseBadRequest(f"หมายเลขบริการไม่ถูกต้อง: {service_id}")

        except Service.DoesNotExist:
            return HttpResponseBadRequest("ไม่พบบริการที่เลือกบางรายการ.")
        
        # ดึงวันที่และเวลาที่เลือก
        date = request.POST.get("selected_date")
        time_slot = request.POST.get('time')
        price = sum([float(x.price) for x in service]) + 50

        context.update({
            "date":date,
            "time_slot":time_slot,
            "price":price,
            "total":round(price,3)})
        
        return render(request, 'bookingDetail.html', {"service":service, "context":context})
    
    return render(request, 'booking.html', {"services":services, "context":context})

@login_required
def payment(request):
    # ถ้ามีการส่งคำขอแบบ POST
    if request.method == "POST":
        

        context = username(request)
        # สร้าง context เพื่อส่งไปที่ template
            

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
            #select_car_brand = request.POST.get('car-brand') # car brand
            car_plate = request.POST.get('car-reg') # car plate
            user = request.user # user 
            status = "Waiting for Payment" # processing status
            price = request.POST.get("price")
            car_type = request.POST.get('car-type')  
            time_slot = request.POST.get('time_slot')
            date = request.POST.get('selected_date')
            context = username(request)
            car_size_map = {
                "S": "ขนาดเล็ก (S, M)",
                "L": "ขนาดกลาง (L, XL)",
                "XXL": "ขนาดใหญ่ (XXL)",
                "sports": "รถสปอร์ต",
                "motorcycleSmall": "รถมอเตอร์ไซต์ขนาดเล็ก",
                "motorcycleLarge": "รถมอเตอร์ไซต์ขนาดใหญ่"
            }

            time_slot_map ={
            '10:30': 0,
            '11:30': 1,
            '12:30': 2,
            '13:30': 3,
            '14:30': 4,
            '15:30': 5,
            '16:30': 6
            }
            
            booking = Booking(status_on=status,
                    user=user,
                    )


            
            payment = Payment(payment_type="QR", paid_status=False)
            
            # debugging        
            # context.update({"time_slot":time_slot_map[str(time_slot)]})
            # return render(request, "payment.html", context)
            
            # get selected service
            try:
                services = request.POST.getlist("service")
                services = services[0].split(",")
                price = float((price.split(" ")[0]))
                for i in services:
                    cardetailing = CarDetailingService(
                                 booking=booking, 
                                 service=get_object_or_404(
                                     Service, service_id=int(i)
                                     ),
                                time_slot=time_slot_map[time_slot], date=date
                )
                    bookingdetail = BookingDetail(
                            detailing=cardetailing,
                            billNo=payment,
                            total_price=price,
                            car_license_plate=car_plate,
                            car_brand = "test",
                            car_type = car_size_map[car_type] 
                )
                

            except Service.DoesNotExist:
                return HttpResponseBadRequest("Service does not exist.")
            
            
            booking.save() # save booking to database
            payment.save() # save payment to database
            cardetailing.save() # save cardetailing to database
            bookingdetail.save() # save bookingdetail to database
            

            # context update
            context.update({
                "price":price,
            })

            # รับข้อมูลจากฟอร์มที่ส่ง
            # service = request.POST.get('service', 'ไม่ระบุ')
            # date = request.POST.get('date', 'ไม่ระบุ')
            # time = request.POST.get('time', 'ไม่ระบุ')
            # context.update({'service': service,'date': date, 'time': time})

            return render(request, "payment.html", context)
    return render(request, 'bookingDetail.html')
