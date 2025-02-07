from django.shortcuts import render

def index(request):
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}
    return render(request, 'index.html', context)

def booking(request):
    # Logic สำหรับการแสดงหน้า booking
    return render(request, 'booking.html')