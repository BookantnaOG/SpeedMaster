from django.shortcuts import render

def index(request):
    context = {'message': 'This is a dynamic message!', 'Message': 'Hello'}
    return render(request, 'index.html', context)

def Booking(request):
    return render(request, "booking.html")
