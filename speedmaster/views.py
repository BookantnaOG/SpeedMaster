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

