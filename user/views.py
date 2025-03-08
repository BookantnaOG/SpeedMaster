from django.shortcuts import render, redirect, get_object_or_404 
from django.contrib.auth import login, logout, authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib.auth.decorators import login_required 
from django.contrib import messages 
from django.http import JsonResponse
from django.templatetags.static import static
from .forms import RegisterForm, UserUpdateForm, UserTelephoneForm, PasswordChangeForm
from speedmaster.models import CarDetailingService, Service, Booking, Payment, BookingDetail
from django.db import transaction
from .models import User_Telephone

# Profile editing view
@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)  # ใช้ฟอร์มที่จำกัดแค่ข้อมูลที่ต้องการ
        if form.is_valid():
            form.save()
            messages.success(request, 'โปรไฟล์ของคุณได้รับการอัปเดตแล้ว!')
            return redirect('dashboard')  # เปลี่ยนการ redirect ไปที่หน้า dashboard
    else:
        form = UserUpdateForm(instance=request.user)

    return render(request, 'profile/edit_profile.html', {'form': form})

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()  # บันทึกผู้ใช้ใหม่
            telephone = User_Telephone(user=user, telephone_number=request.POST.get('phone'))
            telephone.save()
            login(request, user)  # ล็อกอินอัตโนมัติหลังจากสมัคร
            return redirect("home")  # ไปที่หน้า home หลังจากสมัครสมาชิก
        else:
            # ถ้าฟอร์มไม่ถูกต้องก็จะทำการแสดงข้อผิดพลาด
            return render(request, "register.html", {"form": form})
    else:
        form = RegisterForm()  # ถ้าเป็น GET request ให้แสดงฟอร์มเปล่า
    return render(request, "register.html", {"form": form})



# Login view
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'ยินดีต้อนรับ {username}!')
                return redirect('home')  # ไปที่หน้า home หลังจากล็อกอินสำเร็จ
            else:
                messages.error(request, 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!')
    else:
        form = AuthenticationForm()

    return render(request, 'login.html', {'form': form})

# Logout view
def logout_view(request):
    logout(request)
    messages.success(request, 'ออกจากระบบสำเร็จ!')
    return redirect('login')  # ไปที่หน้า login หลังจากออกจากระบบสำเร็จ


def payment_view(request):
    return render(request, 'speedmaster/payment.html')

@login_required
def membership_view(request):
    return render(request, 'Membership.html')

def get_qr_code(request):
    qr_image_url = static("QR/s-1.png")  # ใช้ path ภายใน static เท่านั้น
    return JsonResponse({"qr_image_url": qr_image_url})



#def membership_dashboard(request):
    # การประมวลผลและส่งข้อมูลไปยัง template
    return render(request, 'dashboard.html')



#def membership_dashboard(request):
    # เช็คประเภทสมาชิก
    user_is_regular = False
    user_is_premium = False

    # ตรวจสอบประเภทสมาชิกของผู้ใช้ที่ล็อกอิน
    if request.user.profile.membership_type == 'Regular':
        user_is_regular = True
    elif request.user.profile.membership_type == 'Premium':
        user_is_premium = True

    # ส่งข้อมูลไปยัง template
    return render(request, 'dashboard.html', {
        'user_is_regular': user_is_regular,
        'user_is_premium': user_is_premium,
    })

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

@login_required
def dashboard(request):
    if request.user.is_authenticated:
        context = username(request)
        User = get_user_model()
        user = User.objects.get(username=context["username"])
        context.update({
            "id": request.user.id,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "email": user.email,
            "is_receptionist": user.is_receptionist,
            "is_staff": user.is_staff
        })
    
    return render(request, 'dashboard.html',{"context":context})

@login_required
def delete_account(request):
    if request.method == "DELETE":
        if request.user.is_authenticated:
            user = request.user
            user.delete()  # Delete user from database
            logout(request)  # Log out user
            return JsonResponse({"message": "Account deleted successfully"}, status=200)
        else:
            return JsonResponse({"error": "User not authenticated"}, status=403)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@login_required
def add_telephone(request):
    telephone_numbers = User_Telephone.objects.filter(user=request.user)
    
    if request.method == "POST":
        form = UserTelephoneForm(request.POST)
        if form.is_valid():
            telephone = form.save(commit=False)
            telephone.user = request.user
            telephone.save()
            return redirect("add_telephone")
    else:
        form = UserTelephoneForm()
    return render(request, "add_telephone.html", {"form": form, "tel_nums":telephone_numbers}) 
    
@login_required
def change_password(request):
    # If you want to add custom user-related context, you can do it here
    context = {'user': request.user}
    
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)  # Keeps the user logged in
            return redirect('dashboard')  # Redirect to the dashboard after successful password change
    else:
        form = PasswordChangeForm(request.user)
    
    context['form'] = form  # Add the form to the context
    
    return render(request, 'password.html', context)

@login_required
def edit_profile(request):
    user = request.user
    first_name = request.POST.get("first_name") 
    last_name = request.POST.get("last_name")
    email = request.POST.get("email")

    # apply changes
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.save()
    return redirect("dashboard")

def history_booking(request):
    user = request.user
    
    # Get all bookings for the user
    booking_query = BookingDetail.objects.filter(detailing__booking__user=user).order_by("detailing__date")

    # Prepare the context as a list
    booking_history = []
    time_slot_map = {
    0: "10:30",
    1: "11:30",
    2: "12:30",
    3: "13:30",
    4: "14:30",
    5: "15:30",
    6: "16:30"
    }

    for booking in booking_query:
        booking_history.append({
            "booking_id": booking.detailing.booking.booking_id,
            "service": booking.detailing.service.service_name,  # Assuming service has `service_name`
            "time_slot": time_slot_map[booking.detailing.time_slot],
            "date": booking.detailing.date.strftime("%d/%m/%Y"),
            "status_on":booking.detailing.booking.status_on,
            "car_plate": booking.car_license_plate,
            "car_type": booking.car_type,
            "car_branc": booking.car_brand,

        })

    context = {
        "user": user,
        "bookings": booking_history
    }

    return render(request, 'history.html', context)


