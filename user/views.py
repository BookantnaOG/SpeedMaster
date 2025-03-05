from django.shortcuts import render, redirect 
from django.contrib.auth import login, logout, authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib.auth.decorators import login_required 
from django.contrib import messages 
from django.http import JsonResponse
from django.templatetags.static import static
from .forms import RegisterForm, UserUpdateForm, UserTelephoneForm, PasswordChangeForm


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
            "email": user.email
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
    if request.method == "POST":
        form = UserTelephoneForm(request.POST)
        if form.is_valid():
            telephone = form.save(commit=False)
            telephone.user = request.user
            telephone.save()
            return redirect("dashboard")
    else:
        form = UserTelephoneForm()
    return render(request, "add_telephone.html", {"form": form}) 
    
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