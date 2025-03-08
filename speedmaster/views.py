from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Booking, Service, Payment, BookingDetail, CarDetailingService, User_Telephone
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
    telephone_number = User_Telephone.objects.filter(user=request.user)
    services = Service.objects.all()
    user = request.user
    context = username(request)

    # time zone
    thailand_tz = pytz.timezone('Asia/Bangkok')
    # now = timezone.now().astimezone(thailand_tz)
    
    # TIMESLOT_LIST = (
    #     (0, '10:30'),
    #     (1, '11:30'),
    #     (2, '12:30'),
    #     (3, '13:30'),
    #     (4, '14:30'),
    #     (5, '15:30'),
    #     (6, '16:30')
    # )

    # # Filter out passed timeslots
    # available_timeslots = [
    #     (value, time_str) for value, time_str in TIMESLOT_LIST
    #     if datetime.strptime(time_str, '%H:%M').time() > now.time()  # Only include future times
    # ]

    context.update({
    'today': timezone.now().astimezone(thailand_tz).date().strftime('%Y-%m-%d'),
    # 'available_timeslots': available_timeslots
    })

    if request.method == "POST":
        services = request.POST.getlist("service")
        services = services[0].split(",")
        try:
            service = []
            for i in services:
                service.append(get_object_or_404(Service, service_id=int(i)))

        except Service.DoesNotExist:
            return HttpResponseBadRequest("Service does not exist.")
        
        date = request.POST.get("selected_date")
        time_slot = request.POST.get('time_slot')
        price = sum([float(x.price) for x in service]) + 50

        context.update({
            "date":date,
            "time_slot":time_slot,
            "price":price,
            "total":round(price,3),
            "services":",".join(services)})
        
        
        return render(request, 'bookingDetail.html', {"service":service,
                                                       "context":context,
                                                         "telephone_number":telephone_number})
    
    return render(request, 'booking.html', {"services":services, "context":context})

@login_required
def payment(request):
    if request.method == "POST":
        bill_no = request.POST.get("payment_id")
        if bill_no is None:
            return HttpResponseBadRequest("Invalid form submission: Missing bill number.")

        payment = get_object_or_404(Payment, billNo=bill_no)

        pic = request.FILES.get('receipt')
        if not pic:
            return HttpResponseBadRequest("No file uploaded.")

        # Assign uploaded picture to payment
        payment.user_receipt = pic
        payment.save()

        # Pass pic in a context dictionary
        return render(request, 'test.html', {'pic': pic})

    return render(request, 'payment.html')

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
            car_name = request.POST.get('car-name')
            time_slot = request.POST.get('time_slot')
            date = request.POST.get('selected_date')
            tel_number = request.POST.get('mobile')
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
            if tel_number:
                telephone = User_Telephone.objects.get(telephone_number=tel_number)
            else:
                telephone = User_Telephone(user=user, telephone_number=tel_number)
                telephone.save()
            
            payment = Payment(payment_type="QR", paid_status=False)
            
            
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
                            car_brand = car_name,
                            car_type = car_size_map[car_type],
                            telephone=telephone 
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
                "username":user.username,
                "billNo":payment.billNo,
            })

            return render(request, "payment.html", {"context":context})
    return render(request, 'bookingDetail.html')
