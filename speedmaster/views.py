from django.shortcuts import render

def index(request):
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}
    return render(request, 'index.html', context)

def booking(request):
    return render(request, 'booking.html')

def payment(request):
    if request.method == "POST":
        service = request.POST.get('service', 'ไม่ระบุ')
        date = request.POST.get('date', 'ไม่ระบุ')
        time = request.POST.get('time', 'ไม่ระบุ')

        context = {
            'service': service,
            'date': date,
            'time': time
        }
        return render(request, 'payment.html', context)

    return render(request, 'payment.html')