def receptionist(request):
    user = request.user

    # Get all bookings where the status is "Waiting"
    booking_query = BookingDetail.objects.filter(detailing__booking__status_on="Waiting for Payment")

    # Time slot mapping
    time_slot_map = {
        1: "10:30",
        2: "11:30",
        3: "12:30",
        4: "13:30",
        5: "14:30",
        6: "15:30",
        7: "16:30"
    }


    booking_history = []
    
    

    for booking in booking_query:
        booking_history.append({
        "booking_id": booking.detailing.booking.booking_id,
        "service": booking.detailing.service.service_name,  # Ensure `service_name` exists
        "time_slot": time_slot_map.get(booking.detailing.time_slot, "Unknown"),  # Prevent KeyError
        "date": booking.detailing.date.strftime("%d/%m/%Y"),
        "status_on": booking.detailing.booking.status_on,
        "booking_detail_id": booking.id,
        "receipt": booking.billNo.user_receipt,
        #"bill_status": paid_status_map[booking.billNo.paid_status],
    })

    context = {
        "user": user,
        "bookings": booking_history
    }

    return render(request, 'Receptionist.html', context)

def staff(request):
    user = request.user

    # Get all bookings where the status is "Waiting"
    booking_query = BookingDetail.objects.filter(detailing__booking__status_on="Wait")

    # Time slot mapping
    time_slot_map = {
        1: "10:30",
        2: "11:30",
        3: "12:30",
        4: "13:30",
        5: "14:30",
        6: "15:30",
        7: "16:30"
    }


    booking_history = []
    
    

    for booking in booking_query:
        booking_history.append({
            "booking_id": booking.detailing.booking.booking_id,
            "booking_detail_id": booking.id,
            "service": booking.detailing.service.service_name,  # Ensure `service_name` exists
            "time_slot": time_slot_map.get(booking.detailing.time_slot, "Unknown"),  # Prevent KeyError
            "date": booking.detailing.date.strftime("%d/%m/%Y"),
            "status_on": booking.detailing.booking.status_on,
            "car_plate": booking.car_license_plate,
            "car_brand": booking.car_brand,
            "car_type": booking.car_type,
        })

    context = {
        "user": user,
        "bookings": booking_history
    }

    return render(request, 'Staff.html', context)

def status_booking(request):
    user = request.user
    
    # Get all bookings for the user
    booking_query = BookingDetail.objects.filter(detailing__booking__user=user).order_by("detailing__date")

    # Prepare the context as a list
    booking_history = []
    time_slot_map = {
    0: "10:30",
    1: "11:30",
    2: "12:30",
    3: "13:30",
    4: "14:30",
    5: "15:30",
    6: "16:30"
    }

    for booking in booking_query:
        booking_history.append({
            "booking_id": booking.detailing.booking.booking_id,
            "service": booking.detailing.service.service_name,  # Assuming service has `service_name`
            "time_slot": time_slot_map[booking.detailing.time_slot],
            "date": booking.detailing.date.strftime("%d/%m/%Y"),
            "status_on":booking.detailing.booking.status_on,
            "car_plate": booking.car_license_plate,
            "car_type": booking.car_type,
            "car_branc": booking.car_brand,

        })

    context = {
        "user": user,
        "bookings": booking_history
    }

    return render(request, 'Status_booking.html', context)

def paid_approve(request, item_id):
    with transaction.atomic():
        booking_detail = get_object_or_404(BookingDetail, pk=item_id)

        booking_detail.billNo.paid_status = True
        booking_detail.billNo.save()  # Save to persist changes

        booking_detail.detailing.booking.status_on = "Wait"
        booking_detail.detailing.booking.save()  # Save to persist changes

    # Redirect to the 'receptionist' view
    return redirect('receptionist')

def paid_decline(request, item_id):
    with transaction.atomic():
        booking_detail = get_object_or_404(BookingDetail, pk=item_id)

        booking_detail.billNo.paid_status = False
        booking_detail.billNo.save()  # Save to persist changes

        booking_detail.detailing.booking.status_on = "Decline"
        booking_detail.detailing.booking.save()  # Save to persist changes
    return redirect('receptionist')

def paid_cancel(request, item_id):
    with transaction.atomic():
        booking_detail = get_object_or_404(BookingDetail, pk=item_id)

        booking_detail.billNo.paid_status = False
        booking_detail.billNo.save()  # Save to persist changes

        booking_detail.detailing.booking.status_on = "Cancel"
        booking_detail.detailing.booking.save()  # Save to persist changes
    return redirect('receptionist')

def process_finish(request, item_id):
    with transaction.atomic():
        booking_detail = get_object_or_404(BookingDetail, pk=item_id)
        booking_detail.detailing.booking.status_on = "Finish"
        booking_detail.detailing.booking.save()  # Save to persist changes
    return redirect('staff')

def process_cancel(request, item_id):
    with transaction.atomic():
        booking_detail = get_object_or_404(BookingDetail, pk=item_id)
        booking_detail.detailing.booking.status_on = "Cancel"
        booking_detail.detailing.booking.save()  # Save to persist changes
    return redirect('staff')