from django.shortcuts import render, redirect 
from django.contrib.auth import login, logout, authenticate 
from django.contrib.auth.forms import AuthenticationForm 
from django.contrib.auth.decorators import login_required 
from django.contrib import messages 
from .forms import RegisterForm, UserUpdateForm  

# Dashboard view to show user info
@login_required
def dashboard(request):
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}
    if request.user.is_authenticated:
        context['username'] = request.user.username
    else:
        context['username'] = 'Guest'
    return render(request, 'dashboard.html', context)

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

# Registration view
def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # ล็อกอินอัตโนมัติหลังจากการสมัคร
            messages.success(request, 'การลงทะเบียนสำเร็จ! ยินดีต้อนรับเข้าสู่ระบบ!')
            return redirect("home")  # ไปที่หน้า home หลังจากสมัครสมาชิก
    else:
        form = RegisterForm()
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
